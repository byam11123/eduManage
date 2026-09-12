export interface ReportFilters {
  branchId?: string
  range?: '7d' | '30d' | '90d' | 'year' | 'all'
  type?: 'all' | 'financial' | 'students' | 'attendance' | 'crm'
}

export interface ReportData {
  kpis: {
    totalRevenue: number
    totalPending: number
    overduePending: number
    totalProjected: number
    collectionEfficiency: number
    totalStudents: number
    activeStudents: number
    inactiveStudents: number
    totalEnquiries: number
    conversionRate: number
    overallAttendanceRate: number
    totalStaff: number
    totalCourses: number
  }
  branches: Array<{
    id: string
    name: string
    city?: string
  }>
  charts: {
    monthlyRevenue: Array<{
      month: string
      collected: number
      due: number
    }>
    paymentModes: Array<{
      name: string
      value: number
    }>
    courseDistribution: Array<{
      course: string
      students: number
      revenue: number
    }>
    attendanceSplit: Array<{
      name: string
      value: number
      color: string
    }>
    leadSources: Array<{
      source: string
      count: number
    }>
  }
  registers: {
    feeCollections: Array<{
      id: string
      studentId: string
      studentName: string
      course: string
      branch: string
      installmentNo: number
      paidAmount: number
      paymentMode: string
      paidDate: string
      status: string
    }>
    pendingDues: Array<{
      id: string
      studentId: string
      studentName: string
      phone: string
      branch: string
      course: string
      installmentNo: number
      totalAmount: number
      paidAmount: number
      dueAmount: number
      dueDate: string
      status: string
      isOverdue: boolean
    }>
    students: Array<{
      id: string
      studentId: string
      name: string
      email: string
      phone: string
      gender: string
      branch: string
      courses: string
      status: string
      enrollmentDate: string
    }>
    enquiries: Array<{
      id: string
      name: string
      phone: string
      email: string
      branch: string
      source: string
      status: string
      date: string
    }>
  }
}

export const reportService = {
  async getReports(filters: ReportFilters = {}): Promise<{ success: boolean; data?: ReportData; error?: string }> {
    const params = new URLSearchParams()
    if (filters.branchId && filters.branchId !== 'all') params.append('branchId', filters.branchId)
    if (filters.range) params.append('range', filters.range)
    if (filters.type) params.append('type', filters.type)

    const response = await fetch(`/api/reports?${params.toString()}`)
    return response.json()
  }
}
