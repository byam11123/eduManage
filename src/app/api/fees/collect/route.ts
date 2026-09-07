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
        const { installmentId, additionalFeeId, amount, mode, transactionId, remarks, proofUrl } = body

        if ((!installmentId && !additionalFeeId) || !amount) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        let studentId = ''
        let organizationId = ''
        let targetAmount = 0
        let targetPaidAmount = 0

        // 1. Fetch Installment OR AdditionalFee with related data for validation
        if (installmentId) {
            const installment = await db.installment.findUnique({
                where: { id: installmentId },
                include: {
                    studentCourse: {
                        include: { student: { include: { branch: true } } }
                    }
                }
            })
            if (!installment) return NextResponse.json({ success: false, error: 'Installment not found' }, { status: 404 })
            studentId = installment.studentCourse.studentId
            organizationId = installment.studentCourse.student.branch.organizationId
            targetAmount = installment.amount
            targetPaidAmount = installment.paidAmount
        } else if (additionalFeeId) {
            const additionalFee = await (db as any).additionalFee.findUnique({
                where: { id: additionalFeeId },
                include: { student: { include: { branch: true } } }
            })
            if (!additionalFee) return NextResponse.json({ success: false, error: 'Additional Fee not found' }, { status: 404 })
            studentId = additionalFee.studentId
            organizationId = additionalFee.student.branch.organizationId
            targetAmount = additionalFee.amount
            targetPaidAmount = additionalFee.status === 'paid' ? additionalFee.amount : 0
        }

        // Verify organization context
        if (organizationId !== payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Unauthorized organization context' }, { status: 403 })
        }

        // 2. Perform Transaction
        const result = await db.$transaction(async (tx) => {
            let updatedTarget: any = null
            const newPaidAmount = targetPaidAmount + amount
            let status = 'partial'
            if (newPaidAmount >= targetAmount) {
                status = 'paid'
            }

            // Generate Receipt Number
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

            // Update Target (Installment or AdditionalFee)
            if (installmentId) {
                updatedTarget = await tx.installment.update({
                    where: { id: installmentId },
                    data: {
                        paidAmount: newPaidAmount,
                        status,
                        mode,
                        transactionId,
                        receiptNo,
                        proofUrl: proofUrl || null,
                        remarks: remarks || undefined,
                        paidDate: new Date()
                    }
                })
            } else if (additionalFeeId) {
                updatedTarget = await (tx as any).additionalFee.update({
                    where: { id: additionalFeeId },
                    data: {
                        status: status === 'paid' ? 'paid' : 'pending',
                        paidDate: new Date(),
                        receiptNo,
                        transactionId,
                        remarks: remarks || undefined,
                        proofUrl: proofUrl || null
                    }
                })
            }

            // Create Receipt
            const receipt = await tx.receipt.create({
                data: {
                    receiptNo,
                    receiptYear: currentYear,
                    receiptSequence: nextSequence,
                    amount: amount,
                    mode,
                    transactionId,
                    remark: remarks,
                    studentId: studentId,
                    date: new Date(),
                    proofUrl: proofUrl || null
                }
            })

            return { updatedTarget, receipt }
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
