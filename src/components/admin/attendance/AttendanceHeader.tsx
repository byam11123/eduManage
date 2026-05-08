'use client'

import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, List as ListIcon, LayoutGrid, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/shared/PageHeader"

interface AttendanceHeaderProps {
    title: string
    view: 'table' | 'calendar'
    onViewChange: (view: 'table' | 'calendar') => void
}

export function AttendanceHeader({ title, view, onViewChange }: AttendanceHeaderProps) {
    return (
        <div className="space-y-8">
            <PageHeader 
                title={`${title} Attendance`}
                description={`Daily presence tracking and monthly attendance reports for ${title.toLowerCase()}s.`}
                actions={[
                    { label: 'Download Logs', icon: Clock, variant: 'outline' }
                ]}
            />

            <div className="flex bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-1.5 shadow-sm w-fit">
                <button
                    onClick={() => onViewChange('table')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        view === 'table' 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600"
                    )}
                >
                    <ListIcon className="w-4 h-4" />
                    Daily Table
                </button>
                <button
                    onClick={() => onViewChange('calendar')}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        view === 'calendar' 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600"
                    )}
                >
                    <CalendarIcon className="w-4 h-4" />
                    Monthly Calendar
                </button>
            </div>
        </div>
    )
}
