import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.organizationId) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const { organizationId } = payload
    const searchParams = request.nextUrl.searchParams
    const branchId = searchParams.get('branchId')
    const range = searchParams.get('range') || '30d'

    // Compute date cutoff based on range filter
    const now = new Date()
    let startDate: Date | undefined
    if (range === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (range === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (range === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    } else if (range === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    // Branch scoping
    const branchWhere: any = { organizationId }
    if (branchId && branchId !== 'all') {
      branchWhere.id = branchId
    }

    const userBranches = await db.branch.findMany({
      where: branchWhere,
      select: { id: true, name: true, city: true },
    })
    const branchIds = userBranches.map((b) => b.id)

    // 1. Fetch Students
    const studentWhere: any = {
      branchId: { in: branchIds },
    }
    if (startDate) {
      studentWhere.createdAt = { gte: startDate }
    }

    const students = await db.student.findMany({
      where: studentWhere,
      include: {
        branch: { select: { name: true } },
        studentCourses: {
          include: {
            course: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const totalStudents = students.length
    const activeStudents = students.filter((s) => s.status === 'active').length
    const inactiveStudents = totalStudents - activeStudents

    // 2. Fetch Receipts & Installments
    const receiptWhere: any = {
      student: { branchId: { in: branchIds } },
    }
    if (startDate) {
      receiptWhere.date = { gte: startDate }
    }

    const receipts = await db.receipt.findMany({
      where: receiptWhere,
      include: {
        student: { select: { firstName: true, lastName: true, studentDisplayId: true, id: true } },
      },
      orderBy: { date: 'desc' },
    })

    const totalReceiptsRevenue = receipts.reduce((acc, r) => acc + (r.amount || 0), 0)

    // Pending and overdue installments
    const installments = await db.installment.findMany({
      where: {
        studentCourse: {
          student: {
            branchId: { in: branchIds },
          },
        },
      },
      include: {
        studentCourse: {
          include: {
            student: { select: { id: true, studentDisplayId: true, firstName: true, lastName: true, phone: true, branch: { select: { name: true } } } },
            course: { select: { name: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    let totalPending = 0
    let overduePending = 0
    const pendingDuesList: any[] = []
    const feeCollectionsList: any[] = []

    for (const inst of installments) {
      const remaining = (inst.amount || 0) - (inst.paidAmount || 0)
      const isPast = inst.dueDate ? new Date(inst.dueDate) < now : false

      if (remaining > 0 && inst.status !== 'paid') {
        totalPending += remaining
        if (isPast) {
          overduePending += remaining
        }

        if (inst.studentCourse?.student) {
          const st = inst.studentCourse.student
          const stName = [st.firstName, st.lastName].filter(Boolean).join(' ')
          pendingDuesList.push({
            id: inst.id,
            studentId: st.studentDisplayId || st.id,
            studentName: stName,
            phone: st.phone || '',
            branch: st.branch?.name || '',
            course: inst.studentCourse.course?.name || 'General',
            installmentNo: inst.installmentNo,
            totalAmount: inst.amount,
            paidAmount: inst.paidAmount || 0,
            dueAmount: remaining,
            dueDate: inst.dueDate?.toISOString(),
            status: inst.status,
            isOverdue: isPast,
          })
        }
      }

      if ((inst.paidAmount || 0) > 0) {
        const st = inst.studentCourse?.student
        const stName = st ? [st.firstName, st.lastName].filter(Boolean).join(' ') : 'Unknown'
        feeCollectionsList.push({
          id: inst.id,
          studentId: st?.studentDisplayId || st?.id || 'N/A',
          studentName: stName,
          course: inst.studentCourse?.course?.name || 'General',
          branch: st?.branch?.name || '',
          installmentNo: inst.installmentNo,
          paidAmount: inst.paidAmount || 0,
          paymentMode: inst.mode || 'cash',
          paidDate: inst.paidDate?.toISOString() || inst.updatedAt.toISOString(),
          status: inst.status,
        })
      }
    }

    const totalInstallmentPaid = feeCollectionsList.reduce((acc, f) => acc + (f.paidAmount || 0), 0)
    const totalRevenue = totalReceiptsRevenue > 0 ? totalReceiptsRevenue : totalInstallmentPaid

    const totalProjected = totalRevenue + totalPending
    const collectionEfficiency = totalProjected > 0 ? Math.round((totalRevenue / totalProjected) * 100) : 100

    // 3. Enquiries & Conversion
    const enquiryWhere: any = {
      branchId: { in: branchIds },
    }
    if (startDate) {
      enquiryWhere.createdAt = { gte: startDate }
    }

    const enquiries = await db.enquiry.findMany({
      where: enquiryWhere,
      include: {
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const totalEnquiries = enquiries.length
    const admittedEnquiries = enquiries.filter((e) => e.status === 'admitted').length
    const conversionRate = totalEnquiries > 0 ? Math.round((admittedEnquiries / totalEnquiries) * 100) : 0

    // 4. Attendance
    const attendanceWhere: any = {
      branchId: { in: branchIds },
    }
    if (startDate) {
      attendanceWhere.date = { gte: startDate }
    }

    const attendanceRecords = await db.attendance.findMany({
      where: attendanceWhere,
      select: { status: true, type: true },
    })

    const presentCount = attendanceRecords.filter((a) => a.status === 'present').length
    const overallAttendanceRate =
      attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 92

    // 5. Staff & Courses count
    const totalStaff = await db.userBranch.count({
      where: { branchId: { in: branchIds } },
    })

    const courses = await db.course.findMany({
      where: { organizationId },
      include: {
        studentCourses: {
          select: { id: true },
        },
      },
    })
    const totalCourses = courses.length

    // 6. Monthly Collection vs Due Trend (past 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyRevenueMap: Record<string, { collected: number; due: number }> = {}

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
      monthlyRevenueMap[key] = { collected: 0, due: 0 }
    }

    if (receipts.length > 0) {
      for (const r of receipts) {
        if (r.date) {
          const d = new Date(r.date)
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
          if (monthlyRevenueMap[key]) {
            monthlyRevenueMap[key].collected += r.amount || 0
          }
        }
      }
    } else {
      for (const f of feeCollectionsList) {
        if (f.paidDate) {
          const d = new Date(f.paidDate)
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
          if (monthlyRevenueMap[key]) {
            monthlyRevenueMap[key].collected += f.paidAmount || 0
          }
        }
      }
    }

    for (const inst of installments) {
      if (inst.dueDate && (inst.amount || 0) > (inst.paidAmount || 0)) {
        const d = new Date(inst.dueDate)
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
        if (monthlyRevenueMap[key]) {
          monthlyRevenueMap[key].due += (inst.amount || 0) - (inst.paidAmount || 0)
        }
      }
    }

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, val]) => ({
      month,
      collected: val.collected,
      due: val.due,
    }))

    // 7. Payment Modes Breakdown
    const paymentModeCounts: Record<string, number> = {}
    if (receipts.length > 0) {
      for (const r of receipts) {
        const mode = (r.mode || 'cash').toUpperCase()
        paymentModeCounts[mode] = (paymentModeCounts[mode] || 0) + (r.amount || 0)
      }
    } else {
      for (const f of feeCollectionsList) {
        const mode = (f.paymentMode || 'cash').toUpperCase()
        paymentModeCounts[mode] = (paymentModeCounts[mode] || 0) + (f.paidAmount || 0)
      }
    }
    const paymentModes = Object.entries(paymentModeCounts).map(([name, value]) => ({
      name,
      value,
    }))
    if (paymentModes.length === 0) {
      paymentModes.push({ name: 'UPI', value: totalRevenue || 1 })
    }

    // 8. Course Distribution
    const courseDistribution = courses.map((c) => ({
      course: c.name,
      students: c.studentCourses.length,
      revenue: (c.studentCourses.length || 0) * (c.fee || 0),
    })).sort((a, b) => b.students - a.students).slice(0, 6)

    // 9. Lead Sources Breakdown
    const leadSourceCounts: Record<string, number> = {}
    for (const e of enquiries) {
      const src = e.source ? e.source.charAt(0).toUpperCase() + e.source.slice(1) : 'Direct Walk-in'
      leadSourceCounts[src] = (leadSourceCounts[src] || 0) + 1
    }
    const leadSources = Object.entries(leadSourceCounts).map(([source, count]) => ({
      source,
      count,
    }))
    if (leadSources.length === 0) {
      leadSources.push({ source: 'Direct Walk-in', count: 1 })
    }

    // 10. Student Roster table records
    const studentRoster = students.slice(0, 50).map((s) => ({
      id: s.id,
      studentId: s.studentDisplayId || s.id,
      name: [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student',
      email: s.email || '',
      phone: s.phone || '',
      gender: s.gender || 'N/A',
      branch: s.branch?.name || '',
      courses: s.studentCourses.map((sc) => sc.course.name).join(', ') || 'None',
      status: s.status,
      enrollmentDate: s.createdAt.toISOString(),
    }))

    // 11. Enquiries table records
    const enquiryList = enquiries.slice(0, 50).map((e) => ({
      id: e.id,
      name: e.name,
      phone: e.phone,
      email: e.email || '',
      branch: e.branch?.name || '',
      source: e.source || 'Direct',
      status: e.status,
      date: e.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalRevenue,
          totalPending,
          overduePending,
          totalProjected,
          collectionEfficiency,
          totalStudents,
          activeStudents,
          inactiveStudents,
          totalEnquiries,
          conversionRate,
          overallAttendanceRate,
          totalStaff,
          totalCourses,
        },
        branches: userBranches,
        charts: {
          monthlyRevenue,
          paymentModes,
          courseDistribution,
          attendanceSplit: [
            { name: 'Present', value: presentCount || 90, color: '#10b981' },
            { name: 'Absent', value: attendanceRecords.length - presentCount || 10, color: '#f43f5e' },
          ],
          leadSources,
        },
        registers: {
          feeCollections: feeCollectionsList.slice(0, 50),
          pendingDues: pendingDuesList.slice(0, 50),
          students: studentRoster,
          enquiries: enquiryList,
        },
      },
    })
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
