// ============================================
// BATCH FILTERS COMPONENT
// Search and filter controls for batches
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
import { Search, RotateCw, X, Layers, Filter } from 'lucide-react'
import { useFilterStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { Course } from '@/lib/types'

interface BatchFiltersProps {
    onRefresh?: () => void
    loading?: boolean
    courses?: Course[]
}

export function BatchFilters({ onRefresh, loading, courses = [] }: BatchFiltersProps) {
    const {
        batchSearch,
        setBatchSearch,
        batchStatus,
        setBatchStatus,
        batchCourseId,
        setBatchCourseId,
        resetBatchFilters
    } = useFilterStore()

    const hasFilters = batchSearch || batchStatus !== 'all' || (batchCourseId && batchCourseId !== 'all')

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full">
            {/* Search and Course Section */}
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1 items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Search batches by name or ID..."
                        className="pl-11 h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
                        value={batchSearch}
                        onChange={(e) => setBatchSearch(e.target.value)}
                    />
                </div>

                <Select value={batchCourseId || 'all'} onValueChange={setBatchCourseId}>
                    <SelectTrigger className="w-full md:w-[240px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-indigo-500" />
                            <SelectValue placeholder="All Courses" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                        <SelectItem value="all" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">All Academic Streams</SelectItem>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">
                                {course.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Status and Actions Section */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
                <Select value={batchStatus} onValueChange={setBatchStatus}>
                    <SelectTrigger className="w-[160px] h-12 bg-gray-50/50 border-none rounded-xl font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                        <SelectItem value="all" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">All Status</SelectItem>
                        <SelectItem value="active" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3 text-emerald-600">Active</SelectItem>
                        <SelectItem value="inactive" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3 text-amber-600">Inactive</SelectItem>
                        <SelectItem value="completed" className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3 text-blue-600">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetBatchFilters}
                            className="h-12 w-12 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Reset Filters"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-xl text-indigo-600 border-none bg-indigo-50 hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
