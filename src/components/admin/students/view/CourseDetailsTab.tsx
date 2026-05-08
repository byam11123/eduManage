import { useState } from 'react'
import { Plus, MoreVertical, Edit, Trash2, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { Student, StudentCourse } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { CourseActionDialog } from './CourseActionDialog'
import { useRouter } from 'next/navigation'

interface CourseDetailsTabProps {
    student: Student
}

export function CourseDetailsTab({ student }: CourseDetailsTabProps) {
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
            case 'ongoing': return 'bg-emerald-100 text-emerald-700'
            case 'completed': return 'bg-blue-100 text-blue-700'
            case 'dropped': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Enrolled Courses</h2>
                    <p className="text-xs text-gray-500">Manage student's academic enrollments</p>
                </div>
                <Button
                    size="sm"
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleAction(null, 'add')}
                >
                    <Plus className="h-4 w-4" />
                    Add Course
                </Button>
            </div>

            {/* Course List Table */}
            <Card className="shadow-none border-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Course Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Batch(s)</TableHead>
                                <TableHead>Joined On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No active enrollments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((enrollment: any) => (
                                    <TableRow key={enrollment.id} className="hover:bg-gray-50/50">
                                        <TableCell className="font-medium text-gray-900">
                                            {enrollment.course?.name || 'Unknown Course'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`border-0 ${getStatusColor(enrollment.status)}`}>
                                                {enrollment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                {enrollment.batches && enrollment.batches.length > 0 ? (
                                                    enrollment.batches.map((b: any) => (
                                                        <span
                                                            key={b.id}
                                                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                                        >
                                                            {b.batch?.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No Batch Assigned</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(enrollment.joinedAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem
                                                        className="gap-2 text-gray-600"
                                                        onClick={() => handleAction(enrollment, 'status')}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-gray-600"
                                                        onClick={() => handleAction(enrollment, 'batch')}
                                                    >
                                                        <Repeat className="h-4 w-4" />
                                                        Reassign Batch
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
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
                </CardContent>
            </Card>

            <CourseActionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                studentId={student.id}
                course={selectedCourse}
                actionType={actionType}
                onSuccess={() => router.refresh()}
            />
        </div>
    )
}
