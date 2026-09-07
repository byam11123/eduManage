import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const branchId = searchParams.get('branchId')
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const monthFilter = searchParams.get('monthFilter') || 'current'

        // Build where clause
        if (!payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        let whereClause: any = {
            studentCourse: {
                student: {
                    branch: { organizationId: payload.organizationId }
                }
            }
        }

        // RBAC Scoping
        if (payload.role !== 'super_admin') {
            whereClause.studentCourse.student.branchId = { in: payload.branches }
        }

        if (branchId) {
            whereClause.studentCourse = {
                ...whereClause.studentCourse,
                student: {
                    ...whereClause.studentCourse?.student,
                    branchId: branchId
                }
            }
        }

        if (status === 'overdue') {
            whereClause.status = { not: 'paid' }
            whereClause.dueDate = { lt: new Date() }
        } else if (status && status !== 'all') {
            whereClause.status = status
        }

        if (search) {
            whereClause.studentCourse = {
                ...whereClause.studentCourse,
                student: {
                    ...whereClause.studentCourse?.student,
                    OR: [
                        { firstName: { contains: search } },
                        { lastName: { contains: search } },
                        { email: { contains: search } },
                        { phone: { contains: search } }
                    ]
                }
            }
        }

        if (monthFilter === 'current') {
            const now = new Date()
            whereClause.dueDate = {
                ...(whereClause.dueDate || {}),
                gte: startOfMonth(now),
                lte: endOfMonth(now)
            }
        }

        const installments = await db.installment.findMany({
            where: whereClause,
            include: {
                studentCourse: {
                    include: {
                        student: {
                            include: {
                                branch: true
                            }
                        },
                        course: true
                    }
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        })

        return NextResponse.json({
            success: true,
            installments
        })

    } catch (error) {
        console.error('[API /fees GET] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
