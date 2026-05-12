'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IndianRupee, Wallet, CreditCard, Receipt as ReceiptIcon, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface CollectFeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    installment: any
    onSuccess: () => void
}

export function CollectFeeDialog({
    open,
    onOpenChange,
    installment,
    onSuccess
}: CollectFeeDialogProps) {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [mode, setMode] = useState('cash')
    const [transactionId, setTransactionId] = useState('')
    const [remarks, setRemarks] = useState('')

    useEffect(() => {
        if (installment) {
            setAmount((installment.amount - installment.paidAmount).toString())
        }
    }, [installment])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!installment) return

        const paidAmount = parseFloat(amount)
        if (isNaN(paidAmount) || paidAmount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        const remaining = installment.amount - installment.paidAmount
        if (paidAmount > remaining) {
            toast.error(`Amount exceeds pending balance of ₹${remaining}`)
            return
        }

        try {
            setLoading(true)
            const res = await fetch(`/api/fees/collect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    installmentId: installment.id,
                    amount: paidAmount,
                    mode,
                    transactionId,
                    remarks
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success('Fee collected successfully')
                onSuccess()
                onOpenChange(false)
            } else {
                toast.error(data.error || 'Failed to collect fee')
            }
        } catch (error) {
            console.error('Error collecting fee:', error)
            toast.error('Internal server error')
        } finally {
            setLoading(false)
        }
    }

    if (!installment) return null

    const student = installment.studentCourse.student
    const course = installment.studentCourse.course
    const pendingAmount = installment.amount - installment.paidAmount

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="bg-indigo-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <IndianRupee className="h-32 w-32 rotate-12" />
                    </div>
                    <DialogHeader className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white">Collect Payment</DialogTitle>
                        </div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Recording installment #{installment.installmentNo}</p>
                    </DialogHeader>

                    <div className="mt-8 flex items-end justify-between relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Total Due</p>
                            <h4 className="text-3xl font-black tracking-tighter text-white">₹{pendingAmount.toLocaleString()}</h4>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Student</p>
                            <p className="font-bold text-sm text-white">{student.firstName} {student.lastName}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-gray-900">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Amount</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Mode</Label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="cash" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Cash</SelectItem>
                                    <SelectItem value="online" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Online / UPI</SelectItem>
                                    <SelectItem value="cheque" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Cheque</SelectItem>
                                    <SelectItem value="bank_transfer" className="rounded-lg py-3 font-bold text-xs uppercase tracking-widest">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID / Reference (Optional)</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                placeholder="Ref ID, Cheque No, etc."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Collector's Remarks</Label>
                        <Textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="bg-gray-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20 min-h-[80px]"
                            placeholder="Add any additional details..."
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] text-gray-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none min-w-[140px]"
                        >
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
