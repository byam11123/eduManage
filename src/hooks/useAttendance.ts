// ============================================
// USE ATTENDANCE HOOK
// Custom hook for managing attendance
// ============================================

import { useState, useCallback } from 'react'
import { attendanceService } from '@/lib/services'
import type { AttendanceRecord, AttendanceStats, AttendanceType } from '@/lib/types'
import { startOfMonth, endOfMonth, format } from 'date-fns'

interface UseAttendanceProps {
    type: AttendanceType
    studentId?: string
    employeeId?: string
}

export function useAttendance({ type, studentId, employeeId }: UseAttendanceProps) {
    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [stats, setStats] = useState<AttendanceStats>({
        present: 0,
        absent: 0,
        leave: 0,
        halfDay: 0,
        holiday: 0,
        total: 0
    })

    // Fetch data for calendar view
    const fetchMonthlyAttendance = useCallback(async (month: number, year: number, batchId?: string) => {
        setLoading(true)
        try {
            const res = await attendanceService.getMonthlyAttendance(type, month, year, batchId, studentId, employeeId)
            if (res.success && res.data) {
                setRecords(res.data.records)
            }
        } catch (error) {
            console.error('Error fetching monthly attendance:', error)
        } finally {
            setLoading(false)
        }
    }, [type, studentId, employeeId])

    // Fetch data for table view
    const fetchDailyAttendance = useCallback(async (date: Date, batchId?: string) => {
        setLoading(true)
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const res = await attendanceService.getDailyAttendance(type, formattedDate, batchId)
            if (res.success && res.data) {
                setRecords(res.data.records)
                setStats(res.data.stats)
            }
        } catch (error) {
            console.error('Error fetching daily attendance:', error)
        } finally {
            setLoading(false)
        }
    }, [type])

    const updateStatus = async (recordId: string, status: string, remarks?: string) => {
        try {
            const record = records.find(r => r.id === recordId)
            if (!record) return false

            const res = await attendanceService.markAttendance(
                record.entityId,
                status,
                remarks,
                record.date,
                type
            )

            if (res.success) {
                // Optimistically update local state
                setRecords(prev => {
                    const newRecords = prev.map(r =>
                        r.id === recordId ? { ...r, status: status as any, id: res.data.id } : r
                    )
                    
                    // Recalculate stats
                    const newStats = {
                        present: newRecords.filter(r => r.status === 'present').length,
                        absent: newRecords.filter(r => r.status === 'absent').length,
                        leave: newRecords.filter(r => r.status === 'leave').length,
                        halfDay: newRecords.filter(r => r.status === 'half-day').length,
                        holiday: newRecords.filter(r => r.status === 'holiday').length,
                        total: newRecords.length
                    }
                    setStats(newStats)
                    
                    return newRecords
                })
                return true
            }
            return false
        } catch (error) {
            console.error('Error updating attendance:', error)
            return false
        }
    }

    const markAllPresent = async (date: Date, batchId?: string) => {
        setLoading(true)
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const entityIds = records.map(r => r.entityId)
            
            const res = await attendanceService.bulkMarkAttendance(
                entityIds,
                'present',
                formattedDate,
                type,
                batchId
            )

            if (res.success) {
                // Refresh data to get real IDs and updated stats
                await fetchDailyAttendance(date, batchId)
                return true
            }
            return false
        } catch (error) {
            console.error('Error in markAllPresent:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        records,
        stats,
        fetchMonthlyAttendance,
        fetchDailyAttendance,
        updateStatus,
        markAllPresent
    }
}
