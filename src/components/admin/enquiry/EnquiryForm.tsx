// ============================================
// ENQUIRY FORM COMPONENT
// Reusable form for creating and editing enquiries
// ============================================

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { EnquiryFormData, Course } from '@/lib/types'

interface EnquiryFormProps {
    formData: EnquiryFormData
    courses: Course[]
    onChange: (data: EnquiryFormData) => void
    onSubmit: (e: React.FormEvent) => void
    onCancel: () => void
    saving?: boolean
    mode?: 'create' | 'edit'
}

export function EnquiryForm({
    formData,
    courses,
    onChange,
    onSubmit,
    onCancel,
    saving,
    mode = 'create'
}: EnquiryFormProps) {
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
                    <Label htmlFor="firstName">First name *</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                        id="mobile"
                        name="mobile"
                        placeholder="9876543210"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email ID</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Row 3 */}
                <div className="space-y-2">
                    <Label htmlFor="courseId">Enquiry course</Label>
                    <Select
                        value={formData.courseId}
                        onValueChange={(val) => handleSelectChange('courseId', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {courses.map(course => (
                                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Select
                        value={formData.source}
                        onValueChange={(val) => handleSelectChange('source', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="web">Website</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="walk-in">Walk-in</SelectItem>
                            <SelectItem value="social_media">Social Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Row 4 */}
                {mode === 'edit' && (
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => handleSelectChange('status', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="interested">Interested</SelectItem>
                                <SelectItem value="admitted">Admitted</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Enter enquiry details or notes..."
                    value={formData.description}
                    onChange={handleChange}
                />
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
