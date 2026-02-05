// ============================================
// COURSE FORM COMPONENT
// Reusable form for creating/editing courses
// Organized into 5 clear sections
// ============================================

'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Loader2, Plus, X } from 'lucide-react'
import type { CourseFormData } from '@/lib/types'

interface CourseFormProps {
    formData: CourseFormData
    onChange: (data: CourseFormData) => void
    onSubmit: () => void
    onCancel: () => void
    saving?: boolean
    mode?: 'create' | 'edit'
}

export function CourseForm({
    formData,
    onChange,
    onSubmit,
    onCancel,
    saving = false,
    mode = 'create'
}: CourseFormProps) {
    const [newSubject, setNewSubject] = useState('')

    const handleChange = (field: keyof CourseFormData, value: string | boolean | string[]) => {
        onChange({ ...formData, [field]: value })
    }

    // Use refs to track last known values to avoid overwriting manual edits
    const lastCalculatedRef = useRef({ count: 0, fee: 0, reg: 0 })

    // Update installment amounts array when master fields change
    useEffect(() => {
        const count = parseInt(formData.maxInstallments) || 1
        const totalFee = parseFloat(formData.fee) || 0
        const registrationFee = parseFloat(formData.registrationFee) || 0
        const currentAmounts = formData.installmentAmounts || []

        const masterFieldsChanged =
            count !== lastCalculatedRef.current.count ||
            totalFee !== lastCalculatedRef.current.fee ||
            registrationFee !== lastCalculatedRef.current.reg

        // Also re-calculate if the array is empty but we have a fee
        const isMostlyEmpty = currentAmounts.length === 0 || currentAmounts.every(a => !a || a === '0')

        if (masterFieldsChanged || isMostlyEmpty) {
            let newAmounts: string[] = []

            if (count === 1) {
                newAmounts = [totalFee > 0 ? totalFee.toString() : '']
            } else {
                // Logic per user request:
                // If registration fees is filled -> 1st installment = registration fee
                // Remaining -> divided equally
                // If registration fees NOT filled -> all divide equally (including 1st)

                if (registrationFee > 0) {
                    const remainingBalance = totalFee - registrationFee
                    const remainingCount = count - 1
                    const perInstallment = remainingBalance > 0 ? Math.floor(remainingBalance / remainingCount) : 0
                    const remainder = remainingBalance > 0 ? remainingBalance - (perInstallment * remainingCount) : 0

                    newAmounts = Array.from({ length: count }, (_, i) => {
                        if (i === 0) return registrationFee.toString()
                        // Add remainder to 2nd installment for clean division
                        return (i === 1 ? perInstallment + remainder : perInstallment).toString()
                    })
                } else {
                    // All divide equally
                    const perInstallment = totalFee > 0 ? Math.floor(totalFee / count) : 0
                    const remainder = totalFee > 0 ? totalFee - (perInstallment * count) : 0

                    newAmounts = Array.from({ length: count }, (_, i) => {
                        // Add remainder to 1st installment for clean division
                        return (i === 0 ? perInstallment + remainder : perInstallment).toString()
                    })
                }
            }

            lastCalculatedRef.current = { count, fee: totalFee, reg: registrationFee }

            // Only update if it actually changed to avoid infinite loops
            if (JSON.stringify(newAmounts) !== JSON.stringify(currentAmounts)) {
                handleChange('installmentAmounts', newAmounts)
            }
        }
    }, [formData.maxInstallments, formData.fee, formData.registrationFee])

    const updateInstallmentAmount = (index: number, value: string) => {
        const newAmounts = [...(formData.installmentAmounts || [])]
        newAmounts[index] = value
        handleChange('installmentAmounts', newAmounts)
    }

    const addSubject = () => {
        const subjects = formData.subjects || []
        if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
            handleChange('subjects', [...subjects, newSubject.trim()])
            setNewSubject('')
        }
    }

    const removeSubject = (subject: string) => {
        const subjects = formData.subjects || []
        handleChange('subjects', subjects.filter(s => s !== subject))
    }

    const isValid = formData.name && formData.fee

    const installmentCount = parseInt(formData.maxInstallments) || 1

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Section 1: Basic Course Info */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Basic Course Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Course Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Enter course name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Course Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Enter description"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Course Type</Label>
                        <Select
                            value={formData.courseType}
                            onValueChange={(val) => handleChange('courseType', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="skill">Skill</SelectItem>
                                <SelectItem value="certification">Certification</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Mode</Label>
                        <Select
                            value={formData.mode}
                            onValueChange={(val) => handleChange('mode', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="offline">Offline</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 2: Fee Structure */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Fee Structure</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fee">Total Course Fee *</Label>
                        <Input
                            id="fee"
                            type="number"
                            value={formData.fee}
                            onChange={(e) => handleChange('fee', e.target.value)}
                            placeholder="Enter total fee"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="registrationFee">Registration Fee</Label>
                        <Input
                            id="registrationFee"
                            type="number"
                            value={formData.registrationFee}
                            onChange={(e) => handleChange('registrationFee', e.target.value)}
                            placeholder="One-time registration fee"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Installments</Label>
                        <Select
                            value={formData.maxInstallments}
                            onValueChange={(val) => handleChange('maxInstallments', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Installments" /></SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                    <SelectItem key={n} value={n.toString()}>
                                        {n} Installment{n !== 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="discountAllowed">Discount Allowed</Label>
                            <Switch
                                id="discountAllowed"
                                checked={formData.discountAllowed}
                                onCheckedChange={(checked) => handleChange('discountAllowed', checked)}
                            />
                        </div>
                        {formData.discountAllowed && (
                            <Input
                                type="number"
                                value={formData.discountPercentage}
                                onChange={(e) => handleChange('discountPercentage', e.target.value)}
                                placeholder="Discount %"
                                max={100}
                            />
                        )}
                    </div>
                </div>

                {/* Dynamic Installment Amount Inputs */}
                {installmentCount > 1 && (
                    <div className="space-y-3 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                        <Label className="text-sm font-medium">Installment Amounts</Label>
                        <p className="text-xs text-gray-500 mb-2">Define custom amount for each installment</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Array.from({ length: installmentCount }).map((_, index) => (
                                <div key={index} className="space-y-1">
                                    <Label className="text-xs text-gray-500">Installment {index + 1}</Label>
                                    <Input
                                        type="number"
                                        value={(formData.installmentAmounts || [])[index] || ''}
                                        onChange={(e) => updateInstallmentAmount(index, e.target.value)}
                                        placeholder={`Amount ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Section 3: Duration Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Duration Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Course Duration (Years)</Label>
                        <Select
                            value={formData.durationYears}
                            onValueChange={(val) => handleChange('durationYears', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Years" /></SelectTrigger>
                            <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y} Year{y !== 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Course Duration (Months)</Label>
                        <Select
                            value={formData.durationMonths}
                            onValueChange={(val) => handleChange('durationMonths', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Months" /></SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <SelectItem key={i} value={i.toString()}>
                                        {i} Month{i !== 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 4: Academic Details */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Academic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Subjects</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                placeholder="Enter subject name"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addSubject}
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                            >
                                <Plus className="h-4 w-4 mr-1" /> ADD
                            </Button>
                        </div>
                        {(formData.subjects?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.subjects?.map((subject) => (
                                    <span
                                        key={subject}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                    >
                                        {subject}
                                        <button
                                            type="button"
                                            onClick={() => removeSubject(subject)}
                                            className="hover:text-indigo-900"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Eligibility</Label>
                        <Select
                            value={formData.eligibility}
                            onValueChange={(val) => handleChange('eligibility', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Minimum Eligibility" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high_school">High School (10th)</SelectItem>
                                <SelectItem value="higher_secondary">Higher Secondary (12th)</SelectItem>
                                <SelectItem value="graduation">Graduation</SelectItem>
                                <SelectItem value="post_graduation">Post Graduation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 5: Status Control */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Status Control</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Course Status</Label>
                        <Select
                            value={formData.status || 'active'}
                            onValueChange={(val) => handleChange('status', val)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
                <Button variant="outline" onClick={onCancel}>
                    CANCEL
                </Button>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={onSubmit}
                    disabled={saving || !isValid}
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {mode === 'create' ? 'SUBMIT' : 'UPDATE'}
                </Button>
            </div>
        </div>
    )
}
