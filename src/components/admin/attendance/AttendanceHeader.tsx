import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, List as ListIcon } from "lucide-react"

interface AttendanceHeaderProps {
    title: string
    view: 'table' | 'calendar'
    onViewChange: (view: 'table' | 'calendar') => void
}

export function AttendanceHeader({ title, view, onViewChange }: AttendanceHeaderProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500">
                <span className="text-indigo-600">Attendance</span>
                <span className="mx-2">›</span>
                <span className="text-indigo-600">{title}</span>
                <span className="mx-2">›</span>
                <span>{title} attendance</span>
            </div>

            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => onViewChange('table')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${view === 'table'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    TABLE VIEW
                </button>
                <button
                    onClick={() => onViewChange('calendar')}
                    className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${view === 'calendar'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    CALENDAR VIEW
                </button>
            </div>
        </div>
    )
}
