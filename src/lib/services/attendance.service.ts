import type { AttendanceRecord, AttendanceStats, ApiResponse, AttendanceType } from '@/lib/types'

export const attendanceService = {
    // Get attendance for a specific month (for calendar view)
    async getMonthlyAttendance(
        type: AttendanceType,
        month: number,
        year: number,
        batchId?: string,
        studentId?: string,
        employeeId?: string
    ): Promise<ApiResponse<{ records: AttendanceRecord[] }>> {
        try {
            const params = new URLSearchParams({
                type,
                month: month.toString(),
                year: year.toString(),
            })
            if (batchId && batchId !== 'all') params.append('batchId', batchId)
            if (studentId) params.append('studentId', studentId)
            if (employeeId) params.append('employeeId', employeeId)

            const response = await fetch(`/api/admin/attendance?${params.toString()}`)
            return await response.json()
        } catch (error) {
            console.error('Error in getMonthlyAttendance:', error)
            return { success: false, error: 'Failed to fetch monthly attendance' }
        }
    },

    // Get attendance for a specific day (for table view)
    async getDailyAttendance(
        type: AttendanceType,
        date: string,
        batchId?: string
    ): Promise<ApiResponse<{ records: AttendanceRecord[], stats: AttendanceStats }>> {
        try {
            const params = new URLSearchParams({
                type,
                date,
            })
            if (batchId && batchId !== 'all') params.append('batchId', batchId)

            const response = await fetch(`/api/admin/attendance?${params.toString()}`)
            return await response.json()
        } catch (error) {
            console.error('Error in getDailyAttendance:', error)
            return { success: false, error: 'Failed to fetch daily attendance' }
        }
    },

    // Mark attendance
    async markAttendance(
        entityId: string,
        status: string,
        remarks?: string,
        date?: string,
        type: AttendanceType = 'student',
        batchId?: string
    ): Promise<ApiResponse> {
        try {
            const response = await fetch('/api/admin/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entityId,
                    status,
                    remarks,
                    date: date || new Date().toISOString().split('T')[0],
                    type,
                    batchId
                })
            })
            return await response.json()
        } catch (error) {
            console.error('Error in markAttendance:', error)
            return { success: false, error: 'Failed to mark attendance' }
        }
    },

    // Bulk mark attendance
    async bulkMarkAttendance(
        entities: string[],
        status: string,
        date: string,
        type: AttendanceType,
        batchId?: string
    ): Promise<ApiResponse<{ count: number }>> {
        try {
            const response = await fetch('/api/admin/attendance/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    entities,
                    status,
                    date,
                    type,
                    batchId
                })
            })
            return await response.json()
        } catch (error) {
            console.error('Error in bulkMarkAttendance:', error)
            return { success: false, error: 'Failed to bulk mark attendance' }
        }
    }
}
