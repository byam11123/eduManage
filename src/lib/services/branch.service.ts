// ============================================
// BRANCH SERVICE
// Centralized API calls for branch operations
// ============================================

import type { Branch, ApiResponse } from '@/lib/types'

const BASE_URL = '/api/branches'

export interface BranchFormData {
    name: string
    description?: string
    address?: string
    city?: string
    state?: string
    country?: string
    phone?: string
    email?: string
}

export const branchService = {
    /**
     * Get all branches for the current organization
     */
    async getAll(): Promise<ApiResponse<Branch[]>> {
        try {
            const res = await fetch(BASE_URL)
            const data = await res.json()
            return {
                success: data.success,
                data: data.branches || [],
                error: data.error
            }
        } catch (error) {
            console.error('branchService.getAll error:', error)
            return { success: false, error: 'Failed to fetch branches' }
        }
    },

    /**
     * Get a single branch by ID
     */
    async getById(id: string): Promise<ApiResponse<Branch>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`)
            const data = await res.json()
            return {
                success: data.success,
                data: data.branch,
                error: data.error
            }
        } catch (error) {
            console.error('branchService.getById error:', error)
            return { success: false, error: 'Failed to fetch branch' }
        }
    },

    /**
     * Create a new branch
     */
    async create(formData: BranchFormData): Promise<ApiResponse<Branch>> {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.branch,
                error: data.error
            }
        } catch (error) {
            console.error('branchService.create error:', error)
            return { success: false, error: 'Failed to create branch' }
        }
    },

    /**
     * Update an existing branch
     */
    async update(id: string, formData: Partial<BranchFormData>): Promise<ApiResponse<Branch>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.branch,
                error: data.error
            }
        } catch (error) {
            console.error('branchService.update error:', error)
            return { success: false, error: 'Failed to update branch' }
        }
    },

    /**
     * Delete a branch
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
            console.error('branchService.delete error:', error)
            return { success: false, error: 'Failed to delete branch' }
        }
    }
}
