import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, hashPassword } from '@/lib/auth-utils'

// GET all users (filtered by permissions)
export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // TODO: Add permission check - only Super Admin should see all users
        // For now, allowing any authenticated admin to see users (simplified)

        const users = await db.user.findMany({
            include: {
                userBranches: true
            },
            orderBy: { createdAt: 'desc' }
        })

        const formattedUsers = users.map(user => {
            // Find the user's role and branches
            // Logic: If they have *any* super_admin role, they are super_admin
            // Otherwise, check branch_admin, etc.

            let role = 'user'
            let defaultBranchId = undefined
            const branches: string[] = []

            user.userBranches.forEach(ub => {
                branches.push(ub.branchId)
                if (ub.isDefault) defaultBranchId = ub.branchId

                // Elevate role if found
                if (ub.role === 'super_admin') role = 'super_admin'
                else if (ub.role === 'branch_admin' && role !== 'super_admin') role = 'branch_admin'
            })

            // If no branches assigned, they are just a 'user' without context

            return {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: role,
                branches: branches,
                defaultBranchId: defaultBranchId,
                createdAt: user.createdAt
            }
        })

        return NextResponse.json({
            success: true,
            users: formattedUsers
        })

    } catch (error: any) {
        console.error('Get Users Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// CREATE new user
export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { fullName, email, password, role, branches, defaultBranchId } = body

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Email already registered' },
                { status: 400 }
            )
        }

        const hashedPassword = await hashPassword(password)

        // Transaction to create user and assign branches
        const newUser = await db.$transaction(async (tx) => {
            // 1. Create User
            const user = await tx.user.create({
                data: {
                    fullName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    isVerified: true, // Auto-verify created users
                    emailVerified: new Date()
                }
            })

            // 2. Assign Branches
            if (branches && branches.length > 0) {
                await tx.userBranch.createMany({
                    data: branches.map((branchId: string) => ({
                        userId: user.id,
                        branchId: branchId,
                        role: role, // Assign the selected role for ALL selected branches for simplicity
                        isDefault: branchId === defaultBranchId
                    }))
                })
            }

            return user
        })

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: { id: newUser.id, email: newUser.email }
        })

    } catch (error: any) {
        console.error('Create User Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE user
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })
    }

    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) { // Add stricter check: must be super_admin
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Prevent deleting yourself
        if (id === auth.userId) {
            return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 })
        }

        await db.user.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'User deleted' })
    } catch (error: any) {
        console.error('Delete User Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

// UPDATE user (simplified - role/branch update)
export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 })
    }

    try {
        const auth = await verifyAuth(request)
        if (!auth.success) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { fullName, email, role, branches, defaultBranchId } = body

        await db.$transaction(async (tx) => {
            // Update basic info
            await tx.user.update({
                where: { id },
                data: { fullName, email }
            })

            // Update branches: Delete all and recreate (easiest way to handle sync)
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
        })

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Update User Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
