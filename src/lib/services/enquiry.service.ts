// ============================================
// ENQUIRY SERVICE
// Centralized API calls for enquiry operations
// ============================================

import type { Enquiry, EnquiryFormData, ApiResponse } from '@/lib/types'

const BASE_URL = '/api/enquiries'

export const enquiryService = {
    /**
     * Get all enquiries
     */
    async getAll(): Promise<ApiResponse<Enquiry[]>> {
        try {
            const res = await fetch(BASE_URL)
            const data = await res.json()
            return {
                success: data.success,
                data: data.enquiries || [],
                error: data.error
            }
        } catch (error) {
            console.error('enquiryService.getAll error:', error)
            return { success: false, error: 'Failed to fetch enquiries' }
        }
    },

    /**
     * Get a single enquiry by ID
     */
    async getById(id: string): Promise<ApiResponse<Enquiry>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`)
            const data = await res.json()
            return {
                success: data.success,
                data: data.enquiry,
                error: data.error
            }
        } catch (error) {
            console.error('enquiryService.getById error:', error)
            return { success: false, error: 'Failed to fetch enquiry' }
        }
    },

    /**
     * Create a new enquiry
     */
    async create(formData: EnquiryFormData): Promise<ApiResponse<Enquiry>> {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.enquiry,
                error: data.error
            }
        } catch (error) {
            console.error('enquiryService.create error:', error)
            return { success: false, error: 'Failed to create enquiry' }
        }
    },

    /**
     * Update an existing enquiry
     */
    async update(id: string, formData: Partial<EnquiryFormData>): Promise<ApiResponse<Enquiry>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.enquiry,
                error: data.error
            }
        } catch (error) {
            console.error('enquiryService.update error:', error)
            return { success: false, error: 'Failed to update enquiry' }
        }
    },

    /**
     * Delete an enquiry
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
            console.error('enquiryService.delete error:', error)
            return { success: false, error: 'Failed to delete enquiry' }
        }
    }
}
