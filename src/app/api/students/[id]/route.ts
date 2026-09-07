import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils/id-generator'
import { extractToken, verifyToken } from '@/lib/auth-utils'

// Helper for auth verification
async function verifyAuth(request: NextRequest) {
    const token = extractToken(request)
    if (!token) return null
    return await verifyToken(token)
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        const student = await db.student.findUnique({
            where: { id },
            include: {
                branch: {
                    select: { id: true, name: true }
                },
                // Legacy fields (keep for fallback)
                course: {
                    select: { id: true, name: true }
                },
                batch: {
                    select: { id: true, name: true }
                },
                // New Multi-Course Data
                studentCourses: {
                    include: {
                        course: true,
                        batches: {
                            include: {
                                batch: true
                            }
                        },
                        installments: {
                            orderBy: { installmentNo: 'asc' }
                        }
                    }
                },
                attendances: {
                    orderBy: { date: 'desc' },
                    take: 50 // Limit to recent records
                },
                referral: {
                    include: {
                        referrer: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                },
                additionalFees: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        }) as any

        if (!student) {
            return NextResponse.json(
                { success: false, error: 'Student not found' },
                { status: 404 }
            )
        }

        // Access Control: Check if user has access to this student's branch
        if (payload.role !== 'super_admin' && !payload.branches.includes(student.branchId)) {
            return NextResponse.json(
                { success: false, error: 'Access denied' },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            student
        })

    } catch (error) {
        console.error('[API /students/[id] GET] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const body = await request.json()

        // 1. Check if student exists
        const existingStudent = await db.student.findUnique({
            where: { id },
            // We need to know current ID status
            select: { branchId: true, installmentPlan: true, studentDisplayId: true, status: true }
        })

        if (!existingStudent) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
        }

        // 2. Access Control
        if (payload.role !== 'super_admin' && !payload.branches.includes(existingStudent.branchId)) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // 3. Status Transition Logic (Draft -> Active)
        let idUpdates = {}
        if (body.status === 'active' && !existingStudent.studentDisplayId) {
            // Generating Student ID for the first time (Finalizing Admission)
            const studentIdData = await generateId('STUDENT')
            idUpdates = {
                studentDisplayId: studentIdData.displayId,
                studentYear: studentIdData.year,
                studentSequence: studentIdData.sequence,
                enrollmentDate: new Date(), // Set enrollment date to now
            }
        }

        // 4. Sanitize and Update
        const data = { ...body, ...idUpdates }

        // Convert dates
        if (data.dateOfBirth !== undefined) {
            data.dateOfBirth = (data.dateOfBirth && data.dateOfBirth !== '') ? new Date(data.dateOfBirth) : null
        }
        // enrollmentDate logic handled above or preserved if passed
        if (data.enrollmentDate !== undefined) {
            data.enrollmentDate = (data.enrollmentDate && data.enrollmentDate !== '') ? new Date(data.enrollmentDate) : new Date()
        }

        // Convert numbers
        if (data.totalAmount !== undefined) data.totalAmount = Number(data.totalAmount) || 0
        if (data.discountAmount !== undefined) data.discountAmount = Number(data.discountAmount) || 0
        if (data.netPayableFee !== undefined) data.netPayableFee = Number(data.netPayableFee) || 0

        // JSON strings
        if (data.installmentPlan !== undefined) {
            // Receipt Generation Logic (Preserved from previous step)
            try {
                let newPlan: any[] = []
                if (Array.isArray(data.installmentPlan)) {
                    newPlan = data.installmentPlan
                } else if (typeof data.installmentPlan === 'string') {
                    try {
                        // Check if it's "[object Object]" which means it was coerced string
                        if (data.installmentPlan.startsWith('[object')) {
                            newPlan = [] // Invalid
                        } else {
                            newPlan = JSON.parse(data.installmentPlan)
                        }
                    } catch (e) {
                        newPlan = []
                    }
                }

                let oldPlan: any[] = []
                if (existingStudent.installmentPlan) {
                    try {
                        oldPlan = typeof existingStudent.installmentPlan === 'string'
                            ? JSON.parse(existingStudent.installmentPlan)
                            : existingStudent.installmentPlan
                    } catch (e) {
                        oldPlan = []
                    }
                }

                if (Array.isArray(newPlan)) {
                    for (let i = 0; i < newPlan.length; i++) {
                        const newItem = newPlan[i];
                        const oldItem = Array.isArray(oldPlan) && oldPlan[i] ? oldPlan[i] : null;

                        if (newItem.status === 'paid' && (!oldItem || oldItem.status !== 'paid')) {
                            const receiptIdData = await generateId('RECEIPT')
                            const systemReceiptNo = receiptIdData.displayId

                            await db.receipt.create({
                                data: {
                                    receiptNo: systemReceiptNo,
                                    receiptYear: receiptIdData.year,
                                    receiptSequence: receiptIdData.sequence,
                                    studentId: id,
                                    amount: Number(newItem.paidAmount) || Number(newItem.amount) || 0,
                                    mode: newItem.mode || 'cash',
                                    transactionId: newItem.utrNo || null,
                                    remark: newItem.remark || null,
                                    date: newItem.paymentDate ? new Date(newItem.paymentDate) : new Date()
                                }
                            })
                            newItem.receiptNo = systemReceiptNo
                        }
                    }
                    data.installmentPlan = JSON.stringify(newPlan)
                } else {
                    data.installmentPlan = data.installmentPlan ? JSON.stringify(data.installmentPlan) : null
                }
            } catch (e) {
                console.error("Error processing receipts in PATCH:", e)
                data.installmentPlan = data.installmentPlan ? JSON.stringify(data.installmentPlan) : null
            }
        }
        if (data.fullPayment !== undefined) {
            data.fullPayment = data.fullPayment ? JSON.stringify(data.fullPayment) : null
        }
        if (data.installmentMode !== undefined) {
            data.installmentMode = data.installmentMode || null
        }

        // Prevent "Unknown argument" errors if Prisma Client is out of sync
        if ('courseId' in data) delete data.courseId
        if ('batchId' in data) delete data.batchId
        if ('branchId' in data) delete data.branchId
        if ('action' in data) delete data.action
        if ('referrerId' in data) delete data.referrerId

        // Unique field sanitization
        if (data.enrollmentNo !== undefined) {
            data.enrollmentNo = (data.enrollmentNo && data.enrollmentNo !== '') ? data.enrollmentNo : null
        }
        if (data.email !== undefined) {
            data.email = (data.email && data.email !== '') ? data.email : null
        }
        if (data.studentDisplayId !== undefined) {
            data.studentDisplayId = (data.studentDisplayId && data.studentDisplayId !== '') ? data.studentDisplayId : null
        }

        // Referral Logic
        const referrerId = body.referrerId
        if (referrerId !== undefined) {
            if (referrerId && referrerId !== 'none') {
                data.referral = {
                    upsert: {
                        create: {
                            referrerId: referrerId,
                            organizationId: payload.organizationId!,
                            status: existingStudent.status === 'active' ? 'joined' : 'pending'
                        },
                        update: {
                            referrerId: referrerId
                        }
                    }
                }
            } else {
                // Try to delete if it exists, otherwise ignore
                try {
                    await db.referral.deleteMany({
                        where: { studentId: id }
                    })
                } catch (e) {}
            }
        }

        const updatedStudent = await db.student.update({
            where: { id },
            data,
            include: {
                referral: {
                    include: {
                        referrer: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            student: updatedStudent
        })

    } catch (error) {
        console.error('[API /students/[id] PATCH] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params

        // 1. Check if student exists
        const existingStudent = await db.student.findUnique({
            where: { id },
            select: { branchId: true }
        })

        if (!existingStudent) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
        }

        // 2. Access Control
        if (payload.role !== 'super_admin' && !payload.branches.includes(existingStudent.branchId)) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // 3. Delete
        await db.student.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Student deleted successfully'
        })

    } catch (error) {
        console.error('[API /students/[id] DELETE] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
