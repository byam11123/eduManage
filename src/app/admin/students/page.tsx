// ============================================
// STUDENTS PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Modular components
import { StudentList, StudentFilters, StudentStats, DeleteStudentDialog } from '@/components/admin/students'

// Custom hooks
import { useStudents, useCourses, useBranches } from '@/hooks'

// Types
import type { Student } from '@/lib/types'

export default function StudentsPage() {
    const router = useRouter()
    // Custom hooks for data
    const {
        filteredStudents,
        loading,
        fetchStudents,
        deleteStudent,
        stats
    } = useStudents()

    const { courses } = useCourses()
    const { branches } = useBranches()

    // Deletion states
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    // Handlers
    const handleEdit = (student: Student) => {
        router.push(`/admin/students/${student.id}/edit`)
    }

    const handleDelete = (student: Student) => {
        setSelectedStudent(student)
        setIsDeleteOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (selectedStudent) {
            await deleteStudent(selectedStudent.id)
            setIsDeleteOpen(false)
            setSelectedStudent(null)
        }
    }

    const handleView = (student: Student) => {
        router.push(`/admin/students/${student.id}`)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-indigo-600 font-medium">Students</span>
                <span>›</span>
                <span>Student list</span>
            </div>

            {/* Stats Grid */}
            <StudentStats {...stats} />

            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link href="/admin/students/add">
                        <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="h-4 w-4" />
                            ADD STUDENT
                        </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Upload className="h-4 w-4" />
                        UPLOAD DATA
                    </Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="h-9 gap-2 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white border-transparent">
                        <Megaphone className="h-4 w-4" />
                        ANNOUNCEMENT
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <StudentFilters
                            onRefresh={fetchStudents}
                            loading={loading}
                            courses={courses}
                            branches={branches}
                        />
                    </div>

                    {/* Student List */}
                    <div className="overflow-x-auto">
                        <StudentList
                            students={filteredStudents}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end text-sm text-gray-500 gap-4">
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select className="bg-transparent border rounded p-1">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                        </div>
                        <span>
                            {filteredStudents.length > 0 ? `1-${Math.min(10, filteredStudents.length)}` : '0-0'} of {filteredStudents.length}
                        </span>
                    </div>
                </CardContent>
            </Card>
            {/* Stats Grid */}

            {/* Deletion Dialog */}
            <DeleteStudentDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                student={selectedStudent}
                onConfirm={handleConfirmDelete}
                loading={loading}
            />
        </div>
    )
}
