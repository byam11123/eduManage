'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, HandCoins, CreditCard, FileText, MessageSquare, Calendar } from "lucide-react"
import { useReferrals } from "@/hooks"
import { cn } from '@/lib/utils'

interface ProcessPayoutDialogProps {
    isOpen: boolean
    onClose: () => void
    referral: any
    onSuccess?: () => void
}

export function ProcessPayoutDialog({ isOpen, onClose, referral, onSuccess }: ProcessPayoutDialogProps) {
    const { processPayout } = useReferrals()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        mode: 'online',
        transactionId: '',
        remarks: '',
        payoutDate: new Date().toISOString().split('T')[0],
        rewardAmount: referral?.rewardAmount || 0
    })

    // Update form data when referral changes
    useEffect(() => {
        if (referral) {
            setFormData(prev => ({
                ...prev,
                rewardAmount: referral.rewardAmount || 0
            }))
        }
    }, [referral])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!referral) return

        setLoading(true)
        try {
            const success = await processPayout(referral.id, formData)
            if (success) {
                toast.success("Payout processed successfully")
                onSuccess?.()
                onClose()
            } else {
                toast.error("Failed to process payout")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    if (!referral) return null

    const sectionHeaderClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-2"
    const inputClasses = "h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-900">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-10 bg-emerald-600 border-b border-emerald-500/20">
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                                <HandCoins className="h-6 w-6 text-white" />
                            </div>
                            Process Payout
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-10 space-y-8">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Paying To</p>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{referral.referrer?.name}</h4>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referral Amount</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xl font-black text-emerald-600">₹</span>
                                        <Input 
                                            type="number"
                                            value={formData.rewardAmount}
                                            onChange={(e) => setFormData({ ...formData, rewardAmount: parseFloat(e.target.value) || 0 })}
                                            className="h-10 w-32 bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900 border-2 rounded-xl text-lg font-black text-emerald-600 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">For Student</p>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{referral.student?.firstName} {referral.student?.lastName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={sectionHeaderClasses}>
                                        <CreditCard className="h-3 w-3" /> Mode
                                    </Label>
                                    <Select 
                                        value={formData.mode} 
                                        onValueChange={(val) => setFormData({ ...formData, mode: val })}
                                    >
                                        <SelectTrigger className={inputClasses}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="online" className="text-xs font-bold">Online / UPI</SelectItem>
                                            <SelectItem value="cash" className="text-xs font-bold">Cash</SelectItem>
                                            <SelectItem value="bank" className="text-xs font-bold">Bank Transfer</SelectItem>
                                            <SelectItem value="cheque" className="text-xs font-bold">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className={sectionHeaderClasses}>
                                        <Calendar className="h-3 w-3" /> Date
                                    </Label>
                                    <Input 
                                        type="date"
                                        value={formData.payoutDate}
                                        onChange={(e) => setFormData({ ...formData, payoutDate: e.target.value })}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className={sectionHeaderClasses}>
                                    <FileText className="h-3 w-3" /> Transaction ID / Ref No
                                </Label>
                                <Input 
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                    placeholder="e.g. UPI Ref, Cheque No, etc."
                                    className={inputClasses}
                                    required={formData.mode !== 'cash'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={sectionHeaderClasses}>
                                    <MessageSquare className="h-3 w-3" /> Payout Remarks
                                </Label>
                                <Textarea 
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="Add any internal notes..."
                                    className={cn(inputClasses, "h-24 py-4 resize-none")}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-10 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="h-14 px-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-2xl shadow-emerald-200 dark:shadow-none text-[11px] font-black uppercase tracking-[0.2em] group"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm Payment <HandCoins className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" /></>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
