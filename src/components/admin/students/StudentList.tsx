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
import { MoreVertical, Pencil, Trash2, Eye, Users, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Student } from '@/lib/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

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

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">Retrieving student records...</span>
                </div>
            </div>
        )
    }

    if (students.length === 0) {
        return (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-50">
                <Users className="h-12 w-12 text-gray-300" />
                <p className="font-bold uppercase tracking-widest text-xs">No student records found.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-y border-gray-50 dark:border-gray-800">
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Action</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Student Info</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Course & Batch</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Academic Status</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Fee Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow
                        key={student.id}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer border-b border-gray-50 dark:border-gray-800 transition-all"
                        onClick={() => handleRowClick(student.id)}
                    >
                        <TableCell className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                                    <DropdownMenuItem onClick={() => onView?.(student)} className="rounded-xl py-3 cursor-pointer">
                                        <Eye className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span className="font-bold">Full Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit?.(student)} className="rounded-xl py-3 cursor-pointer">
                                        <Pencil className="h-4 w-4 mr-2 text-amber-500" />
                                        <span className="font-bold">Update Details</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete?.(student)}
                                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-xl py-3 cursor-pointer mt-1 font-bold"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Record
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-11 w-11 border-2 border-white dark:border-gray-800 shadow-sm ring-2 ring-indigo-50 dark:ring-indigo-900/20">
                                    <AvatarImage src={student.imageUrl} alt={`${student.firstName} ${student.lastName}`} />
                                    <AvatarFallback className="bg-indigo-600 text-white font-black text-xs uppercase">
                                        {student.firstName[0]}{student.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                        {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                                        ID: {student.studentDisplayId || student.admissionDisplayId || '-'}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-700 dark:text-gray-300">{student.course?.name || '-'}</span>
                                <span className="text-[10px] font-bold text-indigo-500/70 uppercase tracking-tighter mt-1">Batch: Morning A</span>
                            </div>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                            <div className="flex flex-col gap-1">
                                <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400">{student.phone || '-'}</p>
                                <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{student.email || '-'}</p>
                            </div>
                        </TableCell>
                        <TableCell className="px-8 py-5">
                            <StatusBadge status={student.status} />
                        </TableCell>
                        <TableCell className="px-8 py-5">
                            <StatusBadge status={student.paymentStatus} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
