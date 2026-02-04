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
            {/* Refresh Button */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100"
                onClick={onRefresh}
                disabled={loading}
            >
                <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search courses..."
                    className="pl-9 h-9"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                />
            </div>

            {/* Status Filter */}
            <Select value={courseStatus} onValueChange={setCourseStatus}>
                <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetCourseFilters}
                    className="h-9 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}
        </div>
    )
}
