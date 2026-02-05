// ============================================
// ATTENDANCE SERVICE
// API service for managing attendance
// ============================================

import type { AttendanceRecord, AttendanceStats, ApiResponse, AttendanceType } from '@/lib/types'

// Mock data generator
const generateMockAttendance = (
    type: AttendanceType,
    month: number,
    year: number
): AttendanceRecord[] => {
    const records: AttendanceRecord[] = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const entities = type === 'student'
        ? [
            { id: '1', name: 'Meera Agarwal', rollNo: 'OCI-EN240119' },
            { id: '2', name: 'Ritu Joshi', rollNo: 'OCI-EN240115' },
            { id: '3', name: 'Meera Joshi', rollNo: 'OCI-EN240114' },
            { id: '4', name: 'Navya Mehta', rollNo: 'OCI-EN240105' },
            { id: '5', name: 'Rahul Verma', rollNo: 'OCI-001' }
        ]
        : [
            { id: '1', name: 'John Doe', designation: 'Teacher' },
            { id: '2', name: 'Jane Smith', designation: 'Admin' }
        ]

    // Generate data for each entity for each day
    entities.forEach(entity => {
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const random = Math.random()
            let status: any = 'present'

            const dayOfWeek = new Date(date).getDay()
            if (dayOfWeek === 0) status = 'holiday' // Sunday
            else if (random > 0.9) status = 'absent'
            else if (random > 0.85) status = 'leave'
            else if (random > 0.8) status = 'half-day'

            records.push({
                id: `${type}-${entity.id}-${date}`,
                date,
                status,
                type,
                entityId: entity.id,
                name: entity.name,
                rollNo: (entity as any).rollNo,
                designation: (entity as any).designation
            })
        }
    })

    return records
}

export const attendanceService = {
    // Get attendance for a specific month (for calendar view)
    async getMonthlyAttendance(
        type: AttendanceType,
        month: number,
        year: number
    ): Promise<ApiResponse<{ records: AttendanceRecord[] }>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const records = generateMockAttendance(type, month, year)
        return { success: true, data: { records } }
    },

    // Get attendance for a specific day (for table view)
    async getDailyAttendance(
        type: AttendanceType,
        date: string
    ): Promise<ApiResponse<{ records: AttendanceRecord[], stats: AttendanceStats }>> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const [year, month, day] = date.split('-').map(Number)
        const allRecords = generateMockAttendance(type, month - 1, year)
        const records = allRecords.filter(r => r.date === date)

        // Calculate stats
        const stats: AttendanceStats = {
            present: records.filter(r => r.status === 'present').length,
            absent: records.filter(r => r.status === 'absent').length,
            leave: records.filter(r => r.status === 'leave').length,
            halfDay: records.filter(r => r.status === 'half-day').length,
            holiday: records.filter(r => r.status === 'holiday').length,
            total: records.length
        }

        return {
            success: true,
            data: { records, stats }
        }
    },

    // Mark attendance
    async markAttendance(
        recordId: string,
        status: string
    ): Promise<ApiResponse> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return { success: true, message: 'Attendance updated successfully' }
    }
}
