import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

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
            firstName,
            lastName,
            mobile,
            email,
            courseId,
            description,
            source = 'web'
        } = body

        if (!firstName || !lastName || !mobile) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (First Name, Last Name, or Mobile)' },
                { status: 400 }
            )
        }

        // Determine Context (Org & Branch)
        // For now, we'll try to get the user's default branch or the first one they are assigned to.
        // In a real scenario, the UI might send the specific branchId if the user has access to multiple.

        // 1. Get User's Relations
        const userBranches = await db.userBranch.findMany({
            where: { userId: auth.userId },
            include: { branch: true }
        })

        if (userBranches.length === 0) {
            return NextResponse.json(
                { success: false, error: 'User is not assigned to any branch' },
                { status: 403 }
            )
        }

        // Select Branch
        // Priority: 1. Default Branch, 2. First Assigned Branch
        const defaultStartBranch = userBranches.find(ub => ub.isDefault) || userBranches[0]
        const branchId = defaultStartBranch.branchId
        const organizationId = defaultStartBranch.branch.organizationId

        const enquiry = await db.enquiry.create({
            data: {
                firstName,
                lastName,
                mobile,
                email,
                description,
                status: 'new',
                source,
                branchId,
                organizationId,
                courseId: courseId || null
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Enquiry generated successfully',
            enquiry
        })

    } catch (error: any) {
        console.error('Create Enquiry Error:', error)
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

        // Fetch User Branches to scope the query
        const userBranches = await db.userBranch.findMany({
            where: { userId: auth.userId },
            include: { branch: true }
        })

        if (userBranches.length === 0) {
            return NextResponse.json({ success: true, enquiries: [] })
        }

        const isSuperAdmin = userBranches.some(ub => ub.role === 'super_admin')
        const branchIds = userBranches.map(ub => ub.branchId)
        // If super_admin, generally fetching by organization is better, but fetching by assigned branches is safer for now 
        // unless we explicitly check organization ownership. Let's stick to assigned branches for safety.

        // Actually, if super_admin owners, they might want to see ALL enquiries for their Org.
        let whereClause: any = {
            branchId: { in: branchIds }
        }

        // Better Logic: If owner, find Organization and get all enquiries
        const organization = await db.organization.findUnique({
            where: { ownerId: auth.userId }
        })

        if (organization) {
            whereClause = { organizationId: organization.id }
        }

        const enquiries = await db.enquiry.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                course: { select: { name: true } },
                branch: { select: { name: true } }
            }
        })

        return NextResponse.json({
            success: true,
            enquiries
        })

    } catch (error: any) {
        console.error('Get Enquiries Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
