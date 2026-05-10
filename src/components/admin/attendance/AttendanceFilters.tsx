import { Input } from "@/components/ui/input"
import { Search, Calendar, Layers, MapPin, Filter, RotateCw } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Batch } from "@/lib/types"

interface AttendanceFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    year: number
    onYearChange: (year: number) => void
    month: number
    onMonthChange: (month: number) => void
    batchId?: string
    onBatchChange?: (id: string) => void
    batches?: Batch[]
    view?: 'table' | 'calendar'
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const years = [2024, 2025, 2026, 2027]

export function AttendanceFilters({
    search,
    onSearchChange,
    year,
    onYearChange,
    month,
    onMonthChange,
    batchId,
    onBatchChange,
    batches = [],
    view = 'table'
}: AttendanceFiltersProps) {
    return (
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full">
            {/* Search and Batch Section */}
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1 items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Search student by name or ID..."
                        className="pl-11 h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select value={batchId} onValueChange={onBatchChange}>
                    <SelectTrigger className="w-full md:w-[240px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-indigo-500" />
                            <SelectValue placeholder="All Batches" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                        <SelectItem value="all" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">All Active Batches</SelectItem>
                        {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">
                                {batch.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date/Month Section */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
                {view === 'calendar' ? (
                    <>
                        <Select value={month.toString()} onValueChange={(v) => onMonthChange(parseInt(v))}>
                            <SelectTrigger className="w-[140px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                                {months.map((m, i) => (
                                    <SelectItem key={i} value={i.toString()} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={year.toString()} onValueChange={(v) => onYearChange(parseInt(v))}>
                            <SelectTrigger className="w-[100px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                ) : (
                    <div className="flex items-center h-12 px-4 bg-gray-50/50 rounded-xl gap-3 text-indigo-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-black text-[10px] uppercase tracking-widest">Marking for Today</span>
                    </div>
                )}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl text-indigo-600 border-none bg-indigo-50 hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
                >
                    <RotateCw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
