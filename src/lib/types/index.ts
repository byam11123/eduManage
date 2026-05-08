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
    organizationId?: string
    organization?: {
        id: string
        name: string
        logo?: string
        slug: string
    } | null
    image?: string
    isVerified: boolean
    branches: {
        id: string
        name: string
        isDefault: boolean
    }[]
    permissions?: string[]
    defaultBranchId?: string
    address?: string
    phone?: string
    status: string
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
    _count?: {
        students: number
    }
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
    code: string
    description?: string
    fee: number
    feeDescription?: string
    durationYears: number
    durationMonths: number
    maxInstallments: number
    installmentAmounts?: string // JSON string in DB
    courseType?: string
    mode: 'offline' | 'online' | 'hybrid'
    registrationFee: number
    discountAllowed: boolean
    discountPercentage: number
    eligibility?: string
    status: 'active' | 'inactive'
    organizationId: string
    showInAdmissionForm: boolean
    subjects?: Subject[]
    students?: Student[]
    createdAt: string
    updatedAt: string
}

export interface CourseFormData {
    // Basic Info
    name: string
    code: string
    description: string
    organizationId?: string
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
    status: 'active' | 'inactive' | 'graduated' | 'dropped' | 'draft'
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
    
    // Qualification Fields
    highestQualification?: string
    hsSchoolName?: string
    hsBoard?: string
    hsPassingYear?: string
    hsPercentage?: string
    hssSchoolName?: string
    hssBoard?: string
    hssStream?: string
    hssPassingYear?: string
    hssPercentage?: string
    gradCollegeName?: string
    gradUniversity?: string
    gradDegree?: string
    gradPassingYear?: string
    gradPercentage?: string
    pgCollegeName?: string
    pgUniversity?: string
    pgDegree?: string
    pgPassingYear?: string
    pgPercentage?: string

    // IDs
    admissionDisplayId: string
    admissionYear: string
    admissionSequence: number
    studentDisplayId?: string
    studentYear?: string
    studentSequence?: number

    // Financials
    totalAmount?: string
    discountAmount?: string
    netPayableFee?: string
    isPartPayment?: boolean
    installmentPlan?: string // JSON string
    installmentMode?: string
    fullPayment?: string // JSON string
    receivedBy?: string

    notes?: string
    branchId: string
    courseId?: string
    batchId?: string
    branch?: Branch
    course?: Course
    batch?: Batch

    // New Multi-Course Relation
    studentCourses?: StudentCourse[]

    createdAt: string
    updatedAt: string
}

export interface UseStudentsReturn {
    students: Student[]
    filteredStudents: Student[]
    selectedStudent: Student | null
    loading: boolean
    saving: boolean
    fetchStudents: (params?: { branchId?: string; courseId?: string; batchId?: string }) => Promise<void>
    fetchStudentById: (id: string) => Promise<Student | null>
    createStudent: (data: StudentFormData) => Promise<boolean>
    updateStudent: (id: string, data: Partial<StudentFormData>) => Promise<boolean>
    deleteStudent: (id: string) => Promise<boolean>
    selectStudent: (student: Student | null) => void
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
}

export interface Installment {
    id: string
    installmentNo: number
    dueDate: string
    amount: number
    paidAmount: number
    paidDate?: string
    status: 'pending' | 'paid' | 'partial' | 'due'
    mode?: string
    receiptNo?: string
    remarks?: string
}

export interface StudentCourseBatch {
    id: string
    batchId: string
    batch: Batch
}

export interface StudentCourse {
    id: string
    courseId: string
    course: Course
    status: 'ongoing' | 'completed' | 'dropped'
    totalFee: number
    discountAmount: number
    netPayable: number
    installments: Installment[]
    batches: StudentCourseBatch[]
    joinedAt: string
}

export interface InstallmentPlanItem {
    installmentNo: number
    dueDate: string
    amount: string
    paidAmount: string
    paymentDate: string
    mode: 'cash' | 'online' | ''
    receiptNo: string
    utrNo?: string
    proofImage: string
    status: 'paid' | 'pending' | 'due'
    remark: string
    receivedBy: string
}

export interface StudentAdmissionFormData {
    // Step 1: Student Details
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    enrollmentNo: string
    phone: string
    fathersName: string
    mothersName: string
    category: string
    maritalStatus: string
    fathersPhone: string
    address: string
    aadhaarNumber: string
    alternatePhone: string
    addressLine1: string
    addressLine2: string
    district: string
    city: string
    state: string
    pinCode: string
    country: string
    gender: string
    referredBy: string
    admissionDate: string
    imageUrl: string

    // Step 2: Qualification Details
    highestQualification: string
    hsSchoolName: string
    hsBoard: string
    hsPassingYear: string
    hsPercentage: string
    hssSchoolName: string
    hssBoard: string
    hssStream: string
    hssPassingYear: string
    hssPercentage: string
    gradCollegeName: string
    gradUniversity: string
    gradDegree: string
    gradPassingYear: string
    gradPercentage: string
    pgCollegeName: string
    pgUniversity: string
    pgDegree: string
    pgPassingYear: string
    pgPercentage: string

    // Step 3: Course & Batch Details
    courseId: string
    branchId: string
    batchId: string

    // Step 4: Payment Details
    totalAmount: string
    discountAmount: string
    netPayableFee: string
    isPartPayment: string
    applyCoupon: string
    discountedAmount: string // Keep for compatibility if needed, but netPayableFee is preferred
    paymentMode: string // for full payment
    receiptNo: string // for full payment
    transactionId: string // for full payment
    paymentDate: string // for full payment
    proofImage: string // for full payment
    receivedBy: string // for full payment

    // Step 5: Installment Details
    divideInstallments: 'preset' | 'equal' | 'custom'
    installments: number
    payFirstInstallmentNow: string
    installmentPlan: InstallmentPlanItem[]
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
    imageUrl: string
    status?: string
    enrollmentNo?: string
    enrollmentDate?: string
    paymentStatus?: string
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
    description?: string
    startDate: string
    endDate?: string
    startTime: string
    endTime: string
    courseId: string
    status?: string
    code?: string
    maxStudents?: number
}

// ===========================================
// ENQUIRY TYPES
// ===========================================

export interface Enquiry {
    id: string
    firstName: string
    lastName: string
    email?: string
    mobile: string
    description?: string
    status: 'new' | 'contacted' | 'interested' | 'admitted' | 'lost' | 'dropped'
    source?: string
    courseId?: string
    branchId: string
    organizationId: string
    course?: Course
    branch?: Branch
    createdAt: string
    updatedAt: string
}

export interface EnquiryFormData {
    firstName: string
    lastName: string
    email: string
    mobile: string
    description: string
    courseId: string
    status: string
    source: string
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
    fullName: string
    branchName?: string

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
