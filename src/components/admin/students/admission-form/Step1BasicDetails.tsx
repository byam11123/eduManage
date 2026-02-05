'use client'

import { User, Upload } from 'lucide-react'
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

interface Step1Props {
    formData: StudentAdmissionFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSelectChange: (name: string, value: string) => void
    onDateChange: (name: string, value: string) => void
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onImageRemove: () => void
}

export function Step1BasicDetails({
    formData,
    onChange,
    onSelectChange,
    onDateChange,
    onImageUpload,
    onImageRemove
}: Step1Props) {
    return (
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
                                onChange={onImageUpload}
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
                                onClick={onImageRemove}
                            >
                                Remove Image
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={onChange} placeholder="First name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={onChange} placeholder="Last name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <DateInput id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={(val) => onDateChange('dateOfBirth', val)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(val) => onSelectChange('gender', val)}>
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
                        <Input id="fathersName" name="fathersName" value={formData.fathersName} onChange={onChange} placeholder="Father's / Husband's Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mothersName">Mother's Name</Label>
                        <Input id="mothersName" name="mothersName" value={formData.mothersName} onChange={onChange} placeholder="Mother's Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select value={formData.maritalStatus} onValueChange={(val) => onSelectChange('maritalStatus', val)}>
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
                        <Select value={formData.category} onValueChange={(val) => onSelectChange('category', val)}>
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
                        <Input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={onChange} placeholder="12-digit Aadhaar" maxLength={12} />
                    </div>
                </div>
            </div>

            {/* Section 4: Contact Details */}
            <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={onChange} placeholder="Mobile Number" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alternatePhone">Alternate Number</Label>
                        <Input id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={onChange} placeholder="Alternate Number" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="Email address" />
                    </div>
                </div>
                {/* Address Sub-Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={onChange} placeholder="House No, Street" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={onChange} placeholder="Area, Landmark (Optional)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={onChange} placeholder="City" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" name="district" value={formData.district} onChange={onChange} placeholder="District" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={formData.state} onValueChange={(val) => onSelectChange('state', val)}>
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
                        <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={onChange} placeholder="6-digit PIN" maxLength={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={formData.country} onValueChange={(val) => onSelectChange('country', val)}>
                            <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
