'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
    User,
    GraduationCap,
    BookOpen,
    CreditCard,
    ChevronRight,
    Upload,
    Calendar as CalendarIcon,
    Plus,
    LayoutGrid,
    Banknote,
    BadgeCheck,
    Loader2,
    Briefcase,
    Building2,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    Camera
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
import { cn } from '@/lib/utils'
import { staffService } from '@/lib/services/staff.service'
import { toast } from 'sonner'
import { StaffFormData } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { CreatableSuggestionInput } from '@/components/shared/creatable-suggestion-input'

const steps = [
    { id: 1, title: 'Personal info', description: 'Setup information', icon: User, color: 'indigo' },
    { id: 2, title: 'Academic Qualifications', description: 'Education history', icon: GraduationCap, color: 'emerald' },
    { id: 3, title: 'Professional Details', description: 'Experience & Skills', icon: Briefcase, color: 'amber' },
    { id: 4, title: 'Salary details', description: 'Monthly remuneration', icon: Banknote, color: 'blue' },
    { id: 5, title: 'Bank details', description: 'Bank account info', icon: CreditCard, color: 'rose' },
    { id: 6, title: 'Review details', description: 'Check filled details', icon: BadgeCheck, color: 'violet' },
]

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState<StaffFormData>({
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
        designation: '',
        dateOfJoining: '',
        highestQualification: '',
        education: [],
        experienceYears: '',
        skills: '',
        referredBy: '',
        salaryType: 'fixed',
        salaryAmount: '',
        bankName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        imageUrl: '',
        status: 'active',
        // Academic Details
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
        pgPercentage: ''
    })

    useEffect(() => {
        const loadStaff = async () => {
            try {
                const res = await staffService.getById(resolvedParams.id)
                if (res.success && res.data) {
                    const s = res.data as any
                    setFormData({
                        firstName: s.firstName || s.fullName.split(' ')[0],
                        lastName: s.lastName || s.fullName.split(' ').slice(1).join(' '),
                        employeeCode: s.employeeCode || '',
                        phone: s.phone || '',
                        email: s.email || '',
                        dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
                        gender: s.gender || '',
                        fathersName: s.fathersName || '',
                        fathersPhone: s.fathersPhone || '',
                        address: s.address || '',
                        department: s.department || '',
                        designation: s.designation || '',
                        dateOfJoining: s.dateOfJoining ? new Date(s.dateOfJoining).toISOString().split('T')[0] : '',
                        highestQualification: s.highestQualification || '',
                        education: s.education || [],
                        experienceYears: s.experienceYears?.toString() || '',
                        skills: s.skills || '',
                        referredBy: s.referredBy || '',
                        salaryType: s.salaryType || 'fixed',
                        salaryAmount: s.salaryAmount?.toString() || '',
                        bankName: s.bankName || s.bankDetails?.bankName || '',
                        accountNumber: s.accountNumber || s.bankDetails?.accountNumber || '',
                        confirmAccountNumber: s.accountNumber || s.bankDetails?.accountNumber || '',
                        ifscCode: s.ifscCode || s.bankDetails?.ifscCode || '',
                        imageUrl: s.profileImage || s.image || '',
                        status: s.status || 'active',
                        // Academic Details
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
                        pgPercentage: s.pgPercentage || ''
                    })
                } else {
                    toast.error('Staff member not found')
                    router.push('/admin/staff')
                }
            } catch (error) {
                toast.error('Error loading staff details')
                router.push('/admin/staff')
            } finally {
                setLoading(false)
            }
        }
        loadStaff()
    }, [resolvedParams.id, router])

    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-400"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block ml-1"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-10 flex items-center gap-3"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
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

    const validateAllFields = () => {
        const missingFields = []
        if (!formData.firstName) missingFields.push('First Name')
        if (!formData.phone) missingFields.push('Phone Number')
        if (!formData.email) missingFields.push('Email')
        
        return missingFields
    }

    const handleNext = () => {
        setCurrentStep(prev => prev + 1)
    }

    const handleSubmit = async () => {
        const missingFields = validateAllFields()
        
        if (missingFields.length > 0) {
            toast.error(`Please fill required fields: ${missingFields.join(', ')}`)
            if (!formData.firstName || !formData.phone || !formData.email) setCurrentStep(1)
            return
        }

        try {
            setIsSubmitting(true)
            const res = await staffService.update(resolvedParams.id, formData as any)
            if (res.success) {
                toast.success('Staff updated successfully')
                router.push(`/admin/staff/${resolvedParams.id}`)
            } else {
                toast.error(res.error || 'Failed to update staff')
            }
        } catch (error) {
            toast.error('Error updating staff')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-gray-950">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 p-6 md:p-10 lg:p-12 space-y-10 animate-in fade-in duration-1000">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
                <div className="space-y-3">
                    <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent text-gray-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest gap-2 transition-all group"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Profile
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Edit Staff</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Personnel Management</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="h-12 rounded-2xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 font-black uppercase tracking-widest text-[10px] text-gray-500">
                        EMP ID: {formData.employeeCode || 'PENDING'}
                    </Badge>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
                
                {/* Stepper Sidebar */}
                <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-12 z-20">
                    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white dark:border-gray-800 rounded-[2.5rem] p-6 shadow-2xl shadow-gray-200/50 dark:shadow-none space-y-2">
                        {steps.map((step) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative text-left",
                                        isActive ? "bg-white dark:bg-gray-800 shadow-xl shadow-indigo-100 dark:shadow-none lg:translate-x-2" : "hover:bg-white/50 dark:hover:bg-gray-800/30"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-full animate-in slide-in-from-left duration-500" />
                                    )}
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
                                        isActive ? `bg-indigo-600 text-white shadow-lg shadow-indigo-500/30` : 
                                        isCompleted ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-widest leading-none mb-1 transition-colors truncate",
                                            isActive ? "text-gray-900 dark:text-white" : "text-gray-400"
                                        )}>
                                            {step.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate">{step.description}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Form Panels */}
                <div className="lg:col-span-9 space-y-8 relative z-10">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                        <CardContent className="p-10 md:p-14 min-h-[600px] flex flex-col">
                            
                            {/* Step 1: Personal info */}
                            {currentStep === 1 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                                        Personal info
                                    </h3>

                                    {/* Photo Upload Section */}
                                    <div className="flex flex-col md:flex-row items-center gap-10 bg-gray-50/50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                                        <div className="relative group">
                                            <div className="h-40 w-40 rounded-[2.5rem] border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                                {formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="Staff" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-16 w-16 text-gray-300" />
                                                )}
                                            </div>
                                            <label htmlFor="staff-image" className="absolute -bottom-2 -right-2 h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-900 cursor-pointer hover:bg-indigo-700 transition-all shadow-xl hover:scale-110 active:scale-90">
                                                <Camera className="h-5 w-5 text-white" />
                                                <input
                                                    id="staff-image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-3 text-center md:text-left">
                                            <h4 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Staff Photo</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                                Update staff profile picture.<br />
                                                Max 2MB • JPG, PNG, WEBP
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>First name *</Label>
                                            <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Last name</Label>
                                            <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Employee code</Label>
                                            <Input name="employeeCode" value={formData.employeeCode} onChange={handleInputChange} placeholder="Auto-generated on Submit" className={cn(inputClasses, "bg-gray-100/50 cursor-not-allowed opacity-70")} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Phone number *</Label>
                                            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Email *</Label>
                                            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Date of birth *</Label>
                                            <DateInput name="dateOfBirth" value={formData.dateOfBirth} onChange={(val) => handleSelectChange('dateOfBirth', val)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Gender *</Label>
                                            <Select onValueChange={(val) => handleSelectChange('gender', val)} value={formData.gender}>
                                                <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                    <SelectItem value="male" className="rounded-xl py-3 font-bold">Male</SelectItem>
                                                    <SelectItem value="female" className="rounded-xl py-3 font-bold">Female</SelectItem>
                                                    <SelectItem value="other" className="rounded-xl py-3 font-bold">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Father's name</Label>
                                            <Input name="fathersName" value={formData.fathersName} onChange={handleInputChange} placeholder="Father's full name" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Father's phone</Label>
                                            <Input name="fathersPhone" value={formData.fathersPhone} onChange={handleInputChange} placeholder="+91 98765 43210" className={inputClasses} />
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4">
                                        <Label className={labelClasses}>Address</Label>
                                        <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full residential address" className="min-h-[120px] rounded-[2rem] bg-gray-50 dark:bg-gray-900 border-none font-bold p-8 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Academic Qualifications */}
                            {currentStep === 2 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Academic Qualifications
                                    </h3>
                                    
                                    <div className="space-y-4 max-w-md bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                                        <Label className={labelClasses}>Highest Qualification *</Label>
                                        <Select value={formData.highestQualification} onValueChange={(val) => handleSelectChange('highestQualification', val)}>
                                            <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}><SelectValue placeholder="Select Qualification" /></SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                <SelectItem value="high_school" className="rounded-xl py-3 font-bold">10th Standard</SelectItem>
                                                <SelectItem value="higher_secondary" className="rounded-xl py-3 font-bold">12th Standard</SelectItem>
                                                <SelectItem value="graduation" className="rounded-xl py-3 font-bold">Graduation</SelectItem>
                                                <SelectItem value="post_graduation" className="rounded-xl py-3 font-bold">Post Graduation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-12">
                                        {/* High School (10th) - Show for all qualifications */}
                                        {formData.highestQualification && (
                                            <div className="space-y-8 bg-gray-50/30 dark:bg-gray-900/30 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all duration-500">
                                                <h3 className={sectionHeaderClasses}>
                                                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                                                    10th Details
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>School Name</Label>
                                                        <CreatableSuggestionInput 
                                                            type="school" 
                                                            value={formData.hsSchoolName} 
                                                            onChange={(val) => handleSelectChange('hsSchoolName', val)} 
                                                            placeholder="Select or type School"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Board</Label>
                                                        <CreatableSuggestionInput 
                                                            type="board" 
                                                            value={formData.hsBoard} 
                                                            onChange={(val) => handleSelectChange('hsBoard', val)} 
                                                            placeholder="Select or type Board"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Passing Year</Label>
                                                        <Input name="hsPassingYear" value={formData.hsPassingYear} onChange={handleInputChange} placeholder="YYYY" className={inputClasses} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Percentage / CGPA</Label>
                                                        <Input name="hsPercentage" value={formData.hsPercentage} onChange={handleInputChange} placeholder="e.g. 85%" className={inputClasses} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Higher Secondary (12th) - Show for higher_secondary, graduation, post_graduation */}
                                        {['higher_secondary', 'graduation', 'post_graduation'].includes(formData.highestQualification) && (
                                            <div className="space-y-8 bg-amber-50/30 dark:bg-amber-900/10 p-10 rounded-[2.5rem] border border-amber-100/50 dark:border-amber-900/20 transition-all duration-500">
                                                <h3 className={sectionHeaderClasses}>
                                                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                    12th Details
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>School Name</Label>
                                                        <CreatableSuggestionInput 
                                                            type="school" 
                                                            value={formData.hssSchoolName} 
                                                            onChange={(val) => handleSelectChange('hssSchoolName', val)} 
                                                            placeholder="Select or type School"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Board</Label>
                                                        <CreatableSuggestionInput 
                                                            type="board" 
                                                            value={formData.hssBoard} 
                                                            onChange={(val) => handleSelectChange('hssBoard', val)} 
                                                            placeholder="Select or type Board"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Stream</Label>
                                                        <Select value={formData.hssStream} onValueChange={(val) => handleSelectChange('hssStream', val)}>
                                                            <SelectTrigger className={cn(inputClasses, "bg-white/50 dark:bg-gray-900/50 font-bold shadow-sm")}><SelectValue placeholder="Select Stream" /></SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                                <SelectItem value="science" className="rounded-xl py-3 font-bold">Science</SelectItem>
                                                                <SelectItem value="commerce" className="rounded-xl py-3 font-bold">Commerce</SelectItem>
                                                                <SelectItem value="arts" className="rounded-xl py-3 font-bold">Arts / Humanities</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Passing Year</Label>
                                                        <Input name="hssPassingYear" value={formData.hssPassingYear} onChange={handleInputChange} placeholder="YYYY" className={inputClasses} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Percentage</Label>
                                                        <Input name="hssPercentage" value={formData.hssPercentage} onChange={handleInputChange} placeholder="e.g. 85%" className={inputClasses} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Graduation - Show for graduation, post_graduation */}
                                        {['graduation', 'post_graduation'].includes(formData.highestQualification) && (
                                            <div className="space-y-8 bg-blue-50/30 dark:bg-blue-900/10 p-10 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-900/20 transition-all duration-500">
                                                <h3 className={sectionHeaderClasses}>
                                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                    Graduation Details
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>College Name</Label>
                                                        <CreatableSuggestionInput 
                                                            type="college" 
                                                            value={formData.gradCollegeName} 
                                                            onChange={(val) => handleSelectChange('gradCollegeName', val)} 
                                                            placeholder="Select or type College"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>University</Label>
                                                        <CreatableSuggestionInput 
                                                            type="university" 
                                                            value={formData.gradUniversity} 
                                                            onChange={(val) => handleSelectChange('gradUniversity', val)} 
                                                            placeholder="Select or type University"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Degree</Label>
                                                        <CreatableSuggestionInput 
                                                            type="degree" 
                                                            value={formData.gradDegree} 
                                                            onChange={(val) => handleSelectChange('gradDegree', val)} 
                                                            placeholder="e.g. BSc, BCom, BTech"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Passing Year</Label>
                                                        <Input name="gradPassingYear" value={formData.gradPassingYear} onChange={handleInputChange} placeholder="YYYY" className={inputClasses} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Percentage / CGPA</Label>
                                                        <Input name="gradPercentage" value={formData.gradPercentage} onChange={handleInputChange} placeholder="e.g. 8.5 CGPA" className={inputClasses} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Post Graduation - Show only for post_graduation */}
                                        {formData.highestQualification === 'post_graduation' && (
                                            <div className="space-y-8 bg-purple-50/30 dark:bg-purple-900/10 p-10 rounded-[2.5rem] border border-purple-100/50 dark:border-purple-900/20 transition-all duration-500">
                                                <h3 className={sectionHeaderClasses}>
                                                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                                                    Post Graduation Details
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>College Name</Label>
                                                        <CreatableSuggestionInput 
                                                            type="college" 
                                                            value={formData.pgCollegeName} 
                                                            onChange={(val) => handleSelectChange('pgCollegeName', val)} 
                                                            placeholder="Select or type College"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>University</Label>
                                                        <CreatableSuggestionInput 
                                                            type="university" 
                                                            value={formData.pgUniversity} 
                                                            onChange={(val) => handleSelectChange('pgUniversity', val)} 
                                                            placeholder="Select or type University"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Degree</Label>
                                                        <CreatableSuggestionInput 
                                                            type="degree" 
                                                            value={formData.pgDegree} 
                                                            onChange={(val) => handleSelectChange('pgDegree', val)} 
                                                            placeholder="e.g. MSc, MCom, MTech"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Passing Year</Label>
                                                        <Input name="pgPassingYear" value={formData.pgPassingYear} onChange={handleInputChange} placeholder="YYYY" className={inputClasses} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className={labelClasses}>Percentage / CGPA</Label>
                                                        <Input name="pgPercentage" value={formData.pgPercentage} onChange={handleInputChange} placeholder="e.g. 8.5 CGPA" className={inputClasses} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Professional Details */}
                            {currentStep === 3 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                        Professional Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Department</Label>
                                            <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Computer Science" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Designation</Label>
                                            <Input name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Senior Teacher, HOD" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Date of joining</Label>
                                            <DateInput name="dateOfJoining" value={formData.dateOfJoining} onChange={(val) => handleSelectChange('dateOfJoining', val)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Total Experience (Years)</Label>
                                            <Input name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} placeholder="e.g. 5" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Referred By</Label>
                                            <Input name="referredBy" value={formData.referredBy} onChange={handleInputChange} placeholder="Employee name or ID" className={inputClasses} />
                                        </div>
                                        <div className="col-span-2 space-y-2 pt-4">
                                            <Label className={labelClasses}>Skills</Label>
                                            <Textarea name="skills" value={formData.skills} onChange={handleInputChange} placeholder="Teaching, Management, Data Analysis..." className="min-h-[120px] rounded-[2rem] bg-gray-50 dark:bg-gray-900 border-none font-bold p-8 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Salary details */}
                            {currentStep === 4 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        Salary Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Salary Type</Label>
                                            <Select onValueChange={(val) => handleSelectChange('salaryType', val)} value={formData.salaryType}>
                                                <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select Type" /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                    <SelectItem value="fixed" className="rounded-xl py-3 font-bold">Fixed Salary</SelectItem>
                                                    <SelectItem value="hourly" className="rounded-xl py-3 font-bold">Hourly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Amount</Label>
                                            <Input name="salaryAmount" value={formData.salaryAmount} onChange={handleInputChange} placeholder="25000" className={inputClasses} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Bank details */}
                            {currentStep === 5 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                                        Bank Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Bank name</Label>
                                            <Input name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Bank Name" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>IFSC code</Label>
                                            <Input name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} placeholder="IFSC Code" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Account number</Label>
                                            <Input name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Account Number" className={inputClasses} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Confirm account number</Label>
                                            <Input name="confirmAccountNumber" value={formData.confirmAccountNumber} onChange={handleInputChange} placeholder="Confirm Account Number" className={inputClasses} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Review details */}
                            {currentStep === 6 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className={sectionHeaderClasses}>
                                        <span className="h-2 w-2 rounded-full bg-violet-600" />
                                        Review details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 space-y-6">
                                            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg overflow-hidden">
                                                    {formData.imageUrl ? (
                                                        <img src={formData.imageUrl} alt="Avatar" className="h-full w-full object-cover" />
                                                    ) : (
                                                        formData.firstName[0]
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xl">{formData.firstName} {formData.lastName}</h4>
                                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{formData.department || 'Staff'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 text-sm font-bold">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Employee code</span>
                                                    <span>{formData.employeeCode}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Phone number</span>
                                                    <span>{formData.phone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Email</span>
                                                    <span className="lowercase">{formData.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Highest Qualification</span>
                                                    <span className="capitalize">{formData.highestQualification?.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Gender</span>
                                                    <span className="capitalize">{formData.gender || 'Not Specified'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Experience</span>
                                                    <span>{formData.experienceYears} Years</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400 uppercase tracking-widest text-[10px]">Referred By</span>
                                                    <span>{formData.referredBy || 'Direct'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white space-y-6 shadow-2xl shadow-gray-900/20">
                                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                                <h4 className="font-black text-xl tracking-tight">Financial Status</h4>
                                                <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-widest">VERIFIED</Badge>
                                            </div>
                                            <div className="space-y-4 font-bold">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-white/40 uppercase tracking-widest text-[10px]">Salary Amount</span>
                                                    <span className="text-3xl font-black tracking-tighter">₹{Number(formData.salaryAmount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/40 uppercase tracking-widest text-[10px]">Bank name</span>
                                                    <span>{formData.bankName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-white/40 uppercase tracking-widest text-[10px]">Account number</span>
                                                    <span>{formData.accountNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="mt-auto pt-14 flex items-center justify-between border-t border-gray-50 dark:border-gray-800">
                                <Button
                                    variant="ghost"
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    disabled={currentStep === 1}
                                    className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-indigo-600 transition-all disabled:opacity-20"
                                >
                                    Back
                                </Button>
                                
                                {currentStep < steps.length ? (
                                    <Button
                                        onClick={handleNext}
                                        className="h-14 rounded-2xl px-12 bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 font-black uppercase tracking-widest text-[10px] text-white gap-3 transition-all"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="h-14 rounded-2xl px-12 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-500/30 font-black uppercase tracking-widest text-[10px] text-white gap-3 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                Update Staff
                                                <Sparkles className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
