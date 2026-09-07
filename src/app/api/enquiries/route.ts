import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'
import { generateId } from '@/lib/utils/id-generator'

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
            source = 'web',
            followUpDate
        } = body

        if (!firstName || !lastName || !mobile) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (First Name, Last Name, or Mobile)' },
                { status: 400 }
            )
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        // 1. Get User's Relations
        const userBranches = await db.userBranch.findMany({
            where: { userId: auth.userId },
        })

        // Select Branch
        const targetBranchId = body.branchId || (userBranches.find(ub => ub.isDefault) || userBranches[0])?.branchId

        if (!targetBranchId) {
            return NextResponse.json({ success: false, error: 'User is not assigned to any branch' }, { status: 403 })
        }

        // Verify branch belongs to organization
        const branch = await db.branch.findFirst({
            where: { id: targetBranchId, organizationId: auth.organizationId }
        })

        if (!branch) {
            return NextResponse.json({ success: false, error: 'Invalid branch for your organization' }, { status: 403 })
        }

        const branchId = targetBranchId
        const organizationId = auth.organizationId

        // Generate ID
        const enquiryIdData = await generateId('ENQUIRY')

        const enquiry = await db.enquiry.create({
            data: {
                // ID System Fields
                enquiryId: enquiryIdData.displayId,
                enquiryYear: enquiryIdData.year,
                enquirySequence: enquiryIdData.sequence,

                firstName,
                lastName,
                mobile,
                email,
                description,
                status: 'new',
                source,
                followUpDate: followUpDate ? new Date(followUpDate) : null,
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

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        let whereClause: any = { organizationId: auth.organizationId }

        // RBAC Scoping for non-super_admins
        if (auth.role !== 'super_admin') {
            whereClause.branchId = { in: auth.branches }
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
