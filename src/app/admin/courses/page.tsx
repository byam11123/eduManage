// ============================================
// COURSES PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

// Modular components
import {
    CourseList,
    CourseFilters,
    AddCourseDialog,
    EditCourseDialog,
    DeleteCourseDialog
} from '@/components/admin/courses'

// Shared components
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'

// Custom hooks
import { useCourses } from '@/hooks'
import { formatCurrency } from '@/lib/utils'

// Types
import type { Course, CourseFormData } from '@/lib/types'
import { BookOpen, CheckCircle, XCircle, IndianRupee } from 'lucide-react'
import { ExportButton } from '@/components/shared/ExportButton'

// Default form data
const defaultFormData: CourseFormData = {
    // Basic Info
    name: '',
    code: '',
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
        deleteCourse,
        stats
    } = useCourses()

    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isBulkExporting, setIsBulkExporting] = useState(false)

    const handleBulkDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} course(s)? This cannot be undone.`)) return
        setIsBulkDeleting(true)
        for (const id of ids) {
            await deleteCourse(id)
        }
        setIsBulkDeleting(false)
        toast.success(`${ids.length} course(s) deleted`)
    }

    const handleBulkExport = (ids: string[]) => {
        setIsBulkExporting(true)
        const selected = filteredCourses.filter(c => ids.includes(c.id))
        const data = selected.map(c => ({
            name: c.name,
            code: c.code || 'N/A',
            fee: `₹${c.fee.toLocaleString()}`,
            duration: `${c.durationYears}y ${c.durationMonths}m`,
            type: (c as any).courseType || 'N/A',
            mode: (c as any).mode?.toUpperCase() || 'OFFLINE',
            status: c.status.toUpperCase()
        }))
        const headers = ['Program Name', 'Code', 'Fee', 'Duration', 'Type', 'Mode', 'Status']
        const keys = ['name', 'code', 'fee', 'duration', 'type', 'mode', 'status']
        const csv = [headers.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'EduManage_Courses_Export.csv'
        a.click()
        URL.revokeObjectURL(url)
        setIsBulkExporting(false)
        toast.success(`${ids.length} course(s) exported`)
    }

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
            code: course.code || '',
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

    const courseStats = [
        { title: 'Total Courses', value: stats.total, icon: BookOpen, color: 'indigo' as const, trend: 'All Programs' },
        { title: 'Active', value: stats.active, icon: CheckCircle, color: 'emerald' as const, trend: 'Live' },
        { title: 'Inactive', value: stats.inactive, icon: XCircle, color: 'rose' as const, trend: 'Paused' },
        { title: 'Avg. Course Fee', value: formatCurrency(stats.avgFee), icon: IndianRupee, color: 'amber' as const, trend: 'Pricing Base' },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Course Management"
                description="Design, price, and organize your educational programs and curricula."
                actions={[
                    { label: 'Add New Course', icon: Plus, variant: 'default', onClick: handleAddOpen }
                ]}
            >
                <ExportButton 
                    data={filteredCourses.map(c => ({
                        name: c.name,
                        code: c.code || 'N/A',
                        fee: `₹${c.fee.toLocaleString()}`,
                        duration: `${c.durationYears}y ${c.durationMonths}m`,
                        type: (c as any).courseType || 'N/A',
                        mode: (c as any).mode?.toUpperCase() || 'OFFLINE',
                        status: c.status.toUpperCase()
                    }))}
                    columns={[
                        { header: 'Program Name', dataKey: 'name' },
                        { header: 'Code', dataKey: 'code' },
                        { header: 'Fee', dataKey: 'fee' },
                        { header: 'Duration', dataKey: 'duration' },
                        { header: 'Type', dataKey: 'type' },
                        { header: 'Mode', dataKey: 'mode' },
                        { header: 'Status', dataKey: 'status' },
                    ]}
                    fileName="EduManage_Course_Catalog"
                    title="Academic Program Master Catalog"
                    variant="outline"
                />
            </PageHeader>

            <StatsGrid stats={courseStats} columns={4} />

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="w-full lg:flex-1">
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                        <CardContent className="p-4">
                            <CourseFilters
                                onRefresh={fetchCourses}
                                loading={loading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main List Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <CourseList
                        courses={filteredCourses}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onBulkDelete={handleBulkDelete}
                        onBulkExport={handleBulkExport}
                        isBulkDeleting={isBulkDeleting}
                        isBulkExporting={isBulkExporting}
                    />

                    {/* Pagination info */}
                    <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing {filteredCourses.length} Courses
                        </p>
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
