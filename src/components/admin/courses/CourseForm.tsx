// ============================================
// COURSE FORM COMPONENT
// Reusable form for creating/editing courses
// ============================================

'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'
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
    const handleChange = (field: keyof CourseFormData, value: string) => {
        onChange({ ...formData, [field]: value })
    }

    const isValid = formData.name && formData.fee

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {/* Course Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Course name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter course name"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Course description</Label>
                    <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Enter description"
                    />
                </div>

                {/* Fee */}
                <div className="space-y-2">
                    <Label htmlFor="fee">Course fee *</Label>
                    <Input
                        id="fee"
                        type="number"
                        value={formData.fee}
                        onChange={(e) => handleChange('fee', e.target.value)}
                        placeholder="Enter fee amount"
                    />
                </div>

                {/* Fee Description */}
                <div className="space-y-2">
                    <Label htmlFor="feeDescription">Course fee description</Label>
                    <Input
                        id="feeDescription"
                        value={formData.feeDescription}
                        onChange={(e) => handleChange('feeDescription', e.target.value)}
                        placeholder="Fee details"
                    />
                </div>

                {/* Duration Years */}
                <div className="space-y-2">
                    <Label>Course duration (In year)</Label>
                    <Select
                        value={formData.durationYears}
                        onValueChange={(val) => handleChange('durationYears', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y} Year{y !== 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Duration Months */}
                <div className="space-y-2">
                    <Label>Course duration (In month)</Label>
                    <Select
                        value={formData.durationMonths}
                        onValueChange={(val) => handleChange('durationMonths', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {i} Month{i !== 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Max Installments */}
                <div className="space-y-2 col-span-2">
                    <Label>Max installment *</Label>
                    <Select
                        value={formData.maxInstallments}
                        onValueChange={(val) => handleChange('maxInstallments', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Installments" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 12].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                    {n} Installment{n !== 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status (only in edit mode) */}
                {mode === 'edit' && (
                    <div className="space-y-2 col-span-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status || 'active'}
                            onValueChange={(val) => handleChange('status', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Add Subjects Button */}
                <div className="col-span-2 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto font-medium"
                    >
                        <Plus className="h-4 w-4 mr-1" /> ADD SUBJECTS
                    </Button>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
