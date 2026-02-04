// ============================================
// BATCH SERVICE
// Centralized API calls for batch operations
// ============================================

import type { Batch, BatchFormData, ApiResponse } from '@/lib/types'

const BASE_URL = '/api/batches'

export const batchService = {
    /**
     * Get all batches
     */
    async getAll(): Promise<ApiResponse<Batch[]>> {
        try {
            const res = await fetch(BASE_URL)
            const data = await res.json()
            return {
                success: data.success,
                data: data.batches || [],
                error: data.error
            }
        } catch (error) {
            console.error('batchService.getAll error:', error)
            return { success: false, error: 'Failed to fetch batches' }
        }
    },

    /**
     * Get a single batch by ID with students and stats
     */
    async getById(id: string): Promise<ApiResponse<{ batch: Batch; stats: Record<string, number> }>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`)
            const data = await res.json()
            return {
                success: data.success,
                data: { batch: data.batch, stats: data.stats },
                error: data.error
            }
        } catch (error) {
            console.error('batchService.getById error:', error)
            return { success: false, error: 'Failed to fetch batch' }
        }
    },

    /**
     * Create a new batch
     */
    async create(formData: BatchFormData): Promise<ApiResponse<Batch>> {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.batch,
                error: data.error
            }
        } catch (error) {
            console.error('batchService.create error:', error)
            return { success: false, error: 'Failed to create batch' }
        }
    },

    /**
     * Update an existing batch
     */
    async update(id: string, formData: Partial<BatchFormData>): Promise<ApiResponse<Batch>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.batch,
                error: data.error
            }
        } catch (error) {
            console.error('batchService.update error:', error)
            return { success: false, error: 'Failed to update batch' }
        }
    },

    /**
     * Delete a batch
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            return {
                success: data.success,
                error: data.error,
                message: data.message
            }
        } catch (error) {
            console.error('batchService.delete error:', error)
            return { success: false, error: 'Failed to delete batch' }
        }
    }
}
