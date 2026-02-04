// ============================================
// USE STUDENTS HOOK
// Custom hook for student data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Student, StudentFormData } from '@/lib/types'
import { studentService } from '@/lib/services'
import { useFilterStore } from '@/lib/stores'

interface UseStudentsReturn {
    // Data
    students: Student[]
    filteredStudents: Student[]
    selectedStudent: Student | null

    // Loading States
    loading: boolean
    saving: boolean

    // Actions
    fetchStudents: (params?: { branchId?: string; courseId?: string; batchId?: string }) => Promise<void>
    fetchStudentById: (id: string) => Promise<Student | null>
    createStudent: (data: StudentFormData) => Promise<boolean>
    updateStudent: (id: string, data: Partial<StudentFormData>) => Promise<boolean>
    deleteStudent: (id: string) => Promise<boolean>
    selectStudent: (student: Student | null) => void

    // Stats
    stats: {
        total: number
        active: number
        inactive: number
        graduated: number
        dropped: number
    }
}

export function useStudents(): UseStudentsReturn {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const {
        studentSearch,
        studentStatus,
        studentBranchId,
        studentCourseId,
        studentBatchId
    } = useFilterStore()

    // Fetch students with optional filters
    const fetchStudents = useCallback(async (params?: {
        branchId?: string;
        courseId?: string;
        batchId?: string
    }) => {
        setLoading(true)
        try {
            const response = await studentService.getAll(params)
            if (response.success && response.data) {
                setStudents(response.data)
            }
        } catch (error) {
            console.error('useStudents.fetchStudents error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch single student by ID
    const fetchStudentById = useCallback(async (id: string): Promise<Student | null> => {
        try {
            const response = await studentService.getById(id)
            if (response.success && response.data) {
                return response.data
            }
            return null
        } catch (error) {
            console.error('useStudents.fetchStudentById error:', error)
            return null
        }
    }, [])

    // Create student
    const createStudent = useCallback(async (data: StudentFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await studentService.create(data)
            if (response.success) {
                await fetchStudents()
                return true
            }
            return false
        } catch (error) {
            console.error('useStudents.createStudent error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchStudents])

    // Update student
    const updateStudent = useCallback(async (id: string, data: Partial<StudentFormData>): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await studentService.update(id, data)
            if (response.success) {
                await fetchStudents()
                return true
            }
            return false
        } catch (error) {
            console.error('useStudents.updateStudent error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchStudents])

    // Delete student
    const deleteStudent = useCallback(async (id: string): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await studentService.delete(id)
            if (response.success) {
                await fetchStudents()
                return true
            }
            return false
        } catch (error) {
            console.error('useStudents.deleteStudent error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchStudents])

    // Select a student
    const selectStudent = useCallback((student: Student | null) => {
        setSelectedStudent(student)
    }, [])

    // Filter students based on search and filters
    const filteredStudents = students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
        const matchesSearch = studentSearch
            ? fullName.includes(studentSearch.toLowerCase()) ||
            student.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.phone?.includes(studentSearch)
            : true

        const matchesStatus = studentStatus === 'all' || student.status === studentStatus
        const matchesBranch = !studentBranchId || student.branchId === studentBranchId
        const matchesCourse = !studentCourseId || student.courseId === studentCourseId
        const matchesBatch = !studentBatchId || student.batchId === studentBatchId

        return matchesSearch && matchesStatus && matchesBranch && matchesCourse && matchesBatch
    })

    // Calculate stats
    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'active').length,
        inactive: students.filter(s => s.status === 'inactive').length,
        graduated: students.filter(s => s.status === 'graduated').length,
        dropped: students.filter(s => s.status === 'dropped').length
    }

    // Initial fetch
    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    return {
        students,
        filteredStudents,
        selectedStudent,
        loading,
        saving,
        fetchStudents,
        fetchStudentById,
        createStudent,
        updateStudent,
        deleteStudent,
        selectStudent,
        stats
    }
}
