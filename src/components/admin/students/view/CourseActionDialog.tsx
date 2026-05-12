'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCourses } from '@/hooks/useCourses'
import { useBatches } from '@/hooks/useBatches'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Plus, GraduationCap, Layers, Activity, ChevronRight, Loader2 } from 'lucide-react'
import { AddCourseDialog } from '@/components/admin/courses'
import { AddBatchDialog } from '@/components/admin/batches'
import type { CourseFormData, BatchFormData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CourseActionDialogProps {
    isOpen: boolean
    onClose: () => void
    studentId: string
    course: any // StudentCourse
    actionType: 'add' | 'status' | 'batch' | null
    onSuccess: () => void
}

export function CourseActionDialog({
    isOpen,
    onClose,
    studentId,
    course,
    actionType,
    onSuccess
}: CourseActionDialogProps) {
    const router = useRouter()
    const { courses, fetchCourses } = useCourses()
    const { batches, fetchBatches } = useBatches()
    const [loading, setLoading] = useState(false)

    // Form States
    const [selectedCourseId, setSelectedCourseId] = useState('')
    const [selectedBatchId, setSelectedBatchId] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    // Add New Resource States
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
    const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
    const [savingNewCourse, setSavingNewCourse] = useState(false)
    const [savingNewBatch, setSavingNewBatch] = useState(false)

    // Initial Data for New Forms
    const [newCourseData, setNewCourseData] = useState<CourseFormData>({
        name: '', code: '', description: '', fee: '0', status: 'active', organizationId: '',
        courseType: 'academic', mode: 'offline', feeDescription: '', registrationFee: '0',
        discountAllowed: false, discountPercentage: '0', maxInstallments: '1',
        installmentAmounts: [], durationYears: '0', durationMonths: '0', subjects: [],
        eligibility: 'high_school'
    })
    const [newBatchData, setNewBatchData] = useState<BatchFormData>({
        name: '', code: '', courseId: '', startTime: '', endTime: '', status: 'active',
        startDate: new Date().toISOString().split('T')[0], maxStudents: 30
    })

    const handleClose = () => {
        setSelectedCourseId('')
        setSelectedBatchId('')
        setSelectedStatus('')
        onClose()
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (actionType === 'add') {
                if (!selectedCourseId) {
                    toast.error('Please select a course')
                    setLoading(false)
                    return
                }

                const res = await fetch('/api/student-courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId,
                        courseId: selectedCourseId,
                        batchId: selectedBatchId || null
                    })
                })

                if (!res.ok) throw new Error('Failed to add course')
                toast.success('Course added successfully')

            } else if (actionType === 'status') {
                if (!selectedStatus) {
                    toast.error('Please select a status')
                    setLoading(false)
                    return
                }

                const res = await fetch(`/api/student-courses/${course.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: selectedStatus })
                })

                if (!res.ok) throw new Error('Failed to update status')
                toast.success('Status updated successfully')

            } else if (actionType === 'batch') {
                if (!selectedBatchId) {
                    toast.error('Please select a batch')
                    setLoading(false)
                    return
                }

                const res = await fetch(`/api/student-courses/${course.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ batchId: selectedBatchId })
                })

                if (!res.ok) throw new Error('Failed to reassign batch')
                toast.success('Batch reassigned successfully')
            }

            onSuccess()
            handleClose()
            router.refresh()

        } catch (error) {
            console.error(error)
            toast.error('Operation failed')
        } finally {
            setLoading(false)
        }
    }

    const handleAddCourse = async () => {
        setSavingNewCourse(true)
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourseData)
            })
            if (!res.ok) throw new Error('Failed')

            toast.success('Course created')
            setIsAddCourseOpen(false)
            setNewCourseData({ 
                name: '', code: '', description: '', fee: '0', status: 'active', organizationId: '',
                courseType: 'academic', mode: 'offline', feeDescription: '', registrationFee: '0',
                discountAllowed: false, discountPercentage: '0', maxInstallments: '1',
                installmentAmounts: [], durationYears: '0', durationMonths: '0', subjects: [],
                eligibility: 'high_school'
            })
            router.refresh()
        } catch (error) {
            toast.error('Failed to create course')
        } finally {
            setSavingNewCourse(false)
        }
    }

    const handleAddBatch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setSavingNewBatch(true)
        try {
            const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBatchData)
            })
            if (!res.ok) throw new Error('Failed')

            toast.success('Batch created')
            setIsAddBatchOpen(false)
            setNewBatchData({
                name: '', code: '', courseId: '', startTime: '', endTime: '', status: 'active',
                startDate: new Date().toISOString().split('T')[0], maxStudents: 30
            })
            router.refresh()
        } catch (error) {
            toast.error('Failed to create batch')
        } finally {
            setSavingNewBatch(false)
        }
    }

    const targetCourseId = actionType === 'add' ? selectedCourseId : course?.courseId
    const relevantBatches = batches.filter((b: any) => b.courseId === targetCourseId && b.status === 'active')

    const sectionHeaderClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2"
    const inputClasses = "h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                    <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Enrollment Details</p>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {actionType === 'add' ? 'Course Enrollment' :
                                    actionType === 'status' ? 'Update Status' :
                                        actionType === 'batch' ? 'Assign to Batch' : 'Update Course'}
                            </DialogTitle>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* ADD MODE: Course Selection */}
                        {actionType === 'add' && (
                            <div className="space-y-2">
                                <Label className={sectionHeaderClasses}>
                                    <GraduationCap className="h-3 w-3" />
                                    Select Course
                                </Label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                            <SelectTrigger className={inputClasses}>
                                                <SelectValue placeholder="Choose course..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {courses.filter((c: any) => c.status === 'active').map((c: any) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 transition-all"
                                        onClick={() => setIsAddCourseOpen(true)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* BATCH SELECTION: Add or Reassign Mode */}
                        {(actionType === 'add' || actionType === 'batch') && (
                            <div className="space-y-2">
                                <Label className={sectionHeaderClasses}>
                                    <Layers className="h-3 w-3" />
                                    Select Batch {actionType === 'add' && '(Optional)'}
                                </Label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                                            <SelectTrigger className={inputClasses}>
                                                <SelectValue placeholder="Choose batch..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {relevantBatches.length > 0 ? (
                                                    relevantBatches.map((b: any) => (
                                                        <SelectItem key={b.id} value={b.id}>
                                                            {b.name} ({b.startTime} - {b.endTime})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">No Active Batches</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-all disabled:opacity-50"
                                        onClick={() => {
                                            if (targetCourseId) {
                                                setNewBatchData(prev => ({ ...prev, courseId: targetCourseId }))
                                                setIsAddBatchOpen(true)
                                            } else {
                                                toast.error('Select a course first')
                                            }
                                        }}
                                        disabled={!targetCourseId}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {actionType === 'add' && !selectedCourseId && (
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Select a course to see batches</p>
                                )}
                            </div>
                        )}

                        {/* STATUS SELECTION: Status Mode */}
                        {actionType === 'status' && (
                            <div className="space-y-2">
                                <Label className={sectionHeaderClasses}>
                                    <Activity className="h-3 w-3" />
                                    Enrollment Status
                                </Label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className={inputClasses}>
                                        <SelectValue placeholder="Update status..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="ongoing">Active Enrollment</SelectItem>
                                        <SelectItem value="completed">Curriculum Completed</SelectItem>
                                        <SelectItem value="dropped">Withdrawal / Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-8 pt-0 gap-3 sm:gap-0">
                        <Button 
                            variant="ghost" 
                            onClick={handleClose} 
                            disabled={loading}
                            className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                        >
                            CANCEL
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                            SAVE CHANGES
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Creation Dialogs */}
            <AddCourseDialog
                open={isAddCourseOpen}
                onOpenChange={setIsAddCourseOpen}
                formData={newCourseData}
                onChange={setNewCourseData}
                onSubmit={handleAddCourse}
                saving={savingNewCourse}
            />

            <AddBatchDialog
                open={isAddBatchOpen}
                onOpenChange={setIsAddBatchOpen}
                formData={newBatchData}
                courses={courses}
                onChange={setNewBatchData}
                onSubmit={handleAddBatch}
                saving={savingNewBatch}
            />
        </>
    )
}
