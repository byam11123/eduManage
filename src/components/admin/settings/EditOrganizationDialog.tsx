'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Organization } from "@/lib/types"
import { organizationService } from "@/lib/services"
import { toast } from "sonner"
import { Loader2, Save, X } from "lucide-react"

interface EditOrganizationDialogProps {
    isOpen: boolean
    onClose: () => void
    organization: Organization
    onSuccess: () => void
}

export function EditOrganizationDialog({ isOpen, onClose, organization, onSuccess }: EditOrganizationDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: organization.name,
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        city: organization.city || '',
        website: organization.website || '',
        description: organization.description || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await organizationService.updateOrganization(organization.id, formData)
            if (response.success) {
                toast.success("Organization details updated successfully")
                onSuccess()
                onClose()
            } else {
                toast.error(response.error || "Failed to update organization")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-900">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-8 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <DialogTitle className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Edit Organization Details</DialogTitle>
                    </DialogHeader>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organization Name</Label>
                            <Input 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</Label>
                            <Input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</Label>
                            <Input 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Website</Label>
                            <Input 
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</Label>
                            <Input 
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</Label>
                            <Textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none text-[10px] font-black uppercase tracking-widest group"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save Changes <Save className="ml-3 h-3.5 w-3.5 group-hover:scale-110 transition-transform" /></>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
