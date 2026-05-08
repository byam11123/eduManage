import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, hashPassword } from '@/lib/auth-utils'

// (Helper removed as we use auth.organizationId)

// GET all users (including their module permissions)
export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const orgId = auth.organizationId
        if (!orgId) return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })

        const users = await db.user.findMany({
            where: {
                organizations: {
                    some: { organizationId: orgId }
                }
            },
            include: {
                userBranches: {
                    where: {
                        branch: { organizationId: orgId }
                    }
                },
                permissions: {
                    where: { organizationId: orgId, canAccess: true },
                    select: { module: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const formattedUsers = users.map(user => {
            let role = 'user'
            let defaultBranchId: string | undefined = undefined
            const branches: string[] = []

            user.userBranches.forEach(ub => {
                branches.push(ub.branchId)
                if (ub.isDefault) defaultBranchId = ub.branchId
                if (ub.role === 'super_admin') role = 'super_admin'
                else if (ub.role === 'branch_admin' && role !== 'super_admin') role = 'branch_admin'
            })

            return {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: role,
                branches: branches,
                permissions: user.permissions.map(p => p.module),
                defaultBranchId: defaultBranchId,
                createdAt: user.createdAt
            }
        })

        return NextResponse.json({ success: true, users: formattedUsers })

    } catch (error: any) {
        console.error('Get Users Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// CREATE new user with permissions
export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const orgId = auth.organizationId
        if (!orgId) return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })

        const body = await request.json()
        const { fullName, email, password, role, branches, defaultBranchId, permissions } = body

        if (!email || !password || !fullName) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } })
        if (existingUser) return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 })

        const hashedPassword = await hashPassword(password)

        await db.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    isVerified: true,
                    emailVerified: new Date(),
                    organizations: {
                        create: {
                            organizationId: orgId,
                            role: role === 'super_admin' ? 'admin' : 'member',
                            status: 'active',
                            joinedAt: new Date()
                        }
                    }
                }
            })

            if (branches && branches.length > 0) {
                await tx.userBranch.createMany({
                    data: branches.map((branchId: string) => ({
                        userId: user.id,
                        branchId: branchId,
                        role: role,
                        isDefault: branchId === defaultBranchId
                    }))
                })
            }

            if (permissions && Array.isArray(permissions)) {
                await tx.modulePermission.createMany({
                    data: permissions.map((module: string) => ({
                        userId: user.id,
                        organizationId: orgId,
                        module,
                        canAccess: true
                    }))
                })
            }
        })

        return NextResponse.json({ success: true, message: 'User created successfully' })

    } catch (error: any) {
        console.error('Create User Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// UPDATE user and their permissions
export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })

    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const orgId = auth.organizationId
        if (!orgId) return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })

        // Verify target user belongs to the same organization
        const targetUser = await db.user.findFirst({
            where: {
                id,
                organizations: {
                    some: { organizationId: orgId }
                }
            }
        })

        if (!targetUser) {
            return NextResponse.json({ success: false, error: 'User not found in your organization' }, { status: 403 })
        }

        const body = await request.json()
        const { fullName, email, role, branches, defaultBranchId, permissions } = body

        await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id },
                data: { fullName, email }
            })

            await tx.userBranch.deleteMany({ where: { userId: id } })
            if (branches && branches.length > 0) {
                await tx.userBranch.createMany({
                    data: branches.map((branchId: string) => ({
                        userId: id,
                        branchId: branchId,
                        role: role,
                        isDefault: branchId === defaultBranchId
                    }))
                })
            }

            // Sync Permissions
            await tx.modulePermission.deleteMany({ where: { userId: id, organizationId: orgId } })
            if (permissions && Array.isArray(permissions)) {
                await tx.modulePermission.createMany({
                    data: permissions.map((module: string) => ({
                        userId: id,
                        organizationId: orgId,
                        module,
                        canAccess: true
                    }))
                })
            }
        })

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Update User Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE user
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })

    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const orgId = auth.organizationId
        if (!orgId) return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })

        if (id === auth.userId) return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 })

        // Ensure the target user belongs to the same organization
        const targetUser = await db.user.findFirst({
            where: {
                id,
                organizations: {
                    some: { organizationId: orgId }
                }
            }
        })

        if (!targetUser) {
            return NextResponse.json({ success: false, error: 'User not found in your organization' }, { status: 403 })
        }

        await db.user.delete({ where: { id } })
        return NextResponse.json({ success: true, message: 'User deleted' })
    } catch (error: any) {
        console.error('Delete User Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
