// ============================================
// CENTRALIZED TYPE DEFINITIONS
// All entity interfaces and API types
// ============================================

// ===========================================
// USER & AUTH TYPES
// ===========================================

export interface User {
    id: string
    fullName: string
    email: string
    role: string
    image?: string
    isVerified: boolean
    branches: string[]
    defaultBranchId?: string
    createdAt?: string
}

export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

// ===========================================
// ORGANIZATION & BRANCH TYPES
// ===========================================

export interface Organization {
    id: string
    name: string
    slug: string
    logo?: string
    email?: string
    phone?: string
    address?: string
    createdAt: string
}

export interface Branch {
    id: string
    name: string
    description?: string
    address?: string
    city?: string
    state?: string
    country?: string
    phone?: string
    email?: string
    isActive: boolean
    organizationId: string
    createdAt: string
}

// ===========================================
// COURSE & SUBJECT TYPES
// ===========================================

export interface Subject {
    id: string
    name: string
    description?: string
    courseId: string
}

export interface Course {
    id: string
    name: string
    description?: string
    fee: number
    feeDescription?: string
    durationYears: number
    durationMonths: number
    maxInstallments: number
    status: 'active' | 'inactive'
    organizationId: string
    subjects?: Subject[]
    students?: Student[]
    createdAt: string
    updatedAt: string
}

export interface CourseFormData {
    name: string
    description: string
    fee: string
    feeDescription: string
    durationYears: string
    durationMonths: string
    maxInstallments: string
    status?: string
}

// ===========================================
// STUDENT TYPES
// ===========================================

export interface Student {
    id: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
    enrollmentNo: string
    dateOfBirth?: string
    gender?: string
    address?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
    imageUrl?: string
    status: 'active' | 'inactive' | 'graduated' | 'dropped'
    paymentStatus: 'paid' | 'pending' | 'overdue' | 'partial'
    enrollmentDate?: string
    fathersName?: string
    fathersPhone?: string
    schoolCollege?: string
    referredBy?: string
    notes?: string
    branchId: string
    courseId?: string
    batchId?: string
    branch?: Branch
    course?: Course
    batch?: Batch
    createdAt: string
    updatedAt: string
}

export interface StudentFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    address: string
    city: string
    state: string
    country: string
    zipCode: string
    fathersName: string
    fathersPhone: string
    schoolCollege: string
    referredBy: string
    notes: string
    branchId: string
    courseId: string
    batchId: string
}

// ===========================================
// BATCH TYPES
// ===========================================

export interface Batch {
    id: string
    name: string
    description?: string
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    status: 'active' | 'inactive' | 'completed'
    courseId: string
    course?: Course
    students?: Student[]
    createdAt: string
    updatedAt: string
}

export interface BatchFormData {
    name: string
    description: string
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    courseId: string
}

// ===========================================
// ENQUIRY TYPES
// ===========================================

export interface Enquiry {
    id: string
    name: string
    email?: string
    phone: string
    message?: string
    status: 'new' | 'contacted' | 'converted' | 'closed'
    source?: string
    courseId?: string
    branchId: string
    course?: Course
    createdAt: string
    updatedAt: string
}

// ===========================================
// DASHBOARD & STATS TYPES
// ===========================================

export interface DashboardStats {
    totalStudents: number
    activeStudents: number
    totalRevenue: number
    pendingFees: number
    totalCourses: number
    totalBatches: number
    totalEnquiries: number
    recentEnquiries: number
}

export interface RevenueData {
    month: string
    revenue: number
    students: number
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// ===========================================
// UI STATE TYPES
// ===========================================

export interface ModalState {
    isOpen: boolean
    type: 'add' | 'edit' | 'delete' | 'view' | null
    data?: unknown
}

export interface FilterState {
    search: string
    status: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
    page: number
    pageSize: number
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type EntityStatus = 'active' | 'inactive'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial'
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped'
