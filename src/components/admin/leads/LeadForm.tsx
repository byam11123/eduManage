import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import type { Lead, LeadFormData } from "@/lib/types"

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
    const { register, handleSubmit, reset, setValue } = useForm<LeadFormData>()

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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("firstName", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName", { required: true })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register("phone", { required: true })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" {...register("company")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Value (₹)</Label>
                            <Input id="value" type="number" {...register("value")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Source</Label>
                            <Select onValueChange={(val) => setValue('source', val)} defaultValue={initialData?.source || 'website'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="referral">Referral</SelectItem>
                                    <SelectItem value="social_media">Social Media</SelectItem>
                                    <SelectItem value="campaign">Campaign</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Stage</Label>
                            <Select onValueChange={(val) => setValue('stage', val)} defaultValue={initialData?.stage || 'new'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="qualified">Qualified</SelectItem>
                                    <SelectItem value="proposal">Proposal</SelectItem>
                                    <SelectItem value="negotiation">Negotiation</SelectItem>
                                    <SelectItem value="won">Won</SelectItem>
                                    <SelectItem value="lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" {...register("notes")} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (initialData ? 'Update Lead' : 'Create Lead')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
