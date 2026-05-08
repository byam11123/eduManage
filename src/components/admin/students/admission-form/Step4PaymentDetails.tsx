'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileUp, Image as ImageIcon, X, Wallet, ShieldCheck, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentAdmissionFormData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Step4Props {
    formData: StudentAdmissionFormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSelectChange: (name: string, value: string) => void
}

export function Step4PaymentDetails({
    formData,
    onChange,
    onSelectChange
}: Step4Props) {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onSelectChange('proofImage', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-8">
                <h3 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    Fee Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2 group">
                        <Label htmlFor="totalAmount" className={labelClasses}>Course Fee</Label>
                        <div className="relative">
                            <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input id="totalAmount" name="totalAmount" value={formData.totalAmount} disabled className={cn(inputClasses, "pl-14 opacity-70 cursor-not-allowed")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discountAmount" className={labelClasses}>Discount Amount</Label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-indigo-600">₹</span>
                            <Input
                                id="discountAmount"
                                name="discountAmount"
                                type="number"
                                value={formData.discountAmount}
                                onChange={onChange}
                                className={cn(inputClasses, "pl-14 ring-2 ring-indigo-50 dark:ring-indigo-900/20")}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="netPayableFee" className={labelClasses}>Payable Amount</Label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                            <Input id="netPayableFee" name="netPayableFee" value={formData.netPayableFee} disabled className={cn(inputClasses, "pl-14 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 font-black border-2 border-emerald-100 dark:border-emerald-900/20")} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-4 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-800">
                    <Label htmlFor="isPartPayment" className={labelClasses}>Payment Type *</Label>
                    <Select value={formData.isPartPayment} onValueChange={(val) => onSelectChange('isPartPayment', val)}>
                        <SelectTrigger className={cn(inputClasses, "bg-gray-50/50 dark:bg-gray-950/50 font-bold")}><SelectValue placeholder="Select Type" /></SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                            <SelectItem value="no" className="rounded-xl py-3 font-bold">Full Payment</SelectItem>
                            <SelectItem value="yes" className="rounded-xl py-3 font-bold">Installments</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-800">
                    <Label className={labelClasses}>Institutional Coupon Code? 🎁</Label>
                    <RadioGroup value={formData.applyCoupon} onValueChange={(val) => onSelectChange('applyCoupon', val)} className="flex items-center gap-10 h-14 px-8">
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <RadioGroupItem value="yes" id="c-yes" className="h-5 w-5 border-2 border-indigo-200 text-indigo-600 focus:ring-indigo-600" />
                            <Label htmlFor="c-yes" className="font-black text-xs uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <RadioGroupItem value="no" id="c-no" className="h-5 w-5 border-2 border-indigo-200 text-indigo-600 focus:ring-indigo-600" />
                            <Label htmlFor="c-no" className="font-black text-xs uppercase tracking-widest text-gray-500 group-hover:text-indigo-600 transition-colors">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            {/* Full Payment Info - Show only if part payment is NO */}
            {formData.isPartPayment === 'no' && (
                <div className="p-10 border border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] bg-emerald-50/10 dark:bg-emerald-950/10 space-y-10 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/20 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Payment Details</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">Payment information</p>
                            </div>
                        </div>
                        <span className="px-5 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black rounded-xl uppercase tracking-[0.2em]">Full Payment</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="paymentMode" className={labelClasses}>Payment Method *</Label>
                            <Select value={formData.paymentMode} onValueChange={(val) => onSelectChange('paymentMode', val)}>
                                <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm font-bold")}><SelectValue placeholder="Select Method" /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    <SelectItem value="cash" className="rounded-xl py-3 font-bold">Cash</SelectItem>
                                    <SelectItem value="online" className="rounded-xl py-3 font-bold">Online (UPI / Bank Transfer)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receiptNo" className={labelClasses}>Receipt Number *</Label>
                            <Input id="receiptNo" name="receiptNo" value={formData.receiptNo} onChange={onChange} className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")} placeholder="REG-2024-XXXX" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transactionId" className={labelClasses}>Transaction ID / UTR *</Label>
                            <Input id="transactionId" name="transactionId" value={formData.transactionId} onChange={onChange} className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")} placeholder="Transaction Reference" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentDate" className={labelClasses}>Payment Date *</Label>
                            <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={onChange} className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receivedBy" className={labelClasses}>Collected By *</Label>
                            <Input id="receivedBy" name="receivedBy" value={formData.receivedBy} onChange={onChange} className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")} placeholder="Full Name" />
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <Label className={labelClasses}>Payment Proof *</Label>
                            <div className="flex items-start gap-6">
                                {!formData.proofImage ? (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="h-12 w-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all mb-3">
                                                <FileUp className="w-6 h-6" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600">Upload Receipt/Proof</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-64 border-4 border-white dark:border-gray-800 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-900 group shadow-2xl">
                                        <img src={formData.proofImage} alt="Proof" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Proof Uploaded</p>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => onSelectChange('proofImage', '')} className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-900/40 border-none">
                                                <X className="w-4 h-4 mr-2" /> Remove Proof
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
