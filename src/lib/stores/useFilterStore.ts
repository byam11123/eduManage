// ============================================
// FILTER STORE
// Zustand store for filter/search state management
// ============================================

import { create } from 'zustand'

interface FilterStore {
    // Search State
    globalSearch: string

    // Course Filters
    courseSearch: string
    courseStatus: string

    // Student Filters
    studentSearch: string
    studentStatus: string
    studentBranchId: string
    studentCourseId: string
    studentBatchId: string

    // Batch Filters
    batchSearch: string
    batchStatus: string
    batchCourseId: string

    // Pagination
    page: number
    pageSize: number

    // Actions
    setGlobalSearch: (search: string) => void

    setCourseSearch: (search: string) => void
    setCourseStatus: (status: string) => void
    resetCourseFilters: () => void

    setStudentSearch: (search: string) => void
    setStudentStatus: (status: string) => void
    setStudentBranchId: (branchId: string) => void
    setStudentCourseId: (courseId: string) => void
    setStudentBatchId: (batchId: string) => void
    resetStudentFilters: () => void

    setBatchSearch: (search: string) => void
    setBatchStatus: (status: string) => void
    setBatchCourseId: (courseId: string) => void
    resetBatchFilters: () => void

    setPage: (page: number) => void
    setPageSize: (size: number) => void

    resetAllFilters: () => void
}

const initialState = {
    globalSearch: '',
    courseSearch: '',
    courseStatus: 'all',
    studentSearch: '',
    studentStatus: 'all',
    studentBranchId: '',
    studentCourseId: '',
    studentBatchId: '',
    batchSearch: '',
    batchStatus: 'all',
    batchCourseId: '',
    page: 1,
    pageSize: 10
}

export const useFilterStore = create<FilterStore>()((set) => ({
    // Initial State
    ...initialState,

    // Global Search
    setGlobalSearch: (globalSearch) => set({ globalSearch }),

    // Course Filter Actions
    setCourseSearch: (courseSearch) => set({ courseSearch }),
    setCourseStatus: (courseStatus) => set({ courseStatus }),
    resetCourseFilters: () => set({
        courseSearch: '',
        courseStatus: 'all'
    }),

    // Student Filter Actions
    setStudentSearch: (studentSearch) => set({ studentSearch }),
    setStudentStatus: (studentStatus) => set({ studentStatus }),
    setStudentBranchId: (studentBranchId) => set({ studentBranchId }),
    setStudentCourseId: (studentCourseId) => set({ studentCourseId }),
    setStudentBatchId: (studentBatchId) => set({ studentBatchId }),
    resetStudentFilters: () => set({
        studentSearch: '',
        studentStatus: 'all',
        studentBranchId: '',
        studentCourseId: '',
        studentBatchId: ''
    }),

    // Batch Filter Actions
    setBatchSearch: (batchSearch) => set({ batchSearch }),
    setBatchStatus: (batchStatus) => set({ batchStatus }),
    setBatchCourseId: (batchCourseId) => set({ batchCourseId }),
    resetBatchFilters: () => set({
        batchSearch: '',
        batchStatus: 'all',
        batchCourseId: ''
    }),

    // Pagination Actions
    setPage: (page) => set({ page }),
    setPageSize: (pageSize) => set({ pageSize, page: 1 }),

    // Reset All
    resetAllFilters: () => set(initialState)
}))
