'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, MapPin, Mail, Phone, Building2, User as UserIcon, ShieldCheck, Search, Plus, Globe, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks"
import { getUserInitials, cn } from "@/lib/utils"
import { organizationService } from "@/lib/services"
import { Organization } from "@/lib/types"
import { useState, useEffect } from 'react'
import { EditOrganizationDialog } from "./EditOrganizationDialog"
import { toast } from "sonner"

export function OrganizationInfoTab() {
    const { user } = useAuth()
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const fetchOrganization = async () => {
        setLoading(true)
        try {
            const response = await organizationService.getCurrentOrganization()
            if (response.success && response.data) {
                setOrganization(response.data)
            } else {
                toast.error(response.error || "Failed to fetch organization")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrganization()
    }, [])

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (!organization) {
        return (
            <div className="h-[400px] flex items-center justify-center text-gray-400 font-black uppercase tracking-widest">
                Organization not found
            </div>
        )
    }

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Profile Card (4 cols) */}
                <Card className="xl:col-span-4 border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <CardContent className="flex flex-col items-center justify-center p-10 space-y-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
                            <div className="h-40 w-40 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-5xl font-black text-indigo-600 relative z-10 border-4 border-white dark:border-gray-800 shadow-xl">
                                {user?.fullName ? getUserInitials(user.fullName) : 'A'}
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {user?.fullName || 'User Name'}
                            </h3>
                            <div className="flex items-center justify-center gap-2">
                                <Badge className="bg-rose-50 text-rose-600 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 uppercase text-[10px] px-4 py-1 font-black tracking-widest rounded-full">
                                    {user?.role?.replace('_', ' ') || 'ADMIN'}
                                </Badge>
                                <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 uppercase text-[10px] px-4 py-1 font-black tracking-widest rounded-full">
                                    ACTIVE
                                </Badge>
                            </div>
                        </div>

                        <div className="w-full space-y-4 pt-8 border-t border-gray-50 dark:border-gray-800">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-indigo-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">
                                    {user?.role?.replace('_', ' ') || 'Admin'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Organization Details Card (8 cols) */}
                <Card className="xl:col-span-8 border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden h-fit">
                    <CardHeader className="p-10 border-b border-gray-50 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-4xl font-black text-emerald-600 shadow-inner">
                                    O
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Organization Details</p>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                         {organization.name}
                                     </CardTitle>
                                     <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">ID: {organization.id}</p>
                                 </div>
                             </div>
                             <Button 
                                 className="h-14 px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none text-[10px] font-black uppercase tracking-widest group"
                                 onClick={() => setIsEditDialogOpen(true)}
                             >
                                 Edit Info <Pencil className="ml-3 h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                             </Button>
                         </div>
                     </CardHeader>
                     <CardContent className="p-10">
                         <h4 className={sectionHeaderClasses}>
                             <Globe className="h-4 w-4" />
                             Contact Details
                         </h4>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-2">
                                 <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                     <Phone className="h-4 w-4 text-indigo-600" />
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                 <p className="text-sm font-bold text-gray-900 dark:text-white">{organization.phone || 'N/A'}</p>
                             </div>
                             <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-2">
                                 <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                     <Mail className="h-4 w-4 text-indigo-600" />
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                 <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{organization.email || 'N/A'}</p>
                             </div>
                             <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-2">
                                 <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                     <MapPin className="h-4 w-4 text-indigo-600" />
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                 <p className="text-sm font-bold text-gray-900 dark:text-white">{organization.city || organization.address || 'N/A'}</p>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
             </div>

             {/* Organizations Table Section */}
             <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                 <CardHeader className="p-10 border-b border-gray-50 dark:border-gray-800 space-y-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="flex items-center gap-4">
                             <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none text-[10px] font-black uppercase tracking-widest">
                                 Switch Organization
                             </Button>
                             <Button variant="outline" className="h-12 px-6 border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 gap-2">
                                 <Plus className="h-3.5 w-3.5" />
                                 Add Organization
                             </Button>
                         </div>
                         <div className="relative group w-full md:w-[350px]">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                             <Input
                                 placeholder="Search here..."
                                 className="h-12 pl-12 pr-4 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-2xl text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-600/20"
                             />
                         </div>
                     </div>
                 </CardHeader>
                 <CardContent className="p-0">
                     <div className="relative w-full overflow-auto">
                         <table className="w-full text-sm text-left border-collapse">
                             <thead>
                                 <tr className="border-b border-gray-50 dark:border-gray-800">
                                     <th className="h-14 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-[80px]">Select</th>
                                     <th className="h-14 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID</th>
                                     <th className="h-14 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Organization Name</th>
                                     <th className="h-14 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                 <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all cursor-pointer">
                                     <td className="p-8 align-middle">
                                         <div className="flex items-center justify-center">
                                             <input type="checkbox" className="h-5 w-5 rounded-lg border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 transition-all" checked readOnly />
                                         </div>
                                     </td>
                                     <td className="p-8 align-middle">
                                         <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30">{organization.id}</span>
                                     </td>
                                     <td className="p-8 align-middle font-black text-gray-900 dark:text-white uppercase tracking-tight text-xs">{organization.name}</td>
                                     <td className="p-8 align-middle text-gray-400 font-bold text-xs">{organization.email}</td>
                                 </tr>
                             </tbody>
                         </table>
                         <div className="flex items-center justify-between p-8 border-t border-gray-50 dark:border-gray-800">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Records: 1</p>
                             <div className="flex gap-2">
                                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100 dark:border-gray-800 text-gray-400" disabled>&lt;</Button>
                                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100 dark:border-gray-800 text-gray-400" disabled>&gt;</Button>
                             </div>
                         </div>
                     </div>
                 </CardContent>
             </Card>

             <EditOrganizationDialog 
                isOpen={isEditDialogOpen} 
                onClose={() => setIsEditDialogOpen(false)} 
                organization={organization}
                onSuccess={fetchOrganization}
             />
         </div>
    )
}
