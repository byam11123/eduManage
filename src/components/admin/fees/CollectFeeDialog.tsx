'use client'

import { useState, useEffect, useRef } from 'react'
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
import { IndianRupee, Wallet, CreditCard, FileDown, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'
import { generateFeeReceipt } from '@/lib/utils/receipt-generator'
import { useAuth } from '@/hooks'

interface CollectFeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    installment: any // Can be Installment or AdditionalFee
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
    const [proofFile, setProofFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useAuth()

    // Reset all fields each time dialog opens with a new installment
    useEffect(() => {
        if (open && installment) {
            const pendingAmount = installment.status === 'paid' ? 0 : (installment.amount - (installment.paidAmount || 0))
            setAmount(pendingAmount.toString())
            setMode('cash')
            setTransactionId('')
            setRemarks('')
            setProofFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }, [open, installment])

    const isAdditionalFee = installment?.feeType !== undefined
    const requiresProof = mode !== 'cash'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!installment) return

        const paidAmount = parseFloat(amount)
        if (isNaN(paidAmount) || paidAmount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        const remaining = installment.status === 'paid' ? 0 : (installment.amount - (installment.paidAmount || 0))
        if (paidAmount > remaining && remaining !== 0) {
            toast.error(`Amount exceeds pending balance of ₹${remaining}`)
            return
        }

        // Proof is required for all non-cash payment modes
        if (requiresProof && !proofFile) {
            toast.error('Payment proof is required for online/cheque/bank transfer payments')
            return
        }

        try {
            setLoading(true)
            
            // 1. Upload proof if exists
            let proofUrl = ''
            if (proofFile) {
                const formData = new FormData()
                formData.append('file', proofFile)
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                const uploadData = await uploadRes.json()
                if (uploadData.success) {
                    proofUrl = uploadData.url
                } else {
                    toast.error('Failed to upload proof document')
                    return
                }
            }

            // 2. Collect fee
            const res = await fetch(`/api/fees/collect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    installmentId: isAdditionalFee ? undefined : installment.id,
                    additionalFeeId: isAdditionalFee ? installment.id : undefined,
                    amount: paidAmount,
                    mode,
                    transactionId,
                    remarks,
                    proofUrl
                })
            })

            const data = await res.json()
            if (data.success) {
                // ── Generate and download receipt PDF ──
                const receipt = data.data?.receipt
                const student = isAdditionalFee ? installment.student : installment.studentCourse.student
                const courseName = isAdditionalFee ? 'Miscellaneous Fee' : installment.studentCourse.course.name

                if (receipt) {
                    const receiptOpts = {
                        receiptNo:      receipt.receiptNo,
                        date:           new Date(receipt.date),
                        studentName:    `${student.firstName} ${student.lastName}`,
                        studentId:      student.studentDisplayId || student.admissionDisplayId || '',
                        courseName:     isAdditionalFee ? installment.title : courseName,
                        installmentNo:  isAdditionalFee ? 0 : installment.installmentNo,
                        amount:         parseFloat(amount),
                        mode,
                        transactionId,
                        remarks,
                        organizationName: user?.organization?.name || 'EduManage',
                        branchName:     student.branch?.name
                    }
                    generateFeeReceipt(receiptOpts)

                    toast.success(`Receipt ${receipt.receiptNo} generated`, {
                        description: 'PDF downloaded to your device',
                        action: {
                            label: 'Download Again',
                            onClick: () => generateFeeReceipt(receiptOpts)
                        }
                    })
                } else {
                    toast.success('Fee collected successfully')
                }

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

    const student = isAdditionalFee ? installment.student : installment.studentCourse?.student
    if (!student) return null

    const pendingAmount = installment.status === 'paid' ? 0 : (installment.amount - (installment.paidAmount || 0))
    const titleText = isAdditionalFee ? installment.title : `Installment #${installment.installmentNo}`

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
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Recording {titleText}</p>
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

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white dark:bg-gray-900 max-h-[70vh] overflow-y-auto custom-scrollbar">
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
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Payment Proof
                            {requiresProof ? (
                                <span className="text-rose-500 ml-1">* Required for {mode.replace('_', ' ')} payment</span>
                            ) : (
                                <span className="text-gray-400 ml-1">(Optional for cash)</span>
                            )}
                        </Label>

                        {/* Hidden real file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        />

                        {proofFile ? (
                            /* File selected state */
                            <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-3">
                                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
                                    <UploadCloud className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-indigo-700 dark:text-indigo-300 truncate">{proofFile.name}</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                                        {(proofFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 flex-shrink-0"
                                    onClick={() => {
                                        setProofFile(null)
                                        if (fileInputRef.current) fileInputRef.current.value = ''
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            /* Empty state – click to browse */
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                                    <UploadCloud className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-gray-500 group-hover:text-indigo-600 transition-colors">Click to upload screenshot or receipt</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">PNG, JPG, PDF · Max 5 MB</p>
                                </div>
                            </button>
                        )}
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

                    <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
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
                            {loading ? (
                            'Processing…'
                        ) : (
                            <span className="flex items-center gap-2">
                                <FileDown className="h-3.5 w-3.5" />
                                Confirm & Download
                            </span>
                        )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
