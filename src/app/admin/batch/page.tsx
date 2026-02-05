// ============================================
// BATCH LIST PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import Link from 'next/link'

// Modular components
import { BatchList, BatchFilters } from '@/components/admin/batches'

// Custom hooks
import { useBatches, useCourses } from '@/hooks'

export default function BatchListPage() {
    // Custom hooks
    const {
        filteredBatches,
        loading,
        deleteBatch,
        fetchBatches
    } = useBatches()

    const { courses } = useCourses()

    // Handlers
    const handleEdit = (batch: any) => {
        // Navigate to edit page
        console.log('Edit batch', batch.id)
    }

    const handleDelete = (batch: any) => {
        // Show confirmation
        console.log('Delete batch', batch.id)
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
        </div>
    )
}
