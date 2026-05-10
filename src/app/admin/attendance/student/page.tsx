'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AttendanceFilters,
    AttendanceStatsView,
    AttendanceTable,
    AttendanceCalendar
} from '@/components/admin/attendance'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { useAttendance, useBatches } from '@/hooks'
import { ClipboardCheck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default function StudentAttendancePage() {
    const [view, setView] = useState<'table' | 'calendar'>('table')
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<number>(new Date().getMonth())
    const [batchId, setBatchId] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [date, setDate] = useState<Date>(new Date())

    const {
        loading,
        records,
        stats,
        fetchMonthlyAttendance,
        fetchDailyAttendance,
        updateStatus,
        markAllPresent
    } = useAttendance({ type: 'student' })

    const { batches } = useBatches()

    useEffect(() => {
        if (view === 'calendar') {
            fetchMonthlyAttendance(month, year, batchId === 'all' ? undefined : batchId)
        } else {
            fetchDailyAttendance(date, batchId === 'all' ? undefined : batchId)
        }
    }, [view, month, year, date, batchId, fetchMonthlyAttendance, fetchDailyAttendance])

    const attendanceStats = [
        { title: 'Present Today', value: stats.present, icon: CheckCircle, color: 'emerald' as const, trend: 'In Campus' },
        { title: 'Absent', value: stats.absent, icon: XCircle, color: 'rose' as const, trend: 'Missing' },
        { title: 'Late/Half Day', value: stats.halfDay, icon: Clock, color: 'amber' as const, trend: 'Delayed' },
        { title: 'Leave', value: stats.leave, icon: AlertCircle, color: 'indigo' as const, trend: 'Approved' },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Student Attendance"
                description="Monitor daily presence, track monthly patterns, and manage leave records for all batches."
                actions={[
                    { 
                        label: view === 'table' ? 'Switch to Calendar' : 'Switch to Daily Log', 
                        icon: view === 'table' ? ClipboardCheck : ClipboardCheck, 
                        variant: 'outline',
                        onClick: () => setView(view === 'table' ? 'calendar' : 'table')
                    },
                    { 
                        label: 'Mark All Present', 
                        icon: CheckCircle, 
                        variant: 'default', 
                        onClick: () => markAllPresent(date, batchId === 'all' ? undefined : batchId) 
                    }
                ]}
            />

            <StatsGrid stats={attendanceStats} columns={4} />

            <div className="space-y-6">
                {/* Filters */}
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                    <CardContent className="p-4">
                        <AttendanceFilters
                            search={search}
                            onSearchChange={setSearch}
                            year={year}
                            onYearChange={setYear}
                            month={month}
                            onMonthChange={setMonth}
                            batchId={batchId}
                            onBatchChange={setBatchId}
                            batches={batches}
                            view={view}
                        />
                    </CardContent>
                </Card>

                {/* Content */}
                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">
                                    {view === 'table' ? 'Daily Presence Log' : 'Monthly Attendance View'}
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">
                                    {view === 'table' ? 'Real-time entry management' : 'Academic pattern analysis'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        {view === 'table' ? (
                            <AttendanceTable
                                records={records.filter(r => 
                                    r.name.toLowerCase().includes(search.toLowerCase()) || 
                                    (r.rollNo?.toLowerCase().includes(search.toLowerCase()) ?? false)
                                )}
                                loading={loading}
                                type="student"
                                onStatusChange={updateStatus}
                            />
                        ) : (
                            <AttendanceCalendar
                                records={records}
                                loading={loading}
                                month={month}
                                year={year}
                                type="student"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">
                    <span>Active Registry Count: {records.length}</span>
                    <span>Last Synced: Just Now</span>
                </div>
            </div>
        </div>
    )
}
