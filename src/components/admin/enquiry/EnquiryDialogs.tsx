// ============================================
// ENQUIRY DIALOGS COMPONENT
// Add, Edit, and Delete dialogs for enquiries
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
import { EnquiryForm } from './EnquiryForm'
import type { Enquiry, EnquiryFormData, Course } from '@/lib/types'

// ===== ADD ENQUIRY DIALOG =====
interface AddEnquiryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: EnquiryFormData
    courses: Course[]
    onChange: (data: EnquiryFormData) => void
    onSubmit: (e: React.FormEvent) => void
    saving?: boolean
}

export function AddEnquiryDialog({
    open,
    onOpenChange,
    formData,
    courses,
    onChange,
    onSubmit,
    saving
}: AddEnquiryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add New Enquiry</DialogTitle>
                </DialogHeader>
                <EnquiryForm
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

// ===== EDIT ENQUIRY DIALOG =====
interface EditEnquiryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: EnquiryFormData
    courses: Course[]
    onChange: (data: EnquiryFormData) => void
    onSubmit: (e: React.FormEvent) => void
    saving?: boolean
}

export function EditEnquiryDialog({
    open,
    onOpenChange,
    formData,
    courses,
    onChange,
    onSubmit,
    saving
}: EditEnquiryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit Enquiry</DialogTitle>
                </DialogHeader>
                <EnquiryForm
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

// ===== DELETE ENQUIRY DIALOG =====
interface DeleteEnquiryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    enquiry: Enquiry | null
    onConfirm: () => void
    saving?: boolean
}

export function DeleteEnquiryDialog({
    open,
    onOpenChange,
    enquiry,
    onConfirm,
    saving
}: DeleteEnquiryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Delete Enquiry</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the enquiry from &quot;{enquiry?.firstName} {enquiry?.lastName}&quot;? This action cannot be
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
