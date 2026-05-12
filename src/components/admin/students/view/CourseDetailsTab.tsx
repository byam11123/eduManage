'use client'

import { useState } from 'react'
import { Plus, MoreVertical, Edit, Trash2, Repeat, GraduationCap, LayoutPanelLeft, CalendarRange, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Student } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { CourseActionDialog } from './CourseActionDialog'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CourseDetailsTabProps {
    student: Student
    onRefresh: () => void
}

export function CourseDetailsTab({ student, onRefresh }: CourseDetailsTabProps) {
    const router = useRouter()
    const courses = student.studentCourses || []

    // Action States
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const [actionType, setActionType] = useState<'add' | 'status' | 'batch' | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAction = (course: any, type: 'add' | 'status' | 'batch') => {
        setSelectedCourse(course)
        setActionType(type)
        setIsDialogOpen(true)
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing': return 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-none'
            case 'completed': return 'bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none'
            case 'dropped': return 'bg-rose-500 text-white shadow-rose-100 dark:shadow-none'
            default: return 'bg-gray-400 text-white'
        }
    }

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header / Actions */}
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex items-center justify-between shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-20" />
                <div className="flex items-center gap-8 relative">
                    <div className="h-16 w-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md shadow-inner">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Enrolled Courses</h3>
                        <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">Active records of institutional pedagogical engagement.</p>
                    </div>
                </div>
                <Button
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-indigo-600 font-black uppercase tracking-widest text-[11px] h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-95 relative"
                    onClick={() => handleAction(null, 'add')}
                >
                    <Plus className="h-4 w-4" />
                    ENROLL NEW PROGRAM
                </Button>
            </div>

            {/* Course List Table */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <h4 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        Enrolled Courses
                    </h4>

                    <div className="rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-950/50">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="h-14 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <LayoutPanelLeft className="h-3 w-3" />
                                            Course Name
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</TableHead>
                                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="h-3 w-3" />
                                            Batch
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <CalendarRange className="h-3 w-3" />
                                            Joined On
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.length === 0 ? (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell colSpan={5} className="text-center py-20 text-gray-400 text-xs font-black uppercase tracking-widest italic">
                                            No institutional pedagogical records identified.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    courses.map((enrollment: any) => (
                                        <TableRow key={enrollment.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 border-gray-100 dark:border-gray-800 transition-colors">
                                            <TableCell className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                                                    {enrollment.course?.name || 'UNIDENTIFIED_PROGRAM'}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                    ID: {enrollment.course?.id?.slice(-8).toUpperCase()}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none shadow-lg", getStatusColor(enrollment.status))}>
                                                    {enrollment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {enrollment.batches && enrollment.batches.length > 0 ? (
                                                        enrollment.batches.map((b: any) => (
                                                            <span
                                                                key={b.id}
                                                                className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 shadow-sm"
                                                            >
                                                                {b.batch?.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                                            Batch Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                                    {formatDate(enrollment.joinedAt)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-8 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                                            <MoreVertical className="h-4 w-4 text-gray-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl">
                                                        <DropdownMenuItem
                                                            className="rounded-xl py-3 gap-3 font-black text-[10px] uppercase tracking-widest text-gray-600 focus:bg-indigo-50 focus:text-indigo-700"
                                                            onClick={() => handleAction(enrollment, 'status')}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl py-3 gap-3 font-black text-[10px] uppercase tracking-widest text-gray-600 focus:bg-indigo-50 focus:text-indigo-700"
                                                            onClick={() => handleAction(enrollment, 'batch')}
                                                        >
                                                            <Repeat className="h-4 w-4" />
                                                            Assign to Batch
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
                                                        <DropdownMenuItem
                                                            className="rounded-xl py-3 gap-3 font-black text-[10px] uppercase tracking-widest text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                                                            onClick={() => handleAction(enrollment, 'status')}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Mark Dropped
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <CourseActionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                studentId={student.id}
                course={selectedCourse}
                actionType={actionType}
                onSuccess={() => {
                    onRefresh()
                    router.refresh()
                }}
            />
        </div>
    )
}
