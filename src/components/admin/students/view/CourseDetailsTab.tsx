'use client'

import { Plus, MoreVertical, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface CourseDetailsTabProps {
    student: Student
}

export function CourseDetailsTab({ student }: CourseDetailsTabProps) {
    // Mock data for enrolled courses since the current Student type only has one course relation directly
    // Ideally this would come from a separate API call like /api/students/:id/courses
    const enrolledCourses = student.course ? [
        {
            id: '1',
            name: student.course.name || 'Unknown Course',
            status: student.status === 'active' ? 'Ongoing' : 'Completed',
            batch: student.batch?.name || 'Batch A',
        }
    ] : []

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Enrolled Courses
                </CardTitle>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9">
                    ADD COURSE
                    <BookOpen className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Course</TableHead>
                            <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Course Status</TableHead>
                            <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider">Batch</TableHead>
                            <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider text-center">Batch Reassign</TableHead>
                            <TableHead className="font-semibold text-gray-600 uppercase text-xs tracking-wider text-center">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrolledCourses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-gray-500">
                                    No courses found
                                </TableCell>
                            </TableRow>
                        ) : (
                            enrolledCourses.map((course) => (
                                <TableRow key={course.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-medium text-gray-900 capitalize">
                                        {course.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {course.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {course.batch}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 px-2 h-8">
                                            Reassign
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-end p-4 border-t border-gray-100 text-xs text-gray-500 gap-4">
                    <span className="flex items-center gap-2">
                        Rows per page:
                        <span className="font-medium">10</span>
                    </span>
                    <span>
                        {enrolledCourses.length > 0 ? `1-${enrolledCourses.length} of ${enrolledCourses.length}` : '0-0 of 0'}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled>
                            <span className="sr-only">Previous</span>
                            ‹
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled>
                            <span className="sr-only">Next</span>
                            ›
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
