'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    AttendanceHeader,
    AttendanceFilters,
    AttendanceStatsView,
    AttendanceTable,
    AttendanceCalendar
} from '@/components/admin/attendance'
import { useAttendance } from '@/hooks'
import { ClipboardCheck } from 'lucide-react'

export default function StudentAttendancePage() {
    const [view, setView] = useState<'table' | 'calendar'>('table')
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<number>(new Date().getMonth())
    const [search, setSearch] = useState('')
    const [date, setDate] = useState<Date>(new Date())

    const {
        loading,
        records,
        stats,
        fetchMonthlyAttendance,
        fetchDailyAttendance,
        updateStatus
    } = useAttendance({ type: 'student' })

    useEffect(() => {
        if (view === 'calendar') {
            fetchMonthlyAttendance(month, year)
        } else {
            fetchDailyAttendance(date)
        }
    }, [view, month, year, date, fetchMonthlyAttendance, fetchDailyAttendance])

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <AttendanceHeader
                title="Student"
                view={view}
                onViewChange={setView}
            />

            <div className="space-y-6">
                {/* Filters */}
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                    <CardContent className="p-5">
                        <AttendanceFilters
                            search={search}
                            onSearchChange={setSearch}
                            year={year}
                            onYearChange={setYear}
                            month={month}
                            onMonthChange={setMonth}
                        />
                    </CardContent>
                </Card>

                {/* Stats Legend */}
                {view === 'calendar' && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border-none shadow-xl shadow-gray-200/50 dark:shadow-none">
                        <AttendanceStatsView type="student" stats={stats} />
                    </div>
                )}

                {/* Content */}
                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Presence Log</h3>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Automated entry management</p>
                            </div>
                        </div>
                        {view === 'table' && (
                            <Button className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none">
                                Submit Registry
                            </Button>
                        )}
                    </div>
                    <CardContent className="p-0">
                        {view === 'table' ? (
                            <AttendanceTable
                                records={records}
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
                    <span>Active Registry Count: {view === 'table' ? records.length : 'N/A'}</span>
                    <span>Last Synced: Just Now</span>
                </div>
            </div>
        </div>
    )
}
