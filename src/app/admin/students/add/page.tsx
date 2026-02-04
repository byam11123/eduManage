'use client'

import { useState } from 'react'
import {
    User,
    GraduationCap,
    BookOpen,
    CreditCard,
    FileCheck,
    ChevronRight,
    Upload,
    Calendar as CalendarIcon,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const steps = [
    { id: 1, title: 'Student Details', description: 'Enter Student Information', icon: User },
    { id: 2, title: 'College Details', description: 'Enter College Information', icon: GraduationCap },
    { id: 3, title: 'Course & Batch', description: 'Enter Course & Batch Information', icon: BookOpen },
    { id: 4, title: 'Payment Details', description: 'Enter Payment Information', icon: CreditCard },
    { id: 5, title: 'Review', description: 'Check Your Filled Details', icon: FileCheck },
]

export default function StudentAdmissionPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
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
        studentImage: null as File | null
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleNext = () => {
        if (currentStep < steps.length) setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1)
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 h-[calc(100vh-4rem)] overflow-hidden">
            {/* Sidebar Steps */}
            <Card className="w-full md:w-64 h-full border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto">
                <CardContent className="p-6 space-y-8">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        const Icon = step.icon

                        return (
                            <div key={step.id} className="relative flex items-center gap-4 group">
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
                                        <ChevronRight className="w-4 h-4 text-white" /> // Checkmark would be better but keeping simple
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-sm font-semibold transition-colors",
                                        isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
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
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of birth</Label>
                                <div className="relative">
                                    <Input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="enrollmentNo">Enrollment number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="enrollmentNo"
                                    name="enrollmentNo"
                                    value={formData.enrollmentNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="123-456-8790"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fathersName">Father's name</Label>
                                <Input
                                    id="fathersName"
                                    name="fathersName"
                                    placeholder="Father's name"
                                    value={formData.fathersName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fathersPhone">Father's phone number</Label>
                                <Input
                                    id="fathersPhone"
                                    name="fathersPhone"
                                    placeholder="123-456-8790"
                                    value={formData.fathersPhone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                {/* Gender dropdown - using native select for simplicity or mock */}
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {/* Empty col for alignment if needed, or Date of Admission */}
                            <div className="space-y-2">
                                <Label htmlFor="admissionDate">Date of admission</Label>
                                <Input
                                    id="admissionDate"
                                    name="admissionDate"
                                    type="date"
                                    value={formData.admissionDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="referredBy">Referred by</Label>
                                <div className="flex gap-2">
                                    <select
                                        id="referredBy"
                                        name="referredBy"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.referredBy}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Referrer</option>
                                        <option value="google">Google</option>
                                        <option value="friend">Friend</option>
                                        <option value="advertisement">Advertisement</option>
                                    </select>
                                    <Button size="icon" variant="ghost" className="shrink-0 bg-indigo-50 text-indigo-600">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>Student Image</Label>
                                <div className="flex items-center gap-2 border rounded-md p-2">
                                    <Button variant="secondary" size="sm">Choose File</Button>
                                    <span className="text-sm text-gray-500">No file chosen</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other steps */}
                    {currentStep > 1 && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Step {currentStep} content goes here...
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="mt-8">
                            <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700 border-transparent">
                                ADD FIELD
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="w-24"
                    >
                        BACK
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="w-24 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {currentStep === steps.length ? 'SUBMIT' : 'NEXT'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
