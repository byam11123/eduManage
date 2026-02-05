'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AttendanceDetailsTab() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // Feb 2026

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthName = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const paddingDays = Array.from({ length: firstDay }, (_, i) => i)

    return (
        <div className="flex flex-col xl:flex-row gap-6">
            {/* Stats */}
            <Card className="border-none shadow-sm h-fit">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-800">Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="bg-green-100 text-green-700 text-sm font-bold py-2 px-4 rounded text-center">
                        PRESENT : 0
                    </div>
                    <div className="bg-red-100 text-red-700 text-sm font-bold py-2 px-4 rounded text-center">
                        ABSENT : 0
                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-slate-800 text-white hover:bg-slate-700 border-none">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-medium text-gray-700">{monthName} {year}</h2>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-slate-800 text-white hover:bg-slate-700 border-none">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-7 border border-gray-200 text-sm">
                    {/* Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center font-semibold text-blue-600 border-b border-gray-200 border-r last:border-r-0">
                            {day}
                        </div>
                    ))}

                    {/* Padding Days */}
                    {paddingDays.map(day => (
                        <div key={`pad-${day}`} className="h-24 border-b border-gray-200 border-r last:border-r-0 bg-gray-50/30" />
                    ))}

                    {/* Actual Days */}
                    {days.map(day => (
                        <div key={day} className="h-24 border-b border-gray-200 border-r last:border-r-0 last:border-b-0 p-2 relative group hover:bg-gray-50 transition-colors">
                            <span className="font-medium text-indigo-600 block mb-1">{day}</span>
                            {/* Attendance Status would go here */}
                            {/* <div className="absolute inset-x-2 top-8 text-xs text-center p-1 rounded bg-green-100 text-green-700">Present</div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
