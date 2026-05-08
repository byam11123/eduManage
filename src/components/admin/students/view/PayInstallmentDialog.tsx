'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Installment } from '@/lib/types'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
            // Call API to pay installment
            const response = await fetch(`/api/installments/${installment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paidAmount: Number(installment.amount) - Number(installment.paidAmount), // Pay remaining
                    paymentDate: formData.paymentDate,
                    mode: formData.mode,
                    transactionId: formData.transactionId,
                    remarks: formData.remark,
                    receivedBy: formData.receivedBy,
                    // proofImage logic...
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Pay Installment #{installment.installmentNo}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input value={`₹ ${installment.amount}`} disabled className="bg-gray-50 font-bold text-gray-700" />
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Date</Label>
                            <Input
                                type="date"
                                required
                                value={formData.paymentDate}
                                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Payment Mode</Label>
                            <Select
                                value={formData.mode}
                                onValueChange={(val) => setFormData({ ...formData, mode: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="online">Online / UPI</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Transaction ID / Check No (Optional)</Label>
                            <Input
                                placeholder="For online/check payments"
                                value={formData.transactionId}
                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label>Payment Proof (Image)</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) setProofFile(e.target.files[0])
                                }}
                            />
                            <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                                <Upload className="h-5 w-5 mb-1" />
                                {proofFile ? (
                                    <span className="text-indigo-600 font-medium">{proofFile.name}</span>
                                ) : (
                                    <span>Click to upload receipt</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Remarks</Label>
                        <Textarea
                            placeholder="Optional notes..."
                            className="resize-none h-20"
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
