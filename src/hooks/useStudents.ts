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

        let studentTotalPaid = 0
        let studentTotalOverdue = 0

        // Parse Installment Plan
        let installments: any[] = []
        try {
            if (student.installmentPlan) {
                installments = typeof student.installmentPlan === 'string'
                    ? JSON.parse(student.installmentPlan)
                    : student.installmentPlan
            }
        } catch (e) {
            console.error('Error parsing installment plan for student:', student.id, e)
        }

        // Process Installments
        if (installments.length > 0) {
            installments.forEach(inst => {
                const amount = Number(inst.amount || 0)
                const paidAmount = Number(inst.paidAmount || 0)
                const pending = amount - paidAmount
                const isPaid = inst.status === 'paid'

                // Received Payment
                if (paidAmount > 0) {
                    acc.received += paidAmount
                    studentTotalPaid += paidAmount

                    const mode = inst.mode?.toLowerCase() || ''
                    if (mode === 'cash') acc.cash += paidAmount
                    else if (mode === 'online' || mode === 'upi' || mode === 'bank_transfer') acc.online += paidAmount
                    else acc.unknown += paidAmount
                }

                // Overdue & Upcoming
                if (pending > 0 && inst.dueDate) {
                    const dueDate = new Date(inst.dueDate)
                    const today = new Date()
                    // Reset time for accurate date comparison
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
        }

        // Process Full Payment (if exists and no installments used, or strictly speaking, full payment overrides)
        // Usually system uses ONE or the OTHER. But let's check 'fullPayment' field too if logic stores it there
        if (student.paymentStatus === 'paid' && (!installments.length)) {
            // If manual full payment tracking is separate (depending on how backend saves it)
            // Based on schema, 'fullPayment' is a JSON string.
            let fullPayData: any = null
            try {
                if (student.fullPayment) {
                    fullPayData = typeof student.fullPayment === 'string' ? JSON.parse(student.fullPayment) : student.fullPayment
                }
            } catch (e) { }

            if (fullPayData) {
                // Check if actually paid
                // Usually if status='paid', trust totalAmount or netPayableFee?
                // Let's trust netPayableFee for total received if paid.
                // Ideally we should sum distinct transaction amounts.
                // Fallback: If totalAmount is there and status is paid.

                // However, the safest bet is checking if we double counted with installments.
                // If installments exist, we used them. If not:
                const paidAmt = Number(student.netPayableFee || student.totalAmount || 0)
                if (paidAmt > 0) {
                    acc.received += paidAmt
                    studentTotalPaid += paidAmt

                    const mode = fullPayData.paymentMode?.toLowerCase() || ''
                    if (mode === 'cash') acc.cash += paidAmt
                    else if (mode === 'online' || mode === 'upi' || mode === 'bank_transfer') acc.online += paidAmt
                    else acc.unknown += paidAmt
                }
            }
        }

        // Defaulters (Anyone with overdue > 0)
        if (studentTotalOverdue > 1) { // Tolerance of 1 for float errors
            acc.defaulters++
        }

        // Refunded (Placeholder logic based on status)
        if (student.status === 'dropped') { // Assuming dropped might be refunded? Or create explicit status later.
            // For now, no explicit refunded amount field in schema.
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
        stats
    }
}
