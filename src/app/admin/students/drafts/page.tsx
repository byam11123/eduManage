'use client'

import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Modular components
import { StudentList, DeleteStudentDialog } from '@/components/admin/students'

// Custom hooks
import { useStudents } from '@/hooks'
import { useFilterStore } from '@/lib/stores'

// Types
import type { Student } from '@/lib/types'

export default function DraftsPage() {
    const router = useRouter()

    // Global filter store
    const { setStudentStatus } = useFilterStore()

    // Initialize filter to 'draft' on mount
    useEffect(() => {
        setStudentStatus('draft')
        return () => {
            setStudentStatus('all') // Reset on unmount
        }
    }, [setStudentStatus])

    // Custom hooks for data
    const {
        filteredStudents,
        loading,
        deleteStudent
    } = useStudents()

    // Deletion states (Local to this page to avoid prop drilling issues if hooks differ)
    // Actually useStudents exposes deleteStudent, but StudentList needs handlers.
    // The explicit state handling was in the main page, let's replicate simpler version.

    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)

    const handleEdit = (student: Student) => {
        // Navigate to Admission Form with studentId to resume/edit
        // The admission form handles loading existing data
        router.push(`/admin/students/add?studentId=${student.id}`)
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

    // Viewing a draft might just mean editing it
    const handleView = (student: Student) => {
        router.push(`/admin/students/add?studentId=${student.id}`)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-indigo-600 font-medium">Students</span>
                <span>›</span>
                <span>Draft Admissions</span>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Draft Admissions</h1>
                    <p className="text-sm text-gray-500">Incomplete admission forms saved as drafts</p>
                </div>
                <Link href="/admin/students/add">
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="h-4 w-4" />
                        NEW ADMISSION
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {/* Student List (Filtered to drafts via store side-effect) */}
                    <div className="overflow-x-auto">
                        <StudentList
                            students={filteredStudents}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    </div>
                </CardContent>
            </Card>

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

import React from 'react'
