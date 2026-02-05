import { AttendanceStats } from "@/lib/types"

interface AttendanceStatsProps {
    stats: AttendanceStats
    type: 'student' | 'employee'
}

export function AttendanceStatsView({ stats, type }: AttendanceStatsProps) {
    const items = [
        { label: 'Present', value: stats.present, color: 'bg-green-500' },
        { label: 'Absent', value: stats.absent, color: 'bg-red-500' },
        { label: 'Weekly Off', value: stats.holiday, color: 'bg-gray-300' },
        { label: 'Half Day', value: stats.halfDay, color: 'bg-yellow-500' },
        { label: 'Holiday', value: stats.holiday, color: 'bg-blue-400' },
        { label: 'Not Available', value: 0, color: 'bg-white border' },
    ]

    return (
        <div className="flex flex-wrap gap-4 items-center justify-center text-xs text-gray-500">
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}
