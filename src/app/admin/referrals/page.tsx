'use client'

import React, { useState, useEffect } from 'react'
import { 
    Users, 
    UserPlus, 
    TrendingUp, 
    Wallet, 
    ChevronRight, 
    Search, 
    Filter, 
    MoreHorizontal,
    ExternalLink,
    CheckCircle2,
    Clock,
    XCircle,
    HandCoins,
    Edit3,
    Trash2,
    ChevronDown,
    FileText,
    Table as TableIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials, cn } from '@/lib/utils'
import { useReferrals } from '@/hooks'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { AddReferrerDialog } from '@/components/admin/referrals/AddReferrerDialog'
import { ProcessPayoutDialog } from '@/components/admin/referrals/ProcessPayoutDialog'

export default function ReferralsPage() {
    const { 
        referrers, 
        referrals, 
        stats: dbStats, 
        loading, 
        fetchAllData,
        exportReferrers,
        exportReferralLog
    } = useReferrals()
    const [activeTab, setActiveTab] = useState('overview')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)
    const [selectedReferrer, setSelectedReferrer] = useState<any>(null)
    const [selectedReferral, setSelectedReferral] = useState<any>(null)

    const { updateReferrer, deleteReferrer } = useReferrals()

    const handleOpenPayout = (referral: any) => {
        setSelectedReferral(referral)
        setIsPayoutDialogOpen(true)
    }

    const handleToggleStatus = async (referrer: any) => {
        const newStatus = referrer.status === 'active' ? 'inactive' : 'active'
        const success = await updateReferrer(referrer.id, { status: newStatus })
        if (success) {
            toast.success(`Partner ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
        } else {
            toast.error("Failed to update status")
        }
    }

    const handleDeleteReferrer = async (id: string) => {
        if (!confirm("Are you sure you want to delete this partner? This action cannot be undone.")) return
        const success = await deleteReferrer(id)
        if (success) {
            toast.success("Partner deleted successfully")
        } else {
            toast.error("Failed to delete partner")
        }
    }

    const handleEditReferrer = (referrer: any) => {
        setSelectedReferrer(referrer)
        setIsAddDialogOpen(true)
    }

    const closeDialog = () => {
        setIsAddDialogOpen(false)
        setSelectedReferrer(null)
    }

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // Local stats with fallbacks
    const totalReferrers = dbStats?.totalReferrers || 0
    const totalReferrals = dbStats?.totalReferrals || 0
    const convertedCount = dbStats?.converted || 0
    const conversionRate = totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0
    const rewardsPaid = dbStats?.paidRewards?._sum?.rewardAmount || 0
    const rewardsPending = dbStats?.pendingRewards?._sum?.rewardAmount || 0

    const stats = [
        { label: 'Total Referrers', value: totalReferrers.toString(), sub: 'Across all branches', icon: Users, color: 'indigo' },
        { label: 'Active Referrals', value: totalReferrals.toString(), sub: `${totalReferrals - convertedCount} pending join`, icon: TrendingUp, color: 'emerald' },
        { label: 'Converted', value: convertedCount.toString(), sub: `${conversionRate}% conversion`, icon: CheckCircle2, color: 'blue' },
        { label: 'Rewards Paid', value: `₹${(rewardsPaid / 1000).toFixed(1)}k`, sub: `₹${rewardsPending} pending`, icon: Wallet, color: 'amber' },
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-none font-bold px-3 py-1">
                            Partner Program
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Referral Management</h1>
                    <p className="text-gray-500 font-medium max-w-lg leading-relaxed">
                        Track agents, students, and partners who refer new admissions to your institution.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-12 rounded-2xl border-gray-200 font-bold px-6 hover:bg-gray-50 transition-all gap-2">
                                Export Report
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-none bg-white dark:bg-gray-900">
                            <DropdownMenuItem 
                                onClick={() => activeTab === 'referrers' ? exportReferrers('excel') : exportReferralLog('excel')}
                                className="rounded-xl h-12 font-bold gap-3 cursor-pointer"
                            >
                                <TableIcon className="h-4 w-4 text-emerald-500" />
                                Export as Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => activeTab === 'referrers' ? exportReferrers('pdf') : exportReferralLog('pdf')}
                                className="rounded-xl h-12 font-bold gap-3 cursor-pointer"
                            >
                                <FileText className="h-4 w-4 text-rose-500" />
                                Export as PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                        onClick={() => setIsAddDialogOpen(true)}
                        className="h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 font-bold px-6 gap-2"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Referrer
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden group hover:scale-[1.02] transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <Badge variant="outline" className="border-none bg-gray-50 dark:bg-gray-800 font-bold text-[10px] text-gray-400">DAILY</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">{stat.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border-none h-auto">
                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg text-sm">Overview</TabsTrigger>
                        <TabsTrigger value="referrers" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg text-sm">Partners</TabsTrigger>
                        <TabsTrigger value="referrals" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-lg text-sm">Referral Log</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input className="w-64 h-12 pl-12 rounded-2xl bg-white dark:bg-gray-900 border-none shadow-lg shadow-gray-200/20 font-medium" placeholder="Search partners..." />
                        </div>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-900 shadow-lg shadow-gray-200/20">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="overview" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Top Partners List */}
                        <Card className="lg:col-span-2 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem]">
                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight">Top Performing Partners</CardTitle>
                                        <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ranked by conversion rate</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="font-bold text-indigo-600" onClick={() => setActiveTab('referrers')}>View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    {referrers.slice(0, 3).map((referrer) => (
                                        <div key={referrer.id} className="group flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-14 w-14 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl shadow-gray-200/50">
                                                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-lg">
                                                        {getUserInitials(referrer.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{referrer.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-none bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30">{referrer.type}</Badge>
                                                        <span className="text-[10px] font-bold text-gray-400">{referrer.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-gray-900 dark:text-white">{referrer._count?.referrals || 0}</p>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Admissions</p>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="rounded-2xl h-12 w-12 opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => handleEditReferrer(referrer)}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {referrers.length === 0 && (
                                        <div className="h-32 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No partners found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem]">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-2xl font-black tracking-tight">Recent Activity</CardTitle>
                                <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live referral feed</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-8">
                                        {referrals.map((referral) => (
                                            <div key={referral.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] before:w-px before:bg-gray-100 dark:before:bg-gray-800 last:before:hidden">
                                                <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-gray-900 shadow-lg shadow-indigo-500/50" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                                        <span className="font-black text-indigo-600">{referral.referrer?.name}</span> referred <span className="font-black">{referral.student?.firstName} {referral.student?.lastName}</span>
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={`text-[9px] font-black uppercase px-2 py-0.5 border-none ${
                                                            referral.status === 'joined' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                            {referral.status}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-gray-400">{format(new Date(referral.createdAt), 'MMM dd, yyyy')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {referrals.length === 0 && (
                                            <div className="h-32 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No recent activity</div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="referrers" className="animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-800">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Partner Details</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Referrals</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Earnings</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrers.map((ref) => (
                                        <tr key={ref.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-600">
                                                        {getUserInitials(ref.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 dark:text-white">{ref.name}</p>
                                                        <p className="text-xs font-bold text-gray-400">{ref.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <Badge variant="secondary" className="capitalize font-bold rounded-lg border-none bg-gray-100 text-gray-600">{ref.type}</Badge>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-black text-gray-900 dark:text-white">{ref._count?.referrals || 0}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-black text-indigo-600">₹{(ref.totalEarned || 0).toLocaleString()}</p>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${ref.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${ref.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                        {ref.status || 'active'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                                                        <DropdownMenuItem 
                                                            className="rounded-xl font-bold py-2.5 gap-2 cursor-pointer"
                                                            onClick={() => handleEditReferrer(ref)}
                                                        >
                                                            <Edit3 className="h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-xl font-bold py-2.5 gap-2 cursor-pointer"
                                                            onClick={() => handleToggleStatus(ref)}
                                                        >
                                                            {ref.status === 'active' ? (
                                                                <><XCircle className="h-4 w-4 text-amber-600" /> Deactivate</>
                                                            ) : (
                                                                <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Activate</>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800 my-1" />
                                                        <DropdownMenuItem 
                                                            className="rounded-xl font-bold py-2.5 gap-2 text-rose-600 hover:text-rose-700 cursor-pointer"
                                                            onClick={() => handleDeleteReferrer(ref.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete Partner
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                    {referrers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">No partners found in database</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="referrals" className="animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-800">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Name</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Referrer</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Join Status</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Reward Status</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map((log) => (
                                        <tr key={log.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <td className="p-6">
                                                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-xs">{log.student?.firstName} {log.student?.lastName}</p>
                                                <p className="text-[9px] font-bold text-gray-400">{log.student?.admissionDisplayId}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-indigo-600 text-xs">{log.referrer?.name}</p>
                                            </td>
                                            <td className="p-6 text-gray-500 font-medium text-xs">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</td>
                                            <td className="p-6">
                                                <Badge className={`font-black uppercase tracking-tighter rounded-lg border-none px-3 text-[9px] ${
                                                    log.status === 'joined' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {log.rewardStatus === 'paid' ? (
                                                        <HandCoins className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-amber-500" />
                                                    )}
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                        log.rewardStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                                                    }`}>
                                                        {log.rewardStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-black text-gray-900 dark:text-white text-xs">₹{(log.rewardAmount || 0).toLocaleString()}</p>
                                            </td>
                                            <td className="p-6 text-right">
                                                {log.rewardStatus !== 'paid' && log.status === 'joined' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleOpenPayout(log)}
                                                        className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                                    >
                                                        Mark as Paid
                                                    </Button>
                                                )}
                                                {log.rewardStatus === 'paid' && (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-end gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Processed
                                                        </span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {log.payoutMode} • {log.payoutTransactionId?.slice(-6)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {referrals.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center text-gray-400 font-black uppercase tracking-widest text-[10px]">No referrals logged yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <AddReferrerDialog 
                isOpen={isAddDialogOpen} 
                onClose={closeDialog} 
                onSuccess={fetchAllData}
                initialData={selectedReferrer}
            />

            <ProcessPayoutDialog 
                isOpen={isPayoutDialogOpen}
                onClose={() => {
                    setIsPayoutDialogOpen(false)
                    setSelectedReferral(null)
                }}
                referral={selectedReferral}
                onSuccess={fetchAllData}
            />
        </div>
    )
}
