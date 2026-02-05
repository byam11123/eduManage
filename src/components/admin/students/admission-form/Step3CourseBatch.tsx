'use client'

import { Plus } from 'lucide-react'
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
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Select Batch & Course</h3>

                <div className="space-y-6 pt-2">
                    {/* Course Selection */}
                    <div className="flex items-end gap-3 max-w-xl">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="courseId">Course *</Label>
                            <Select value={formData.courseId} onValueChange={(val) => onSelectChange('courseId', val)}>
                                <SelectTrigger className="h-12"><SelectValue placeholder="Select Course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                    {courses.length === 0 && <SelectItem value="disabled" disabled>No courses available</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                            onClick={() => setIsAddCourseOpen(true)}
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Batch Selection */}
                    <div className="flex items-end gap-3 max-w-xl">
                        <div className="space-y-2 w-full">
                            <Label htmlFor="batchId">Batch *</Label>
                            <Select
                                value={formData.batchId}
                                onValueChange={(val) => onSelectChange('batchId', val)}
                                disabled={!formData.courseId}
                            >
                                <SelectTrigger className="h-12"><SelectValue placeholder={formData.courseId ? "Select Batch" : "Select course first"} /></SelectTrigger>
                                <SelectContent>
                                    {batches.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                    {batches.length === 0 && formData.courseId && <SelectItem value="disabled" disabled>No cohorts/batches for this course</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                            onClick={() => setIsAddBatchOpen(true)}
                            disabled={!formData.courseId}
                        >
                            <Plus className="h-5 w-5" />
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
