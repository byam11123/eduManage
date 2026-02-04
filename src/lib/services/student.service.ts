// ============================================
// STUDENT SERVICE
// Centralized API calls for student operations
// ============================================

import type { Student, StudentFormData, ApiResponse } from '@/lib/types'

const BASE_URL = '/api/students'

export const studentService = {
    /**
     * Get all students with optional filters
     */
    async getAll(params?: { branchId?: string; courseId?: string; batchId?: string; status?: string }): Promise<ApiResponse<Student[]>> {
        try {
            const searchParams = new URLSearchParams()
            if (params?.branchId) searchParams.set('branchId', params.branchId)
            if (params?.courseId) searchParams.set('courseId', params.courseId)
            if (params?.batchId) searchParams.set('batchId', params.batchId)
            if (params?.status) searchParams.set('status', params.status)

            const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL
            const res = await fetch(url)
            const data = await res.json()
            return {
                success: data.success,
                data: data.students || [],
                error: data.error
            }
        } catch (error) {
            console.error('studentService.getAll error:', error)
            return { success: false, error: 'Failed to fetch students' }
        }
    },

    /**
     * Get a single student by ID
     */
    async getById(id: string): Promise<ApiResponse<Student>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`)
            const data = await res.json()
            return {
                success: data.success,
                data: data.student,
                error: data.error
            }
        } catch (error) {
            console.error('studentService.getById error:', error)
            return { success: false, error: 'Failed to fetch student' }
        }
    },

    /**
     * Create a new student
     */
    async create(formData: StudentFormData): Promise<ApiResponse<Student>> {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.student,
                error: data.error
            }
        } catch (error) {
            console.error('studentService.create error:', error)
            return { success: false, error: 'Failed to create student' }
        }
    },

    /**
     * Update an existing student
     */
    async update(id: string, formData: Partial<StudentFormData>): Promise<ApiResponse<Student>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.student,
                error: data.error
            }
        } catch (error) {
            console.error('studentService.update error:', error)
            return { success: false, error: 'Failed to update student' }
        }
    },

    /**
     * Delete a student
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
            console.error('studentService.delete error:', error)
            return { success: false, error: 'Failed to delete student' }
        }
    }
}
