// ============================================
// COURSE LIST COMPONENT
// Table view for listing courses with actions
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
import { MoreVertical, Pencil, Trash2, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Course } from '@/lib/types'

interface CourseListProps {
    courses: Course[]
    loading?: boolean
    onEdit?: (course: Course) => void
    onDelete?: (course: Course) => void
}

export function CourseList({
    courses,
    loading,
    onEdit,
    onDelete
}: CourseListProps) {
    const router = useRouter()

    const handleRowClick = (courseId: string) => {
        router.push(`/admin/courses/${courseId}`)
    }

    if (loading) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead className="w-[250px]">NAME</TableHead>
                        <TableHead>FEE</TableHead>
                        <TableHead>DESCRIPTION</TableHead>
                        <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                            Loading courses...
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    if (courses.length === 0) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead className="w-[250px]">NAME</TableHead>
                        <TableHead>FEE</TableHead>
                        <TableHead>DESCRIPTION</TableHead>
                        <TableHead>STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <FileText className="h-8 w-8 text-gray-300" />
                                <p>No data found</p>
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
                    <TableHead className="w-[250px] font-semibold text-xs uppercase tracking-wider text-gray-500">
                        NAME
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        FEE
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        DESCRIPTION
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        STATUS
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {courses.map((course) => (
                    <TableRow
                        key={course.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleRowClick(course.id)}
                    >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => onEdit?.(course)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(course)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                            {course.name}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                            ₹{course.fee.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-500 dark:text-gray-400 max-w-md truncate">
                            {course.description || '-'}
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={course.status === 'active' ? 'default' : 'secondary'}
                                className={
                                    course.status === 'active'
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none'
                                        : ''
                                }
                            >
                                {course.status.toUpperCase()}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
