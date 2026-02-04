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

        // Get user's organization
        const organization = await db.organization.findUnique({
            where: { ownerId: auth.userId }
        })

        if (!organization) {
            return NextResponse.json(
                { success: false, error: 'Organization not found. You must be an organization owner to create branches.' },
                { status: 403 }
            )
        }

        // Check if branch name exists
        const existingBranch = await db.branch.findFirst({
            where: {
                organizationId: organization.id,
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
        let hashedPassword = null
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
                    organizationId: organization.id,
                    isActive: true
                }
            })

            // 2. Create Admin User (if provided)
            let adminUser = null
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

        // Get user's organization
        const organization = await db.organization.findUnique({
            where: { ownerId: auth.userId }
        })

        // If not owner, maybe check UserBranch map? 
        // For now, let's assume Super Admin flow (Owner) lists all branches

        let branches = []

        if (organization) {
            branches = await db.branch.findMany({
                where: { organizationId: organization.id },
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { students: true }
                    }
                }
            })
        } else {
            // If not organization owner, maybe just return branches they are assigned to
            // This part matches the "Scope" logic
            const userBranches = await db.userBranch.findMany({
                where: { userId: auth.userId },
                include: { branch: true }
            })
            branches = userBranches.map(ub => ub.branch)
        }

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
