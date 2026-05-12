'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Save,
    ArrowLeft,
    Loader2,
    Globe,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { branchService, type BranchFormData } from '@/lib/services/branch.service'
import { PageHeader } from '@/components/shared/PageHeader'

export default function EditBranchPage() {
    const router = useRouter()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        email: ''
    })

    useEffect(() => {
        if (id) {
            fetchBranch(id as string)
        }
    }, [id])

    const fetchBranch = async (branchId: string) => {
        try {
            const res = await branchService.getById(branchId)
            if (res.success && res.data) {
                const b = res.data
                setFormData({
                    name: b.name,
                    description: b.description || '',
                    address: b.address || '',
                    city: b.city || '',
                    state: b.state || '',
                    country: b.country || '',
                    phone: b.phone || '',
                    email: b.email || ''
                })
            } else {
                setError('Failed to load branch details')
            }
        } catch (err) {
            setError('Error loading branch')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError('')

        try {
            const res = await branchService.update(id as string, formData)
            if (res.success) {
                toast.success('Branch updated successfully')
                router.push('/admin/branches')
                router.refresh()
            } else {
                throw new Error(res.error || 'Failed to update branch')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message)
            toast.error(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                    <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Loading branch registry...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Edit Branch Configuration"
                description="Update regional parameters, contact logistics, and operational descriptions for this location."
                backHref="/admin/branches"
            />

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Core Identity */}
                        <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Core Identity</h3>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Primary branch naming and profiling</p>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Branch Name</Label>
                                    <Input
                                        name="name"
                                        placeholder="e.g. NextGen Bilaspur Center"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Operational Description</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Detailed profile and focus areas of this regional center..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-gray-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20 p-4 min-h-[120px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logistics & Contact */}
                        <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Global Logistics</h3>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Physical address and communication channels</p>
                                </div>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</Label>
                                    <Input
                                        name="address"
                                        placeholder="Full physical location details..."
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-4"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</Label>
                                        <Input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-4"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">State / Province</Label>
                                        <Input
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-4"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Country</Label>
                                        <Input
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20 px-4"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Official Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="pl-11 h-12 bg-gray-50 border-none rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Guidance & Actions */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-indigo-600 rounded-3xl overflow-hidden p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Info className="h-32 w-32 rotate-12" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Configuration Guide</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                                        <p className="text-xs font-bold text-white/80 leading-relaxed">Ensure branch names are unique across the global network.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                                        <p className="text-xs font-bold text-white/80 leading-relaxed">Official communication channels will be visible to all assigned students.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                                        <p className="text-xs font-bold text-white/80 leading-relaxed">Geo-logistics are used for regional reporting and fee tax calculations.</p>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <Button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="w-full h-14 bg-white hover:bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl transition-all active:scale-95"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Synchronizing...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Commit Changes
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/admin/branches" className="block text-center mt-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                                        Abandon Changes
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
