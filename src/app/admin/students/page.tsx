'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Megaphone, Users, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { StudentList, StudentFilters, StudentStats, DeleteStudentDialog } from '@/components/admin/students'
import { useStudents, useCourses, useBranches } from '@/hooks'
import type { Student } from '@/lib/types'

export default function StudentsPage() {
    const router = useRouter()
    const {
        filteredStudents,
        loading,
        fetchStudents,
        deleteStudent,
        stats
    } = useStudents()

    const { courses } = useCourses()
    const { branches } = useBranches()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Student Directory"
                description="Manage student records, track academic progress, and monitor fee collection across all batches."
                actions={[
                    { 
                        label: 'Announcement', 
                        icon: Megaphone, 
                        variant: 'outline',
                        className: 'bg-violet-600 text-white hover:bg-violet-700 hover:text-white border-none shadow-lg shadow-violet-100 dark:shadow-none'
                    },
                    { label: 'Bulk Upload', icon: Upload, variant: 'outline' },
                    { label: 'Add New Student', icon: Plus, variant: 'default', href: '/admin/students/add' }
                ]}
            />

            <StudentStats {...stats} />

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="w-full lg:flex-1">
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                        <CardContent className="p-4">
                            <StudentFilters
                                onRefresh={fetchStudents}
                                loading={loading}
                                courses={courses}
                                branches={branches}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main List Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Student Ledger</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Live academic database</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
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
                    <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing {filteredStudents.length} Students
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400" disabled>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
