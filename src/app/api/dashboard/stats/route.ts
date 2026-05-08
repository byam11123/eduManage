import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        // Build scoping filter
        if (!payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const orgId = payload.organizationId
        const isSuperAdmin = payload.role === 'super_admin'

        // Base filter for anything with organizationId directly (Course, Enquiry, etc.)
        const orgFilter = { organizationId: orgId }

        // Filter for students (scoped by organization via branch)
        const studentOrgFilter = {
            branch: { organizationId: orgId }
        }

        // Branch-level scoping for non-super-admins
        const branchFilter = isSuperAdmin ? {} : { branchId: { in: payload.branches } }

        // 1. Total Students
        const totalStudents = await db.student.count({
            where: {
                ...studentOrgFilter,
                ...branchFilter
            }
        })

        const activeStudents = await db.student.count({
            where: {
                status: 'active',
                ...studentOrgFilter,
                ...branchFilter
            }
        })

        // 2. Revenue & Pending (from Installments)
        const installments = await db.installment.findMany({
            where: {
                studentCourse: {
                    student: {
                        ...studentOrgFilter,
                        ...branchFilter
                    }
                }
            },
            select: {
                amount: true,
                paidAmount: true
            }
        })

        const totalRevenue = installments.reduce((sum, inst) => sum + inst.paidAmount, 0)
        const pendingFees = installments.reduce((sum, inst) => sum + (inst.amount - inst.paidAmount), 0)

        // 3. Courses & Batches
        const totalCourses = await db.course.count({ where: orgFilter })
        const totalBatches = await db.batch.count({ 
            where: {
                course: orgFilter
            }
        })

        // 4. Enquiries
        const totalEnquiries = await db.enquiry.count({
            where: {
                ...orgFilter,
                ...branchFilter
            }
        })

        const now = new Date()
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
        const recentEnquiries = await db.enquiry.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                ...orgFilter,
                ...branchFilter
            }
        })

        return NextResponse.json({
            success: true,
            stats: {
                totalStudents,
                activeStudents,
                totalRevenue,
                pendingFees,
                totalCourses,
                totalBatches,
                totalEnquiries,
                recentEnquiries
            }
        })

    } catch (error) {
        console.error('[API /dashboard/stats] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
