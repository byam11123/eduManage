import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns'

export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'student'
    const date = searchParams.get('date') // YYYY-MM-DD
    const month = searchParams.get('month') // 0-11
    const year = searchParams.get('year')
    const batchId = searchParams.get('batchId')

    try {
        if (date) {
            const attendanceDate = new Date(date)
            attendanceDate.setHours(0, 0, 0, 0)

            // 1. Fetch Entities (Students or Employees)
            let entities: any[] = []
            if (type === 'student') {
                entities = await db.student.findMany({
                    where: {
                        branchId: { in: auth.branches },
                        batchId: batchId === 'all' || !batchId ? undefined : batchId,
                        status: 'active'
                    },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        studentDisplayId: true,
                        phone: true
                    },
                    orderBy: { firstName: 'asc' }
                })
            } else {
                // Employees are UserBranch records
                const userBranches = await db.userBranch.findMany({
                    where: {
                        branchId: { in: auth.branches },
                        isActive: true
                    },
                    include: {
                        user: {
                            select: { id: true, fullName: true, phone: true }
                        }
                    }
                })
                entities = userBranches.map(ub => ({
                    id: ub.user.id,
                    name: ub.user.fullName,
                    designation: ub.designation,
                    phone: ub.user.phone
                }))
            }

            // 2. Fetch Existing Attendance Records
            const attendanceRecords = await db.attendance.findMany({
                where: {
                    organizationId: auth.organizationId,
                    type,
                    date: attendanceDate,
                    studentId: type === 'student' ? { in: entities.map(e => e.id) } : undefined,
                    employeeId: type === 'employee' ? { in: entities.map(e => e.id) } : undefined,
                }
            })

            // 3. Merge and Create Final List
            const finalRecords = entities.map(entity => {
                const record = attendanceRecords.find(r => 
                    type === 'student' ? r.studentId === entity.id : r.employeeId === entity.id
                )

                return {
                    id: record?.id || `new-${entity.id}`,
                    entityId: entity.id,
                    name: type === 'student' ? `${entity.firstName} ${entity.lastName}` : entity.name,
                    rollNo: entity.studentDisplayId,
                    designation: entity.designation,
                    status: record?.status || 'pending',
                    date: date,
                    type,
                    remarks: record?.remarks || ''
                }
            })

            // 4. Calculate Stats
            const stats = {
                present: finalRecords.filter(r => r.status === 'present').length,
                absent: finalRecords.filter(r => r.status === 'absent').length,
                leave: finalRecords.filter(r => r.status === 'leave').length,
                halfDay: finalRecords.filter(r => r.status === 'half-day').length,
                holiday: finalRecords.filter(r => r.status === 'holiday').length,
                total: finalRecords.length
            }

            return NextResponse.json({
                success: true,
                data: { records: finalRecords, stats }
            })
        }

        if (month !== null && year !== null) {
            const start = new Date(parseInt(year), parseInt(month), 1)
            const end = endOfMonth(start)

            const records = await db.attendance.findMany({
                where: {
                    organizationId: auth.organizationId,
                    type,
                    date: {
                        gte: start,
                        lte: end
                    },
                    batchId: batchId === 'all' || !batchId ? undefined : batchId,
                },
                include: {
                    student: { select: { firstName: true, lastName: true, studentDisplayId: true } },
                    employee: { select: { fullName: true } }
                }
            })

            const formattedRecords = records.map(r => ({
                id: r.id,
                entityId: r.studentId || r.employeeId,
                name: r.student ? `${r.student.firstName} ${r.student.lastName}` : r.employee?.fullName,
                rollNo: r.student?.studentDisplayId,
                status: r.status,
                date: format(r.date, 'yyyy-MM-dd'),
                type: r.type
            }))

            return NextResponse.json({
                success: true,
                data: { records: formattedRecords }
            })
        }

        return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 })

    } catch (error) {
        console.error('[API Attendance GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { entityId, date, status, type, remarks, batchId } = body

        if (!entityId || !date || !status || !type) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const attendanceDate = new Date(date)
        attendanceDate.setHours(0, 0, 0, 0)

        // Find existing record for this entity and date
        const existingRecord = await db.attendance.findFirst({
            where: {
                organizationId: auth.organizationId,
                date: attendanceDate,
                type,
                studentId: type === 'student' ? entityId : undefined,
                employeeId: type === 'employee' ? entityId : undefined,
            }
        })

        if (existingRecord) {
            // Update
            const updated = await db.attendance.update({
                where: { id: existingRecord.id },
                data: { status, remarks }
            })
            return NextResponse.json({ success: true, data: updated })
        } else {
            // Create
            const branchId = auth.branches[0] // Fallback to first branch
            
            const created = await db.attendance.create({
                data: {
                    date: attendanceDate,
                    status,
                    type,
                    remarks,
                    organizationId: auth.organizationId,
                    branchId: branchId, // In real scenario, get from entity
                    studentId: type === 'student' ? entityId : undefined,
                    employeeId: type === 'employee' ? entityId : undefined,
                }
            })
            return NextResponse.json({ success: true, data: created })
        }

    } catch (error) {
        console.error('[API Attendance POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
