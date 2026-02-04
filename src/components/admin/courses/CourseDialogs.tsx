// ============================================
// COURSE DIALOGS COMPONENT
// Add, Edit, and Delete dialogs for courses
// ============================================

'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { CourseForm } from './CourseForm'
import type { Course, CourseFormData } from '@/lib/types'

// ===== ADD COURSE DIALOG =====
interface AddCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: CourseFormData
    onChange: (data: CourseFormData) => void
    onSubmit: () => void
    saving?: boolean
}

export function AddCourseDialog({
    open,
    onOpenChange,
    formData,
    onChange,
    onSubmit,
    saving
}: AddCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add Course</DialogTitle>
                </DialogHeader>
                <CourseForm
                    formData={formData}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    saving={saving}
                    mode="create"
                />
            </DialogContent>
        </Dialog>
    )
}

// ===== EDIT COURSE DIALOG =====
interface EditCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: CourseFormData
    onChange: (data: CourseFormData) => void
    onSubmit: () => void
    saving?: boolean
}

export function EditCourseDialog({
    open,
    onOpenChange,
    formData,
    onChange,
    onSubmit,
    saving
}: EditCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Course</DialogTitle>
                </DialogHeader>
                <CourseForm
                    formData={formData}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    saving={saving}
                    mode="edit"
                />
            </DialogContent>
        </Dialog>
    )
}

// ===== DELETE COURSE DIALOG =====
interface DeleteCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    course: Course | null
    onConfirm: () => void
    saving?: boolean
}

export function DeleteCourseDialog({
    open,
    onOpenChange,
    course,
    onConfirm,
    saving
}: DeleteCourseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Delete Course</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{course?.name}&quot;? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        CANCEL
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={saving}>
                        {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        DELETE
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
