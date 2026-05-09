import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { installmentId, amount, mode, transactionId, remarks } = body

        if (!installmentId || !amount) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Fetch Installment with related data for validation and receipt
        const installment = await db.installment.findUnique({
            where: { id: installmentId },
            include: {
                studentCourse: {
                    include: {
                        student: {
                            include: {
                                branch: true
                            }
                        }
                    }
                }
            }
        })

        if (!installment) {
            return NextResponse.json({ success: false, error: 'Installment not found' }, { status: 404 })
        }

        // Verify organization context
        if (installment.studentCourse.student.branch.organizationId !== payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Unauthorized organization context' }, { status: 403 })
        }

        // 2. Perform Transaction
        const result = await db.$transaction(async (tx) => {
            // A. Update Installment
            const newPaidAmount = installment.paidAmount + amount
            let status = 'partial'
            if (newPaidAmount >= installment.amount) {
                status = 'paid'
            }

            const updatedInstallment = await tx.installment.update({
                where: { id: installmentId },
                data: {
                    paidAmount: newPaidAmount,
                    status,
                    mode,
                    transactionId,
                    remarks: remarks || installment.remarks,
                    paidDate: new Date()
                }
            })

            // B. Generate Receipt Number
            const currentYear = new Date().getFullYear()
            const lastReceipt = await tx.receipt.findFirst({
                where: {
                    receiptYear: currentYear,
                    student: {
                        branch: { organizationId: payload.organizationId }
                    }
                },
                orderBy: { receiptSequence: 'desc' }
            })

            const nextSequence = (lastReceipt?.receiptSequence || 0) + 1
            const receiptNo = `RCP/${currentYear}/${nextSequence.toString().padStart(5, '0')}`

            // C. Create Receipt
            const receipt = await tx.receipt.create({
                data: {
                    receiptNo,
                    receiptYear: currentYear,
                    receiptSequence: nextSequence,
                    amount: amount,
                    mode,
                    transactionId,
                    remark: remarks,
                    studentId: installment.studentCourse.studentId,
                    date: new Date()
                }
            })

            return { updatedInstallment, receipt }
        })

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        console.error('[API /fees/collect POST] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
