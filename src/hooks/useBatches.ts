// ============================================
// USE BATCHES HOOK
// Custom hook for batch data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Batch, BatchFormData } from '@/lib/types'
import { batchService } from '@/lib/services'
import { useFilterStore } from '@/lib/stores'

interface UseBatchesReturn {
    // Data
    batches: Batch[]
    filteredBatches: Batch[]
    selectedBatch: Batch | null

    // Loading States
    loading: boolean
    saving: boolean

    // Actions
    fetchBatches: () => Promise<void>
    fetchBatchById: (id: string) => Promise<{ batch: Batch; stats: Record<string, number> } | null>
    createBatch: (data: BatchFormData) => Promise<boolean>
    updateBatch: (id: string, data: Partial<BatchFormData>) => Promise<boolean>
    deleteBatch: (id: string) => Promise<boolean>
    selectBatch: (batch: Batch | null) => void

    // Helpers
    getBatchesByCourse: (courseId: string) => Batch[]
}

export function useBatches(): UseBatchesReturn {
    const [batches, setBatches] = useState<Batch[]>([])
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const { batchSearch, batchStatus, batchCourseId } = useFilterStore()

    // Fetch all batches
    const fetchBatches = useCallback(async () => {
        setLoading(true)
        try {
            const response = await batchService.getAll()
            if (response.success && response.data) {
                setBatches(response.data)
            }
        } catch (error) {
            console.error('useBatches.fetchBatches error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch single batch by ID with stats
    const fetchBatchById = useCallback(async (id: string): Promise<{ batch: Batch; stats: Record<string, number> } | null> => {
        try {
            const response = await batchService.getById(id)
            if (response.success && response.data) {
                return response.data
            }
            return null
        } catch (error) {
            console.error('useBatches.fetchBatchById error:', error)
            return null
        }
    }, [])

    // Create batch
    const createBatch = useCallback(async (data: BatchFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await batchService.create(data)
            if (response.success) {
                await fetchBatches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBatches.createBatch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBatches])

    // Update batch
    const updateBatch = useCallback(async (id: string, data: Partial<BatchFormData>): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await batchService.update(id, data)
            if (response.success) {
                await fetchBatches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBatches.updateBatch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBatches])

    // Delete batch
    const deleteBatch = useCallback(async (id: string): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await batchService.delete(id)
            if (response.success) {
                await fetchBatches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBatches.deleteBatch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBatches])

    // Select a batch
    const selectBatch = useCallback((batch: Batch | null) => {
        setSelectedBatch(batch)
    }, [])

    // Get batches by course ID
    const getBatchesByCourse = useCallback((courseId: string): Batch[] => {
        return batches.filter(b => b.courseId === courseId)
    }, [batches])

    // Filtered batches based on search and filters
    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batchSearch
            ? batch.name.toLowerCase().includes(batchSearch.toLowerCase())
            : true

        const matchesStatus = batchStatus === 'all' || batch.status === batchStatus
        const matchesCourse = !batchCourseId || batch.courseId === batchCourseId

        return matchesSearch && matchesStatus && matchesCourse
    })

    // Initial fetch
    useEffect(() => {
        fetchBatches()
    }, [fetchBatches])

    return {
        batches,
        filteredBatches,
        selectedBatch,
        loading,
        saving,
        fetchBatches,
        fetchBatchById,
        createBatch,
        updateBatch,
        deleteBatch,
        selectBatch,
        getBatchesByCourse
    }
}
