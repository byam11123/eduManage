'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Layers, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

// Modular components
import {
    BatchList,
    BatchFilters,
    EditBatchDialog,
    DeleteBatchDialog
} from '@/components/admin/batches'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'

// Custom hooks
import { useBatches, useCourses } from '@/hooks'
import type { Batch, BatchFormData } from '@/lib/types'
import { ExportButton } from '@/components/shared/ExportButton'
import { toast } from 'sonner'

export default function BatchListPage() {
    // Custom hooks
    const {
        filteredBatches,
        loading,
        saving,
        updateBatch,
        deleteBatch,
        fetchBatches,
        stats
    } = useBatches()

    const { courses } = useCourses()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isBulkExporting, setIsBulkExporting] = useState(false)
    const [editFormData, setEditFormData] = useState<BatchFormData>({
        name: '',
        description: '',
        courseId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        status: 'active'
    })

    // Handlers
    const handleEdit = (batch: Batch) => {
        setSelectedBatch(batch)
        setEditFormData({
            name: batch.name,
            description: batch.description || '',
            courseId: batch.courseId,
            startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
            endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
            startTime: batch.startTime || '',
            endTime: batch.endTime || '',
            status: batch.status
        })
        setIsEditOpen(true)
    }

    const handleDelete = (batch: Batch) => {
        setSelectedBatch(batch)
        setIsDeleteOpen(true)
    }

    const onEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBatch) return
        const success = await updateBatch(selectedBatch.id, editFormData)
        if (success) {
            setIsEditOpen(false)
            fetchBatches()
        }
    }

    const onDeleteConfirm = async () => {
        if (!selectedBatch) return
        const success = await deleteBatch(selectedBatch.id)
        if (success) {
            setIsDeleteOpen(false)
            fetchBatches()
        }
    }

    const handleBulkDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} batch(es)? This cannot be undone.`)) return
        setIsBulkDeleting(true)
        for (const id of ids) {
            await deleteBatch(id)
        }
        setIsBulkDeleting(false)
        toast.success(`${ids.length} batch(es) deleted`)
    }

    const handleBulkExport = (ids: string[]) => {
        setIsBulkExporting(true)
        const selected = filteredBatches.filter(b => ids.includes(b.id))
        const data = selected.map(b => ({
            name: b.name,
            course: b.course?.name || 'N/A',
            students: (b as any)._count?.students || 0,
            startDate: b.startDate ? new Date(b.startDate).toLocaleDateString() : 'N/A',
            status: b.status.toUpperCase(),
            schedule: `${b.startTime || ''} - ${b.endTime || ''}`
        }))
        const headers = ['Batch Name', 'Program', 'Enrolled', 'Start Date', 'Schedule', 'Status']
        const keys = ['name', 'course', 'students', 'startDate', 'schedule', 'status']
        const csv = [headers.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'EduManage_Batches_Export.csv'
        a.click()
        URL.revokeObjectURL(url)
        setIsBulkExporting(false)
        toast.success(`${ids.length} batch(es) exported`)
    }

    const batchStats = [
        { title: 'Total Batches', value: stats.total, icon: Layers, color: 'indigo' as const, trend: 'All Time' },
        { title: 'Active', value: stats.active, icon: CheckCircle, color: 'emerald' as const, trend: 'Ongoing' },
        { title: 'Total Capacity', value: stats.totalStudents, icon: Users, color: 'amber' as const, trend: 'Enrollments' },
        { title: 'Inactive', value: stats.inactive, icon: XCircle, color: 'rose' as const, trend: 'Completed' },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Batch Management"
                description="Coordinate academic cohorts, track enrollment timelines, and manage course schedules."
                actions={[
                    { label: 'Add New Batch', icon: Layers, variant: 'default', href: '/admin/batch/add' }
                ]}
            >
                <ExportButton 
                    data={filteredBatches.map(b => ({
                        name: b.name,
                        course: b.course?.name || 'N/A',
                        students: b.students?.length || 0,
                        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString() : 'N/A',
                        status: b.status.toUpperCase(),
                        schedule: `${b.startTime || ''} - ${b.endTime || ''}`
                    }))}
                    columns={[
                        { header: 'Batch Name', dataKey: 'name' },
                        { header: 'Program', dataKey: 'course' },
                        { header: 'Enrolled', dataKey: 'students' },
                        { header: 'Start Date', dataKey: 'startDate' },
                        { header: 'Schedule', dataKey: 'schedule' },
                        { header: 'Status', dataKey: 'status' },
                    ]}
                    fileName="EduManage_Batches_Registry"
                    title="Academic Cohort Master List"
                    variant="outline"
                />
            </PageHeader>

            <StatsGrid stats={batchStats} columns={4} />

            <div className="space-y-6">
                {/* Filters */}
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                    <CardContent className="p-4">
                        <BatchFilters
                            onRefresh={fetchBatches}
                            loading={loading}
                            courses={courses}
                        />
                    </CardContent>
                </Card>

                {/* Batch List */}
                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <BatchList
                            batches={filteredBatches}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onBulkDelete={handleBulkDelete}
                            onBulkExport={handleBulkExport}
                            isBulkDeleting={isBulkDeleting}
                            isBulkExporting={isBulkExporting}
                        />

                        {/* Pagination info */}
                        <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Showing {filteredBatches.length} records
                            </span>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Rows per page: 10</span>
                                <span>Page 1 of 1</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialogs */}
            <EditBatchDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={editFormData}
                onChange={setEditFormData}
                courses={courses}
                onSubmit={onEditSubmit}
                saving={saving}
            />

            <DeleteBatchDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                batch={selectedBatch}
                onConfirm={onDeleteConfirm}
                saving={saving}
            />
        </div>
    )
}
