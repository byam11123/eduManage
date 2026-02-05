import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AttendanceFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    year: number
    onYearChange: (year: number) => void
    month: number
    onMonthChange: (month: number) => void
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
    onMonthChange
}: AttendanceFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Name, ID"
                    className="pl-9"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md bg-white dark:bg-gray-900">
                    <span className="px-3 text-sm text-gray-500 border-r py-2">Year</span>
                    <Select value={year.toString()} onValueChange={(v) => onYearChange(parseInt(v))}>
                        <SelectTrigger className="border-0 focus:ring-0 w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center border rounded-md bg-white dark:bg-gray-900">
                    <span className="px-3 text-sm text-gray-500 border-r py-2">Month</span>
                    <Select value={month.toString()} onValueChange={(v) => onMonthChange(parseInt(v))}>
                        <SelectTrigger className="border-0 focus:ring-0 w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((m, i) => (
                                <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
