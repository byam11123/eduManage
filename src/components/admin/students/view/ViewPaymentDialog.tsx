'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Installment } from '@/lib/types'
import { CreditCard, Calendar, FileText, LayoutGrid, MessageSquare, CheckCircle2, IndianRupee, ReceiptText, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewPaymentDialogProps {
    isOpen: boolean
    onClose: () => void
    installment: Installment
}

export function ViewPaymentDialog({
    isOpen,
    onClose,
    installment
}: ViewPaymentDialogProps) {
    const sectionHeaderClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2"
    const dataBoxClasses = "h-12 px-4 flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white font-bold text-xs border border-gray-100 dark:border-gray-800 shadow-sm"

    const formatDate = (date: any) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Payment Info</p>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Payment Details</DialogTitle>
                            <p className="text-xs font-medium opacity-80 mt-2">Installment #{installment.installmentNo} payment received.</p>
                        </div>
                        <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <IndianRupee className="h-3 w-3" />
                                Amount Paid
                            </h4>
                            <div className="h-12 px-4 flex items-center bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 font-black text-sm border border-emerald-100 dark:border-emerald-900/30">
                                ₹ {installment.paidAmount?.toLocaleString() || installment.amount.toLocaleString()}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <Calendar className="h-3 w-3" />
                                Payment Date
                            </h4>
                            <div className={dataBoxClasses}>
                                {formatDate(installment.paidDate)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <LayoutGrid className="h-3 w-3" />
                                Payment Mode
                            </h4>
                            <div className={cn(dataBoxClasses, "capitalize")}>
                                {installment.mode || 'Cash'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <ReceiptText className="h-3 w-3" />
                                Receipt No.
                            </h4>
                            <div className={cn(dataBoxClasses, "font-mono tracking-wider text-indigo-600 dark:text-indigo-400")}>
                                {installment.receiptNo || 'None'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className={sectionHeaderClasses}>
                            <FileText className="h-3 w-3" />
                            Reference ID
                        </h4>
                        <div className={cn(dataBoxClasses, "font-mono")}>
                            {installment.transactionId || 'None'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <h4 className={sectionHeaderClasses}>
                                <MessageSquare className="h-3 w-3" />
                                Payment Notes
                            </h4>
                            <div className="min-h-[100px] p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 text-xs font-medium border border-gray-100 dark:border-gray-800">
                                {installment.remarks || 'No notes.'}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <Button 
                            onClick={onClose} 
                            className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            CLOSE
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
