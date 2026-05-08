import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'
import { startOfMonth, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        // Get installments from the last 12 months
        const twelveMonthsAgo = subMonths(new Date(), 11)
        const installments = await db.installment.findMany({
            where: {
                paidDate: { gte: twelveMonthsAgo },
                studentCourse: {
                    student: {
                        branch: { organizationId: payload.organizationId },
                        ...(payload.role !== 'super_admin' ? { branchId: { in: payload.branches } } : {})
                    }
                }
            },
            select: {
                paidAmount: true,
                paidDate: true
            }
        })

        // Group by month
        const monthlyData: Record<string, number> = {}
        
        // Initialize last 12 months with 0
        for (let i = 0; i < 12; i++) {
            const monthName = format(subMonths(new Date(), 11 - i), 'MMM')
            monthlyData[monthName] = 0
        }

        installments.forEach(inst => {
            if (inst.paidDate) {
                const monthName = format(inst.paidDate, 'MMM')
                if (monthlyData[monthName] !== undefined) {
                    monthlyData[monthName] += inst.paidAmount
                }
            }
        })

        const data = Object.entries(monthlyData).map(([name, revenue]) => ({
            name,
            revenue
        }))

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error) {
        console.error('[API /dashboard/revenue] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
