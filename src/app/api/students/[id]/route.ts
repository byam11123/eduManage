import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

// Helper for auth verification
async function verifyAuth(request: NextRequest) {
    const token = extractToken(request)
    if (!token) return null
    return verifyToken(token)
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
                course: {
                    select: { id: true, name: true }
                },
                batch: {
                    select: { id: true, name: true }
                }
            }
        })

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
            select: { branchId: true }
        })

        if (!existingStudent) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
        }

        // 2. Access Control
        if (payload.role !== 'super_admin' && !payload.branches.includes(existingStudent.branchId)) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // 3. Sanitize and Update
        const data = { ...body }

        // Convert dates
        if (data.dateOfBirth !== undefined) {
            data.dateOfBirth = (data.dateOfBirth && data.dateOfBirth !== '') ? new Date(data.dateOfBirth) : null
        }
        if (data.enrollmentDate !== undefined) {
            data.enrollmentDate = (data.enrollmentDate && data.enrollmentDate !== '') ? new Date(data.enrollmentDate) : new Date()
        }

        // Convert numbers
        if (data.totalAmount !== undefined) data.totalAmount = Number(data.totalAmount) || 0
        if (data.discountAmount !== undefined) data.discountAmount = Number(data.discountAmount) || 0
        if (data.netPayableFee !== undefined) data.netPayableFee = Number(data.netPayableFee) || 0

        // JSON strings
        if (data.installmentPlan !== undefined) {
            data.installmentPlan = data.installmentPlan ? JSON.stringify(data.installmentPlan) : null
        }
        if (data.fullPayment !== undefined) {
            data.fullPayment = data.fullPayment ? JSON.stringify(data.fullPayment) : null
        }
        if (data.installmentMode !== undefined) {
            data.installmentMode = data.installmentMode || null
        }

        const updatedStudent = await db.student.update({
            where: { id },
            data
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
