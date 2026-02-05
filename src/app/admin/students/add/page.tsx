'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    User,
    GraduationCap,
    BookOpen,
    CreditCard,
    FileCheck,
    ChevronRight,
    Upload,
    Calendar as CalendarIcon,
    Plus,
    LayoutGrid,
    Banknote,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { DateInput } from '@/components/ui/date-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { INDIAN_STATES } from '@/lib/constants'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { useBranches, useCourses, useBatches } from '@/hooks'
import { AddCourseDialog } from '@/components/admin/courses'
import { AddBatchDialog } from '@/components/admin/batches'
import type { CourseFormData, BatchFormData } from '@/lib/types'

const steps = [
    { id: 1, title: 'Student Details', description: 'Enter Student Information', icon: User },
    { id: 2, title: 'Qualification Details', description: 'Enter Education Information', icon: GraduationCap },
    { id: 3, title: 'Course & Batch Details', description: 'Select Course and Batch', icon: BookOpen },
    { id: 4, title: 'Payment Details', description: 'Enter Payment Information', icon: CreditCard },
    { id: 5, title: 'Installment Details', description: 'Enter Installment Information', icon: Banknote },
    { id: 6, title: 'Review Details', description: 'Check your Filled Details', icon: FileCheck },
]

export default function StudentAdmissionPage() {
    const router = useRouter()
    const { defaultBranch, branches } = useBranches()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
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
        highestQualification: '', // 'high_school' | 'higher_secondary' | 'graduation' | 'post_graduation'
        // High School (10th)
        hsSchoolName: '',
        hsBoard: '',
        hsPassingYear: '',
        hsPercentage: '',
        // Higher Secondary (12th)
        hssSchoolName: '',
        hssBoard: '',
        hssStream: '',
        hssPassingYear: '',
        hssPercentage: '',
        // Graduation
        gradCollegeName: '',
        gradUniversity: '',
        gradDegree: '',
        gradPassingYear: '',
        gradPercentage: '',
        // Post Graduation
        pgCollegeName: '',
        pgUniversity: '',
        pgDegree: '',
        pgPassingYear: '',
        pgPercentage: '',

        // Step 3: Coaching Details
        courseId: '',
        branchId: '', // Will be set from default branch

        // Step 4: Batch Details
        batchId: '',

        // Step 5: Payment Details
        totalAmount: '30000', // Mock default or fetched from course
        isPartPayment: 'no',
        applyCoupon: 'no',
        discountedAmount: '30000',

        // Step 6: Installment Details
        installments: 1,
        payFirstInstallmentNow: 'due',
        installmentPlan: [] as { date: string, description: string, amount: string }[]
    })

    const { courses, loading: coursesLoading, createCourse } = useCourses()
    const { batches, fetchBatches, createBatch } = useBatches()

    // Dialog states for instant creation
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
    const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
    const [savingNewCourse, setSavingNewCourse] = useState(false)
    const [savingNewBatch, setSavingNewBatch] = useState(false)

    // Form data for new course/batch
    const [newCourseData, setNewCourseData] = useState<CourseFormData>({
        name: '',
        description: '',
        fee: 0,
        registrationFee: 0,
        courseType: 'academic',
        mode: 'offline',
        durationYears: 0,
        durationMonths: 0,
        maxInstallments: 1
    })

    const [newBatchData, setNewBatchData] = useState<BatchFormData>({
        name: '',
        description: '',
        courseId: '',
        status: 'active'
    })

    // Handler for instant course creation
    const handleAddCourse = async () => {
        try {
            setSavingNewCourse(true)
            const success = await createCourse(newCourseData)
            if (success) {
                toast.success('Course created successfully!')
                setIsAddCourseOpen(false)
                // The useCourses hook will refresh the list, and we can select it once identified
                // For simplicity, we just keep the form as is, user can select the new one
            }
        } catch (error) {
            toast.error('Failed to create course')
        } finally {
            setSavingNewCourse(false)
        }
    }

    // Handler for instant batch creation
    const handleAddBatch = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSavingNewBatch(true)
            // Ensure courseId is set
            const batchToCreate = { ...newBatchData, courseId: formData.courseId }
            if (!batchToCreate.courseId) {
                toast.error('Please select a course first')
                return
            }
            const success = await createBatch(batchToCreate)
            if (success) {
                toast.success('Batch created successfully!')
                setIsAddBatchOpen(false)
                // Refresh batches for the current course
                fetchBatches(formData.courseId)
            }
        } catch (error) {
            toast.error('Failed to create batch')
        } finally {
            setSavingNewBatch(false)
        }
    }

    // Fetch batches when course changes
    useEffect(() => {
        if (formData.courseId) {
            fetchBatches(formData.courseId)
        }
    }, [formData.courseId, fetchBatches])


    // Pre-fill from enquiry data if coming from Enquiry page
    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams.get('fromEnquiry') === 'true') {
            setFormData(prev => ({
                ...prev,
                firstName: searchParams.get('firstName') || '',
                lastName: searchParams.get('lastName') || '',
                phone: searchParams.get('phone') || '',
                email: searchParams.get('email') || '',
            }))
        }
    }, [searchParams])

    // Set default branch when loaded
    useEffect(() => {
        if (defaultBranch && !formData.branchId) {
            setFormData(prev => ({ ...prev, branchId: defaultBranch.id }))
        }
    }, [defaultBranch, formData.branchId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleInstallmentChange = (index: number, field: string, value: string) => {
        const newPlan = [...formData.installmentPlan]
        newPlan[index] = { ...newPlan[index], [field]: value }
        setFormData(prev => ({ ...prev, installmentPlan: newPlan }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        // Update installment rows when count changes
        const count = Number(formData.installments) || 1
        const currentCount = formData.installmentPlan.length

        if (count > currentCount) {
            const newRows = Array(count - currentCount).fill({ date: '', description: '', amount: '' })
            setFormData(prev => ({ ...prev, installmentPlan: [...prev.installmentPlan, ...newRows] }))
        } else if (count < currentCount) {
            setFormData(prev => ({ ...prev, installmentPlan: prev.installmentPlan.slice(0, count) }))
        }
    }, [formData.installments])


    const handleNext = () => {
        if (currentStep < steps.length) setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)

            // Prepare student data
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
                branchId: formData.branchId || defaultBranch?.id, // REQUIRED by API
                imageUrl: formData.imageUrl,
                status: 'active',
                paymentStatus: formData.isPartPayment === 'yes' ? 'partial' : 'pending'
            }

            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            })

            const data = await res.json()

            if (data.success) {
                // If this admission came from an enquiry, update status to 'admitted' (preserves for analytics)
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

                toast.success('Student admitted successfully!')
                router.push('/admin/students')
            } else {
                toast.error(data.error || 'Failed to create student')
            }
        } catch (error) {
            console.error('Submit error:', error)
            toast.error('Error submitting admission form')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 h-[calc(100vh-4rem)] overflow-hidden">
            {/* Sidebar Steps */}
            <Card className="w-full md:w-64 h-full border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto hidden md:block">
                <CardContent className="p-6 space-y-8">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        const Icon = step.icon

                        return (
                            <div key={step.id} className="relative flex items-center gap-4 group cursor-pointer" onClick={() => isCompleted && setCurrentStep(step.id)}>
                                {/* Connector Line */}
                                {step.id !== steps.length && (
                                    <div className={cn(
                                        "absolute left-4 top-10 bottom-[-2rem] w-0.5",
                                        isCompleted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                                    )} />
                                )}

                                <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                    isActive ? "border-indigo-600 text-indigo-600 bg-indigo-50" :
                                        isCompleted ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-400"
                                )}>
                                    {isCompleted ? (
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-sm font-semibold transition-colors",
                                        isActive ? "text-indigo-600" : "text-gray-500"
                                    )}>
                                        {step.title}
                                    </span>
                                    <span className="text-xs text-gray-400 hidden lg:block">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Main Form Area */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {steps[currentStep - 1].title}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {steps[currentStep - 1].description}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6">

                    {/* Step 1: Student Details - Reorganized into 4 Sections */}
                    {currentStep === 1 && (
                        <div className="space-y-8">
                            {/* Section 1: Student Basic Details */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Basic Details</h3>

                                {/* Image Upload & Preview */}
                                <div className="flex flex-col md:flex-row items-center gap-6 pb-6">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-full border-4 border-indigo-50 overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="Student" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-12 w-12 text-gray-300" />
                                            )}
                                        </div>
                                        <label htmlFor="student-image" className="absolute bottom-0 right-0 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:bg-indigo-700 transition-colors">
                                            <Upload className="h-4 w-4 text-white" />
                                            <input
                                                id="student-image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-medium text-gray-900">Student Profile Image</h4>
                                        <p className="text-xs text-gray-500">Upload a professional portrait. Max size 2MB. Supports JPG, PNG.</p>
                                        {formData.imageUrl && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto font-medium text-xs mt-2"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                            >
                                                Remove Image
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                        <DateInput id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(val) => setFormData(prev => ({ ...prev, dateOfBirth: val }))} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Family Details */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Family Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fathersName">Father's / Husband's Name</Label>
                                        <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={handleInputChange} placeholder="Father's / Husband's Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mothersName">Mother's Name</Label>
                                        <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={handleInputChange} placeholder="Mother's Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <Select value={formData.maritalStatus} onValueChange={(val) => handleSelectChange('maritalStatus', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">Unmarried</SelectItem>
                                                <SelectItem value="married">Married</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Category & ID */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Category & ID</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general">GEN</SelectItem>
                                                <SelectItem value="obc">OBC</SelectItem>
                                                <SelectItem value="sc">SC</SelectItem>
                                                <SelectItem value="st">ST</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                                        <Input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} placeholder="12-digit Aadhaar" maxLength={12} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Contact Details */}
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Mobile Number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="alternatePhone">Alternate Number</Label>
                                        <Input id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} placeholder="Alternate Number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" />
                                    </div>
                                </div>
                                {/* Address Sub-Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="addressLine1">Address Line 1</Label>
                                        <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="House No, Street" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="addressLine2">Address Line 2</Label>
                                        <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Area, Landmark (Optional)" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District</Label>
                                        <Input id="district" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                            <SelectContent>
                                                {INDIAN_STATES.map((state) => (
                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pinCode">PIN Code</Label>
                                        <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleInputChange} placeholder="6-digit PIN" maxLength={6} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Select value={formData.country} onValueChange={(val) => handleSelectChange('country', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="India">India</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Qualification Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Highest Qualification Selector */}
                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="highestQualification">Highest Qualification *</Label>
                                <Select value={formData.highestQualification} onValueChange={(val) => handleSelectChange('highestQualification', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select Highest Qualification" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high_school">High School (10th)</SelectItem>
                                        <SelectItem value="higher_secondary">Higher Secondary (12th)</SelectItem>
                                        <SelectItem value="graduation">Graduation</SelectItem>
                                        <SelectItem value="post_graduation">Post Graduation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* High School (10th) - Show for all qualifications */}
                            {formData.highestQualification && (
                                <div className="border rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">High School (10th) Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hsSchoolName">School Name *</Label>
                                            <Input id="hsSchoolName" name="hsSchoolName" value={formData.hsSchoolName} onChange={handleInputChange} placeholder="Enter school name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hsBoard">Board *</Label>
                                            <Input id="hsBoard" name="hsBoard" value={formData.hsBoard} onChange={handleInputChange} placeholder="e.g. CBSE, ICSE, State Board" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hsPassingYear">Passing Year *</Label>
                                            <Input id="hsPassingYear" name="hsPassingYear" value={formData.hsPassingYear} onChange={handleInputChange} placeholder="e.g. 2018" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hsPercentage">Percentage / Grade *</Label>
                                            <Input id="hsPercentage" name="hsPercentage" value={formData.hsPercentage} onChange={handleInputChange} placeholder="e.g. 85% or A+" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Higher Secondary (12th) - Show for higher_secondary, graduation, post_graduation */}
                            {['higher_secondary', 'graduation', 'post_graduation'].includes(formData.highestQualification) && (
                                <div className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-900/20 space-y-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Higher Secondary (12th) Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hssSchoolName">School Name *</Label>
                                            <Input id="hssSchoolName" name="hssSchoolName" value={formData.hssSchoolName} onChange={handleInputChange} placeholder="Enter school name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hssBoard">Board *</Label>
                                            <Input id="hssBoard" name="hssBoard" value={formData.hssBoard} onChange={handleInputChange} placeholder="e.g. CBSE, ICSE, State Board" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hssStream">Stream *</Label>
                                            <Select value={formData.hssStream} onValueChange={(val) => handleSelectChange('hssStream', val)}>
                                                <SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="science">Science</SelectItem>
                                                    <SelectItem value="commerce">Commerce</SelectItem>
                                                    <SelectItem value="arts">Arts</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hssPassingYear">Passing Year *</Label>
                                            <Input id="hssPassingYear" name="hssPassingYear" value={formData.hssPassingYear} onChange={handleInputChange} placeholder="e.g. 2020" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hssPercentage">Percentage *</Label>
                                            <Input id="hssPercentage" name="hssPercentage" value={formData.hssPercentage} onChange={handleInputChange} placeholder="e.g. 90%" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Graduation - Show for graduation, post_graduation */}
                            {['graduation', 'post_graduation'].includes(formData.highestQualification) && (
                                <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/20 space-y-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Graduation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gradCollegeName">College Name *</Label>
                                            <Input id="gradCollegeName" name="gradCollegeName" value={formData.gradCollegeName} onChange={handleInputChange} placeholder="Enter college name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gradUniversity">University *</Label>
                                            <Input id="gradUniversity" name="gradUniversity" value={formData.gradUniversity} onChange={handleInputChange} placeholder="Enter university name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gradDegree">Degree *</Label>
                                            <Input id="gradDegree" name="gradDegree" value={formData.gradDegree} onChange={handleInputChange} placeholder="e.g. BSc, BCom, BTech" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gradPassingYear">Passing Year *</Label>
                                            <Input id="gradPassingYear" name="gradPassingYear" value={formData.gradPassingYear} onChange={handleInputChange} placeholder="e.g. 2023" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="gradPercentage">Percentage / CGPA *</Label>
                                            <Input id="gradPercentage" name="gradPercentage" value={formData.gradPercentage} onChange={handleInputChange} placeholder="e.g. 75% or 8.5 CGPA" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Post Graduation - Show only for post_graduation */}
                            {formData.highestQualification === 'post_graduation' && (
                                <div className="border rounded-lg p-4 bg-purple-50/50 dark:bg-purple-900/20 space-y-4">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Post Graduation Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pgCollegeName">PG College Name *</Label>
                                            <Input id="pgCollegeName" name="pgCollegeName" value={formData.pgCollegeName} onChange={handleInputChange} placeholder="Enter PG college name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pgUniversity">University *</Label>
                                            <Input id="pgUniversity" name="pgUniversity" value={formData.pgUniversity} onChange={handleInputChange} placeholder="Enter university name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pgDegree">Degree *</Label>
                                            <Input id="pgDegree" name="pgDegree" value={formData.pgDegree} onChange={handleInputChange} placeholder="e.g. MSc, MCom, MTech" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pgPassingYear">Passing Year *</Label>
                                            <Input id="pgPassingYear" name="pgPassingYear" value={formData.pgPassingYear} onChange={handleInputChange} placeholder="e.g. 2025" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pgPercentage">Percentage / CGPA *</Label>
                                            <Input id="pgPercentage" name="pgPercentage" value={formData.pgPercentage} onChange={handleInputChange} placeholder="e.g. 80% or 9.0 CGPA" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Course & Batch Details */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Select Batch & Course</h3>

                                <div className="space-y-6 pt-2">
                                    {/* Course Selection */}
                                    <div className="flex items-end gap-3 max-w-xl">
                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="courseId">Course *</Label>
                                            <Select value={formData.courseId} onValueChange={(val) => handleSelectChange('courseId', val)}>
                                                <SelectTrigger className="h-12"><SelectValue placeholder="Select Course" /></SelectTrigger>
                                                <SelectContent>
                                                    {courses.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                    {courses.length === 0 && <SelectItem value="disabled" disabled>No courses available</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                                            onClick={() => setIsAddCourseOpen(true)}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* Batch Selection */}
                                    <div className="flex items-end gap-3 max-w-xl">
                                        <div className="space-y-2 w-full">
                                            <Label htmlFor="batchId">Batch *</Label>
                                            <Select
                                                value={formData.batchId}
                                                onValueChange={(val) => handleSelectChange('batchId', val)}
                                                disabled={!formData.courseId}
                                            >
                                                <SelectTrigger className="h-12"><SelectValue placeholder={formData.courseId ? "Select Batch" : "Select course first"} /></SelectTrigger>
                                                <SelectContent>
                                                    {batches.map(b => (
                                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                    ))}
                                                    {batches.length === 0 && formData.courseId && <SelectItem value="disabled" disabled>No cohorts/batches for this course</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                                            onClick={() => setIsAddBatchOpen(true)}
                                            disabled={!formData.courseId}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Details */}
                    {currentStep === 4 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="totalAmount">Total payment amount</Label>
                                <Input id="totalAmount" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} disabled className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isPartPayment">Part payment *</Label>
                                <Select value={formData.isPartPayment} onValueChange={(val) => handleSelectChange('isPartPayment', val)}>
                                    <SelectTrigger h-12><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label>Do you want to apply coupon ?</Label>
                                <RadioGroup defaultValue={formData.applyCoupon} onValueChange={(val) => handleSelectChange('applyCoupon', val)} className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="c-yes" />
                                        <Label htmlFor="c-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="c-no" />
                                        <Label htmlFor="c-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discountedAmount">Discounted payment amount</Label>
                                <Input id="discountedAmount" name="discountedAmount" value={formData.discountedAmount} onChange={handleInputChange} className="h-12" />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Installment Details */}
                    {currentStep === 5 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="discountedAmountDisplay">Discounted payment amount</Label>
                                    <Input id="discountedAmountDisplay" value={formData.discountedAmount} disabled className="bg-gray-100 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="installments">Number of installments *</Label>
                                    <Select value={String(formData.installments)} onValueChange={(val) => handleSelectChange('installments', val)}>
                                        <SelectTrigger className="h-12"><SelectValue placeholder="Select Count" /></SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 max-w-xl">
                                <Label htmlFor="payFirstInstallmentNow">Are you paying first installment right now ? *</Label>
                                <Select value={formData.payFirstInstallmentNow} onValueChange={(val) => handleSelectChange('payFirstInstallmentNow', val)}>
                                    <SelectTrigger className="h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="due">Due</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dynamic Rows */}
                            <div className="space-y-4">
                                {formData.installmentPlan.map((inst, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg bg-gray-50/50">
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-gray-700">Installment {idx + 1} :</Label>
                                            <Label className="text-xs text-gray-500 block">Installment date *</Label>
                                            <Input type="date" value={inst.date} onChange={(e) => handleInstallmentChange(idx, 'date', e.target.value)} className="h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 block">Payment description *</Label>
                                            <Input placeholder="Description" value={inst.description} onChange={(e) => handleInstallmentChange(idx, 'description', e.target.value)} className="h-10" />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <Label className="text-xs text-gray-500 block">Due payment *</Label>
                                            <Input placeholder="Amount" value={inst.amount} onChange={(e) => handleInstallmentChange(idx, 'amount', e.target.value)} className="h-10" />
                                            <Button variant="ghost" size="sm" className="absolute right-0 bottom-10" disabled>
                                                SAVE
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 6: Review */}
                    {currentStep === 6 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-green-50 p-6 border border-green-200 rounded-lg text-green-800 flex items-start gap-3">
                                <div className="mt-0.5"><FileCheck className="h-5 w-5" /></div>
                                <div>
                                    <p className="font-semibold">All details are ready!</p>
                                    <p className="text-sm opacity-90">Please review the summary below before completing the admission process.</p>
                                </div>
                            </div>

                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6 border rounded-lg bg-gray-50/50">
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</dt>
                                    <dd className="text-sm font-medium text-gray-900">{formData.firstName} {formData.lastName}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</dt>
                                    <dd className="text-sm font-medium text-gray-900">{formData.phone}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {courses.find(c => c.id === formData.courseId)?.name || 'Not selected'}
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Batch</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {batches.find(b => b.id === formData.batchId)?.name || 'Not selected'}
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Fee</dt>
                                    <dd className="text-sm font-medium text-gray-900">₹{formData.totalAmount}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Installments</dt>
                                    <dd className="text-sm font-medium text-gray-900">{formData.installments}</dd>
                                </div>
                            </dl>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="w-24 uppercase font-semibold"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={currentStep === steps.length ? handleSubmit : handleNext}
                        disabled={isSubmitting}
                        className="w-28 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-semibold"
                    >
                        {isSubmitting ? 'Saving...' : currentStep === steps.length ? 'Confirm' : 'Next'}
                    </Button>
                </div>
            </div>

            {/* Dialogs for Instant Creation */}
            <AddCourseDialog
                open={isAddCourseOpen}
                onOpenChange={setIsAddCourseOpen}
                formData={newCourseData}
                onChange={setNewCourseData}
                onSubmit={handleAddCourse}
                saving={savingNewCourse}
            />

            <AddBatchDialog
                open={isAddBatchOpen}
                onOpenChange={setIsAddBatchOpen}
                formData={newBatchData}
                courses={courses}
                onChange={setNewBatchData}
                onSubmit={handleAddBatch}
                saving={savingNewBatch}
            />
        </div>
    )
}
