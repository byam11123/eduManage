import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, hashPassword } from '@/lib/auth-utils'

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
        const {
            name, address, city, state, zipCode, phone, email, description,
            // Admin User Details
            adminName, adminEmail, adminPassword
        } = body

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Branch name is required' },
                { status: 400 }
            )
        }

        if (!auth.organizationId) {
            return NextResponse.json(
                { success: false, error: 'Organization context missing. You must belong to an organization to create branches.' },
                { status: 403 }
            )
        }

        const organizationId = auth.organizationId

        // Check if branch name exists
        const existingBranch = await db.branch.findFirst({
            where: {
                organizationId,
                name: { equals: name }
            }
        })

        if (existingBranch) {
            return NextResponse.json(
                { success: false, error: 'A branch with this name already exists' },
                { status: 400 }
            )
        }

        // If Admin User details provided, check if email exists
        let hashedPassword: string | null = null
        if (adminEmail && adminPassword) {
            const existingUser = await db.user.findUnique({
                where: { email: adminEmail.toLowerCase() }
            })
            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: 'Admin email already registered to another user' },
                    { status: 400 }
                )
            }
            hashedPassword = await hashPassword(adminPassword)
        }

        // Transaction: Create Branch -> (Optional) Create User -> Link
        const result = await db.$transaction(async (tx) => {
            // 1. Create Branch
            const branch = await tx.branch.create({
                data: {
                    name,
                    description,
                    address,
                    city,
                    state,
                    zipCode,
                    phone,
                    email,
                    organizationId,
                    isActive: true
                }
            })

            // 2. Create Admin User (if provided)
            let adminUser: any = null
            if (adminEmail && hashedPassword && adminName) {
                adminUser = await tx.user.create({
                    data: {
                        fullName: adminName,
                        email: adminEmail.toLowerCase(),
                        password: hashedPassword,
                        isVerified: true,
                        emailVerified: new Date()
                    }
                })

                // 3. Link User to Branch as 'branch_admin' and set as default
                await tx.userBranch.create({
                    data: {
                        userId: adminUser.id,
                        branchId: branch.id,
                        role: 'branch_admin',
                        isDefault: true
                    }
                })
            }

            return { branch, adminUser }
        })

        return NextResponse.json({
            success: true,
            message: result.adminUser ? 'Branch and Admin created successfully' : 'Branch created successfully',
            branch: result.branch,
            adminUser: result.adminUser ? { id: result.adminUser.id, email: result.adminUser.email } : undefined
        })

    } catch (error: any) {
        console.error('Create Branch Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const branches = await db.branch.findMany({
            where: { organizationId: auth.organizationId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            branches
        })

    } catch (error: any) {
        console.error('Get Branches Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
