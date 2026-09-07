import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const body = await request.json()
        const { title, feeType, amount, dueDate } = body

        if (!title || !feeType || !amount) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const student = await db.student.findUnique({
            where: { id },
            include: { branch: true }
        })

        if (!student) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
        }

        if (payload.role !== 'super_admin' && !payload.branches.includes(student.branchId)) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // Auto-generate feeDisplayId: AF/YY/NNNNN
        const currentYear = new Date().getFullYear()
        const shortYear = currentYear.toString().slice(-2)

        const lastFee = await (db as any).additionalFee.findFirst({
            where: { feeYear: currentYear },
            orderBy: { feeSequence: 'desc' }
        })
        const nextSequence = (lastFee?.feeSequence || 0) + 1
        const feeDisplayId = `AF/${shortYear}/${nextSequence.toString().padStart(5, '0')}`

        const fee = await (db as any).additionalFee.create({
            data: {
                studentId: id,
                feeDisplayId,
                feeYear: currentYear,
                feeSequence: nextSequence,
                title,
                feeType,
                amount: Number(amount),
                dueDate: dueDate ? new Date(dueDate) : null,
                status: 'pending'
            }
        })

        return NextResponse.json({ success: true, data: fee })
    } catch (error) {
        console.error('[API /students/[id]/fees] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
