'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useBranches, useCourses, useBatches } from '@/hooks'
import { useAdmissionDraftStore } from '@/lib/stores'
import type {
    StudentAdmissionFormData,
    CourseFormData,
    BatchFormData,
    InstallmentPlanItem
} from '@/lib/types'

export const INITIAL_FORM_DATA: StudentAdmissionFormData = {
    // Step 1: Student Details
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    enrollmentNo: 'OCI-1',
    phone: '',
    fathersName: '',
    mothersName: '',
    category: '',
    maritalStatus: 'single',
    fathersPhone: '',
    address: '',
    aadhaarNumber: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    district: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    gender: '',
    referredBy: '',
    admissionDate: '',
    imageUrl: '',

    // Step 2: Qualification Details
    highestQualification: '',
    hsSchoolName: '',
    hsBoard: '',
    hsPassingYear: '',
    hsPercentage: '',
    hssSchoolName: '',
    hssBoard: '',
    hssStream: '',
    hssPassingYear: '',
    hssPercentage: '',
    gradCollegeName: '',
    gradUniversity: '',
    gradDegree: '',
    gradPassingYear: '',
    gradPercentage: '',
    pgCollegeName: '',
    pgUniversity: '',
    pgDegree: '',
    pgPassingYear: '',
    pgPercentage: '',

    // Step 3: Course & Batch Details
    courseId: '',
    branchId: '',
    batchId: '',

    // Step 4: Payment Details
    totalAmount: '0',
    discountAmount: '0',
    netPayableFee: '0',
    isPartPayment: 'no',
    applyCoupon: 'no',
    discountedAmount: '0',
    paymentMode: '',
    receiptNo: '',
    transactionId: '',
    paymentDate: '',
    proofImage: '',
    receivedBy: '',

    // Step 5: Installment Details
    divideInstallments: 'preset',
    installments: 1,
    payFirstInstallmentNow: 'no',
    installmentPlan: []
}

export function useAdmissionForm() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const { defaultBranch } = useBranches()
    const { courses, createCourse } = useCourses()
    const { batches, fetchBatches, createBatch } = useBatches()
    const { draftData, currentStep: draftStep, hasDraft, saveDraft, clearDraft } = useAdmissionDraftStore()

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<StudentAdmissionFormData>(INITIAL_FORM_DATA)

    // Dialog states for instant creation
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
    const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
    const [savingNewCourse, setSavingNewCourse] = useState(false)
    const [savingNewBatch, setSavingNewBatch] = useState(false)

    // Form data for new course/batch
    const [newCourseData, setNewCourseData] = useState<CourseFormData>({
        name: '',
        code: '',
        description: '',
        fee: '0',
        registrationFee: '0',
        courseType: 'academic',
        mode: 'offline',
        durationYears: '0',
        durationMonths: '0',
        maxInstallments: '1',
        feeDescription: '',
        discountAllowed: false,
        discountPercentage: '0',
        installmentAmounts: [],
        subjects: [],
        eligibility: 'high_school'
    })

    const [newBatchData, setNewBatchData] = useState<BatchFormData>({
        name: '',
        description: '',
        courseId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
    })

    // Pre-fill from enquiry data or existing student
    useEffect(() => {
        const studentId = (searchParams.get('studentId') || searchParams.get('id') || params?.id) as string

        if (searchParams.get('fromEnquiry') === 'true') {
            setFormData(prev => ({
                ...prev,
                firstName: searchParams.get('firstName') || '',
                lastName: searchParams.get('lastName') || '',
                phone: searchParams.get('phone') || '',
                email: searchParams.get('email') || '',
            }))
        } else if (studentId) {
            // Load existing student data for editing
            const loadStudent = async () => {
                try {
                    const res = await fetch(`/api/students/${studentId}`)
                    const data = await res.json()
                    if (data.success && data.student) {
                        const s = data.student

                        let fullPaymentData: any = {}
                        if (s.fullPayment) {
                            try {
                                fullPaymentData = typeof s.fullPayment === 'string' ? JSON.parse(s.fullPayment) : s.fullPayment
                            } catch (e) {
                                console.error('Failed to parse fullPayment:', e)
                            }
                        }

                        let installmentPlanData: InstallmentPlanItem[] = []
                        if (s.installmentPlan) {
                            try {
                                installmentPlanData = typeof s.installmentPlan === 'string' ? JSON.parse(s.installmentPlan) : s.installmentPlan
                            } catch (e) {
                                console.error('Failed to parse installmentPlan:', e)
                            }
                        }

                        setFormData({
                            // Step 1: Student Details
                            firstName: s.firstName || '',
                            lastName: s.lastName || '',
                            email: s.email || '',
                            dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
                            enrollmentNo: s.enrollmentNo || '',
                            phone: s.phone || '',
                            fathersName: s.fathersName || '',
                            mothersName: s.mothersName || '',
                            category: s.category || '',
                            maritalStatus: s.maritalStatus || '',
                            fathersPhone: s.fathersPhone || '',
                            address: s.address || '',
                            aadhaarNumber: s.aadhaarNumber || '',
                            alternatePhone: s.alternatePhone || '',
                            addressLine1: s.addressLine1 || '',
                            addressLine2: s.addressLine2 || '',
                            district: s.district || '',
                            city: s.city || '',
                            state: s.state || '',
                            pinCode: s.zipCode || '',
                            country: s.country || '',
                            gender: s.gender || '',
                            referredBy: s.referredBy || '',
                            admissionDate: s.enrollmentDate ? new Date(s.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                            imageUrl: s.imageUrl || '',

                            // Step 2: Qualification Details
                            highestQualification: s.highestQualification || '',
                            hsSchoolName: s.hsSchoolName || '',
                            hsBoard: s.hsBoard || '',
                            hsPassingYear: s.hsPassingYear || '',
                            hsPercentage: s.hsPercentage || '',
                            hssSchoolName: s.hssSchoolName || '',
                            hssBoard: s.hssBoard || '',
                            hssStream: s.hssStream || '',
                            hssPassingYear: s.hssPassingYear || '',
                            hssPercentage: s.hssPercentage || '',
                            gradCollegeName: s.gradCollegeName || '',
                            gradUniversity: s.gradUniversity || '',
                            gradDegree: s.gradDegree || '',
                            gradPassingYear: s.gradPassingYear || '',
                            gradPercentage: s.gradPercentage || '',
                            pgCollegeName: s.pgCollegeName || '',
                            pgUniversity: s.pgUniversity || '',
                            pgDegree: s.pgDegree || '',
                            pgPassingYear: s.pgPassingYear || '',
                            pgPercentage: s.pgPercentage || '',

                            // Step 3: Course & Batch Details
                            courseId: s.courseId || '',
                            branchId: s.branchId || '',
                            batchId: s.batchId || '',

                            // Step 4: Payment Details
                            totalAmount: String(s.totalAmount || '0'),
                            discountAmount: String(s.discountAmount || '0'),
                            netPayableFee: String(s.netPayableFee || '0'),
                            isPartPayment: s.isPartPayment ? 'yes' : 'no',
                            applyCoupon: 'no',
                            discountedAmount: String(s.netPayableFee || '0'),
                            paymentMode: fullPaymentData?.mode || '',
                            receiptNo: fullPaymentData?.receiptNo || '',
                            transactionId: fullPaymentData?.transactionId || '',
                            paymentDate: fullPaymentData?.date || '',
                            proofImage: fullPaymentData?.proofImage || '',
                            receivedBy: s.receivedBy || '',

                            // Step 5: Installment Details
                            divideInstallments: s.installmentMode || (installmentPlanData.length > 0 ? 'custom' : 'custom'),
                            installments: installmentPlanData.length || 1,
                            payFirstInstallmentNow: 'no',
                            installmentPlan: (installmentPlanData || []).map((ip: any) => ({
                                ...ip,
                                amount: String(ip.amount),
                                paidAmount: String(ip.paidAmount)
                            }))
                        })
                    }
                } catch (e) {
                    console.error('Failed to load student for edit:', e)
                    toast.error('Failed to load student data')
                }
            }
            loadStudent()
        }
    }, [searchParams, params])

    // Set default branch when loaded
    useEffect(() => {
        if (defaultBranch && !formData.branchId) {
            setFormData(prev => ({ ...prev, branchId: defaultBranch.id }))
        }
    }, [defaultBranch, formData.branchId])

    // Update total amount when course changes
    useEffect(() => {
        if (formData.courseId) {
            const course = courses.find(c => c.id === formData.courseId)
            if (course) {
                setFormData(prev => {
                    const total = Number(course.fee) || 0
                    const discount = Number(prev.discountAmount) || 0
                    const net = total - discount
                    return {
                        ...prev,
                        totalAmount: String(total),
                        netPayableFee: String(net > 0 ? net : 0),
                        discountedAmount: String(net > 0 ? net : 0)
                    }
                })
            }
            fetchBatches()
        }
    }, [formData.courseId, courses, fetchBatches])

    // Update net fee when discount changes
    useEffect(() => {
        setFormData(prev => {
            const total = Number(prev.totalAmount) || 0
            const discount = Number(prev.discountAmount) || 0
            const net = total - discount
            return {
                ...prev,
                netPayableFee: String(net > 0 ? net : 0),
                discountedAmount: String(net > 0 ? net : 0)
            }
        })
    }, [formData.discountAmount, formData.totalAmount])

    // Update installment rows based on mode and first payment
    useEffect(() => {
        const mode = formData.divideInstallments
        const isPayingFirstNow = formData.payFirstInstallmentNow === 'yes'
        const netFee = Number(formData.netPayableFee) || 0
        const course = courses.find(c => c.id === formData.courseId)

        // Count depends on mode: Preset forces course max, others use user selection
        const count = mode === 'preset'
            ? (Number(course?.maxInstallments) || 1)
            : (Number(formData.installments) || 1)

        setFormData(prev => {
            let newPlan: InstallmentPlanItem[] = []
            const today = new Date().toISOString().split('T')[0]

            const getMonthlyDate = (index: number) => {
                const d = new Date()
                d.setMonth(d.getMonth() + index)
                return d.toISOString().split('T')[0]
            }

            if (mode === 'preset') {
                // Parse preset amounts from course (stored as JSON string or string[])
                let presetAmounts: string[] = []
                try {
                    const raw = course?.installmentAmounts
                    if (typeof raw === 'string') {
                        presetAmounts = JSON.parse(raw)
                    } else if (Array.isArray(raw)) {
                        presetAmounts = raw
                    }
                } catch (e) {
                    console.error('Failed to parse preset amounts:', e)
                }

                newPlan = Array(count).fill(null).map((_, i) => {
                    const instAmount = presetAmounts[i] || '0'
                    return {
                        installmentNo: i + 1,
                        dueDate: getMonthlyDate(i),
                        amount: String(instAmount),
                        paidAmount: (i === 0 && isPayingFirstNow) ? String(instAmount) : '0',
                        paymentDate: (i === 0 && isPayingFirstNow) ? today : '',
                        mode: (i === 0 && isPayingFirstNow) ? 'cash' : '',
                        receiptNo: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.receiptNo || '') : '',
                        utrNo: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.utrNo || '') : '',
                        proofImage: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.proofImage || '') : '',
                        receivedBy: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.receivedBy || '') : '',
                        status: (i === 0 && isPayingFirstNow) ? 'paid' : 'pending',
                        remark: ''
                    }
                })
            } else if (mode === 'equal') {
                const amountPerInst = Math.floor(netFee / count)
                const lastInstAmount = netFee - (amountPerInst * (count - 1))

                newPlan = Array(count).fill(null).map((_, i) => ({
                    installmentNo: i + 1,
                    dueDate: getMonthlyDate(i),
                    amount: String(i === count - 1 ? lastInstAmount : amountPerInst),
                    paidAmount: (i === 0 && isPayingFirstNow) ? String(i === count - 1 ? lastInstAmount : amountPerInst) : '0',
                    paymentDate: (i === 0 && isPayingFirstNow) ? today : '',
                    mode: (i === 0 && isPayingFirstNow) ? 'cash' : '',
                    receiptNo: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.receiptNo || '') : '',
                    utrNo: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.utrNo || '') : '',
                    proofImage: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.proofImage || '') : '',
                    receivedBy: (i === 0 && isPayingFirstNow) ? (prev.installmentPlan[0]?.receivedBy || '') : '',
                    status: (i === 0 && isPayingFirstNow) ? 'paid' : 'pending',
                    remark: ''
                }))
            } else {
                // Custom Mode - Retain existing data if possible
                newPlan = Array(count).fill(null).map((_, i) => {
                    const existing = prev.installmentPlan[i]
                    return existing || {
                        installmentNo: i + 1,
                        dueDate: getMonthlyDate(i),
                        amount: '0',
                        paidAmount: '0',
                        paymentDate: '',
                        mode: '',
                        receiptNo: '',
                        utrNo: '',
                        proofImage: '',
                        receivedBy: '',
                        status: 'pending',
                        remark: ''
                    }
                })

                // If paying first now, mark 1st inst
                if (isPayingFirstNow && newPlan[0]) {
                    newPlan[0].paidAmount = newPlan[0].amount
                    newPlan[0].paymentDate = today
                    newPlan[0].status = 'paid'
                    if (!newPlan[0].mode) newPlan[0].mode = 'cash'
                }
            }

            // Sync installments count in form data if it changed (e.g. from Preset selection)
            const installmentsToUpdate = mode === 'preset' ? count : prev.installments

            // Avoid state update if nothing changed
            if (JSON.stringify(newPlan) === JSON.stringify(prev.installmentPlan) &&
                installmentsToUpdate === prev.installments) {
                return prev
            }

            return {
                ...prev,
                installmentPlan: newPlan,
                installments: installmentsToUpdate
            }
        })
    }, [formData.installments, formData.divideInstallments, formData.payFirstInstallmentNow, formData.netPayableFee, formData.courseId])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleSelectChange = useCallback((name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }, [])

    const handleInstallmentChange = useCallback((index: number, field: keyof InstallmentPlanItem, value: string) => {
        setFormData(prev => {
            const newPlan = [...prev.installmentPlan]
            newPlan[index] = { ...newPlan[index], [field]: value }
            return { ...prev, installmentPlan: newPlan }
        })
    }, [])

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const handleAddCourse = async () => {
        try {
            setSavingNewCourse(true)
            const success = await createCourse(newCourseData)
            if (success) {
                toast.success('Course created successfully!')
                setIsAddCourseOpen(false)
            }
        } catch (error) {
            toast.error('Failed to create course')
        } finally {
            setSavingNewCourse(false)
        }
    }

    const handleAddBatch = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSavingNewBatch(true)
            const batchToCreate = { ...newBatchData, courseId: formData.courseId }
            if (!batchToCreate.courseId) {
                toast.error('Please select a course first')
                return
            }
            const success = await createBatch(batchToCreate)
            if (success) {
                toast.success('Batch created successfully!')
                setIsAddBatchOpen(false)
                fetchBatches()
            }
        } catch (error) {
            toast.error('Failed to create batch')
        } finally {
            setSavingNewBatch(false)
        }
    }

    const handleNext = useCallback(() => {
        setCurrentStep(prev => prev + 1)
    }, [])

    const handleBack = useCallback(() => {
        setCurrentStep(prev => (prev > 1 ? prev - 1 : prev))
    }, [])

    const handleSaveDraft = async () => {
        try {
            setIsSubmitting(true)

            // Minimal validation for draft
            if (!formData.firstName) {
                toast.error('First Name is required to save a draft')
                setIsSubmitting(false)
                return
            }

            const draftPayload = {
                ...formData,
                action: 'draft', // Signal backend to treat as draft
                branchId: formData.branchId || defaultBranch?.id,
                status: 'draft',
                // Ensure numeric fields are safe
                totalAmount: Number(formData.totalAmount) || 0,
                discountAmount: Number(formData.discountAmount) || 0,
                netPayableFee: Number(formData.netPayableFee) || 0,
                isPartPayment: formData.isPartPayment === 'yes',
                installmentPlan: formData.isPartPayment === 'yes' ? formData.installmentPlan : []
            }

            const studentId = (searchParams.get('studentId') || searchParams.get('id') || params?.id) as string
            const isEdit = !!studentId

            // If editing an existing student, we use PATCH, otherwise POST
            // But wait, if we are saving a NEW draft, it's a POST.
            // If we are updating a DRAFT, it's a PATCH.

            const res = await fetch(isEdit ? `/api/students/${studentId}` : '/api/students', {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftPayload)
            })

            const data = await res.json()

            if (data.success) {
                clearDraft() // Clear local storage draft
                toast.success('Draft saved to server successfully!')
                router.push('/admin/students/drafts') // Redirect to drafts list
            } else {
                toast.error(data.error || 'Failed to save draft')
            }

        } catch (error) {
            console.error('Save draft error:', error)
            toast.error('Error saving draft')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResumeDraft = useCallback(() => {
        if (draftData) {
            setFormData(draftData)
            setCurrentStep(draftStep)
            toast.success('Draft resumed!')
        }
    }, [draftData, draftStep])

    const handleDiscardDraft = useCallback(() => {
        clearDraft()
        toast.success('Draft discarded')
    }, [clearDraft])

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)

            const studentData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                fathersName: formData.fathersName,
                mothersName: formData.mothersName,
                category: formData.category,
                maritalStatus: formData.maritalStatus,
                fathersPhone: formData.fathersPhone,
                aadhaarNumber: formData.aadhaarNumber,
                alternatePhone: formData.alternatePhone,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                district: formData.district,
                city: formData.city,
                state: formData.state,
                zipCode: formData.pinCode,
                country: formData.country,
                courseId: formData.courseId,
                batchId: formData.batchId,
                enrollmentNo: formData.enrollmentNo,
                referredBy: formData.referredBy,
                enrollmentDate: formData.admissionDate,
                branchId: formData.branchId || defaultBranch?.id,
                imageUrl: formData.imageUrl,

                status: 'active', // This will be enforced by backend action='submit' anyway
                action: 'submit', // CRITICAL: Signal backend to finalize admission

                // Qualifications
                highestQualification: formData.highestQualification,
                hsSchoolName: formData.hsSchoolName,
                hsBoard: formData.hsBoard,
                hsPassingYear: formData.hsPassingYear,
                hsPercentage: formData.hsPercentage,
                hssSchoolName: formData.hssSchoolName,
                hssBoard: formData.hssBoard,
                hssStream: formData.hssStream,
                hssPassingYear: formData.hssPassingYear,
                hssPercentage: formData.hssPercentage,
                gradCollegeName: formData.gradCollegeName,
                gradUniversity: formData.gradUniversity,
                gradDegree: formData.gradDegree,
                gradPassingYear: formData.gradPassingYear,
                gradPercentage: formData.gradPercentage,
                pgCollegeName: formData.pgCollegeName,
                pgUniversity: formData.pgUniversity,
                pgDegree: formData.pgDegree,
                pgPassingYear: formData.pgPassingYear,
                pgPercentage: formData.pgPercentage,

                // Advanced Payment Logic fields
                totalAmount: formData.totalAmount,           // Total Course Fee
                discountAmount: formData.discountAmount,     // Admin discount
                netPayableFee: formData.netPayableFee,       // Net payable
                isPartPayment: formData.isPartPayment === 'yes', // Bool for DB
                paymentStatus: formData.isPartPayment === 'yes' ? 'partial' : 'paid',

                // Full Payment Details if applicable
                fullPayment: formData.isPartPayment === 'no' ? {
                    mode: formData.paymentMode,
                    receiptNo: formData.receiptNo,
                    transactionId: formData.transactionId,
                    date: formData.paymentDate,
                    proofImage: formData.proofImage
                } : null,

                // Installment Plan Details if applicable
                installmentMode: formData.divideInstallments,
                installmentPlan: formData.isPartPayment === 'yes' ? formData.installmentPlan : []
            }

            const studentId = (searchParams.get('studentId') || searchParams.get('id') || params?.id) as string
            const isEdit = !!studentId

            const res = await fetch(isEdit ? `/api/students/${studentId}` : '/api/students', {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            })

            const data = await res.json()

            if (data.success) {
                if (!isEdit) {
                    const enquiryId = searchParams.get('enquiryId')
                    if (enquiryId) {
                        try {
                            await fetch(`/api/enquiries/${enquiryId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'admitted' })
                            })
                        } catch (e) {
                            console.warn('Failed to update enquiry status:', e)
                        }
                    }
                }

                clearDraft() // Clear draft on successful submission
                toast.success(isEdit ? 'Student updated successfully!' : 'Student admitted successfully!')
                router.push('/admin/students')
            } else {
                toast.error(data.error || `Failed to ${isEdit ? 'update' : 'create'} student`)
            }
        } catch (error) {
            console.error('Submit error:', error)
            toast.error('Error submitting admission form')
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        currentStep,
        setCurrentStep,
        formData,
        setFormData,
        isSubmitting,
        isAddCourseOpen,
        setIsAddCourseOpen,
        isAddBatchOpen,
        setIsAddBatchOpen,
        savingNewCourse,
        savingNewBatch,
        newCourseData,
        setNewCourseData,
        newBatchData,
        setNewBatchData,
        courses,
        batches,
        handleInputChange,
        handleSelectChange,
        handleInstallmentChange,
        handleImageUpload,
        handleAddCourse,
        handleAddBatch,
        handleNext,
        handleBack,
        handleSubmit,
        handleSaveDraft,
        handleResumeDraft,
        handleDiscardDraft,
        hasDraft
    }
}
