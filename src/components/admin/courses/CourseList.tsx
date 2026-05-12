// ============================================
// COURSE LIST COMPONENT
// Table view for listing courses with bulk actions
// ============================================

'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Course } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useTableFeatures, ColumnDef } from '@/hooks/useTableFeatures'
import { TableToolbar } from '@/components/shared/table/TableToolbar'
import { BulkActionBar } from '@/components/shared/table/BulkActionBar'

interface CourseListProps {
    courses: Course[]
    loading?: boolean
    onEdit?: (course: Course) => void
    onDelete?: (course: Course) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkExport?: (ids: string[]) => void
    isBulkDeleting?: boolean
    isBulkExporting?: boolean
}

export function CourseList({
    courses,
    loading,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkExport,
    isBulkDeleting,
    isBulkExporting
}: CourseListProps) {
    const router = useRouter()

    const columns: ColumnDef[] = [
        { id: 'program', label: 'Program Name' },
        { id: 'fee', label: 'Fee Structure' },
        { id: 'details', label: 'Program Details' },
        { id: 'status', label: 'Status' },
    ]

    const {
        selectedIds,
        selectedArray,
        toggleSelection,
        selectAll,
        clearSelection,
        isAllSelected,
        isSomeSelected,
        visibleColumns,
        toggleColumn,
        isColumnVisible,
        availableColumns
    } = useTableFeatures(courses, columns)

    const handleRowClick = (courseId: string) => {
        router.push(`/admin/courses/${courseId}`)
    }

    if (loading) {
        return (
            <div className="flex flex-col">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Academic Programs</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Live Course Registry</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">Loading courses...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Academic Programs</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Live Course Registry</p>
                        </div>
                    </div>
                    <div className="flex-none">
                        <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                    </div>
                </div>
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
                        <BookOpen className="h-10 w-10 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-gray-400 uppercase">Registry Empty</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">No courses have been configured yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {/* Header with Toolbar */}
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Academic Programs</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Live Course Registry</p>
                    </div>
                </div>
                <div className="flex-none">
                    <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[50px] px-8 py-5">
                                <Checkbox
                                    checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                                    onCheckedChange={selectAll}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead className="w-[60px] font-black text-[10px] uppercase tracking-widest text-gray-400 py-5 pl-2">Action</TableHead>
                            {isColumnVisible('program') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5">Program Name</TableHead>}
                            {isColumnVisible('fee') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5">Fee Structure</TableHead>}
                            {isColumnVisible('details') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5">Program Details</TableHead>}
                            {isColumnVisible('status') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-5 pr-8">Status</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => {
                            const isSelected = selectedIds.has(course.id)
                            return (
                                <TableRow
                                    key={course.id}
                                    className={cn(
                                        'group cursor-pointer border-b border-gray-50 dark:border-gray-800 transition-all',
                                        isSelected
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
                                            : 'hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
                                    )}
                                    onClick={() => handleRowClick(course.id)}
                                >
                                    <TableCell className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleSelection(course.id)}
                                            aria-label={`Select ${course.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="pl-2 py-5" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="rounded-xl border-none shadow-2xl p-2 min-w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() => onEdit?.(course)}
                                                    className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-wider gap-2"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete?.(course)}
                                                    className="rounded-lg py-2.5 font-bold text-xs uppercase tracking-wider gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete Course
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    {isColumnVisible('program') && (
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-900 dark:text-white tracking-tight">{course.name}</span>
                                                {course.code && (
                                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{course.code}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('fee') && (
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-900 dark:text-white tracking-tight">₹{course.fee.toLocaleString()}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Standard Offering</span>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('details') && (
                                        <TableCell className="max-w-md">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 truncate leading-relaxed">
                                                {course.description || 'No description provided'}
                                            </p>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('status') && (
                                        <TableCell className="pr-8">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'px-3 py-1 rounded-full border-none font-black text-[9px] uppercase tracking-[0.15em]',
                                                    course.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'
                                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                                )}
                                            >
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <BulkActionBar
                selectedCount={selectedIds.size}
                onClearSelection={clearSelection}
                onExport={() => onBulkExport?.(selectedArray)}
                onDelete={() => onBulkDelete?.(selectedArray)}
                isExporting={isBulkExporting}
                isDeleting={isBulkDeleting}
            />
        </div>
    )
}
