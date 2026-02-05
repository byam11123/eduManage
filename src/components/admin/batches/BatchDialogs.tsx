// ============================================
// BATCH DIALOGS COMPONENT
// Add, Edit, and Delete dialogs for batches
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
import { BatchForm } from './BatchForm'
import type { Batch, BatchFormData, Course } from '@/lib/types'

// ===== ADD BATCH DIALOG =====
interface AddBatchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: BatchFormData
    courses: Course[]
    onChange: (data: BatchFormData) => void
    onSubmit: (e: React.FormEvent) => void
    saving?: boolean
}

export function AddBatchDialog({
    open,
    onOpenChange,
    formData,
    courses,
    onChange,
    onSubmit,
    saving
}: AddBatchDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add New Batch</DialogTitle>
                </DialogHeader>
                <BatchForm
                    formData={formData}
                    courses={courses}
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

// ===== EDIT BATCH DIALOG =====
interface EditBatchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: BatchFormData
    courses: Course[]
    onChange: (data: BatchFormData) => void
    onSubmit: (e: React.FormEvent) => void
    saving?: boolean
}

export function EditBatchDialog({
    open,
    onOpenChange,
    formData,
    courses,
    onChange,
    onSubmit,
    saving
}: EditBatchDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Batch</DialogTitle>
                </DialogHeader>
                <BatchForm
                    formData={formData}
                    courses={courses}
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

// ===== DELETE BATCH DIALOG =====
interface DeleteBatchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    batch: Batch | null
    onConfirm: () => void
    saving?: boolean
}

export function DeleteBatchDialog({
    open,
    onOpenChange,
    batch,
    onConfirm,
    saving
}: DeleteBatchDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Delete Batch</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{batch?.name}&quot;? This action cannot be
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
