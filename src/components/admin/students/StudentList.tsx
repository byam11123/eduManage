// ============================================
// STUDENT LIST COMPONENT
// Table view for listing students with actions
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MoreVertical, Pencil, Trash2, Eye, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Student } from '@/lib/types'

interface StudentListProps {
    students: Student[]
    loading?: boolean
    onEdit?: (student: Student) => void
    onDelete?: (student: Student) => void
    onView?: (student: Student) => void
}

export function StudentList({
    students,
    loading,
    onEdit,
    onDelete,
    onView
}: StudentListProps) {
    const router = useRouter()

    const handleRowClick = (studentId: string) => {
        router.push(`/admin/students/${studentId}`)
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-green-100 text-green-700 border-none',
            inactive: 'bg-gray-100 text-gray-600 border-none',
            graduated: 'bg-blue-100 text-blue-700 border-none',
            dropped: 'bg-red-100 text-red-700 border-none'
        }
        return styles[status] || ''
    }

    const getPaymentBadge = (status: string) => {
        const styles: Record<string, string> = {
            paid: 'bg-green-100 text-green-700 border-none',
            pending: 'bg-yellow-100 text-yellow-700 border-none',
            overdue: 'bg-red-100 text-red-700 border-none',
            partial: 'bg-orange-100 text-orange-700 border-none'
        }
        return styles[status] || ''
    }

    if (loading) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead>STUDENT</TableHead>
                        <TableHead>CONTACT</TableHead>
                        <TableHead>COURSE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>PAYMENT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                            Loading students...
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    if (students.length === 0) {
        return (
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <TableRow>
                        <TableHead className="w-[60px]">ACTION</TableHead>
                        <TableHead>STUDENT</TableHead>
                        <TableHead>CONTACT</TableHead>
                        <TableHead>COURSE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>PAYMENT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Users className="h-8 w-8 text-gray-300" />
                                <p>No students found</p>
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
                        STUDENT
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        CONTACT
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        COURSE
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        STATUS
                    </TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                        PAYMENT
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow
                        key={student.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleRowClick(student.id)}
                    >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => onView?.(student)}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit?.(student)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(student)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={student.imageUrl} alt={`${student.firstName} ${student.lastName}`} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                        {student.firstName[0]}{student.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '-'}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300">{student.email || '-'}</p>
                                <p className="text-xs text-gray-500">{student.phone || '-'}</p>
                            </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                            {student.course?.name || '-'}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className={getStatusBadge(student.status)}>
                                {student.status.toUpperCase()}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className={getPaymentBadge(student.paymentStatus)}>
                                {student.paymentStatus.toUpperCase()}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
