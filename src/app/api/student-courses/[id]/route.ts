import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 })

        const { id } = await params
        const body = await request.json()
        const { status, batchId } = body

        // Update Data Construction
        let updateData: any = {}

        if (status) {
            updateData.status = status
        }

        // Batch Reassignment Logic
        if (batchId) {
            // Remove existing batches (or mark inactive if we tracked history, currently we replace)
            // Ideally we should transaction this, but for now simple delete-create
            await db.studentCourseBatch.deleteMany({
                where: { studentCourseId: id }
            })

            updateData.batches = {
                create: { batchId }
            }
        }

        const studentCourse = await db.studentCourse.update({
            where: { id },
            data: updateData,
            include: {
                course: true,
                batches: { include: { batch: true } },
                installments: true
            }
        })

        return NextResponse.json({ success: true, studentCourse })

    } catch (error) {
        console.error('[API /student-courses/[id] PATCH]', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
