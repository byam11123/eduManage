'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { StudentAdmissionFormData } from '@/lib/types'

interface Step2Props {
    formData: StudentAdmissionFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSelectChange: (name: string, value: string) => void
}

export function Step2Qualifications({
    formData,
    onChange,
    onSelectChange
}: Step2Props) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Highest Qualification Selector */}
            <div className="space-y-2 max-w-md">
                <Label htmlFor="highestQualification">Highest Qualification *</Label>
                <Select value={formData.highestQualification} onValueChange={(val) => onSelectChange('highestQualification', val)}>
                    <SelectTrigger><SelectValue placeholder="Select Highest Qualification" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="high_school">High School (10th)</SelectItem>
                        <SelectItem value="higher_secondary">Higher Secondary (12th)</SelectItem>
                        <SelectItem value="graduation">Graduation</SelectItem>
                        <SelectItem value="post_graduation">Post Graduation</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* High School (10th) - Show for all qualifications */}
            {formData.highestQualification && (
                <div className="border rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">High School (10th) Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hsSchoolName">School Name *</Label>
                            <Input id="hsSchoolName" name="hsSchoolName" value={formData.hsSchoolName} onChange={onChange} placeholder="Enter school name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hsBoard">Board *</Label>
                            <Input id="hsBoard" name="hsBoard" value={formData.hsBoard} onChange={onChange} placeholder="e.g. CBSE, ICSE, State Board" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hsPassingYear">Passing Year *</Label>
                            <Input id="hsPassingYear" name="hsPassingYear" value={formData.hsPassingYear} onChange={onChange} placeholder="e.g. 2018" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hsPercentage">Percentage / Grade *</Label>
                            <Input id="hsPercentage" name="hsPercentage" value={formData.hsPercentage} onChange={onChange} placeholder="e.g. 85% or A+" />
                        </div>
                    </div>
                </div>
            )}

            {/* Higher Secondary (12th) - Show for higher_secondary, graduation, post_graduation */}
            {['higher_secondary', 'graduation', 'post_graduation'].includes(formData.highestQualification) && (
                <div className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-900/20 space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Higher Secondary (12th) Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hssSchoolName">School Name *</Label>
                            <Input id="hssSchoolName" name="hssSchoolName" value={formData.hssSchoolName} onChange={onChange} placeholder="Enter school name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hssBoard">Board *</Label>
                            <Input id="hssBoard" name="hssBoard" value={formData.hssBoard} onChange={onChange} placeholder="e.g. CBSE, ICSE, State Board" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hssStream">Stream *</Label>
                            <Select value={formData.hssStream} onValueChange={(val) => onSelectChange('hssStream', val)}>
                                <SelectTrigger><SelectValue placeholder="Select Stream" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="science">Science</SelectItem>
                                    <SelectItem value="commerce">Commerce</SelectItem>
                                    <SelectItem value="arts">Arts</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hssPassingYear">Passing Year *</Label>
                            <Input id="hssPassingYear" name="hssPassingYear" value={formData.hssPassingYear} onChange={onChange} placeholder="e.g. 2020" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hssPercentage">Percentage *</Label>
                            <Input id="hssPercentage" name="hssPercentage" value={formData.hssPercentage} onChange={onChange} placeholder="e.g. 90%" />
                        </div>
                    </div>
                </div>
            )}

            {/* Graduation - Show for graduation, post_graduation */}
            {['graduation', 'post_graduation'].includes(formData.highestQualification) && (
                <div className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/20 space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Graduation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gradCollegeName">College Name *</Label>
                            <Input id="gradCollegeName" name="gradCollegeName" value={formData.gradCollegeName} onChange={onChange} placeholder="Enter college name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grad University">University *</Label>
                            <Input id="gradUniversity" name="gradUniversity" value={formData.gradUniversity} onChange={onChange} placeholder="Enter university name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gradDegree">Degree *</Label>
                            <Input id="gradDegree" name="gradDegree" value={formData.gradDegree} onChange={onChange} placeholder="e.g. BSc, BCom, BTech" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gradPassingYear">Passing Year *</Label>
                            <Input id="gradPassingYear" name="gradPassingYear" value={formData.gradPassingYear} onChange={onChange} placeholder="e.g. 2023" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gradPercentage">Percentage / CGPA *</Label>
                            <Input id="gradPercentage" name="gradPercentage" value={formData.gradPercentage} onChange={onChange} placeholder="e.g. 75% or 8.5 CGPA" />
                        </div>
                    </div>
                </div>
            )}

            {/* Post Graduation - Show only for post_graduation */}
            {formData.highestQualification === 'post_graduation' && (
                <div className="border rounded-lg p-4 bg-purple-50/50 dark:bg-purple-900/20 space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Post Graduation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pgCollegeName">PG College Name *</Label>
                            <Input id="pgCollegeName" name="pgCollegeName" value={formData.pgCollegeName} onChange={onChange} placeholder="Enter PG college name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pgUniversity">University *</Label>
                            <Input id="pgUniversity" name="pgUniversity" value={formData.pgUniversity} onChange={onChange} placeholder="Enter university name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pgDegree">Degree *</Label>
                            <Input id="pgDegree" name="pgDegree" value={formData.pgDegree} onChange={onChange} placeholder="e.g. MSc, MCom, MTech" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pgPassingYear">Passing Year *</Label>
                            <Input id="pgPassingYear" name="pgPassingYear" value={formData.pgPassingYear} onChange={onChange} placeholder="e.g. 2025" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pgPercentage">Percentage / CGPA *</Label>
                            <Input id="pgPercentage" name="pgPercentage" value={formData.pgPercentage} onChange={onChange} placeholder="e.g. 80% or 9.0 CGPA" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
