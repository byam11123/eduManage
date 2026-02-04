'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Save,
    ArrowLeft,
    Loader2,
    UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CreateBranchPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        // Admin User Details
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    })

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/branches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to create branch')
            }

            // Success
            alert('Branch created successfully!') // Replace with toast if available
            router.push('/admin/branches')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
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
                    <h1 className="text-2xl font-bold tracking-tight">Create New Branch</h1>
                    <p className="text-gray-500">Add a new location and optionally create its admin user</p>
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
                        <CardDescription>Basic information about the new branch</CardDescription>
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

                {/* Branch Admin User (Optional) */}
                <Card className="border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Branch Administrator</CardTitle>
                        </div>
                        <CardDescription>Create a login for the branch manager (Optional)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adminName">Admin Full Name</Label>
                                <Input
                                    id="adminName"
                                    name="adminName"
                                    placeholder="e.g. John Manager"
                                    value={formData.adminName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="adminEmail">Admin Email</Label>
                                <Input
                                    id="adminEmail"
                                    name="adminEmail"
                                    type="email"
                                    placeholder="manager@branch.com"
                                    value={formData.adminEmail}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="adminPassword">Admin Password</Label>
                                <Input
                                    id="adminPassword"
                                    name="adminPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.adminPassword}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">This user will be created as 'Branch Admin' and linked to this branch.</p>
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
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input
                                    id="zipCode"
                                    name="zipCode"
                                    placeholder="Zip Code"
                                    value={formData.zipCode}
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
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Create Branch
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}
