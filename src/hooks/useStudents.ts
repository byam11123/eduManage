// ============================================
// USE STUDENTS HOOK
// Custom hook for student data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Student, StudentFormData } from '@/lib/types'
import { studentService } from '@/lib/services'
import { useFilterStore } from '@/lib/stores'
import { calculateStudentFinancials } from '@/lib/utils'

interface UseStudentsReturn {
    // Data
    students: Student[]
    filteredStudents: Student[]
    selectedStudent: Student | null

    // Loading States
    loading: boolean
    saving: boolean

    // Actions
    fetchStudents: (params?: { branchId?: string; courseId?: string; batchId?: string; cursor?: string }) => Promise<void>
    fetchStudentById: (id: string) => Promise<Student | null>
    createStudent: (data: StudentFormData) => Promise<boolean>
    updateStudent: (id: string, data: Partial<StudentFormData>) => Promise<boolean>
    deleteStudent: (id: string) => Promise<boolean>
    selectStudent: (student: Student | null) => void

    // Pagination
    currentPage: number
    hasMore: boolean
    totalCount: number
    goToNextPage: () => void
    goToPrevPage: () => void

    // Stats
    stats: {
        total: number
        received: number
        cash: number
        online: number
        unknown: number
        overdue: number
        upcoming: number
        refundedCount: number
        refundedAmount: number
        defaulters: number
    }
    bulkCreate: (data: { students: any[]; branchId: string; courseId: string; batchId?: string }) => Promise<boolean>
}

export function useStudents(): UseStudentsReturn {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Pagination state
    const PAGE_SIZE = 25
    const [currentPage, setCurrentPage]   = useState(1)
    const [hasMore, setHasMore]           = useState(false)
    const [nextCursor, setNextCursor]     = useState<string | null>(null)
    const [totalCount, setTotalCount]     = useState(0)
    // cursor stack for back-navigation: index 0 = page 1 cursor (null = start)
    const [cursorStack, setCursorStack]   = useState<(string | null)[]>([null])

    const {
        studentSearch,
        studentStatus,
        studentBranchId,
        studentCourseId,
        studentBatchId
    } = useFilterStore()

    // Internal fetch — accepts explicit cursor to support next/prev
    const fetchStudents = useCallback(async (params?: {
        branchId?: string
        courseId?: string
        batchId?: string
        cursor?: string
    }) => {
        setLoading(true)
        try {
            const response = await studentService.getAll({
                ...params,
                limit: PAGE_SIZE
            })
            if (response.success && response.data) {
                setStudents(response.data)
            }
            if (response.meta) {
                setHasMore(response.meta.hasMore)
                setNextCursor(response.meta.nextCursor)
                setTotalCount(response.meta.total)
            }
        } catch (error) {
            console.error('useStudents.fetchStudents error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Go to next page
    const goToNextPage = useCallback(() => {
        if (!hasMore || !nextCursor) return
        setCursorStack(prev => [...prev, nextCursor])
        setCurrentPage(prev => prev + 1)
        fetchStudents({ cursor: nextCursor })
    }, [hasMore, nextCursor, fetchStudents])

    // Go to previous page
    const goToPrevPage = useCallback(() => {
        if (currentPage <= 1) return
        const newStack = cursorStack.slice(0, -1)
        setCursorStack(newStack)
        const prevCursor = newStack[newStack.length - 2] ?? null // cursor before current page
        setCurrentPage(prev => prev - 1)
        fetchStudents({ cursor: prevCursor || undefined })
    }, [currentPage, cursorStack, fetchStudents])

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

        const matchesStatus = studentStatus === 'all'
            ? student.status !== 'draft'
            : student.status === studentStatus
        const matchesBranch = !studentBranchId || student.branchId === studentBranchId
        const matchesCourse = !studentCourseId || student.courseId === studentCourseId
        const matchesBatch = !studentBatchId || student.batchId === studentBatchId

        return matchesSearch && matchesStatus && matchesBranch && matchesCourse && matchesBatch
    })

    // Calculate stats
    const stats = students.reduce((acc, student) => {
        // 1. Total Students
        acc.total++

        let studentTotalOverdue = 0

        // Use new relational multi-course helper
        const studentCourses = student.studentCourses || []
        
        studentCourses.forEach(course => {
            const installments = course.installments || []
            
            installments.forEach(inst => {
                const amount = Number(inst.amount || 0)
                const paidAmount = Number(inst.paidAmount || 0)
                const pending = amount - paidAmount

                // Received Payment Breakdown
                if (paidAmount > 0) {
                    const mode = inst.mode?.toLowerCase() || ''
                    if (mode === 'cash') acc.cash += paidAmount
                    else if (mode === 'online' || mode === 'upi' || mode === 'bank_transfer') acc.online += paidAmount
                    else acc.unknown += paidAmount
                }

                // Overdue & Upcoming (Strict Date Check)
                if (pending > 0 && inst.dueDate) {
                    const dueDate = new Date(inst.dueDate)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    dueDate.setHours(0, 0, 0, 0)

                    if (dueDate < today) {
                        acc.overdue += pending
                        studentTotalOverdue += pending
                    } else {
                        acc.upcoming += pending
                    }
                }
            })
            
            // Add total paid from this course
            acc.received += installments.reduce((sum: number, inst: any) => sum + (Number(inst.paidAmount) || 0), 0)
        })

        // Process Full Payment (Legacy/Fallback)
        // If no relational installments exist, fallback to legacy
        if (studentCourses.length === 0 && student.paymentStatus === 'paid') {
            try {
                const fullPayData = student.fullPayment ? (typeof student.fullPayment === 'string' ? JSON.parse(student.fullPayment) : student.fullPayment) : null

                if (fullPayData) {
                    const paidAmt = Number(student.netPayableFee || student.totalAmount || 0)
                    if (paidAmt > 0) {
                        acc.received += paidAmt

                        const mode = fullPayData.paymentMode?.toLowerCase() || ''
                        if (mode === 'cash') acc.cash += paidAmt
                        else if (mode === 'online' || mode === 'upi' || mode === 'bank_transfer') acc.online += paidAmt
                        else acc.unknown += paidAmt
                    }
                }
            } catch (e) { }
        }

        // Defaulters (Anyone with strictly overdue > 0)
        if (studentTotalOverdue > 1) {
            acc.defaulters++
        }

        // Refunded (Placeholder)
        if (student.status === 'dropped') {
            acc.refundedCount++
        }

        return acc
    }, {
        total: 0,
        received: 0,
        cash: 0,
        online: 0,
        unknown: 0,
        overdue: 0,
        upcoming: 0,
        refundedCount: 0,
        refundedAmount: 0,
        defaulters: 0
    })

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
        // Pagination
        currentPage,
        hasMore,
        totalCount,
        goToNextPage,
        goToPrevPage,
        bulkCreate: async (data: { students: any[]; branchId: string; courseId: string; batchId?: string }) => {
            setSaving(true)
            try {
                const response = await studentService.bulkCreate(data)
                if (response.success) {
                    // Reset pagination on bulk import
                    setCurrentPage(1)
                    setCursorStack([null])
                    await fetchStudents()
                    return true
                }
                return false
            } catch (err) {
                console.error('useStudents.bulkCreate error:', err)
                return false
            } finally {
                setSaving(false)
            }
        },
        stats
    }
}
