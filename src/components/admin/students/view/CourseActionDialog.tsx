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
import { Plus } from 'lucide-react'
import { AddCourseDialog } from '@/components/admin/courses'
import { AddBatchDialog } from '@/components/admin/batches'
import type { CourseFormData, BatchFormData } from '@/lib/types'

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

    // Reset form when dialog opens/closes
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

    // Handlers for New Resource Creation
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
            router.refresh() // Force full page data refresh
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
            router.refresh() // Force full page data refresh
        } catch (error) {
            toast.error('Failed to create batch')
        } finally {
            setSavingNewBatch(false)
        }
    }

    // Filter batches based on selected course (for Add) or current course (for Reassign)
    const targetCourseId = actionType === 'add' ? selectedCourseId : course?.courseId
    const relevantBatches = batches.filter((b: any) => b.courseId === targetCourseId && b.status === 'active')

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'add' ? 'Add New Course' :
                                actionType === 'status' ? 'Update Enrollment Status' :
                                    actionType === 'batch' ? 'Reassign Batch' : ''}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* ADD MODE: Course Selection */}
                        {actionType === 'add' && (
                            <div className="space-y-2">
                                <Label>Select Course</Label>
                                <div className="flex items-center gap-2">
                                    <div className="w-full">
                                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a course..." />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        variant="outline"
                                        className="mb-0 shrink-0 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200"
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
                                <Label>Select Batch {actionType === 'add' && '(Optional)'}</Label>
                                <div className="flex items-center gap-2">
                                    <div className="w-full">
                                        <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a batch..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {relevantBatches.length > 0 ? (
                                                    relevantBatches.map((b: any) => (
                                                        <SelectItem key={b.id} value={b.id}>
                                                            {b.name} ({b.startTime} - {b.endTime})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-sm text-gray-500 text-center">No active batches</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="mb-0 shrink-0 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200"
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
                                    <p className="text-xs text-muted-foreground">Select a course first to see batches.</p>
                                )}
                            </div>
                        )}

                        {/* STATUS SELECTION: Status Mode */}
                        {actionType === 'status' && (
                            <div className="space-y-2">
                                <Label>Enrollment Status</Label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="dropped">Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
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
