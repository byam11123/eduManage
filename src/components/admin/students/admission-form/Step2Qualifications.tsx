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
import { cn } from '@/lib/utils'

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
    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Highest Qualification Selector */}
            <div className="space-y-4 max-w-md bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                <Label htmlFor="highestQualification" className={labelClasses}>Highest Qualification *</Label>
                <Select value={formData.highestQualification} onValueChange={(val) => onSelectChange('highestQualification', val)}>
                    <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}><SelectValue placeholder="Select Qualification" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                        <SelectItem value="high_school" className="rounded-xl py-3 font-bold">10th Standard</SelectItem>
                        <SelectItem value="higher_secondary" className="rounded-xl py-3 font-bold">12th Standard</SelectItem>
                        <SelectItem value="graduation" className="rounded-xl py-3 font-bold">Graduation</SelectItem>
                        <SelectItem value="post_graduation" className="rounded-xl py-3 font-bold">Post Graduation</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2 px-1">Required for admission</p>
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
                                <Label htmlFor="hsSchoolName" className={labelClasses}>School Name *</Label>
                                <Input id="hsSchoolName" name="hsSchoolName" value={formData.hsSchoolName} onChange={onChange} placeholder="School Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hsBoard" className={labelClasses}>Board *</Label>
                                <Input id="hsBoard" name="hsBoard" value={formData.hsBoard} onChange={onChange} placeholder="CBSE, ICSE, or State Board" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hsPassingYear" className={labelClasses}>Passing Year *</Label>
                                <Input id="hsPassingYear" name="hsPassingYear" value={formData.hsPassingYear} onChange={onChange} placeholder="YYYY" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hsPercentage" className={labelClasses}>Percentage / CGPA *</Label>
                                <Input id="hsPercentage" name="hsPercentage" value={formData.hsPercentage} onChange={onChange} placeholder="Percentage or CGPA" className={inputClasses} />
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
                                <Label htmlFor="hssSchoolName" className={labelClasses}>School Name *</Label>
                                <Input id="hssSchoolName" name="hssSchoolName" value={formData.hssSchoolName} onChange={onChange} placeholder="School Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hssBoard" className={labelClasses}>Board *</Label>
                                <Input id="hssBoard" name="hssBoard" value={formData.hssBoard} onChange={onChange} placeholder="CBSE, ICSE, or State Board" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hssStream" className={labelClasses}>Stream *</Label>
                                <Select value={formData.hssStream} onValueChange={(val) => onSelectChange('hssStream', val)}>
                                    <SelectTrigger className={cn(inputClasses, "bg-white/50 dark:bg-gray-900/50 font-bold shadow-sm")}><SelectValue placeholder="Select Stream" /></SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                        <SelectItem value="science" className="rounded-xl py-3 font-bold">Science</SelectItem>
                                        <SelectItem value="commerce" className="rounded-xl py-3 font-bold">Commerce</SelectItem>
                                        <SelectItem value="arts" className="rounded-xl py-3 font-bold">Arts / Humanities</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hssPassingYear" className={labelClasses}>Passing Year *</Label>
                                <Input id="hssPassingYear" name="hssPassingYear" value={formData.hssPassingYear} onChange={onChange} placeholder="YYYY" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hssPercentage" className={labelClasses}>Percentage *</Label>
                                <Input id="hssPercentage" name="hssPercentage" value={formData.hssPercentage} onChange={onChange} placeholder="Percentage" className={inputClasses} />
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
                                <Label htmlFor="gradCollegeName" className={labelClasses}>College Name *</Label>
                                <Input id="gradCollegeName" name="gradCollegeName" value={formData.gradCollegeName} onChange={onChange} placeholder="College Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradUniversity" className={labelClasses}>University *</Label>
                                <Input id="gradUniversity" name="gradUniversity" value={formData.gradUniversity} onChange={onChange} placeholder="University Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradDegree" className={labelClasses}>Degree *</Label>
                                <Input id="gradDegree" name="gradDegree" value={formData.gradDegree} onChange={onChange} placeholder="e.g. BSc, BCom, BTech" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradPassingYear" className={labelClasses}>Passing Year *</Label>
                                <Input id="gradPassingYear" name="gradPassingYear" value={formData.gradPassingYear} onChange={onChange} placeholder="YYYY" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradPercentage" className={labelClasses}>Percentage / CGPA *</Label>
                                <Input id="gradPercentage" name="gradPercentage" value={formData.gradPercentage} onChange={onChange} placeholder="Percentage or CGPA" className={inputClasses} />
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
                                <Label htmlFor="pgCollegeName" className={labelClasses}>College Name *</Label>
                                <Input id="pgCollegeName" name="pgCollegeName" value={formData.pgCollegeName} onChange={onChange} placeholder="College Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgUniversity" className={labelClasses}>University *</Label>
                                <Input id="pgUniversity" name="pgUniversity" value={formData.pgUniversity} onChange={onChange} placeholder="University Name" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgDegree" className={labelClasses}>Degree *</Label>
                                <Input id="pgDegree" name="pgDegree" value={formData.pgDegree} onChange={onChange} placeholder="e.g. MSc, MCom, MTech" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgPassingYear" className={labelClasses}>Passing Year *</Label>
                                <Input id="pgPassingYear" name="pgPassingYear" value={formData.pgPassingYear} onChange={onChange} placeholder="YYYY" className={inputClasses} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgPercentage" className={labelClasses}>Percentage / CGPA *</Label>
                                <Input id="pgPercentage" name="pgPercentage" value={formData.pgPercentage} onChange={onChange} placeholder="Percentage or CGPA" className={inputClasses} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
