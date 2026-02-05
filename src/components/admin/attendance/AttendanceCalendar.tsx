import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getDaysInMonth } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { AttendanceRecord, AttendanceType } from "@/lib/types"

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
        return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-700' // Using color codes from images could also be specific
            case 'absent': return 'bg-red-100 text-red-700'
            case 'half-day': return 'bg-yellow-100 text-yellow-700'
            case 'holiday': return 'bg-blue-100 text-blue-700'
            case 'week-off': return 'bg-gray-100 text-gray-500' // Sunday
            default: return 'bg-gray-50 text-gray-400'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'present': return 'P'
            case 'absent': return 'A'
            case 'half-day': return 'HD'
            case 'holiday': return 'H'
            case 'week-off': return 'WO'
            default: return '-'
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading calendar data...</div>
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
            <Table className="w-full min-w-[1200px]">
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 font-semibold text-xs text-gray-500">
                        <TableHead className="w-[200px] sticky left-0 bg-gray-50 z-10">
                            {type === 'student' ? 'STUDENT NAME' : 'EMPLOYEE NAME'}
                        </TableHead>
                        <TableHead className="w-[100px] bg-gray-50">SUMMARY</TableHead>
                        {days.map(day => (
                            <TableHead key={day} className="text-center px-1 min-w-[40px] border-l border-gray-100">
                                <div className="flex flex-col items-center gap-1">
                                    <span>{day}</span>
                                    <span className="text-[10px] font-normal">{getDayName(day)}</span>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.values(entityRecords).map(({ info, days: statusMap }) => {
                        const presentCount = Object.values(statusMap).filter(s => s === 'present').length
                        const absentCount = Object.values(statusMap).filter(s => s === 'absent').length

                        return (
                            <TableRow key={info.entityId}>
                                <TableCell className="sticky left-0 bg-white z-10 border-r border-gray-100 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-600">
                                            <AvatarFallback>{info.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">{info.name}</span>
                                            <span className="text-[10px] text-gray-500">
                                                {type === 'student' ? info.rollNo : info.designation}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="border-r border-gray-100 bg-gray-50/30">
                                    <div className="flex flex-col gap-1 text-[10px] font-medium">
                                        <span className="text-green-600">Present: {presentCount}</span>
                                        <span className="text-red-500">Absent: {absentCount}</span>
                                    </div>
                                </TableCell>
                                {days.map(day => {
                                    const status = statusMap[day] || 'na'
                                    const isSunday = new Date(year, month, day).getDay() === 0
                                    const displayStatus = isSunday && status !== 'holiday' ? 'week-off' : status

                                    return (
                                        <TableCell key={day} className="p-0 text-center border-l border-gray-100">
                                            <div className={`h-full w-full py-3 flex items-center justify-center text-xs font-medium ${getStatusColor(displayStatus)}`}>
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
