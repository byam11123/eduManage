// ============================================
// BATCH FORM COMPONENT
// Reusable form for creating and editing batches
// ============================================

'use client'

import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import type { BatchFormData, Course } from '@/lib/types'

interface BatchFormProps {
    formData: BatchFormData
    courses: Course[]
    onChange: (data: BatchFormData) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    saving?: boolean
    mode?: 'create' | 'edit'
}

export function BatchForm({
    formData,
    courses,
    onChange,
    onSubmit,
    onCancel,
    saving,
    mode = 'create'
}: BatchFormProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        onChange({ ...formData, [name]: value })
    }

    const handleSelectChange = (name: string, value: string) => {
        onChange({ ...formData, [name]: value })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                    <Label htmlFor="name">Batch name *</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="MORNING BATCH"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Batch description</Label>
                    <Input
                        id="description"
                        name="description"
                        placeholder="CORELDRAW"
                        value={formData.description || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <Label htmlFor="courseId">Select course *</Label>
                    <Select
                        value={formData.courseId}
                        onValueChange={(val) => handleSelectChange('courseId', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map(course => (
                                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Batch start date *</Label>
                    <DateInput
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(val) => onChange({ ...formData, startDate: val })}
                    />
                </div>

                {/* Row 3 */}
                <div className="space-y-2">
                    <Label htmlFor="endDate">Batch end date *</Label>
                    <DateInput
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={(val) => onChange({ ...formData, endDate: val })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                        value={formData.status || 'active'}
                        onValueChange={(val) => handleSelectChange('status', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Row 4 */}
                <div className="space-y-2">
                    <Label htmlFor="startTime">Start time</Label>
                    <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.startTime || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTime">End time</Label>
                    <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.endTime || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    CANCEL
                </Button>
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                    disabled={saving}
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === 'create' ? 'SUBMIT' : 'UPDATE')}
                </Button>
            </div>
        </form>
    )
}
