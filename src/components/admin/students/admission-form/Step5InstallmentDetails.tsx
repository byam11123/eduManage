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
import { FileUp, X, CheckCircle2, History, Settings2, CalendarRange, CreditCard, LayoutPanelLeft, FileCheck } from 'lucide-react'
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
        { value: 'preset', label: 'Standard Plan', description: 'Auto-calculated from course' },
        { value: 'equal', label: 'Equal Plan', description: 'Split equally across months' },
        { value: 'custom', label: 'Custom Plan', description: 'Setup manually' }
    ]

    const inputClasses = "h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base focus:ring-2 focus:ring-indigo-500/20 transition-all"
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2 block"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            {/* Logic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[3rem] border border-indigo-100/50 dark:border-indigo-900/20">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <LayoutPanelLeft className="h-4 w-4 text-indigo-600" />
                        <Label className={labelClasses}>Installment Type *</Label>
                    </div>
                    <Select value={formData.divideInstallments} onValueChange={(val) => onSelectChange('divideInstallments', val)}>
                        <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}>
                            <SelectValue placeholder="Select Logic" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                            {installmentModes.map(m => (
                                <SelectItem key={m.value} value={m.value} className="rounded-xl py-3">
                                    <div className="flex flex-col text-left">
                                        <span className="font-black text-[12px] uppercase tracking-wider">{m.label}</span>
                                        <span className="text-[10px] font-bold text-gray-400 mt-0.5">{m.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Settings2 className="h-4 w-4 text-indigo-600" />
                        <Label className={labelClasses}>No. of Installments *</Label>
                    </div>
                    <Select
                        value={String(formData.installments)}
                        onValueChange={(val) => onSelectChange('installments', val)}
                        disabled={formData.divideInstallments === 'preset'}
                    >
                        <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                <SelectItem key={num} value={String(num)} className="rounded-xl py-3 font-bold">{num} Installments</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-indigo-600" />
                        <Label className={labelClasses}>Pay 1st Installment Now? *</Label>
                    </div>
                    <Select value={formData.payFirstInstallmentNow} onValueChange={(val) => onSelectChange('payFirstInstallmentNow', val)}>
                        <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-950 shadow-sm font-bold")}>
                            <SelectValue placeholder="Select Action" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                            <SelectItem value="yes" className="rounded-xl py-3 font-bold">Yes (Pay Now)</SelectItem>
                            <SelectItem value="no" className="rounded-xl py-3 font-bold">No (Pay Later)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Installment Rows */}
            <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                            <CalendarRange className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Installment Plan</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mt-0.5">Total Amount: ₹{formData.netPayableFee}</p>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl"><CheckCircle2 className="w-3.5 h-3.5" /> Paid</span>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl"><History className="w-3.5 h-3.5" /> Unpaid</span>
                    </div>
                </div>

                <div className="space-y-8">
                    {formData.installmentPlan.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative p-10 rounded-[3rem] border transition-all duration-500",
                                item.status === 'paid'
                                    ? "bg-emerald-50/10 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 shadow-xl shadow-emerald-50 dark:shadow-none scale-[1.02]"
                                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-50 dark:shadow-none"
                            )}
                        >
                            <div className="absolute -left-5 top-10 w-12 h-12 rounded-2xl bg-white dark:bg-gray-950 border-4 border-gray-50 dark:border-gray-900 flex items-center justify-center font-black text-lg text-indigo-600 shadow-2xl">
                                {index + 1}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                                <div className="space-y-2">
                                    <Label className={labelClasses}>Due Date</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            value={item.dueDate}
                                            onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                            className={cn(
                                                inputClasses,
                                                "bg-gray-50/50 dark:bg-gray-950/50",
                                                formData.divideInstallments !== 'custom' && "opacity-50 cursor-not-allowed"
                                            )}
                                            disabled={formData.divideInstallments !== 'custom'}
                                        />
                                        {formData.divideInstallments !== 'custom' && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-black uppercase tracking-widest pointer-events-none">
                                                Auto
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className={labelClasses}>Amount</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                                            className={cn(
                                                inputClasses,
                                                "bg-gray-50/50 dark:bg-gray-950/50",
                                                formData.divideInstallments !== 'custom' && "opacity-50 cursor-not-allowed"
                                            )}
                                            disabled={formData.divideInstallments !== 'custom'}
                                        />
                                        {formData.divideInstallments !== 'custom' && (
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-black uppercase tracking-widest pointer-events-none">
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label className={labelClasses}>Notes / Remarks</Label>
                                    <Input
                                        value={item.remark}
                                        onChange={(e) => handleInstallmentChange(index, 'remark', e.target.value)}
                                        className={cn(inputClasses, "bg-gray-50/50 dark:bg-gray-950/50")}
                                        placeholder="Notes"
                                    />
                                </div>

                                {item.status === 'paid' && (
                                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-5 gap-8 mt-6 pt-10 border-t border-emerald-100 dark:border-emerald-900/20 animate-in fade-in slide-in-from-top-4 duration-700">
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Channel *</Label>
                                            <Select value={item.mode} onValueChange={(val) => handleInstallmentChange(index, 'mode', val)}>
                                                <SelectTrigger className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm font-bold")}>
                                                    <SelectValue placeholder="Mode" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                    <SelectItem value="cash" className="rounded-xl py-3 font-bold uppercase text-[10px]">Cash</SelectItem>
                                                    <SelectItem value="online" className="rounded-xl py-3 font-bold uppercase text-[10px]">Online / UPI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Receipt No. *</Label>
                                            <Input
                                                value={item.receiptNo}
                                                onChange={(e) => handleInstallmentChange(index, 'receiptNo', e.target.value)}
                                                className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")}
                                                placeholder="REG-XXXX"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>UTR / Ref *</Label>
                                            <Input
                                                value={item.utrNo}
                                                onChange={(e) => handleInstallmentChange(index, 'utrNo', e.target.value)}
                                                className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")}
                                                placeholder="BANK-REF"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={labelClasses}>Officer *</Label>
                                            <Input
                                                value={item.receivedBy}
                                                onChange={(e) => handleInstallmentChange(index, 'receivedBy', e.target.value)}
                                                className={cn(inputClasses, "bg-white dark:bg-gray-900 shadow-sm")}
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col justify-end">
                                            {!item.proofImage ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-14 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-900/50 text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100 transition-all"
                                                    onClick={() => document.getElementById(`proof-${index}`)?.click()}
                                                >
                                                    <FileUp className="w-4 h-4 mr-2" /> Evidence
                                                </Button>
                                            ) : (
                                                <div className="flex items-center gap-3 p-2 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-2xl bg-white dark:bg-gray-950 overflow-hidden shadow-lg shadow-emerald-50 dark:shadow-none h-14">
                                                    <img src={item.proofImage} alt="proof" className="h-10 w-10 object-cover rounded-xl border border-emerald-50" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 truncate flex-1">Captured</span>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-xl" onClick={() => handleInstallmentChange(index, 'proofImage', '')}>
                                                        <X className="w-4 h-4" />
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

                {/* Sum Validation Footer */}
                <div className={cn(
                    "p-10 rounded-[3rem] border flex items-center justify-between transition-all duration-700 shadow-2xl",
                    formData.divideInstallments === 'custom'
                        ? (Number(formData.installmentPlan.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)) === Number(formData.netPayableFee)
                            ? "bg-emerald-600 border-none text-white shadow-emerald-200 dark:shadow-none"
                            : "bg-rose-600 border-none text-white shadow-rose-200 dark:shadow-none animate-pulse")
                        : "bg-indigo-600 border-none text-white shadow-indigo-200 dark:shadow-none"
                )}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            {formData.divideInstallments === 'custom' ? (
                                Number(formData.installmentPlan.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)) === Number(formData.netPayableFee) ? (
                                    <FileCheck className="w-6 h-6" />
                                ) : (
                                    <History className="w-6 h-6" />
                                )
                            ) : (
                                <FileCheck className="w-6 h-6" />
                            )}
                        </div>
                        <div>
                            <span className="font-black text-xl tracking-tight block">
                                {formData.divideInstallments === 'custom' ? (
                                    Number(formData.installmentPlan.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)) === Number(formData.netPayableFee)
                                        ? "Custom Plan Valid"
                                        : `Amount Mismatch`
                                ) : (
                                    "Plan Validated"
                                )}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 block mt-0.5">
                                {formData.divideInstallments === 'custom' && Number(formData.installmentPlan.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)) !== Number(formData.netPayableFee)
                                    ? `Remaining: ₹${Math.abs(Number(formData.installmentPlan.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)) - Number(formData.netPayableFee))}`
                                    : "Total matches payable amount"}
                            </span>
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                        Validated by System
                    </div>
                </div>
            </div>
        </div>
    )
}
