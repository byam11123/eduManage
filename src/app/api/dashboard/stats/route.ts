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

        // Branch-level scoping
        const { searchParams } = new URL(request.url)
        const requestedBranchId = searchParams.get('branchId')

        let branchFilter: any = isSuperAdmin ? {} : { branchId: { in: payload.branches } }
        let orgFilter: any = { organizationId: orgId }
        
        // Filter for students (scoped by organization via branch)
        const studentOrgFilter = {
            branch: { organizationId: orgId }
        }
        
        if (requestedBranchId) {
             if (!isSuperAdmin && !payload.branches.includes(requestedBranchId)) {
                 return NextResponse.json({ success: false, error: 'Unauthorized branch access' }, { status: 403 })
             }
             branchFilter = { branchId: requestedBranchId }
             orgFilter = { ...orgFilter, branchId: requestedBranchId }
        }


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
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

        const recentEnquiriesCount = await db.enquiry.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                ...orgFilter,
                ...branchFilter
            }
        })
        const prevEnquiriesCount = await db.enquiry.count({
            where: {
                createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
                ...orgFilter,
                ...branchFilter
            }
        })

        const recentStudents = await db.student.count({
            where: {
                enrollmentDate: { gte: thirtyDaysAgo },
                ...studentOrgFilter,
                ...branchFilter
            }
        })
        const prevStudents = await db.student.count({
            where: {
                enrollmentDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
                ...studentOrgFilter,
                ...branchFilter
            }
        })

        const recentInstallments = await db.installment.findMany({
            where: {
                paidDate: { gte: thirtyDaysAgo },
                studentCourse: { student: { ...studentOrgFilter, ...branchFilter } }
            },
            select: { paidAmount: true }
        })
        const prevInstallments = await db.installment.findMany({
            where: {
                paidDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
                studentCourse: { student: { ...studentOrgFilter, ...branchFilter } }
            },
            select: { paidAmount: true }
        })
        const recentRevenue = recentInstallments.reduce((sum, inst) => sum + inst.paidAmount, 0)
        const prevRevenue = prevInstallments.reduce((sum, inst) => sum + inst.paidAmount, 0)

        // Helper to calc percentage
        const calcTrend = (current: number, prev: number) => {
            if (prev === 0) return { value: current > 0 ? '100%' : '0%', isUp: current >= 0 }
            const diff = ((current - prev) / prev) * 100
            return { value: `${Math.abs(Math.round(diff))}%`, isUp: diff >= 0 }
        }

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
                recentEnquiries: recentEnquiriesCount,
                trends: {
                    enrollment: calcTrend(recentStudents, prevStudents),
                    revenue: calcTrend(recentRevenue, prevRevenue),
                    enquiries: calcTrend(recentEnquiriesCount, prevEnquiriesCount)
                }
            }
        })

    } catch (error) {
        console.error('[API /dashboard/stats] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
