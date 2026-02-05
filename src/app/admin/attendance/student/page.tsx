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
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            <AttendanceHeader
                title="Student"
                view={view}
                onViewChange={setView}
            />

            <Card className="border-none shadow-sm bg-transparent">
                <CardContent className="p-0 space-y-6">
                    {/* Filters */}
                    <AttendanceFilters
                        search={search}
                        onSearchChange={setSearch}
                        year={year}
                        onYearChange={setYear}
                        month={month}
                        onMonthChange={setMonth}
                    />

                    {/* Stats Legend */}
                    {view === 'calendar' && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                            <AttendanceStatsView type="student" stats={stats} />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
                    </div>

                    {/* Footer Pagination/Info */}
                    <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                        <span>Total Students: {view === 'table' ? records.length : '0'}</span>
                        {view === 'table' &&
                            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                SUBMIT
                            </Button>
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
