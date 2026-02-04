// ============================================
// STUDENT FILTERS COMPONENT
// Search and filter controls for students
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
import { Search, RotateCw, X, Download } from 'lucide-react'
import { useFilterStore } from '@/lib/stores'
import type { Course, Branch, Batch } from '@/lib/types'

interface StudentFiltersProps {
    onRefresh?: () => void
    loading?: boolean
    courses?: Course[]
    branches?: Branch[]
    batches?: Batch[]
}

export function StudentFilters({
    onRefresh,
    loading,
    courses = [],
    branches = [],
    batches = []
}: StudentFiltersProps) {
    const {
        studentSearch,
        setStudentSearch,
        studentStatus,
        setStudentStatus,
        studentBranchId,
        setStudentBranchId,
        studentCourseId,
        setStudentCourseId,
        resetStudentFilters
    } = useFilterStore()

    const hasFilters = studentSearch || studentStatus !== 'all' || studentBranchId || studentCourseId

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
                    placeholder="Search students..."
                    className="pl-9 h-9"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                />
            </div>

            {/* Status Filter */}
            <Select value={studentStatus} onValueChange={setStudentStatus}>
                <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
            </Select>

            {/* Branch Filter */}
            {branches.length > 0 && (
                <Select value={studentBranchId} onValueChange={setStudentBranchId}>
                    <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Branches</SelectItem>
                        {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Course Filter */}
            {courses.length > 0 && (
                <Select value={studentCourseId} onValueChange={setStudentCourseId}>
                    <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Courses</SelectItem>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {/* Clear Filters */}
            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetStudentFilters}
                    className="h-9 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                </Button>
            )}

            {/* Export Button */}
            <Button variant="outline" size="sm" className="h-9 ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
        </div>
    )
}
