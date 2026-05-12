'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Edit,
    ArrowLeft,
    Loader2,
    Globe,
    Users,
    LayoutGrid,
    Calendar,
    Clock,
    ShieldCheck,
    Briefcase,
    BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { branchService } from '@/lib/services/branch.service'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { cn } from '@/lib/utils'

export default function BranchDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [branch, setBranch] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) {
            fetchBranchDetails(id as string)
        }
    }, [id])

    const fetchBranchDetails = async (branchId: string) => {
        try {
            setLoading(true)
            const res = await branchService.getById(branchId)
            if (res.success) {
                setBranch(res.data)
            } else {
                toast.error(res.error || 'Failed to load branch details')
                router.push('/admin/branches')
            }
        } catch (error) {
            console.error('Error fetching branch:', error)
            toast.error('Internal server error')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Loading branch profile...</p>
                </div>
            </div>
        )
    }

    if (!branch) return null

    const stats = [
        { title: 'Registered Students', value: branch._count?.students || 0, icon: Users, color: 'indigo' as const, trend: 'Total Capacity' },
        { title: 'Academic Status', value: branch.isActive ? 'Active' : 'Inactive', icon: ShieldCheck, color: branch.isActive ? 'emerald' as const : 'rose' as const, trend: 'Live Status' },
        { title: 'Contact Ready', value: branch.phone ? 'Verified' : 'Missing', icon: Phone, color: 'amber' as const, trend: 'Operations' },
        { title: 'Region', value: branch.city, icon: MapPin, color: 'sky' as const, trend: branch.state },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title={branch.name}
                description={`Regional operational overview and logistical profile for the ${branch.city} center.`}
                backHref="/admin/branches"
                actions={[
                    { label: 'Edit Profile', icon: Edit, variant: 'default', href: `/admin/branches/${id}/edit` }
                ]}
            />

            <StatsGrid stats={stats} columns={4} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Center Profile</h3>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Core organizational identity</p>
                                </div>
                            </div>
                            <Badge variant="outline" className={cn(
                                "rounded-lg font-black text-[10px] px-3 py-1 uppercase tracking-widest border",
                                branch.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-700 border-gray-100'
                            )}>
                                {branch.isActive ? 'Active Operational Center' : 'Inactive'}
                            </Badge>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600/70">About this branch</h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                    {branch.description || "No detailed profile description available for this regional center. Please update the branch configuration to provide more operational context."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-indigo-600" />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Physical Logistics</h5>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{branch.address || 'N/A'}</p>
                                        <p className="text-xs font-bold text-gray-500">{branch.city}, {branch.state}, {branch.country}</p>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">Postal Code: {branch.zipCode || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-4 w-4 text-indigo-600" />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Global Communication</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Official Email</p>
                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{branch.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Contact Line</p>
                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{branch.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Regional Activity */}
                <div className="space-y-8">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                            <h3 className="text-lg font-black tracking-tight">Meta Information</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">System audit and registration</p>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">Established</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white">
                                    {new Date(branch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">Organization ID</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                    {branch.organizationId.slice(0, 12)}...
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">System Integrity</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase tracking-widest">
                                    Verified
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-indigo-600 rounded-3xl overflow-hidden p-8 text-white relative group cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Users className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-black tracking-tight">Student Directory</h4>
                            <p className="text-xs font-bold text-white/70 leading-relaxed">View all students currently enrolled in the {branch.name} center across all courses.</p>
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-xl" asChild>
                                <Link href={`/admin/students?branchId=${branch.id}`}>Access Records</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
