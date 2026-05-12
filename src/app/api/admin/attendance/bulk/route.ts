import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { entities, date, status, type, batchId } = body

        if (!entities || !Array.isArray(entities) || !date || !status || !type) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const attendanceDate = new Date(date)
        attendanceDate.setHours(0, 0, 0, 0)

        // Use a transaction for consistency
        const results = await db.$transaction(
            entities.map((entityId: string) => {
                // Upsert logic for each entity
                // Since SQLite doesn't support complex upsert in transaction easily with Prisma's upsert,
                // and we need to handle studentId/employeeId separately, 
                // we'll do individual operations but wrapped in a transaction.
                
                // However, we can't do a findFirst + update/create inside a single transaction array easily.
                // So we'll use a loop but that's not a single transaction.
                
                // Let's use a simpler approach: delete existing and create many.
                return db.attendance.deleteMany({
                    where: {
                        organizationId: auth.organizationId,
                        date: attendanceDate,
                        type,
                        studentId: type === 'student' ? entityId : undefined,
                        employeeId: type === 'employee' ? entityId : undefined,
                    }
                })
            })
        )

        // Now create all
        const created = await db.attendance.createMany({
            data: entities.map((entityId: string) => ({
                date: attendanceDate,
                status,
                type,
                organizationId: auth.organizationId,
                branchId: auth.branches[0],
                batchId: batchId === 'all' ? null : (batchId || null),
                studentId: type === 'student' ? entityId : null,
                employeeId: type === 'employee' ? entityId : null,
            }))
        })

        return NextResponse.json({ success: true, count: created.count })

    } catch (error) {
        console.error('[API Attendance Bulk] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
