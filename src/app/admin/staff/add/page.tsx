'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    BadgeCheck,
    Loader2
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
import { cn } from '@/lib/utils'
import { staffService } from '@/lib/services/staff.service'
import { toast } from 'sonner'
import { StaffFormData } from '@/lib/types'

const steps = [
    { id: 1, title: 'Personal info', description: 'Setup information', icon: User },
    { id: 2, title: 'Highest Qualification', description: 'Select highest education', icon: GraduationCap },
    { id: 3, title: 'Education details', description: 'Enter education details', icon: BookOpen },
    { id: 4, title: 'Employee monthly salary', description: 'Enter salary details', icon: Banknote },
    { id: 5, title: 'Bank details', description: 'Enter bank details', icon: CreditCard },
    { id: 6, title: 'Review details', description: 'Check Filled Details', icon: BadgeCheck },
]

export default function AddStaffPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<StaffFormData>({
        // Personal
        firstName: '',
        lastName: '',
        employeeCode: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        fathersName: '',
        fathersPhone: '',
        address: '',
        department: '',
        dateOfJoining: '',

        // Qualification
        highestQualification: '',

        // Education
        education: [], // simplified for now

        // Additional
        experienceYears: '',
        skills: '',
        referredBy: '',

        // Salary
        salaryType: 'fixed',
        salaryAmount: '',

        // Bank
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.firstName && formData.phone && formData.email
            default:
                return true
        }
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1)
        } else {
            toast.error('Please fill required fields (marked *)')
        }
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            const res = await staffService.create(formData)
            if (res.success) {
                toast.success('Staff added successfully')
                router.push('/admin/staff')
            } else {
                toast.error(res.error || 'Failed to create staff')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error submitting form')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Add New Staff</h1>

            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
                {/* Sidebar Navigation */}
                <Card className="w-full md:w-80 border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto">
                    <CardContent className="p-6 space-y-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "relative flex items-center gap-4 transition-all duration-200",
                                        isActive || isCompleted ? "opacity-100" : "opacity-50"
                                    )}
                                >
                                    {/* Connecting Line */}
                                    {index !== steps.length - 1 && (
                                        <div className={cn(
                                            "absolute left-[15px] top-10 w-[2px] h-[30px]",
                                            isCompleted ? "bg-indigo-600" : "bg-gray-200"
                                        )} />
                                    )}

                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white dark:bg-gray-800",
                                        isActive ? "border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]" :
                                            isCompleted ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-400"
                                    )}>
                                        {isCompleted ? <FileCheck className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-semibold transition-colors",
                                            isActive ? "text-indigo-600" : "text-gray-700 dark:text-gray-300"
                                        )}>
                                            {step.title}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {step.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Form Content */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label>First name *</Label>
                                    <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last name</Label>
                                    <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Employee code</Label>
                                    <Input name="employeeCode" value={formData.employeeCode} onChange={handleInputChange} placeholder="EMP-001" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone number *</Label>
                                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of birth *</Label>
                                    <Input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Father/Guardian name</Label>
                                    <Input name="fathersName" value={formData.fathersName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Father/Guardian phone</Label>
                                    <Input name="fathersPhone" value={formData.fathersPhone} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Address</Label>
                                    <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full residential address" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of joining</Label>
                                    <Input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select onValueChange={(val) => handleSelectChange('gender', val)} value={formData.gender}>
                                        <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Select onValueChange={(val) => handleSelectChange('department', val)} value={formData.department}>
                                        <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Teaching">Teaching</SelectItem>
                                            <SelectItem value="Management">Management</SelectItem>
                                            <SelectItem value="Support">Support</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Highest Qualification */}
                        {currentStep === 2 && (
                            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2 w-full md:w-1/2">
                                    <Label>Highest Education</Label>
                                    <Select onValueChange={(val) => handleSelectChange('highestQualification', val)} value={formData.highestQualification}>
                                        <SelectTrigger><SelectValue placeholder="Select Qualification" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="phd">PhD</SelectItem>
                                            <SelectItem value="masters">Masters</SelectItem>
                                            <SelectItem value="bachelors">Bachelors</SelectItem>
                                            <SelectItem value="diploma">Diploma</SelectItem>
                                            <SelectItem value="high_school">High School</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Education Details */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* High School */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50/50">
                                    <h3 className="col-span-2 font-medium text-gray-700">High School Details</h3>
                                    <Input placeholder="School Name" />
                                    <Input placeholder="Percentage %" />
                                    <Input placeholder="Board" />
                                    <Input placeholder="Passing Year" />
                                    <Button variant="outline" className="w-full gap-2 text-indigo-600 border-indigo-200 bg-indigo-50">
                                        <Upload className="w-4 h-4" /> Upload Certificate
                                    </Button>
                                    <Button variant="ghost" className="text-red-500">Remove</Button>
                                </div>

                                {/* Intermediate */}
                                <div className="flex justify-center">
                                    <Button variant="dashed" className="gap-2 border-dashed border-2 w-full max-w-sm">
                                        <Plus className="w-4 h-4" /> Add More Education
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Salary */}
                        {currentStep === 4 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label>Salary Type</Label>
                                    <Select onValueChange={(val) => handleSelectChange('salaryType', val)} value={formData.salaryType}>
                                        <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed Salary</SelectItem>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input name="salaryAmount" value={formData.salaryAmount} onChange={handleInputChange} placeholder="25000" />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Bank Details */}
                        {currentStep === 5 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label>Bank Name *</Label>
                                    <Input name="bankName" value={formData.bankName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Number *</Label>
                                    <Input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Account Number *</Label>
                                    <Input name="confirmAccountNumber" value={formData.confirmAccountNumber} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>IFSC Code *</Label>
                                    <Input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} />
                                </div>
                            </div>
                        )}

                        {/* Step 6: Review */}
                        {currentStep === 6 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                                    <h3 className="font-semibold mb-4 text-lg">Personal Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Name</div>
                                            <div className="font-medium">{formData.firstName} {formData.lastName}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Phone</div>
                                            <div className="font-medium">{formData.phone}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Email</div>
                                            <div className="font-medium">{formData.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                                    <h3 className="font-semibold mb-4 text-lg">Financial Details</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Salary</div>
                                            <div className="font-medium">₹{formData.salaryAmount} ({formData.salaryType})</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Bank</div>
                                            <div className="font-medium">{formData.bankName}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Account</div>
                                            <div className="font-medium">{formData.accountNumber}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between bg-gray-50/30">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(prev => prev - 1)}
                            disabled={currentStep === 1}
                            className="w-32 uppercase tracking-wide font-semibold"
                        >
                            Back
                        </Button>

                        {currentStep < steps.length ? (
                            <Button
                                onClick={handleNext}
                                className="w-32 bg-indigo-600 hover:bg-indigo-700 uppercase tracking-wide font-semibold shadow-lg shadow-indigo-200"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-40 bg-emerald-600 hover:bg-emerald-700 uppercase tracking-wide font-semibold shadow-lg shadow-emerald-200"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Submit Staff'
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
