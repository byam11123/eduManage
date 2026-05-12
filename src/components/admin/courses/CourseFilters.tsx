// ============================================
// COURSE FILTERS COMPONENT
// Search and filter controls for courses
// ============================================

'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Search, RotateCw, X } from 'lucide-react'
import { useFilterStore } from '@/lib/stores'

interface CourseFiltersProps {
    onRefresh?: () => void
    loading?: boolean
}

export function CourseFilters({ onRefresh, loading }: CourseFiltersProps) {
    const {
        courseSearch,
        setCourseSearch,
        courseStatus,
        setCourseStatus,
        resetCourseFilters
    } = useFilterStore()

    const hasFilters = courseSearch || courseStatus !== 'all'

    return (
        <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                    placeholder="Search by course name, code or description..."
                    className="pl-11 h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                />
            </div>

            {/* Status Filter */}
            <Select value={courseStatus} onValueChange={setCourseStatus}>
                <SelectTrigger className="w-[180px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                    <SelectItem value="all" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">All Status</SelectItem>
                    <SelectItem value="active" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">Active Only</SelectItem>
                    <SelectItem value="inactive" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">Inactive Only</SelectItem>
                </SelectContent>
            </Select>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl text-indigo-600 border-none bg-indigo-50 hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetCourseFilters}
                        className="h-12 px-5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Reset Filters
                    </Button>
                )}
            </div>
        </div>
    )
}
