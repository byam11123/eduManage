
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const batchId = id

        const batch = await db.batch.findUnique({
            where: { id: batchId },
            include: {
                course: {
                    select: { name: true }
                },
                students: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        enrollmentNo: true,
                        phone: true,
                        email: true,
                        status: true,
                        paymentStatus: true,
                        imageUrl: true
                    }
                }
            }
        })

        if (!batch) {
            return NextResponse.json(
                { success: false, error: 'Batch not found' },
                { status: 404 }
            )
        }

        // Calculate stats
        const stats = {
            activeStudents: batch.students.filter(s => s.status === 'active').length,
            inactiveStudents: batch.students.filter(s => s.status === 'inactive').length,
            // Mocking financial data for now as strictly defined payment models aren't fully visible/populated
            forecastPayment: 0,
            receivedPayment: 0,
            overdueAmount: 0
        }

        return NextResponse.json({ success: true, batch, stats })
    } catch (error) {
        console.error('Error fetching batch details:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch batch details' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { name, description, courseId, startDate, endDate, startTime, endTime, status } = body

        const updatedBatch = await db.batch.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(courseId && { courseId }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(startTime !== undefined && { startTime }),
                ...(endTime !== undefined && { endTime }),
                ...(status && { status })
            }
        })

        return NextResponse.json({ success: true, batch: updatedBatch })
    } catch (error) {
        console.error('Error updating batch:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update batch' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await db.batch.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Batch deleted successfully' })
    } catch (error) {
        console.error('Error deleting batch:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete batch' },
            { status: 500 }
        )
    }
}
