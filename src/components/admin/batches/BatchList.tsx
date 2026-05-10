// ============================================
// BATCH LIST COMPONENT
// Table view for listing batches with bulk actions
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
import { MoreVertical, Pencil, Trash2, Eye, Users, Calendar, Clock, Layers } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Batch } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useTableFeatures, ColumnDef } from '@/hooks/useTableFeatures'
import { TableToolbar } from '@/components/shared/table/TableToolbar'
import { BulkActionBar } from '@/components/shared/table/BulkActionBar'

interface BatchListProps {
    batches: Batch[]
    loading?: boolean
    onEdit?: (batch: Batch) => void
    onDelete?: (batch: Batch) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkExport?: (ids: string[]) => void
    isBulkDeleting?: boolean
    isBulkExporting?: boolean
}

export function BatchList({
    batches,
    loading,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkExport,
    isBulkDeleting,
    isBulkExporting
}: BatchListProps) {
    const router = useRouter()

    const columns: ColumnDef[] = [
        { id: 'cohort', label: 'Academic Cohort' },
        { id: 'course', label: 'Course Stream' },
        { id: 'cycle', label: 'Cycle' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'enrollments', label: 'Enrollments' },
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
    } = useTableFeatures(batches, columns)

    const handleRowClick = (batchId: string) => {
        router.push(`/admin/batch/${batchId}`)
    }

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
            case 'inactive':
                return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
            case 'completed':
                return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Active Academic Cohorts</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Comprehensive list of all registered batches</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest animate-pulse">
                    Synchronizing academic registry...
                </div>
            </div>
        )
    }

    if (batches.length === 0) {
        return (
            <div className="flex flex-col">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Active Academic Cohorts</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Comprehensive list of all registered batches</p>
                        </div>
                    </div>
                    <div className="flex-none">
                        <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                    </div>
                </div>
                <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Layers className="h-8 w-8 text-gray-200" />
                    </div>
                    <div>
                        <p className="font-black text-xs uppercase tracking-widest text-gray-400">No active cohorts found</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Register a new batch to begin tracking students</p>
                    </div>
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
                        <Layers className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Active Academic Cohorts</h3>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Comprehensive list of all registered batches</p>
                    </div>
                </div>
                <div className="flex-none">
                    <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-gray-50 dark:border-gray-800 hover:bg-transparent">
                        <TableHead className="w-[50px] pl-8">
                            <Checkbox
                                checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                                onCheckedChange={selectAll}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-widest text-gray-400 pl-2">Ops</TableHead>
                        {isColumnVisible('cohort') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Academic Cohort</TableHead>}
                        {isColumnVisible('course') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Course Stream</TableHead>}
                        {isColumnVisible('cycle') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Cycle</TableHead>}
                        {isColumnVisible('schedule') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Schedule</TableHead>}
                        {isColumnVisible('enrollments') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Enrollments</TableHead>}
                        {isColumnVisible('status') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-right pr-8">Status</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {batches.map((batch) => {
                        const isSelected = selectedIds.has(batch.id)
                        return (
                            <TableRow
                                key={batch.id}
                                className={cn(
                                    'group border-b border-gray-50 dark:border-gray-800 transition-all cursor-pointer',
                                    isSelected
                                        ? 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
                                        : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                                )}
                                onClick={() => handleRowClick(batch.id)}
                            >
                                <TableCell className="pl-8" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleSelection(batch.id)}
                                        aria-label={`Select ${batch.name}`}
                                    />
                                </TableCell>
                                <TableCell className="pl-2" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                            onClick={() => onEdit?.(batch)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100">
                                                    <MoreVertical className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="rounded-xl border-none shadow-2xl p-1">
                                                <DropdownMenuItem onClick={() => handleRowClick(batch.id)} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3">
                                                    <Eye className="h-4 w-4 mr-2 text-indigo-500" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete?.(batch)} className="rounded-lg font-bold text-[10px] uppercase tracking-widest py-3 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Terminate Batch
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                                {isColumnVisible('cohort') && (
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">
                                                {batch.name}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-0.5">
                                                ID: {batch.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {isColumnVisible('course') && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <Layers className="h-3.5 w-3.5 text-gray-400" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {batch.course?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {isColumnVisible('cycle') && (
                                    <TableCell className="text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                                {batch.startDate ? format(new Date(batch.startDate), 'MMM yy') : 'N/A'} - {batch.endDate ? format(new Date(batch.endDate), 'MMM yy') : 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {isColumnVisible('schedule') && (
                                    <TableCell className="text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/50 rounded-lg">
                                            <Clock className="h-3 w-3 text-indigo-400" />
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
                                                {batch.startTime || '--:--'} - {batch.endTime || '--:--'}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {isColumnVisible('enrollments') && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Users className="h-3.5 w-3.5 text-gray-300" />
                                            <span className="text-xs font-black text-gray-900">
                                                {(batch as any)._count?.students || 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {isColumnVisible('status') && (
                                    <TableCell className="text-right pr-8">
                                        <Badge variant="outline" className={cn(
                                            'rounded-lg font-black text-[10px] px-2 py-0.5 uppercase tracking-widest border',
                                            getStatusStyles(batch.status)
                                        )}>
                                            {batch.status}
                                        </Badge>
                                    </TableCell>
                                )}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

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
