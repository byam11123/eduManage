'use client'

import { Plus, GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { AddCourseDialog } from '@/components/admin/courses'
import { AddBatchDialog } from '@/components/admin/batches'
import type {
    StudentAdmissionFormData,
    Course,
    Batch,
    CourseFormData,
    BatchFormData
} from '@/lib/types'
import { cn } from '@/lib/utils'

interface Step3Props {
    formData: StudentAdmissionFormData
    onSelectChange: (name: string, value: string) => void
    courses: Course[]
    batches: Batch[]
    isAddCourseOpen: boolean
    setIsAddCourseOpen: (open: boolean) => void
    isAddBatchOpen: boolean
    setIsAddBatchOpen: (open: boolean) => void
    savingNewCourse: boolean
    savingNewBatch: boolean
    newCourseData: CourseFormData
    setNewCourseData: (data: CourseFormData) => void
    newBatchData: BatchFormData
    setNewBatchData: (data: BatchFormData) => void
    onAddCourse: () => void
    onAddBatch: (e: React.FormEvent) => void
}

export function Step3CourseBatch({
    formData,
    onSelectChange,
    courses,
    batches,
    isAddCourseOpen,
    setIsAddCourseOpen,
    isAddBatchOpen,
    setIsAddBatchOpen,
    savingNewCourse,
    savingNewBatch,
    newCourseData,
    setNewCourseData,
    newBatchData,
    setNewBatchData,
    onAddCourse,
    onAddBatch
}: Step3Props) {
    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    Course & Batch Selection
                </h3>

                <div className="space-y-10">
                    {/* Course Selection */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-800">
                        <div className="space-y-2 flex-1 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <GraduationCap className="h-4 w-4 text-indigo-600" />
                                <Label htmlFor="courseId" className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Select Course *</Label>
                            </div>
                            <Select value={formData.courseId} onValueChange={(val) => onSelectChange('courseId', val)}>
                                <SelectTrigger className={cn(inputClasses, "bg-gray-50/50 dark:bg-gray-950/50")}><SelectValue placeholder="Select Course" /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    {courses.map(c => (
                                        <SelectItem key={c.id} value={c.id} className="rounded-xl py-3 font-bold">{c.name}</SelectItem>
                                    ))}
                                    {courses.length === 0 && <SelectItem value="disabled" disabled>No courses found</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-90"
                            onClick={() => setIsAddCourseOpen(true)}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Batch Selection */}
                    <div className={cn(
                        "flex flex-col sm:flex-row items-start sm:items-end gap-5 max-w-2xl p-8 rounded-[2.5rem] border transition-all duration-500",
                        formData.courseId 
                            ? "bg-white dark:bg-gray-900 shadow-xl shadow-gray-100 dark:shadow-none border-gray-50 dark:border-gray-800 opacity-100" 
                            : "bg-gray-50/50 dark:bg-gray-900/50 border-transparent opacity-50 grayscale"
                    )}>
                        <div className="space-y-2 flex-1 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-indigo-600" />
                                <Label htmlFor="batchId" className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Select Batch *</Label>
                            </div>
                            <Select
                                value={formData.batchId}
                                onValueChange={(val) => onSelectChange('batchId', val)}
                                disabled={!formData.courseId}
                            >
                                <SelectTrigger className={cn(inputClasses, "bg-gray-50/50 dark:bg-gray-950/50")}><SelectValue placeholder={formData.courseId ? "Select Batch" : "Select course first"} /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    {batches.map(b => (
                                        <SelectItem key={b.id} value={b.id} className="rounded-xl py-3 font-bold">{b.name}</SelectItem>
                                    ))}
                                    {batches.length === 0 && formData.courseId && <SelectItem value="disabled" disabled>No batches found for this course</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-90"
                            onClick={() => setIsAddBatchOpen(true)}
                            disabled={!formData.courseId}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dialogs for Instant Creation */}
            <AddCourseDialog
                open={isAddCourseOpen}
                onOpenChange={setIsAddCourseOpen}
                formData={newCourseData}
                onChange={setNewCourseData}
                onSubmit={onAddCourse}
                saving={savingNewCourse}
            />

            <AddBatchDialog
                open={isAddBatchOpen}
                onOpenChange={setIsAddBatchOpen}
                formData={newBatchData}
                courses={courses}
                onChange={setNewBatchData}
                onSubmit={onAddBatch}
                saving={savingNewBatch}
            />
        </div>
    )
}
