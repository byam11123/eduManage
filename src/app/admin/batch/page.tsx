'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Link from 'next/link'

// Modular components
import {
    BatchList,
    BatchFilters,
    EditBatchDialog,
    DeleteBatchDialog
} from '@/components/admin/batches'

// Custom hooks
import { useBatches, useCourses } from '@/hooks'
import type { Batch, BatchFormData } from '@/lib/types'

export default function BatchListPage() {
    // Custom hooks
    const {
        filteredBatches,
        loading,
        saving,
        updateBatch,
        deleteBatch,
        fetchBatches
    } = useBatches()

    const { courses } = useCourses()

    // Dialog states
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
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

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-indigo-600 font-medium">Batch</span>
                    <span className="text-gray-400">›</span>
                    <span>Batch list</span>
                </div>
                <Link href="/admin/batch/add">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm w-full md:w-auto">
                        ADD BATCH <Users className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <BatchFilters
                            onRefresh={fetchBatches}
                            loading={loading}
                            courses={courses}
                        />
                    </div>

                    {/* Batch List */}
                    <div className="rounded-md border-t border-gray-100 dark:border-gray-800">
                        <BatchList
                            batches={filteredBatches}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* Pagination info */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span>Rows per page: 10</span>
                        <span>
                            {filteredBatches.length > 0
                                ? `1-${Math.min(10, filteredBatches.length)} of ${filteredBatches.length}`
                                : '0-0 of 0'}
                        </span>
                    </div>
                </CardContent>
            </Card>

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
