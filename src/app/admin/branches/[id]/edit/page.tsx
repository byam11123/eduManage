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
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { branchService, type BranchFormData } from '@/lib/services/branch.service'

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
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/branches">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Branch</h1>
                    <p className="text-gray-500">Update branch details and location</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Branch Details */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Branch Details</CardTitle>
                        </div>
                        <CardDescription>Basic information about this branch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">Branch Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. NextGen Bilaspur"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Short description of this branch..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Location & Contact</CardTitle>
                        </div>
                        <CardDescription>Address and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="123 Main St"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <Label htmlFor="phone">Phone Number</Label>
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="+91..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <Label htmlFor="email">Email Address</Label>
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="branch@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/branches">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Update Branch
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}
