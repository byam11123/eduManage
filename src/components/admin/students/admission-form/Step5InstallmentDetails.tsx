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
import { Button } from '@/components/ui/button'
import { FileUp, X, CheckCircle2, History } from 'lucide-react'
import type { StudentAdmissionFormData, InstallmentPlanItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Step5Props {
    formData: StudentAdmissionFormData
    onSelectChange: (name: string, value: string) => void
    handleInstallmentChange: (index: number, field: keyof InstallmentPlanItem, value: string) => void
}

export function Step5InstallmentDetails({
    formData,
    onSelectChange,
    handleInstallmentChange
}: Step5Props) {

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                handleInstallmentChange(index, 'proofImage', reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const installmentModes = [
        { value: 'preset', label: 'PRESET (Course-Based Plan)', description: 'Uses predefined plan from course settings' },
        { value: 'equal', label: 'EQUAL (Smart ERP Mode)', description: 'Automatically divides net fee equally' },
        { value: 'custom', label: 'CUSTOM (Manual Plan)', description: 'Full control to operator for specialized cases' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
            {/* Logic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Divide Installments *</Label>
                    <Select value={formData.divideInstallments} onValueChange={(val) => onSelectChange('divideInstallments', val)}>
                        <SelectTrigger className="bg-white border-indigo-200">
                            <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {installmentModes.map(m => (
                                <SelectItem key={m.value} value={m.value}>
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium">{m.label}</span>
                                        <span className="text-[10px] text-gray-500">{m.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Number of Installments *</Label>
                    <Select
                        value={String(formData.installments)}
                        onValueChange={(val) => onSelectChange('installments', val)}
                        disabled={formData.divideInstallments === 'preset'}
                    >
                        <SelectTrigger className="bg-white border-indigo-200">
                            <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                <SelectItem key={num} value={String(num)}>{num} Installments</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-indigo-900 font-semibold">Are you paying first installment? *</Label>
                    <Select value={formData.payFirstInstallmentNow} onValueChange={(val) => onSelectChange('payFirstInstallmentNow', val)}>
                        <SelectTrigger className="bg-white border-indigo-200">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">YES (Paying Now)</SelectItem>
                            <SelectItem value="no">NO (Pay Later)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Installment Rows */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Installment Plan
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-medium uppercase">
                            Total: {formData.netPayableFee}
                        </span>
                    </h3>
                    <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 className="w-3 h-3" /> Paid</span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium"><History className="w-3 h-3" /> Pending</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {formData.installmentPlan.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative p-6 rounded-2xl border transition-all duration-200",
                                item.status === 'paid'
                                    ? "bg-green-50/40 border-green-100 shadow-sm"
                                    : "bg-white border-gray-100 hover:border-indigo-100 hover:shadow-md"
                            )}
                        >
                            <div className="absolute -left-3 top-6 w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-sm text-gray-400 shadow-sm">
                                {index + 1}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Due Date</Label>
                                    <Input
                                        type="date"
                                        value={item.dueDate}
                                        onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                        className="h-11 bg-transparent"
                                        disabled={formData.divideInstallments !== 'custom' && index > 0}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Amount</Label>
                                    <Input
                                        type="number"
                                        value={item.amount}
                                        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                                        className="h-11 font-semibold text-gray-900 bg-transparent"
                                        disabled={formData.divideInstallments !== 'custom'}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-gray-500">Remark / Description</Label>
                                    <Input
                                        value={item.remark}
                                        onChange={(e) => handleInstallmentChange(index, 'remark', e.target.value)}
                                        className="h-11 bg-transparent"
                                        placeholder="Note for this installment"
                                    />
                                </div>

                                {item.status === 'paid' && (
                                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 pt-4 border-t border-green-100 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] text-green-700">Payment Mode</Label>
                                            <Select value={item.mode} onValueChange={(val) => handleInstallmentChange(index, 'mode', val)}>
                                                <SelectTrigger className="h-10 bg-white/50 border-green-200 text-green-900">
                                                    <SelectValue placeholder="Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="online">Online</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] text-green-700">Receipt No.</Label>
                                            <Input
                                                value={item.receiptNo}
                                                onChange={(e) => handleInstallmentChange(index, 'receiptNo', e.target.value)}
                                                className="h-10 bg-white/50 border-green-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] text-green-700">UTR / Ref No.</Label>
                                            <Input
                                                value={item.utrNo}
                                                onChange={(e) => handleInstallmentChange(index, 'utrNo', e.target.value)}
                                                className="h-10 bg-white/50 border-green-200"
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col justify-end">
                                            {!item.proofImage ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-10 border-dashed border-green-300 text-green-700 bg-green-50/50"
                                                    onClick={() => document.getElementById(`proof-${index}`)?.click()}
                                                >
                                                    <FileUp className="w-4 h-4 mr-2" /> Upload Proof
                                                </Button>
                                            ) : (
                                                <div className="flex items-center gap-2 p-1 border rounded bg-white overflow-hidden">
                                                    <img src={item.proofImage} alt="proof" className="w-8 h-8 object-cover rounded" />
                                                    <span className="text-[10px] text-green-600 truncate flex-1">Proof uploaded</span>
                                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleInstallmentChange(index, 'proofImage', '')}>
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            )}
                                            <input id={`proof-${index}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
