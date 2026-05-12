'use client'

import { User, Upload, Camera, Plus } from 'lucide-react'
import { AddReferrerDialog } from '@/components/admin/referrals/AddReferrerDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DateInput } from '@/components/ui/date-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { INDIAN_STATES } from '@/lib/constants'
import type { StudentAdmissionFormData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useReferrals } from '@/hooks/useReferrals'
import { useEffect } from 'react'

function ReferrerSelect({ value, onValueChange, className }: { value: string; onValueChange: (val: string) => void; className?: string }) {
    const { referrers, fetchAllData, loading } = useReferrals()

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    return (
        <Select 
            value={value} 
            onValueChange={(val) => {
                onValueChange(val)
                // Auto-calculate reward if partner selected
                if (val !== 'none') {
                    const partner = referrers.find(r => r.id === val)
                    if (partner) {
                        const amount = partner.defaultCommissionAmount || 0
                        // Since we can't directly call onChange here easily for another field, 
                        // we rely on the parent component to handle the side effect.
                    }
                }
            }}
        >
            <SelectTrigger className={cn(className, "text-gray-400 font-bold")}>
                <SelectValue placeholder={loading ? "Loading Partners..." : "Select Partner"} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-[300px]">
                <SelectItem value="none" className="rounded-xl py-3 font-bold text-gray-400">None / Clear</SelectItem>
                {referrers.map((ref) => (
                    <SelectItem key={ref.id} value={ref.id} className="rounded-xl py-3 font-bold">
                        {ref.name} ({ref.type.toUpperCase()})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

interface Step1Props {
    formData: StudentAdmissionFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSelectChange: (name: string, value: string) => void
    onDateChange: (name: string, value: string) => void
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onImageRemove: () => void
    isAddReferrerOpen?: boolean
    setIsAddReferrerOpen?: (open: boolean) => void
}

export function Step1BasicDetails({
    formData,
    onChange,
    onSelectChange,
    onDateChange,
    onImageUpload,
    onImageRemove,
    isAddReferrerOpen = false,
    setIsAddReferrerOpen = () => { }
}: Step1Props) {
    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-12">
            {/* Section 1: Student Basic Details */}
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    Student Details
                </h3>

                {/* Image Upload & Preview */}
                <div className="flex flex-col md:flex-row items-center gap-10 bg-gray-50/50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-[2.5rem] border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Student" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-16 w-16 text-gray-300" />
                            )}
                        </div>
                        <label htmlFor="student-image" className="absolute -bottom-2 -right-2 h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-900 cursor-pointer hover:bg-indigo-700 transition-all shadow-xl hover:scale-110 active:scale-90">
                            <Camera className="h-5 w-5 text-white" />
                            <input
                                id="student-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onImageUpload}
                            />
                        </label>
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h4 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Student Photo</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Upload a student profile picture.<br />
                            Max 2MB • JPG, PNG, WEBP
                        </p>
                        {formData.imageUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-black uppercase tracking-widest text-[10px] mt-2"
                                onClick={onImageRemove}
                            >
                                Remove Photo
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className={labelClasses}>First Name *</Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={onChange} placeholder="First Name" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className={labelClasses}>Last Name</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={onChange} placeholder="Last Name" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</Label>
                        <DateInput id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(val) => onDateChange('dateOfBirth', val)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender" className={labelClasses}>Gender</Label>
                        <Select value={formData.gender} onValueChange={(val) => onSelectChange('gender', val)}>
                            <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                <SelectItem value="male" className="rounded-xl py-3 font-bold">Male</SelectItem>
                                <SelectItem value="female" className="rounded-xl py-3 font-bold">Female</SelectItem>
                                <SelectItem value="other" className="rounded-xl py-3 font-bold">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 2: Family Details */}
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Family Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="fathersName" className={labelClasses}>Father / Guardian Name</Label>
                        <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={onChange} placeholder="Enter Full Name" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mothersName" className={labelClasses}>Mother Name</Label>
                        <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={onChange} placeholder="Enter Full Name" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus" className={labelClasses}>Marital Status</Label>
                        <Select value={formData.maritalStatus} onValueChange={(val) => onSelectChange('maritalStatus', val)}>
                            <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select Status" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                <SelectItem value="single" className="rounded-xl py-3 font-bold">Single</SelectItem>
                                <SelectItem value="married" className="rounded-xl py-3 font-bold">Married</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 3: Category & ID */}
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Category & ID
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="category" className={labelClasses}>Category</Label>
                        <Select value={formData.category} onValueChange={(val) => onSelectChange('category', val)}>
                            <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select Category" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                <SelectItem value="general" className="rounded-xl py-3 font-bold">General</SelectItem>
                                <SelectItem value="obc" className="rounded-xl py-3 font-bold">OBC</SelectItem>
                                <SelectItem value="sc" className="rounded-xl py-3 font-bold">SC</SelectItem>
                                <SelectItem value="st" className="rounded-xl py-3 font-bold">ST</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaarNumber" className={labelClasses}>Aadhaar Number</Label>
                        <Input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={onChange} placeholder="XXXX XXXX XXXX" maxLength={12} className={inputClasses} />
                    </div>
                </div>
            </div>

            {/* Section 4: Contact Details */}
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Communication Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="phone" className={labelClasses}>Mobile Number *</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alternatePhone" className={labelClasses}>Alternative Number</Label>
                        <Input id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={onChange} placeholder="Emergency Contact" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className={labelClasses}>Email Address</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="student@example.com" className={inputClasses} />
                    </div>
                </div>

                {/* Referral Source Section */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                    <h3 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Referral Source
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label htmlFor="referrerId" className={labelClasses}>Referral Partner (Registered)</Label>
                            <div className="flex gap-4">
                                <ReferrerSelect 
                                    value={formData.referrerId} 
                                    onValueChange={(val) => onSelectChange('referrerId', val)} 
                                    className={cn(inputClasses, "flex-1")}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-14 w-14 rounded-2xl border-2 border-indigo-600/20 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90"
                                    onClick={() => setIsAddReferrerOpen(true)}
                                >
                                    <Plus className="h-6 w-6" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">
                                Select or add a registered partner
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="referralAmount" className={labelClasses}>Reward Amount (₹)</Label>
                            <Input 
                                id="referralAmount" 
                                name="referralAmount" 
                                type="number"
                                value={formData.referralAmount} 
                                onChange={onChange} 
                                placeholder="0.00" 
                                className={inputClasses} 
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">
                                Reward to be paid to the partner
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instant Referrer Creation */}
                <AddReferrerDialog
                    isOpen={isAddReferrerOpen}
                    onClose={() => setIsAddReferrerOpen(false)}
                    onSuccess={() => {
                        // Refresh will be handled by ReferrerSelect's useEffect
                    }}
                />
                
                {/* Address Sub-Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="addressLine1" className={labelClasses}>Address Line 1</Label>
                        <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={onChange} placeholder="House / Building No" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addressLine2" className={labelClasses}>Address Line 2</Label>
                        <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={onChange} placeholder="Street / Area / Landmark" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className={labelClasses}>City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={onChange} placeholder="Enter City" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="district" className={labelClasses}>District</Label>
                        <Input id="district" name="district" value={formData.district} onChange={onChange} placeholder="Enter District" className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state" className={labelClasses}>State</Label>
                        <Select value={formData.state} onValueChange={(val) => onSelectChange('state', val)}>
                            <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select State" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-[300px]">
                                {INDIAN_STATES.map((state) => (
                                    <SelectItem key={state} value={state} className="rounded-xl py-3 font-bold">{state}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pinCode" className={labelClasses}>PIN Code</Label>
                        <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={onChange} placeholder="XXXXXX" maxLength={6} className={inputClasses} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country" className={labelClasses}>Country</Label>
                        <Select value={formData.country} onValueChange={(val) => onSelectChange('country', val)}>
                            <SelectTrigger className={cn(inputClasses, "text-gray-400 font-bold")}><SelectValue placeholder="Select Country" /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                <SelectItem value="India" className="rounded-xl py-3 font-bold">India</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
