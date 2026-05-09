'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Installment } from '@/lib/types'
import { Loader2, Upload, CreditCard, Calendar, FileText, UserCircle, LayoutGrid, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PayInstallmentDialogProps {
    isOpen: boolean
    onClose: () => void
    installment: Installment
    onSuccess: () => void
}

export function PayInstallmentDialog({
    isOpen,
    onClose,
    installment,
    onSuccess
}: PayInstallmentDialogProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        paymentDate: new Date().toISOString().split('T')[0],
        mode: 'cash',
        transactionId: '',
        remark: '',
        receivedBy: 'Admin'
    })
    const [proofFile, setProofFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`/api/installments/${installment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paidAmount: Number(installment.amount) - Number(installment.paidAmount),
                    paymentDate: formData.paymentDate,
                    mode: formData.mode,
                    transactionId: formData.transactionId,
                    remarks: formData.remark,
                    receivedBy: formData.receivedBy,
                })
            })

            if (!response.ok) throw new Error('Failed to update payment')

            toast.success('Payment recorded successfully')
            onSuccess()
            onClose()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to record payment')
        } finally {
            setLoading(false)
        }
    }

    const sectionHeaderClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2"
    const inputClasses = "h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Payment Details</p>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Record Payment</DialogTitle>
                        <p className="text-xs font-medium opacity-80 mt-2">Add payment for installment #{installment.installmentNo}.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={sectionHeaderClasses}>
                                <CreditCard className="h-3 w-3" />
                                Amount Due
                            </Label>
                            <div className="h-12 px-4 flex items-center bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 font-black text-sm border border-indigo-100 dark:border-indigo-900/30">
                                ₹ {installment.amount.toLocaleString()}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className={sectionHeaderClasses}>
                                <Calendar className="h-3 w-3" />
                                Payment Date
                            </Label>
                            <Input
                                type="date"
                                required
                                className={inputClasses}
                                value={formData.paymentDate}
                                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={sectionHeaderClasses}>
                                <LayoutGrid className="h-3 w-3" />
                                Payment Mode
                            </Label>
                            <Select
                                value={formData.mode}
                                onValueChange={(val) => setFormData({ ...formData, mode: val })}
                            >
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className={sectionHeaderClasses}>
                                <FileText className="h-3 w-3" />
                                Transaction ID
                            </Label>
                            <Input
                                placeholder="Ref ID / Cheque No"
                                className={inputClasses}
                                value={formData.transactionId}
                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className={sectionHeaderClasses}>
                            <Upload className="h-3 w-3" />
                            Upload Proof
                        </Label>
                        <div className="border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all relative group">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) setProofFile(e.target.files[0])
                                }}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Upload className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                                </div>
                                {proofFile ? (
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{proofFile.name}</span>
                                ) : (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Payment Proof</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className={sectionHeaderClasses}>
                            <MessageSquare className="h-3 w-3" />
                            Remarks
                        </Label>
                        <Textarea
                            placeholder="Additional ledger notes..."
                            className={cn(inputClasses, "resize-none h-24 p-4")}
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="gap-3 sm:gap-0 mt-8">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose} 
                            disabled={loading}
                            className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                        >
                            CANCEL
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                            Record Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
