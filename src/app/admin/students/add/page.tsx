'use client'

import { useState, useEffect } from 'react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const steps = [
    { id: 1, title: 'Student Details', description: 'Enter Student Information', icon: User },
    { id: 2, title: 'College Details', description: 'Enter College Information', icon: GraduationCap },
    { id: 3, title: 'Coaching Details', description: 'Enter Coaching Information', icon: BookOpen },
    { id: 4, title: 'Batch Details', description: 'Enter Batch Information', icon: LayoutGrid },
    { id: 5, title: 'Payment Details', description: 'Enter Payment Information', icon: CreditCard },
    { id: 6, title: 'Installment Details', description: 'Enter Installment Information', icon: Banknote },
    { id: 7, title: 'Review Details', description: 'Check your Filled Details', icon: FileCheck },
]

export default function StudentAdmissionPage() {
    const [currentStep, setCurrentStep] = useState(1)

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
        fathersPhone: '',
        address: '',
        gender: '',
        referredBy: '',
        admissionDate: '',
        studentImage: null as File | null,

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

    // Mock Data
    const [courses, setCourses] = useState<{ id: string, name: string }[]>([])
    const [batches, setBatches] = useState<{ id: string, name: string }[]>([])

    useEffect(() => {
        // Fetch courses on mount
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses')
                const data = await res.json()
                if (data.success) setCourses(data.courses)
            } catch (e) { console.error(e) }
        }
        fetchCourses()
    }, [])

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

                    {/* Step 1: Student Details */}
                    {currentStep === 1 && (
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
                                <Label htmlFor="enrollmentNo">Enrollment No <span className="text-red-500">*</span></Label>
                                <Input id="enrollmentNo" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="123-456-7890" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" />
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
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" name="address" value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} placeholder="Address" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: College Details */}
                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="state">State name *</Label>
                                <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="California">California</SelectItem>
                                        <SelectItem value="Texas">Texas</SelectItem>
                                        <SelectItem value="New York">New York</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City name *</Label>
                                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="collegeName">College name *</Label>
                                <Input id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleInputChange} placeholder="College name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department name *</Label>
                                <Input id="department" name="department" value={formData.department} onChange={handleInputChange} placeholder="Department name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="collegeCourse">Course name *</Label>
                                <Input id="collegeCourse" name="collegeCourse" value={formData.collegeCourse} onChange={handleInputChange} placeholder="e.g. B.Tech" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="semester">College semester *</Label>
                                <Input id="semester" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="e.g. 4th Semester" />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Coaching Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-end gap-3 max-w-xl">
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="courseId">Course name *</Label>
                                    <Select value={formData.courseId} onValueChange={(val) => handleSelectChange('courseId', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                                        <SelectContent>
                                            {courses.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                            {courses.length === 0 && <SelectItem value="disabled" disabled>No courses available</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="button" size="icon" className="bg-indigo-600 mb-0.5"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Batch Details */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-end gap-3 max-w-xl">
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="batchId">Batch name *</Label>
                                    <Select value={formData.batchId} onValueChange={(val) => handleSelectChange('batchId', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Batch" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="batch-1">Morning Batch A</SelectItem>
                                            <SelectItem value="batch-2">Evening Batch B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="button" size="icon" className="bg-indigo-600 mb-0.5"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Payment Details */}
                    {currentStep === 5 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="totalAmount">Total payment amount</Label>
                                <Input id="totalAmount" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} disabled className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isPartPayment">Part payment *</Label>
                                <Select value={formData.isPartPayment} onValueChange={(val) => handleSelectChange('isPartPayment', val)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                                <Input id="discountedAmount" name="discountedAmount" value={formData.discountedAmount} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    {/* Step 6: Installment Details */}
                    {currentStep === 6 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="discountedAmountDisplay">Discounted payment amount</Label>
                                    <Input id="discountedAmountDisplay" value={formData.discountedAmount} disabled className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="installments">Number of installments *</Label>
                                    <Select value={String(formData.installments)} onValueChange={(val) => handleSelectChange('installments', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Count" /></SelectTrigger>
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
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                                            <Input type="date" value={inst.date} onChange={(e) => handleInstallmentChange(idx, 'date', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-500 block">Payment description *</Label>
                                            <Input placeholder="Description" value={inst.description} onChange={(e) => handleInstallmentChange(idx, 'description', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <Label className="text-xs text-gray-500 block">Due payment *</Label>
                                            <Input placeholder="Amount" value={inst.amount} onChange={(e) => handleInstallmentChange(idx, 'amount', e.target.value)} />
                                            <Button variant="ghost" size="sm" className="absolute right-0 bottom-10" disabled>
                                                SAVE
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 7: Review */}
                    {currentStep === 7 && (
                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 border border-green-200 rounded text-green-800">
                                Please review the details before submitting.
                            </div>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formData.firstName} {formData.lastName}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Course</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {courses.find(c => c.id === formData.courseId)?.name || formData.courseId}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Fee</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formData.totalAmount}</dd>
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
                        className="w-24 uppercase"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="w-24 bg-indigo-600 hover:bg-indigo-700 text-white uppercase"
                    >
                        {currentStep === steps.length ? 'Submit' : 'Next'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
