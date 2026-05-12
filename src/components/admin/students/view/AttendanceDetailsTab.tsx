'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, XCircle, Clock4, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AttendanceDetailsTab() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // Feb 2026

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthName = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const paddingDays = Array.from({ length: firstDay }, (_, i) => i)

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
                                <span className="text-3xl font-black text-emerald-600">00</span>
                            </div>
                            <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 flex flex-col items-center gap-2 group transition-all hover:scale-[1.02]">
                                <XCircle className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700/70">ABSENT</span>
                                <span className="text-3xl font-black text-rose-600">00</span>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2">
                                <Clock4 className="h-6 w-6 text-gray-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">PERCENTAGE</span>
                                <span className="text-3xl font-black text-gray-900 dark:text-white">0%</span>
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
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95">
                                        <ChevronLeft className="h-5 w-5 text-gray-400" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95">
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
                                    {days.map(day => (
                                        <div key={day} className="h-32 border-b border-r last:border-r-0 border-gray-100 dark:border-gray-800 p-4 relative group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all cursor-pointer">
                                            <span className="text-sm font-black text-gray-900 dark:text-white transition-all group-hover:scale-110 inline-block">{day.toString().padStart(2, '0')}</span>
                                            {/* Empty State placeholder */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <Info className="h-4 w-4 text-gray-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
