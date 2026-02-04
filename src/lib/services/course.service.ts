// ============================================
// COURSE SERVICE
// Centralized API calls for course operations
// ============================================

import type { Course, CourseFormData, ApiResponse } from '@/lib/types'

const BASE_URL = '/api/courses'

export const courseService = {
    /**
     * Get all courses for the current organization
     */
    async getAll(): Promise<ApiResponse<Course[]>> {
        try {
            const res = await fetch(BASE_URL)
            const data = await res.json()
            return {
                success: data.success,
                data: data.courses || [],
                error: data.error
            }
        } catch (error) {
            console.error('courseService.getAll error:', error)
            return { success: false, error: 'Failed to fetch courses' }
        }
    },

    /**
     * Get a single course by ID
     */
    async getById(id: string): Promise<ApiResponse<Course>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`)
            const data = await res.json()
            return {
                success: data.success,
                data: data.course,
                error: data.error
            }
        } catch (error) {
            console.error('courseService.getById error:', error)
            return { success: false, error: 'Failed to fetch course' }
        }
    },

    /**
     * Create a new course
     */
    async create(formData: CourseFormData): Promise<ApiResponse<Course>> {
        try {
            const res = await fetch(BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.course,
                error: data.error
            }
        } catch (error) {
            console.error('courseService.create error:', error)
            return { success: false, error: 'Failed to create course' }
        }
    },

    /**
     * Update an existing course
     */
    async update(id: string, formData: Partial<CourseFormData>): Promise<ApiResponse<Course>> {
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            return {
                success: data.success,
                data: data.course,
                error: data.error
            }
        } catch (error) {
            console.error('courseService.update error:', error)
            return { success: false, error: 'Failed to update course' }
        }
    },

    /**
     * Delete a course
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
            console.error('courseService.delete error:', error)
            return { success: false, error: 'Failed to delete course' }
        }
    }
}
