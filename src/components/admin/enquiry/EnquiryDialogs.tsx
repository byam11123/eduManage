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
import { Loader2, Trash2, AlertTriangle, X } from 'lucide-react'
import { EnquiryForm } from './EnquiryForm'
import type { Enquiry, EnquiryFormData, Course } from '@/lib/types'
import { cn } from '@/lib/utils'

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
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">New Enquiry</p>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight">New Enquiry Entry</DialogTitle>
                        <p className="text-xs font-medium opacity-80 mt-2">Capture basic details for the new enquiry.</p>
                    </div>
                </div>
                <div className="p-10">
                    <EnquiryForm
                        formData={formData}
                        courses={courses}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        onCancel={() => onOpenChange(false)}
                        saving={saving}
                        mode="create"
                    />
                </div>
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
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Edit Enquiry</p>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight">Update Enquiry</DialogTitle>
                        <p className="text-xs font-medium opacity-80 mt-2">Update the prospect's contact info and interest.</p>
                    </div>
                </div>
                <div className="p-10">
                    <EnquiryForm
                        formData={formData}
                        courses={courses}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        onCancel={() => onOpenChange(false)}
                        saving={saving}
                        mode="edit"
                    />
                </div>
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
            <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-rose-500 p-8 text-white relative overflow-hidden text-center">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl">
                            <AlertTriangle className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Delete Enquiry</p>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Confirm Delete</DialogTitle>
                    </div>
                </div>

                <div className="p-10 text-center">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                        Are you sure you want to delete the enquiry from <strong>{enquiry?.firstName} {enquiry?.lastName}</strong>?
                    </p>
                    <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                        <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-relaxed">
                            WARNING: This action is irreversible and will purge the prospect record from the institutional pipeline.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-10 pt-0 gap-3 sm:gap-0 flex flex-col sm:flex-row">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                    >
                        CANCEL
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={onConfirm} 
                        disabled={saving}
                        className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        DELETE ENQUIRY
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


