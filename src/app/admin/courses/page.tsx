// ============================================
// COURSES PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Modular components
import {
    CourseList,
    CourseFilters,
    AddCourseDialog,
    EditCourseDialog,
    DeleteCourseDialog
} from '@/components/admin/courses'

// Custom hooks
import { useCourses } from '@/hooks'

// Types
import type { Course, CourseFormData } from '@/lib/types'

// Default form data
const defaultFormData: CourseFormData = {
    // Basic Info
    name: '',
    description: '',
    courseType: '',
    mode: 'offline',
    // Fee Structure
    fee: '',
    feeDescription: '',
    registrationFee: '',
    discountAllowed: false,
    discountPercentage: '',
    maxInstallments: '1',
    installmentAmounts: [],
    // Duration
    durationYears: '0',
    durationMonths: '0',
    // Academic Details
    subjects: [],
    eligibility: '',
    // Status Control
    status: 'active'
}

export default function CoursesPage() {
    // Custom hook for course data
    const {
        filteredCourses,
        loading,
        saving,
        fetchCourses,
        createCourse,
        updateCourse,
        deleteCourse
    } = useCourses()

    // Dialog states
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    // Selected course for edit/delete
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    // Form data
    const [formData, setFormData] = useState<CourseFormData>(defaultFormData)

    // Handlers
    const handleCreate = async () => {
        const success = await createCourse(formData)
        if (success) {
            setIsAddOpen(false)
            setFormData(defaultFormData)
        }
    }

    const handleEdit = (course: Course) => {
        setSelectedCourse(course)
        setFormData({
            // Basic Info
            name: course.name,
            description: course.description || '',
            courseType: (course as any).courseType || '',
            mode: (course as any).mode || 'offline',
            // Fee Structure
            fee: course.fee.toString(),
            feeDescription: course.feeDescription || '',
            registrationFee: ((course as any).registrationFee || '').toString(),
            discountAllowed: (course as any).discountAllowed || false,
            discountPercentage: ((course as any).discountPercentage || '').toString(),
            maxInstallments: course.maxInstallments.toString(),
            installmentAmounts: (course as any).installmentAmounts || [],
            // Duration
            durationYears: course.durationYears.toString(),
            durationMonths: course.durationMonths.toString(),
            // Academic Details
            subjects: (course as any).subjects?.map((s: any) => s.name) || [],
            eligibility: (course as any).eligibility || '',
            // Status Control
            status: course.status
        })
        setIsEditOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedCourse) return
        const success = await updateCourse(selectedCourse.id, formData)
        if (success) {
            setIsEditOpen(false)
            setSelectedCourse(null)
            setFormData(defaultFormData)
        }
    }

    const handleDelete = (course: Course) => {
        setSelectedCourse(course)
        setIsDeleteOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedCourse) return
        const success = await deleteCourse(selectedCourse.id)
        if (success) {
            setIsDeleteOpen(false)
            setSelectedCourse(null)
        }
    }

    const handleAddOpen = () => {
        setFormData(defaultFormData)
        setIsAddOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Courses
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your institute&apos;s courses
                    </p>
                </div>

                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    onClick={handleAddOpen}
                >
                    <Plus className="h-4 w-4" />
                    ADD COURSE
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <CourseFilters onRefresh={fetchCourses} loading={loading} />
                    </div>

                    {/* Course List */}
                    <div className="rounded-md border-t border-gray-100 dark:border-gray-800">
                        <CourseList
                            courses={filteredCourses}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* Pagination info */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span>Rows per page: 10</span>
                        <span>
                            {filteredCourses.length > 0
                                ? `1-${filteredCourses.length} of ${filteredCourses.length}`
                                : '0-0 of 0'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Dialogs */}
            <AddCourseDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleCreate}
                saving={saving}
            />

            <EditCourseDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleUpdate}
                saving={saving}
            />

            <DeleteCourseDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                course={selectedCourse}
                onConfirm={handleConfirmDelete}
                saving={saving}
            />
        </div>
    )
}
