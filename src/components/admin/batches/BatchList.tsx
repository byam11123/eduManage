// ============================================
// BATCH LIST COMPONENT
// Table view for listing batches with actions
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
import { MoreVertical, Pencil, Trash2, Eye, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import type { Batch } from '@/lib/types'

interface BatchListProps {
    batches: Batch[]
    loading?: boolean
    onEdit?: (batch: Batch) => void
    onDelete?: (batch: Batch) => void
}

export function BatchList({
    batches,
    loading,
    onEdit,
    onDelete
}: BatchListProps) {
    const router = useRouter()

    const handleRowClick = (batchId: string) => {
        router.push(`/admin/batch/${batchId}`)
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-green-100 text-green-700 border-none',
            inactive: 'bg-gray-100 text-gray-600 border-none',
            completed: 'bg-blue-100 text-blue-700 border-none'
        }
        return styles[status] || ''
    }

    if (loading) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead>BATCH NAME</TableHead>
                        <TableHead>COURSE</TableHead>
                        <TableHead>TIMING</TableHead>
                        <TableHead>STUDENTS</TableHead>
                        <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                            Loading batches...
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    if (batches.length === 0) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead>BATCH NAME</TableHead>
                        <TableHead>COURSE</TableHead>
                        <TableHead>TIMING</TableHead>
                        <TableHead>STUDENTS</TableHead>
                        <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Users className="h-8 w-8 text-gray-300" />
                                <p>No batches found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    return (
        <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                    <TableHead className="w-[60px] font-semibold text-xs uppercase tracking-wider text-gray-500">
                        ACTION
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        BATCH NAME
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        COURSE
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        TIMING
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        STUDENTS
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        STATUS
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {batches.map((batch) => (
                    <TableRow
                        key={batch.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleRowClick(batch.id)}
                    >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => onEdit?.(batch)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(batch)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                            {batch.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                            {batch.course?.name || '-'}
                        </TableCell>
                        <TableCell className="text-gray-500">
                            {batch.startTime && batch.endTime
                                ? `${batch.startTime} - ${batch.endTime}`
                                : '-'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                            {batch.students?.length || 0}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className={getStatusBadge(batch.status)}>
                                {batch.status.toUpperCase()}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
