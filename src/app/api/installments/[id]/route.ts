import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'
import { generateId } from '@/lib/utils/id-generator'

// Helper for auth verification
async function verifyAuth(request: NextRequest) {
    const token = extractToken(request)
    if (!token) return null
    return await verifyToken(token)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params // Installment ID
        const body = await request.json()

        // 1. Get Installment
        const installment = await db.installment.findUnique({
            where: { id },
            include: {
                studentCourse: {
                    include: {
                        student: true
                    }
                }
            }
        })

        if (!installment) {
            return NextResponse.json({ success: false, error: 'Installment not found' }, { status: 404 })
        }

        const student = installment.studentCourse.student

        // 2. Access Control
        if (payload.role !== 'super_admin' && (!payload.branches || !payload.branches.includes(student.branchId))) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // 3. Update Logic
        const paidAmount = Number(body.paidAmount) || 0
        const currentPaid = installment.paidAmount || 0
        const newTotalPaid = currentPaid + paidAmount

        // Determine new status
        let newStatus = installment.status
        if (newTotalPaid >= installment.amount) {
            newStatus = 'paid'
        } else if (newTotalPaid > 0) {
            newStatus = 'partial'
        }

        // 4. Generate Receipt if paying
        let receiptNo = installment.receiptNo
        if (paidAmount > 0) {
            const receiptIdData = await generateId('RECEIPT')
            receiptNo = receiptIdData.displayId
            console.log(`[API /installments/[id]] Generating Receipt: ${receiptNo} (Year: ${receiptIdData.year}, Seq: ${receiptIdData.sequence})`)

            await db.receipt.create({
                data: {
                    receiptNo: receiptNo,
                    receiptYear: receiptIdData.year,
                    receiptSequence: receiptIdData.sequence,
                    studentId: student.id,
                    amount: paidAmount,
                    mode: body.mode || 'cash',
                    transactionId: body.transactionId || null,
                    remark: body.remarks || null,
                    date: body.paymentDate ? new Date(body.paymentDate) : new Date()
                }
            })
        }

        // 5. Update Installment
        const updatedInstallment = await db.installment.update({
            where: { id },
            data: {
                paidAmount: newTotalPaid,
                paidDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
                status: newStatus,
                mode: body.mode,
                receiptNo: receiptNo,
                remarks: body.remarks,
                transactionId: body.transactionId
            }
        })

        return NextResponse.json({
            success: true,
            installment: updatedInstallment
        })

    } catch (error: any) {
        console.error('[API /installments/[id] PATCH] Error:', error)
        if (error.code === 'P2002') {
            console.error('Unique constraint failed on fields:', error.meta?.target)
        }
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
