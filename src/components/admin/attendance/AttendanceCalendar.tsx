import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { AttendanceRecord, AttendanceType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AttendanceCalendarProps {
    records: AttendanceRecord[]
    loading: boolean
    month: number
    year: number
    type: AttendanceType
}

export function AttendanceCalendar({
    records,
    loading,
    month,
    year,
    type
}: AttendanceCalendarProps) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Group records by entity
    const entityRecords: Record<string, { info: any, days: Record<string, string> }> = {}

    records.forEach(record => {
        if (!entityRecords[record.entityId]) {
            entityRecords[record.entityId] = {
                info: record,
                days: {}
            }
        }
        const day = new Date(record.date).getDate()
        entityRecords[record.entityId].days[day] = record.status
    })

    // Get weekday for column headers
    const getDayName = (day: number) => {
        const date = new Date(year, month, day)
        return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'present': return 'bg-emerald-50 text-emerald-600 font-black'
            case 'absent': return 'bg-rose-50 text-rose-600 font-black'
            case 'half-day': return 'bg-amber-50 text-amber-600 font-black'
            case 'holiday': return 'bg-indigo-50 text-indigo-600 font-black'
            case 'week-off': return 'bg-gray-50 text-gray-400 font-bold opacity-50'
            default: return 'bg-transparent text-gray-200'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'present': return 'P'
            case 'absent': return 'A'
            case 'half-day': return 'HD'
            case 'holiday': return 'H'
            case 'week-off': return 'W'
            default: return '·'
        }
    }

    if (loading) {
        return (
            <div className="py-40 flex items-center justify-center animate-pulse">
                <div className="h-4 w-64 bg-gray-100 rounded-full" />
            </div>
        )
    }

    return (
        <div className="overflow-x-auto relative">
            <Table className="w-full min-w-[1400px] border-collapse">
                <TableHeader className="bg-gray-50/50 sticky top-0 z-20">
                    <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-[280px] sticky left-0 bg-white dark:bg-gray-900 z-30 font-black text-[10px] uppercase tracking-widest text-gray-400 py-6 pl-8 border-r border-gray-100 dark:border-gray-800 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                            {type === 'student' ? 'Academic Candidate' : 'Professional Staff'}
                        </TableHead>
                        <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-gray-400 py-6 text-center border-r border-gray-100 dark:border-gray-800">
                            Summary
                        </TableHead>
                        {days.map(day => {
                            const isWeekend = [0, 6].includes(new Date(year, month, day).getDay())
                            return (
                                <TableHead key={day} className={cn(
                                    "text-center p-0 min-w-[42px] border-r border-gray-100 dark:border-gray-800 last:border-r-0",
                                    isWeekend && "bg-gray-50/30"
                                )}>
                                    <div className="flex flex-col items-center py-4">
                                        <span className="text-[10px] font-black text-gray-900 dark:text-white mb-1">{day}</span>
                                        <span className="text-[8px] font-black text-gray-400">{getDayName(day)}</span>
                                    </div>
                                </TableHead>
                            )
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.values(entityRecords).map(({ info, days: statusMap }) => {
                        const presentCount = Object.values(statusMap).filter(s => s === 'present').length
                        const absentCount = Object.values(statusMap).filter(s => s === 'absent').length

                        return (
                            <TableRow key={info.entityId} className="group hover:bg-indigo-50/10 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-b-0">
                                <TableCell className="sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-100 dark:border-gray-800 pl-8 py-4 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold transition-all group-hover:scale-110">
                                            <AvatarFallback className="rounded-xl">{info.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{info.name}</span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                {type === 'student' ? info.rollNo : info.designation}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="border-r border-gray-100 dark:border-gray-800 bg-gray-50/20">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black text-gray-600">{presentCount}P</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1 w-1 rounded-full bg-rose-500" />
                                            <span className="text-[9px] font-black text-gray-600">{absentCount}A</span>
                                        </div>
                                    </div>
                                </TableCell>
                                {days.map(day => {
                                    const status = statusMap[day] || 'na'
                                    const isSunday = new Date(year, month, day).getDay() === 0
                                    const displayStatus = isSunday && status !== 'holiday' ? 'week-off' : status

                                    return (
                                        <TableCell key={day} className="p-0 border-r border-gray-100 dark:border-gray-800 last:border-r-0">
                                            <div className={cn(
                                                "h-12 w-full flex items-center justify-center text-[10px] transition-all",
                                                getStatusStyle(displayStatus)
                                            )}>
                                                {getStatusText(displayStatus)}
                                            </div>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
