import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

/**
 * Leads API
 * GET  /api/leads         — list leads (org-scoped, branch-RBAC)
 * POST /api/leads         — create a new lead
 */

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const { searchParams } = new URL(request.url)
        const search  = searchParams.get('search')
        const stage   = searchParams.get('stage')
        const branchId = searchParams.get('branchId')

        let whereClause: any = { organizationId: auth.organizationId }

        // RBAC: non-super_admins only see leads in their branches
        if (auth.role !== 'super_admin') {
            whereClause.branchId = { in: auth.branches }
        } else if (branchId) {
            whereClause.branchId = branchId
        }

        if (stage && stage !== 'all') {
            whereClause.stage = stage
        }

        if (search) {
            whereClause.OR = [
                { firstName: { contains: search } },
                { lastName:  { contains: search } },
                { email:     { contains: search } },
                { phone:     { contains: search } },
            ]
        }

        const leads = await db.lead.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                branch: { select: { id: true, name: true } }
            }
        })

        return NextResponse.json({ success: true, leads })
    } catch (error) {
        console.error('[API /leads GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const body = await request.json()
        const { firstName, lastName, email, phone, source, stage, company, value, notes, assignedTo, branchId } = body

        if (!firstName || !lastName) {
            return NextResponse.json({ success: false, error: 'First name and last name are required' }, { status: 400 })
        }

        // Resolve branch — use provided branchId, else user's default, else first branch
        let targetBranchId = branchId
        if (!targetBranchId) {
            const userBranches = await db.userBranch.findMany({ where: { userId: auth.userId } })
            targetBranchId = (userBranches.find(ub => ub.isDefault) || userBranches[0])?.branchId || null
        }

        // RBAC: non-super_admins must have access to the branch
        if (auth.role !== 'super_admin' && targetBranchId && !auth.branches.includes(targetBranchId)) {
            return NextResponse.json({ success: false, error: 'Access denied to this branch' }, { status: 403 })
        }

        const lead = await db.lead.create({
            data: {
                firstName,
                lastName,
                email:      email      || null,
                phone:      phone      || null,
                source:     source     || 'website',
                stage:      stage      || 'new',
                company:    company    || null,
                value:      value      ? parseFloat(value) : 0,
                notes:      notes      || null,
                assignedTo: assignedTo || null,
                organizationId: auth.organizationId,
                branchId:   targetBranchId || null,
            }
        })

        return NextResponse.json({ success: true, message: 'Lead created successfully', lead })
    } catch (error) {
        console.error('[API /leads POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
