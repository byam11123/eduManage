
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
