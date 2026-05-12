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
import { CreatableSuggestionInput } from '@/components/shared/creatable-suggestion-input'

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
                                <CreatableSuggestionInput 
                                    type="school" 
                                    value={formData.hsSchoolName} 
                                    onChange={(val) => onSelectChange('hsSchoolName', val)} 
                                    placeholder="Select or type School"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hsBoard" className={labelClasses}>Board *</Label>
                                <CreatableSuggestionInput 
                                    type="board" 
                                    value={formData.hsBoard} 
                                    onChange={(val) => onSelectChange('hsBoard', val)} 
                                    placeholder="Select or type Board"
                                />
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
                                <CreatableSuggestionInput 
                                    type="school" 
                                    value={formData.hssSchoolName} 
                                    onChange={(val) => onSelectChange('hssSchoolName', val)} 
                                    placeholder="Select or type School"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hssBoard" className={labelClasses}>Board *</Label>
                                <CreatableSuggestionInput 
                                    type="board" 
                                    value={formData.hssBoard} 
                                    onChange={(val) => onSelectChange('hssBoard', val)} 
                                    placeholder="Select or type Board"
                                />
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
                                <CreatableSuggestionInput 
                                    type="college" 
                                    value={formData.gradCollegeName} 
                                    onChange={(val) => onSelectChange('gradCollegeName', val)} 
                                    placeholder="Select or type College"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradUniversity" className={labelClasses}>University *</Label>
                                <CreatableSuggestionInput 
                                    type="university" 
                                    value={formData.gradUniversity} 
                                    onChange={(val) => onSelectChange('gradUniversity', val)} 
                                    placeholder="Select or type University"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gradDegree" className={labelClasses}>Degree *</Label>
                                <CreatableSuggestionInput 
                                    type="degree" 
                                    value={formData.gradDegree} 
                                    onChange={(val) => onSelectChange('gradDegree', val)} 
                                    placeholder="e.g. BSc, BCom, BTech"
                                />
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
                                <CreatableSuggestionInput 
                                    type="college" 
                                    value={formData.pgCollegeName} 
                                    onChange={(val) => onSelectChange('pgCollegeName', val)} 
                                    placeholder="Select or type College"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgUniversity" className={labelClasses}>University *</Label>
                                <CreatableSuggestionInput 
                                    type="university" 
                                    value={formData.pgUniversity} 
                                    onChange={(val) => onSelectChange('pgUniversity', val)} 
                                    placeholder="Select or type University"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pgDegree" className={labelClasses}>Degree *</Label>
                                <CreatableSuggestionInput 
                                    type="degree" 
                                    value={formData.pgDegree} 
                                    onChange={(val) => onSelectChange('pgDegree', val)} 
                                    placeholder="e.g. MSc, MCom, MTech"
                                />
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
