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
}

export function useAttendance({ type }: UseAttendanceProps) {
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
    const fetchMonthlyAttendance = useCallback(async (month: number, year: number) => {
        setLoading(true)
        try {
            const res = await attendanceService.getMonthlyAttendance(type, month, year)
            if (res.success && res.data) {
                setRecords(res.data.records)
            }
        } catch (error) {
            console.error('Error fetching monthly attendance:', error)
        } finally {
            setLoading(false)
        }
    }, [type])

    // Fetch data for table view
    const fetchDailyAttendance = useCallback(async (date: Date) => {
        setLoading(true)
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const res = await attendanceService.getDailyAttendance(type, formattedDate)
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

    const updateStatus = async (recordId: string, status: string) => {
        try {
            await attendanceService.markAttendance(recordId, status)
            // Optimistically update local state
            setRecords(prev => prev.map(r =>
                r.id === recordId ? { ...r, status: status as any } : r
            ))
            return true
        } catch (error) {
            console.error('Error updating attendance:', error)
            return false
        }
    }

    return {
        loading,
        records,
        stats,
        fetchMonthlyAttendance,
        fetchDailyAttendance,
        updateStatus
    }
}
