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
    // Basic Info
    name: string
    description: string
    courseType: string // 'academic' | 'skill' | 'certification'
    mode: string // 'offline' | 'online' | 'hybrid'
    // Fee Structure
    fee: string
    feeDescription: string
    registrationFee: string
    discountAllowed: boolean
    discountPercentage: string
    maxInstallments: string
    installmentAmounts: string[] // Custom amount for each installment
    // Duration
    durationYears: string
    durationMonths: string
    // Academic Details
    subjects: string[]
    eligibility: string // 'high_school' | 'higher_secondary' | 'graduation' | 'post_graduation'
    // Status Control
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
    mothersName?: string
    category?: 'general' | 'obc' | 'sc' | 'st' | 'other'
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
    aadhaarNumber?: string
    alternatePhone?: string
    addressLine1?: string
    addressLine2?: string
    district?: string
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
    mothersName: string
    category: string
    maritalStatus: string
    aadhaarNumber: string
    alternatePhone: string
    addressLine1: string
    addressLine2: string
    district: string
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

// ============================================
// LEAD MANAGEMENT TYPES
// ============================================

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'website' | 'referral' | 'social_media' | 'campaign' | 'other'

export interface Lead {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    source: LeadSource
    stage: LeadStage
    assignedTo?: string // userId
    company?: string
    value?: number
    notes?: string
    tags?: string[]
    lastContactedAt?: string
    createdAt: string
    updatedAt: string
}

export interface LeadFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    source: string
    stage: string
    company?: string
    value?: string
    notes?: string
    assignedTo?: string
}

// ============================================
// ATTENDANCE TYPES
// ============================================

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half-day' | 'holiday'
export type AttendanceType = 'student' | 'employee'

export interface AttendanceRecord {
    id: string
    date: string
    status: AttendanceStatus
    type: AttendanceType
    entityId: string // studentId or employeeId
    name: string
    rollNo?: string // for students
    designation?: string // for employees
    remarks?: string
    checkIn?: string
    checkOut?: string
}

export interface AttendanceStats {
    present: number
    absent: number
    leave: number
    halfDay: number
    holiday: number
    total: number
}

// ===========================================
// UTILITY TYPES
// ===========================================

export type EntityStatus = 'active' | 'inactive'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial'
// ===========================================
// STAFF / EMPLOYEE TYPES
// ===========================================

export interface Education {
    level: string // 'High School', 'Intermediate', 'Graduation', etc.
    institution: string
    boardOrUniversity?: string
    percentage?: string
    passingYear?: string
    address?: string
    certificateUrl?: string
}

export interface BankDetails {
    accountNumber: string
    accountHolderName: string // Usually same as staff name, but can be different
    bankName: string
    ifscCode: string
    confirmAccountNumber?: string // Only for form validation, mostly not stored
}

export interface Staff {
    id: string
    // Personal Info
    firstName: string
    lastName: string
    employeeCode: string
    email: string
    phone: string
    dateOfBirth: string
    gender: 'male' | 'female' | 'other'
    fathersName?: string
    fathersPhone?: string
    address?: string
    profileImage?: string

    // Official Info
    department?: string
    designation: string // 'Teacher', 'Admin', 'Staff'
    dateOfJoining: string
    status: 'active' | 'inactive' | 'on_leave'

    // Qualification & Experience
    highestQualification?: string
    education?: Education[]
    skills?: string[]
    experienceYears?: number
    referredBy?: string

    // Salary Info
    salaryType: 'fixed' | 'hourly'
    salaryAmount: number

    // Bank Info
    bankDetails?: BankDetails

    // Documents
    aadharCard?: string
    panCard?: string

    createdAt: string
    updatedAt: string
}

export interface StaffFormData {
    // Personal
    firstName: string
    lastName: string
    employeeCode: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    fathersName: string
    fathersPhone: string
    address: string

    // Official
    department: string
    dateOfJoining: string

    // Qualification
    highestQualification: string
    education: Education[]
    experienceYears: string
    skills: string
    referredBy: string

    // Salary
    salaryType: string
    salaryAmount: string

    // Bank
    bankName: string
    accountNumber: string
    confirmAccountNumber: string
    ifscCode: string
}
