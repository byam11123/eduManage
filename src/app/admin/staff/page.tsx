'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Download,
    Mail,
    Phone,
    MapPin,
    Trash2,
    Edit,
    Eye,
    Users,
    UserCheck,
    Clock,
    Building2,
    Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStaff } from '@/hooks'
import { Staff } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function StaffListPage() {
    const router = useRouter()
    const { staff, loading, stats, search, setSearch, deleteStaff } = useStaff()

    const handleDelete = async (s: Staff) => {
        if (confirm(`Are you sure you want to delete ${s.fullName}? This action cannot be undone.`)) {
            await deleteStaff(s.id)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Staff Directory
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        Manage organizational hierarchy, roles, and branch assignments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all rounded-xl shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                    <Link href="/admin/staff/add">
                        <Button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all rounded-xl gap-2 font-bold uppercase tracking-wider text-xs">
                            <Plus className="w-4 h-4" />
                            Onboard Staff
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'Active Workforce', value: stats.total, icon: Users, color: 'indigo', trend: '+2 new this month' },
                    { title: 'On Duty Today', value: stats.active, icon: UserCheck, color: 'emerald', trend: '98% attendance' },
                    { title: 'Leave/Absence', value: stats.onLeave, icon: Clock, color: 'amber', trend: 'Scheduled leaves' },
                ].map((stat, i) => (
                    <Card key={i} className="relative overflow-hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl group transition-all hover:-translate-y-1">
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color}-500`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-1 uppercase">
                                <span className={stat.color === 'emerald' ? 'text-emerald-500' : ''}>{stat.trend}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="relative w-full md:w-1/3 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Search by name, code or phone..."
                        className="pl-11 h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 rounded-xl focus-visible:ring-indigo-500/20 transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="ghost" className="h-10 px-4 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" />
                        Advance Filter
                    </Button>
                    <Badge variant="secondary" className="h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none font-bold text-[10px]">
                        Showing {staff.length} Employees
                    </Badge>
                </div>
            </div>

            {/* Table Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="font-bold text-xs uppercase tracking-wider h-14 pl-6">Profile & ID</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider h-14">Role & Placement</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider h-14">Connectivity</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider h-14">Tenure</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider h-14">Status</TableHead>
                            <TableHead className="text-right font-bold text-xs uppercase tracking-wider h-14 pr-6">Management</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={6} className="h-20 bg-gray-50/30 dark:bg-gray-800/10" />
                                </TableRow>
                            ))
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                                        <Users className="w-12 h-12 opacity-10" />
                                        <p className="font-medium">No personnel found matching your criteria</p>
                                        <Button variant="link" onClick={() => setSearch('')} className="text-indigo-600">Clear all filters</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((s) => (
                                <TableRow key={s.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="h-11 w-11 border-2 border-white dark:border-gray-800 shadow-sm">
                                                    <AvatarImage src={s.profileImage} />
                                                    <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">{s.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${s.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{s.fullName}</span>
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-1.5 rounded mt-1">{s.employeeCode}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="w-3 h-3 text-muted-foreground" />
                                                <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{s.designation}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-[11px] text-muted-foreground">{s.branchName || 'Head Office'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 group/link cursor-pointer">
                                                <div className="p-1 rounded bg-gray-100 dark:bg-gray-800 group-hover/link:bg-indigo-100 dark:group-hover/link:bg-indigo-900/30 transition-colors">
                                                    <Phone className="w-2.5 h-2.5 text-gray-500 group-hover/link:text-indigo-600" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover/link:text-indigo-600 transition-colors">{s.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/link cursor-pointer">
                                                <div className="p-1 rounded bg-gray-100 dark:bg-gray-800 group-hover/link:bg-indigo-100 dark:group-hover/link:bg-indigo-900/30 transition-colors">
                                                    <Mail className="w-2.5 h-2.5 text-gray-500 group-hover/link:text-indigo-600" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover/link:text-indigo-600 transition-colors truncate max-w-[120px]">{s.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Joined On</span>
                                            <span className="text-[11px] text-muted-foreground">{s.dateOfJoining ? formatDate(s.dateOfJoining) : 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                                                s.status === 'on_leave' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                                                    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }>
                                            <div className={`h-1 w-1 rounded-full mr-1.5 ${s.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{s.status.replace('_', ' ')}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-2xl border-gray-100 dark:border-gray-800">
                                                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 font-medium text-xs">
                                                    <Eye className="w-4 h-4" /> View Full Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 font-medium text-xs">
                                                    <Edit className="w-4 h-4" /> Edit Professional Info
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer py-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20 font-bold text-xs" onClick={() => handleDelete(s)}>
                                                    <Trash2 className="w-4 h-4" /> Terminate Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
