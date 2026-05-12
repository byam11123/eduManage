'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, XCircle, Clock4, Info, MinusCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { useAttendance } from '@/hooks'
import { useEffect } from 'react'

interface AttendanceDetailsTabProps {
    student: any
}

export function AttendanceDetailsTab({ student }: AttendanceDetailsTabProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const { records: monthlyRecords, loading, fetchMonthlyAttendance } = useAttendance({ 
        type: 'student', 
        studentId: student.id 
    })

    useEffect(() => {
        fetchMonthlyAttendance(currentDate.getMonth(), currentDate.getFullYear())
    }, [currentDate, fetchMonthlyAttendance])

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const firstDayOfMonth = monthStart.getDay()
    
    // Get all days for the current month view
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const monthName = format(currentDate, 'MMMM')
    const year = format(currentDate, 'yyyy')

    // Merge initial data with fetched records to ensure we have the latest
    const allRecords = [...(student?.attendances || []), ...monthlyRecords]
    const uniqueRecords = Array.from(new Map(allRecords.map(r => [format(new Date(r.date), 'yyyy-MM-dd'), r])).values())
    
    // Filter attendances for the current month
    const currentMonthRecords = uniqueRecords.filter((a: any) => {
        const d = new Date(a.date)
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    })

    const stats = {
        present: currentMonthRecords.filter((a: any) => a.status === 'present').length,
        absent: currentMonthRecords.filter((a: any) => a.status === 'absent').length,
        leave: currentMonthRecords.filter((a: any) => a.status === 'leave').length,
        halfDay: currentMonthRecords.filter((a: any) => a.status === 'half-day').length,
        total: daysInMonth.filter(d => d <= new Date()).length // Total days passed so far in month
    }

    const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1))
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1))

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            case 'absent': return <XCircle className="h-4 w-4 text-rose-500" />
            case 'leave': return <MinusCircle className="h-4 w-4 text-amber-500" />
            case 'half-day': return <AlertCircle className="h-4 w-4 text-indigo-500" />
            default: return null
        }
    }

    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <div className="flex flex-col xl:flex-row gap-10">
                {/* Engagement Summary */}
                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden w-full xl:w-80 shrink-0 h-fit">
                    <CardContent className="p-8">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Attendance Summary
                        </h4>
                        <div className="space-y-4">
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center gap-2 group transition-all hover:scale-[1.02]">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700/70">PRESENT</span>
                                <span className="text-3xl font-black text-emerald-600">{stats.present.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 flex flex-col items-center gap-2 group transition-all hover:scale-[1.02]">
                                <XCircle className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700/70">ABSENT</span>
                                <span className="text-3xl font-black text-rose-600">{stats.absent.toString().padStart(2, '0')}</span>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2">
                                <Clock4 className="h-6 w-6 text-gray-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">PERCENTAGE</span>
                                <span className="text-3xl font-black text-gray-900 dark:text-white">{percentage}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Temporal Visualization (Calendar) */}
                <div className="flex-1 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                        <CardContent className="p-10">
                            <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-gray-800 pb-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                                        <CalendarDays className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                            {monthName} {year}
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Attendance Calendar</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button onClick={handlePrevMonth} variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95">
                                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                                    </Button>
                                    <Button onClick={handleNextMonth} variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95">
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
                                <div className="grid grid-cols-7 border-collapse">
                                    {/* Headers */}
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                        <div key={day} className="py-5 text-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-[0.3em] bg-indigo-50/30 dark:bg-indigo-900/10 border-b border-r last:border-r-0 border-gray-100 dark:border-gray-800">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Padding Days */}
                                    {paddingDays.map(day => (
                                        <div key={`pad-${day}`} className="h-32 border-b border-r last:border-r-0 border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/30" />
                                    ))}

                                    {/* Actual Days */}
                                    {daysInMonth.map(day => {
                                        const record = currentMonthRecords.find((a: any) => isSameDay(new Date(a.date), day))
                                        const isCurrentDay = isToday(day)
                                        
                                        return (
                                            <div 
                                                key={day.toISOString()} 
                                                className={cn(
                                                    "h-32 border-b border-r last:border-r-0 border-gray-100 dark:border-gray-800 p-4 relative group transition-all",
                                                    isCurrentDay && "bg-indigo-50/20 dark:bg-indigo-900/10",
                                                    loading && "opacity-50"
                                                )}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className={cn(
                                                        "text-sm font-black tracking-tighter",
                                                        isCurrentDay ? "text-indigo-600" : "text-gray-900 dark:text-white"
                                                    )}>
                                                        {format(day, 'dd')}
                                                    </span>
                                                    {record && getStatusIcon(record.status)}
                                                </div>

                                                {record && (
                                                    <div className="mt-3 flex items-center justify-center">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm transition-all group-hover:scale-110",
                                                            record.status === 'present' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30",
                                                            record.status === 'absent' && "bg-rose-50 text-rose-600 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30",
                                                            record.status === 'leave' && "bg-amber-50 text-amber-600 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30",
                                                            record.status === 'half-day' && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30"
                                                        )}>
                                                            {record.status === 'present' && 'P'}
                                                            {record.status === 'absent' && 'A'}
                                                            {record.status === 'leave' && 'L'}
                                                            {record.status === 'half-day' && 'H'}
                                                        </div>
                                                    </div>
                                                )}

                                                {record?.remarks && (
                                                    <p className="mt-2 text-[9px] text-gray-400 font-medium line-clamp-2 uppercase tracking-tighter italic">
                                                        "{record.remarks}"
                                                    </p>
                                                )}

                                                {isCurrentDay && (
                                                    <div className="absolute bottom-2 right-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
