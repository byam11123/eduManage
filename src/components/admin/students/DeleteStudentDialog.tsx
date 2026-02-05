// ============================================
// DELETE STUDENT DIALOG COMPONENT
// Standardized confirmation dialog for deleting students
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
import { Loader2, Trash2 } from 'lucide-react'
import type { Student } from '@/lib/types'

interface DeleteStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: Student | null
    onConfirm: () => void
    loading?: boolean
}

export function DeleteStudentDialog({
    open,
    onOpenChange,
    student,
    onConfirm,
    loading
}: DeleteStudentDialogProps) {
    if (!student) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-semibold text-center">Delete Student</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete <strong>{student.firstName} {student.lastName}</strong>?
                        This will permanently remove their record, enrollment data, and payment history.
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-3 sm:justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        CANCEL
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        DELETE STUDENT
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
