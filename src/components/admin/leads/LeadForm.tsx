import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import type { Lead, LeadFormData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Target, Users, Phone, Mail, Building2, DollarSign, FileText, Plus } from "lucide-react"

interface LeadFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: LeadFormData) => Promise<boolean>
    initialData?: Lead
    loading?: boolean
}

export function LeadForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    loading
}: LeadFormProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<LeadFormData>()

    useEffect(() => {
        if (initialData) {
            setValue('firstName', initialData.firstName)
            setValue('lastName', initialData.lastName)
            setValue('email', initialData.email)
            setValue('phone', initialData.phone)
            setValue('company', initialData.company || '')
            setValue('value', initialData.value?.toString() || '')
            setValue('source', initialData.source)
            setValue('stage', initialData.stage)
            setValue('notes', initialData.notes || '')
        } else {
            reset({
                stage: 'new',
                source: 'website'
            })
        }
    }, [initialData, setValue, open, reset])

    const onFormSubmit = async (data: LeadFormData) => {
        const success = await onSubmit(data)
        if (success) {
            onOpenChange(false)
            reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Lead Details</p>
                        <DialogTitle className="text-3xl font-black uppercase tracking-tight">
                            {initialData ? 'Update Prospect' : 'New Lead Generation'}
                        </DialogTitle>
                        <p className="text-xs font-medium opacity-80 mt-2">Add or update lead information.</p>
                    </div>
                </div>

                <div className="p-10">

                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Basic Information</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input 
                                            placeholder="First Name" 
                                            {...register("firstName", { required: true })} 
                                            className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base"
                                        />
                                        <Input 
                                            placeholder="Last Name" 
                                            {...register("lastName", { required: true })} 
                                            className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold px-6 text-base"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input 
                                            placeholder="Email Address" 
                                            type="email" 
                                            {...register("email", { required: true })} 
                                            className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input 
                                            placeholder="Phone Number" 
                                            {...register("phone", { required: true })} 
                                            className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Lead Details</Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input 
                                            placeholder="Company Name" 
                                            {...register("company")} 
                                            className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Input 
                                            placeholder="Estimated Value (₹)" 
                                            type="number" 
                                            {...register("value")} 
                                            className="h-14 pl-14 pr-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none font-bold text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pipeline Info */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Pipeline Status</Label>
                                    <div className="space-y-4">
                                        <Select onValueChange={(val) => setValue('source', val)} defaultValue={initialData?.source || 'website'}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border-none font-black uppercase tracking-widest text-[10px] px-6 text-indigo-600">
                                                <SelectValue placeholder="Lead Source" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                <SelectItem value="website" className="rounded-xl py-3 font-bold">Website</SelectItem>
                                                <SelectItem value="referral" className="rounded-xl py-3 font-bold">Referral</SelectItem>
                                                <SelectItem value="social_media" className="rounded-xl py-3 font-bold">Social Media</SelectItem>
                                                <SelectItem value="campaign" className="rounded-xl py-3 font-bold">Campaign</SelectItem>
                                                <SelectItem value="other" className="rounded-xl py-3 font-bold">Other</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select onValueChange={(val) => setValue('stage', val)} defaultValue={initialData?.stage || 'new'}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border-none font-black uppercase tracking-widest text-[10px] px-6 text-indigo-600">
                                                <SelectValue placeholder="Pipeline Stage" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                <SelectItem value="new" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">New</SelectItem>
                                                <SelectItem value="contacted" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Contacted</SelectItem>
                                                <SelectItem value="qualified" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Qualified</SelectItem>
                                                <SelectItem value="proposal" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Proposal</SelectItem>
                                                <SelectItem value="negotiation" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Negotiation</SelectItem>
                                                <SelectItem value="won" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Won</SelectItem>
                                                <SelectItem value="lost" className="rounded-xl py-3 font-bold uppercase tracking-widest text-[10px]">Lost</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Notes</Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-5 top-5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <Textarea 
                                            placeholder="Add any notes about this lead..." 
                                            {...register("notes")} 
                                            className="min-h-[160px] pl-14 pt-5 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border-none font-bold text-base resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-6 pt-10 border-t border-gray-100 dark:border-gray-800">
                            <button type="button" onClick={() => onOpenChange(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
                            <Button type="submit" disabled={loading} className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 dark:shadow-none border-none transition-all hover:scale-[1.02] active:scale-95">
                                {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Lead')}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

