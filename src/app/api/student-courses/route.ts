import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })

        const body = await request.json()
        const { studentId, courseId, batchId } = body

        if (!studentId || !courseId) {
            return NextResponse.json({ success: false, error: 'Student and Course are required' }, { status: 400 })
        }

        if (!payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        // 1. Get Course Details (Fees) and Verify Organization
        const course = await db.course.findFirst({
            where: { id: courseId, organizationId: payload.organizationId }
        })

        if (!course) {
            return NextResponse.json({ success: false, error: 'Course not found or access denied' }, { status: 404 })
        }

        // 1.1 Verify Student belongs to the organization
        const student = await db.student.findFirst({
            where: {
                id: studentId,
                branch: { organizationId: payload.organizationId }
            }
        })

        if (!student) {
            return NextResponse.json({ success: false, error: 'Student not found or access denied' }, { status: 404 })
        }

        // 2. Create StudentCourse
        const studentCourse = await db.studentCourse.create({
            data: {
                studentId,
                courseId,
                status: 'ongoing',
                totalFee: course.fee,
                netPayable: course.fee, // Default to full fee
                batches: batchId ? {
                    create: { batchId }
                } : undefined,
                // Create single default installment or use course plan
                installments: {
                    create: {
                        installmentNo: 1,
                        dueDate: new Date(),
                        amount: course.fee,
                        status: 'pending' // Default pending
                    }
                }
            },
            include: {
                course: true,
                batches: { include: { batch: true } },
                installments: true
            }
        })

        return NextResponse.json({ success: true, studentCourse })

    } catch (error) {
        console.error('[API /student-courses POST]', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
