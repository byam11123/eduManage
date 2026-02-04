// ============================================
// USE COURSES HOOK
// Custom hook for course data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Course, CourseFormData } from '@/lib/types'
import { courseService } from '@/lib/services'
import { useFilterStore } from '@/lib/stores'

interface UseCoursesReturn {
    // Data
    courses: Course[]
    filteredCourses: Course[]
    selectedCourse: Course | null

    // Loading States
    loading: boolean
    saving: boolean

    // Actions
    fetchCourses: () => Promise<void>
    fetchCourseById: (id: string) => Promise<Course | null>
    createCourse: (data: CourseFormData) => Promise<boolean>
    updateCourse: (id: string, data: Partial<CourseFormData>) => Promise<boolean>
    deleteCourse: (id: string) => Promise<boolean>
    selectCourse: (course: Course | null) => void

    // Helpers
    getCourseById: (id: string) => Course | undefined
}

export function useCourses(): UseCoursesReturn {
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const { courseSearch, courseStatus } = useFilterStore()

    // Fetch all courses
    const fetchCourses = useCallback(async () => {
        setLoading(true)
        try {
            const response = await courseService.getAll()
            if (response.success && response.data) {
                setCourses(response.data)
            }
        } catch (error) {
            console.error('useCourses.fetchCourses error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch single course by ID
    const fetchCourseById = useCallback(async (id: string): Promise<Course | null> => {
        try {
            const response = await courseService.getById(id)
            if (response.success && response.data) {
                return response.data
            }
            return null
        } catch (error) {
            console.error('useCourses.fetchCourseById error:', error)
            return null
        }
    }, [])

    // Create course
    const createCourse = useCallback(async (data: CourseFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await courseService.create(data)
            if (response.success) {
                await fetchCourses() // Refresh list
                return true
            }
            return false
        } catch (error) {
            console.error('useCourses.createCourse error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchCourses])

    // Update course
    const updateCourse = useCallback(async (id: string, data: Partial<CourseFormData>): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await courseService.update(id, data)
            if (response.success) {
                await fetchCourses() // Refresh list
                return true
            }
            return false
        } catch (error) {
            console.error('useCourses.updateCourse error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchCourses])

    // Delete course
    const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await courseService.delete(id)
            if (response.success) {
                await fetchCourses() // Refresh list
                return true
            }
            return false
        } catch (error) {
            console.error('useCourses.deleteCourse error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchCourses])

    // Select a course
    const selectCourse = useCallback((course: Course | null) => {
        setSelectedCourse(course)
    }, [])

    // Get course by ID from local state
    const getCourseById = useCallback((id: string): Course | undefined => {
        return courses.find(c => c.id === id)
    }, [courses])

    // Filtered courses based on search and status
    const filteredCourses = courses.filter(course => {
        const matchesSearch = courseSearch
            ? course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
            (course.description?.toLowerCase().includes(courseSearch.toLowerCase()) ?? false)
            : true

        const matchesStatus = courseStatus === 'all' || course.status === courseStatus

        return matchesSearch && matchesStatus
    })

    // Initial fetch
    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return {
        courses,
        filteredCourses,
        selectedCourse,
        loading,
        saving,
        fetchCourses,
        fetchCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        selectCourse,
        getCourseById
    }
}
