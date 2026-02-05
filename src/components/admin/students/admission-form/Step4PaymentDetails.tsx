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
import { FileUp, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentAdmissionFormData } from '@/lib/types'

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Course Fee</Label>
                    <Input id="totalAmount" name="totalAmount" value={formData.totalAmount} disabled className="bg-gray-100 h-12" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discountAmount">Discount Amount</Label>
                    <Input
                        id="discountAmount"
                        name="discountAmount"
                        type="number"
                        value={formData.discountAmount}
                        onChange={onChange}
                        className="h-12 border-indigo-200 focus:border-indigo-500"
                        placeholder="Enter discount"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="netPayableFee">Net Payable Fee</Label>
                    <Input id="netPayableFee" name="netPayableFee" value={formData.netPayableFee} disabled className="bg-green-50 text-green-700 font-bold h-12" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                    <Label htmlFor="isPartPayment">Is Part Payment? (Installment Enabled) *</Label>
                    <Select value={formData.isPartPayment} onValueChange={(val) => onSelectChange('isPartPayment', val)}>
                        <SelectTrigger className="h-12 border-indigo-100"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="no">NO (Full Payment)</SelectItem>
                            <SelectItem value="yes">YES (Installment System)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>Apply Coupon? 🎁</Label>
                    <RadioGroup value={formData.applyCoupon} onValueChange={(val) => onSelectChange('applyCoupon', val)} className="flex items-center gap-4 py-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="c-yes" />
                            <Label htmlFor="c-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="c-no" />
                            <Label htmlFor="c-no">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            {/* Full Payment Info - Show only if part payment is NO */}
            {formData.isPartPayment === 'no' && (
                <div className="p-6 border rounded-xl bg-green-50/30 space-y-6 animate-in zoom-in-95 duration-200">
                    <h3 className="font-semibold text-green-800 flex items-center gap-2">
                        Full Payment Details
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full uppercase tracking-wider">Status: Paid</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="paymentMode">Mode of Payment *</Label>
                            <Select value={formData.paymentMode} onValueChange={(val) => onSelectChange('paymentMode', val)}>
                                <SelectTrigger className="h-11"><SelectValue placeholder="Select Mode" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="online">Online / UPI / Bank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receiptNo">Receipt No. *</Label>
                            <Input id="receiptNo" name="receiptNo" value={formData.receiptNo} onChange={onChange} className="h-11" placeholder="Enter receipt #" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID / UTR *</Label>
                            <Input id="transactionId" name="transactionId" value={formData.transactionId} onChange={onChange} className="h-11" placeholder="Bank ref number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentDate">Payment Date *</Label>
                            <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={onChange} className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receivedBy">Payment Received By *</Label>
                            <Input id="receivedBy" name="receivedBy" value={formData.receivedBy} onChange={onChange} className="h-11" placeholder="Staff name" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Payment Proof (ScreenShot/Receipt) *</Label>
                            <div className="flex items-start gap-4">
                                {!formData.proofImage ? (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FileUp className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">Click to upload proof</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-white group">
                                        <img src={formData.proofImage} alt="Proof" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="sm" onClick={() => onSelectChange('proofImage', '')}>
                                                <X className="w-4 h-4 mr-1" /> Remove
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
