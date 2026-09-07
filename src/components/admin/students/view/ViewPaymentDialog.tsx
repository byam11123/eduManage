'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Installment } from '@/lib/types'
import { FileText, LayoutGrid, MessageSquare, CheckCircle2, IndianRupee, ReceiptText, ExternalLink, Clock, FileDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateFeeReceipt } from '@/lib/utils/receipt-generator'
import { useAuth } from '@/hooks'

interface ViewPaymentDialogProps {
    isOpen: boolean
    onClose: () => void
    installment: any // Installment or AdditionalFee
}

export function ViewPaymentDialog({
    isOpen,
    onClose,
    installment
}: ViewPaymentDialogProps) {
    const { user } = useAuth()
    const sectionHeaderClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2"
    const dataBoxClasses = "h-12 px-4 flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white font-bold text-xs border border-gray-100 dark:border-gray-800 shadow-sm"

    const isAdditionalFee = installment?.feeType !== undefined

    const formatDateTime = (date: any) => {
        if (!date) return 'Not recorded'
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const handleDownloadReceipt = () => {
        if (!installment?.receiptNo) return

        const student = isAdditionalFee
            ? installment.student
            : installment.studentCourse?.student

        if (!student) return

        generateFeeReceipt({
            receiptNo: installment.receiptNo,
            date: new Date(installment.paidDate || installment.updatedAt),
            studentName: `${student.firstName} ${student.lastName}`,
            studentId: student.studentDisplayId || student.admissionDisplayId || '',
            courseName: isAdditionalFee ? installment.title : (installment.studentCourse?.course?.name || 'Course'),
            installmentNo: isAdditionalFee ? 0 : installment.installmentNo,
            amount: installment.paidAmount || installment.amount,
            mode: installment.mode || 'cash',
            transactionId: installment.transactionId || '',
            remarks: installment.remarks || '',
            organizationName: user?.organization?.name || 'EduManage',
            branchName: student.branch?.name || ''
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                {/* Header */}
                <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Payment Info</p>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Payment Details</DialogTitle>
                            <p className="text-xs font-medium opacity-80 mt-2">
                                {isAdditionalFee
                                    ? installment.title
                                    : `Installment #${installment?.installmentNo} payment received.`}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg mb-2">
                                <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            {installment?.receiptNo && (
                                <p className="text-[10px] font-black tracking-widest opacity-80 font-mono">
                                    {installment.receiptNo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-5">
                    {/* Row 1: Amount + Collected On */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <IndianRupee className="h-3 w-3" />
                                Amount Paid
                            </h4>
                            <div className="h-12 px-4 flex items-center bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 font-black text-sm border border-emerald-100 dark:border-emerald-900/30">
                                ₹ {(installment?.paidAmount || installment?.amount || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <Clock className="h-3 w-3" />
                                Collected On
                            </h4>
                            <div className={cn(dataBoxClasses, "text-[11px]")}>
                                {formatDateTime(installment?.paidDate)}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Mode + Receipt No */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <LayoutGrid className="h-3 w-3" />
                                Payment Mode
                            </h4>
                            <div className={cn(dataBoxClasses, "capitalize")}>
                                {installment?.mode?.replace('_', ' ') || 'Cash'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <ReceiptText className="h-3 w-3" />
                                Receipt No.
                            </h4>
                            <div className={cn(dataBoxClasses, "font-mono tracking-wider text-indigo-600 dark:text-indigo-400")}>
                                {installment?.receiptNo || '—'}
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Reference ID + Payment Proof */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <FileText className="h-3 w-3" />
                                Reference ID
                            </h4>
                            <div className={cn(dataBoxClasses, "font-mono text-[11px]")}>
                                {installment?.transactionId || '—'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <ExternalLink className="h-3 w-3" />
                                Payment Proof
                            </h4>
                            <div className="h-12 flex items-center">
                                {installment?.proofUrl ? (
                                    <a
                                        href={installment.proofUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="h-12 px-5 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-colors w-full justify-center"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        View Document
                                    </a>
                                ) : (
                                    <div className={cn(dataBoxClasses, "w-full text-gray-400 text-[11px]")}>
                                        Not uploaded
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Remarks */}
                    <div className="space-y-2">
                        <h4 className={sectionHeaderClasses}>
                            <MessageSquare className="h-3 w-3" />
                            Remarks
                        </h4>
                        <div className="min-h-[72px] p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 text-xs font-medium border border-gray-100 dark:border-gray-800">
                            {installment?.remarks || installment?.remark || 'No remarks.'}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="mt-2 flex gap-3">
                        {installment?.receiptNo && (
                            <Button
                                onClick={handleDownloadReceipt}
                                variant="outline"
                                className="flex-1 h-12 rounded-2xl border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all gap-2"
                            >
                                <FileDown className="h-4 w-4" />
                                Download Receipt
                            </Button>
                        )}
                        <Button
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
