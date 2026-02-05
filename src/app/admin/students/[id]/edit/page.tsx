'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
    Trash2,
    Save,
    ArrowLeft,
    Loader2
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { INDIAN_STATES } from '@/lib/constants'
import { studentService } from '@/lib/services/student.service'
import { toast } from 'sonner'

const steps = [
    { id: 1, title: 'Student Details', description: 'Enter Student Information', icon: User },
    // College details might not be editable or needed for quick edit, but keeping for consistency
    { id: 2, title: 'College Details', description: 'Enter College Information', icon: GraduationCap },
    { id: 3, title: 'Coaching Details', description: 'Enter Coaching Information', icon: BookOpen },
    { id: 4, title: 'Batch Details', description: 'Enter Batch Information', icon: LayoutGrid },
    // Payment details usually handled separately after admission, but keeping structure
]

export default function EditStudentPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        // Step 1: Student Details
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        enrollmentNo: '',
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
        pinCode: '',
        country: 'India',
        gender: '',
        referredBy: '',
        admissionDate: '',

        // Step 2: College Details
        state: '',
        city: '',
        collegeName: '',
        department: '',
        collegeCourse: '',
        semester: '',

        // Step 3: Coaching Details
        courseId: '',

        // Step 4: Batch Details
        batchId: '',
    })

    // Mock Data
    const [courses, setCourses] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        if (id) {
            loadStudentData()
        }
        loadCourses()
    }, [id])

    const loadCourses = async () => {
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) setCourses(data.courses)
        } catch (e) { console.error(e) }
    }

    const loadStudentData = async () => {
        try {
            setIsLoading(true)
            const res = await studentService.getById(id)
            if (res.success && res.data) {
                const s = res.data
                setFormData({
                    firstName: s.firstName || '',
                    lastName: s.lastName || '',
                    email: s.email || '',
                    dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
                    enrollmentNo: s.enrollmentNo || '',
                    phone: s.phone || '',
                    fathersName: s.fathersName || '',
                    mothersName: s.mothersName || '',
                    category: s.category || '',
                    maritalStatus: s.maritalStatus || 'single',
                    fathersPhone: s.fathersPhone || '',
                    address: s.address || '',
                    aadhaarNumber: s.aadhaarNumber || '',
                    alternatePhone: s.alternatePhone || '',
                    addressLine1: s.addressLine1 || '',
                    addressLine2: s.addressLine2 || '',
                    district: s.district || '',
                    pinCode: s.zipCode || '',
                    country: s.country || 'India',
                    gender: s.gender || '',
                    referredBy: '', // Not always present in basic type
                    admissionDate: s.admissionDate ? new Date(s.admissionDate).toISOString().split('T')[0] : '',

                    state: s.state || '',
                    city: s.city || '',
                    collegeName: s.collegeName || '',
                    department: s.department || '',
                    collegeCourse: s.collegeCourse || '',
                    semester: s.semester || '',

                    courseId: s.courseId || '',
                    batchId: s.batchId || '',
                })
            } else {
                toast.error('Failed to load student data')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error loading student')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            setIsSaving(true)
            // @ts-ignore - Partial update
            const res = await studentService.update(id, formData)
            if (res.success) {
                toast.success('Student updated successfully')
                router.push('/admin/students')
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to update student')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error updating student')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden p-6 gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Edit Student</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                {/* Sidebar Steps */}
                <Card className="w-full md:w-64 h-full border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto hidden md:block">
                    <CardContent className="p-6 space-y-8">
                        {steps.map((step) => {
                            const isActive = currentStep === step.id
                            const Icon = step.icon

                            return (
                                <div key={step.id} className="relative flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                        isActive ? "border-indigo-600 text-indigo-600 bg-indigo-50" : "border-gray-300 text-gray-400"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-semibold transition-colors",
                                            isActive ? "text-indigo-600" : "text-gray-500"
                                        )}>
                                            {step.title}
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
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">

                        {/* Step 1: Student Details - Reorganized into 4 Sections */}
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                {/* Section 1: Student Basic Details */}
                                <div className="space-y-4">
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Basic Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="enrollmentNo">Enrollment No</Label>
                                            <Input id="enrollmentNo" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleInputChange} disabled className="bg-gray-100" />
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
                                            <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mothersName">Mother's Name</Label>
                                            <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={handleInputChange} />
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
                                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="alternatePhone">Alternate Number</Label>
                                            <Input id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
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

                        {/* Step 2: College Details */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State name</Label>
                                    <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                        <SelectContent>
                                            {INDIAN_STATES.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City name</Label>
                                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="collegeName">College name</Label>
                                    <Input id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department name</Label>
                                    <Input id="department" name="department" value={formData.department} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="collegeCourse">Course name</Label>
                                    <Input id="collegeCourse" name="collegeCourse" value={formData.collegeCourse} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semester">College semester</Label>
                                    <Input id="semester" name="semester" value={formData.semester} onChange={handleInputChange} />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Coaching Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-2 w-full max-w-xl">
                                    <Label htmlFor="courseId">Course name</Label>
                                    <Select value={formData.courseId} onValueChange={(val) => handleSelectChange('courseId', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                        <SelectContent>
                                            {courses.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Batch Details */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-2 w-full max-w-xl">
                                    <Label htmlFor="batchId">Batch name</Label>
                                    <Select value={formData.batchId} onValueChange={(val) => handleSelectChange('batchId', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="batch-1">Morning Batch A</SelectItem>
                                            <SelectItem value="batch-2">Evening Batch B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (currentStep > 1) setCurrentStep(prev => prev - 1)
                            }}
                            disabled={currentStep === 1}
                            className="w-24 uppercase"
                        >
                            Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="w-24 bg-indigo-600 hover:bg-indigo-700 text-white uppercase"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="w-32 bg-green-600 hover:bg-green-700 text-white uppercase"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
