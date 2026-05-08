'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
    Search, 
    Filter, 
    Download, 
    Wallet, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    History
} from 'lucide-react'
import { useFees, useBranches } from '@/hooks'
import { format } from 'date-fns'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

export default function FeesPage() {
    const { installments, stats, loading, fetchFees } = useFees()
    const { branches } = useBranches()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [branchFilter, setBranchFilter] = useState('all')

    const handleFilter = () => {
        fetchFees({
            search: searchTerm,
            status: statusFilter,
            branchId: branchFilter
        })
    }

    const feeStats = [
        {
            title: 'Total Expected',
            value: `₹${stats.totalExpected.toLocaleString()}`,
            icon: Wallet,
            color: 'indigo' as const,
            trend: 'Base Target'
        },
        {
            title: 'Total Received',
            value: `₹${stats.totalReceived.toLocaleString()}`,
            icon: CheckCircle2,
            color: 'emerald' as const,
            trend: `${Math.round((stats.totalReceived / stats.totalExpected) * 100) || 0}% Collection`
        },
        {
            title: 'Pending Dues',
            value: `₹${stats.totalPending.toLocaleString()}`,
            icon: TrendingUp,
            color: 'amber' as const,
            trend: 'Action Required'
        },
        {
            title: 'Overdue Dues',
            value: stats.overdueCount,
            icon: AlertCircle,
            color: 'rose' as const,
            trend: 'Critical Attention'
        }
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Fees Management"
                description="Monitor installments, track revenue, and manage student dues with automated collection tracking."
                actions={[
                    { label: 'Export Report', icon: Download, variant: 'outline' },
                    { label: 'Revenue Insights', icon: TrendingUp, variant: 'default' }
                ]}
            />

            <StatsGrid stats={feeStats} columns={4} />

            {/* Filters Bar */}
            <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        <Input 
                            placeholder="Search by student name, email, or phone..." 
                            className="pl-11 h-12 border-none bg-gray-50/50 dark:bg-gray-800/50 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                            className="h-12 px-4 rounded-xl border-none bg-gray-50/50 dark:bg-gray-800/50 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500/20 outline-none min-w-[140px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="pending">Pending</option>
                        </select>

                        <select 
                            className="h-12 px-4 rounded-xl border-none bg-gray-50/50 dark:bg-gray-800/50 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500/20 outline-none min-w-[160px]"
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                        >
                            <option value="all">All Branches</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <Button 
                            className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none"
                            onClick={handleFilter}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Apply
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Table */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <IndianRupee className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight">Installment Records</CardTitle>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter mt-0.5">Live transaction tracking</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl text-gray-400">
                        <History className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-y border-gray-50 dark:border-gray-800">
                                <tr>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Student & Course</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Due Date</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Amount</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Paid</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Status</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Branch</th>
                                    <th className="px-8 py-5 text-right font-black uppercase tracking-widest text-[10px] text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="font-bold uppercase tracking-widest text-xs">Fetching ledger data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : installments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Wallet className="h-12 w-12 mb-2" />
                                                <p className="font-bold uppercase tracking-widest text-xs">No records found matching your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : installments.map((inst) => {
                                    const student = inst.studentCourse.student
                                    const course = inst.studentCourse.course
                                    const isOverdue = inst.status !== 'paid' && new Date(inst.dueDate) < new Date()

                                    return (
                                        <tr key={inst.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                        {student.firstName} {student.lastName}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-500/70 mt-0.5">{course.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className={cn("h-4 w-4", isOverdue ? "text-rose-500" : "text-gray-400")} />
                                                    <span className={cn(
                                                        "text-[13px] font-bold",
                                                        isOverdue ? 'text-rose-600 underline decoration-rose-200 underline-offset-4' : 'text-gray-600 dark:text-gray-400'
                                                    )}>
                                                        {format(new Date(inst.dueDate), 'dd MMM yyyy')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-black text-gray-900 dark:text-white">₹{inst.amount.toLocaleString()}</td>
                                            <td className="px-8 py-5 text-emerald-600 font-black">₹{inst.paidAmount.toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <StatusBadge status={inst.status} />
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] border-gray-100 dark:border-gray-800 py-1 bg-gray-50/50 dark:bg-gray-800/50">
                                                    {student.branch.name}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Button 
                                                    className="h-10 px-5 rounded-xl bg-gray-50 dark:bg-gray-800 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all border-none"
                                                >
                                                    Collect
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
