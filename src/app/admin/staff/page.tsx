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
    Briefcase,
    LayoutGrid,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { cn } from '@/lib/utils'
import { ExportButton } from '@/components/shared/ExportButton'
import { Checkbox } from '@/components/ui/checkbox'
import { useTableFeatures, ColumnDef } from '@/hooks/useTableFeatures'
import { TableToolbar } from '@/components/shared/table/TableToolbar'
import { BulkActionBar } from '@/components/shared/table/BulkActionBar'

export default function StaffListPage() {
    const router = useRouter()
    const { staff, loading, stats, search, setSearch, deleteStaff } = useStaff()

    const staffColumns: ColumnDef[] = [
        { id: 'profile', label: 'Profile & ID' },
        { id: 'role', label: 'Role & Placement' },
        { id: 'contact', label: 'Connectivity' },
        { id: 'tenure', label: 'Tenure' },
        { id: 'status', label: 'Status' },
    ]

    const {
        selectedIds,
        selectedArray,
        toggleSelection,
        selectAll,
        clearSelection,
        isAllSelected,
        isSomeSelected,
        visibleColumns,
        toggleColumn,
        isColumnVisible,
        availableColumns
    } = useTableFeatures(staff, staffColumns)

    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isBulkExporting, setIsBulkExporting] = useState(false)

    const handleDelete = async (s: Staff) => {
        if (confirm(`Are you sure you want to delete ${s.fullName}? This action cannot be undone.`)) {
            await deleteStaff(s.id)
        }
    }

    const handleBulkDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} staff member(s)? This cannot be undone.`)) return
        setIsBulkDeleting(true)
        for (const id of ids) {
            await deleteStaff(id)
        }
        setIsBulkDeleting(false)
        toast.success(`${ids.length} staff member(s) deleted`)
    }

    const handleBulkExport = (ids: string[]) => {
        setIsBulkExporting(true)
        const selected = staff.filter(s => ids.includes(s.id))
        const data = selected.map(s => ({
            code: s.employeeCode,
            name: s.fullName,
            designation: s.designation,
            email: s.email,
            phone: s.phone || 'N/A',
            joining: s.dateOfJoining ? formatDate(s.dateOfJoining) : 'N/A',
            status: s.status.toUpperCase(),
            branch: s.branchName || 'Head Office'
        }))
        const headers = ['Employee ID', 'Staff Name', 'Designation', 'Email', 'Phone', 'Joining Date', 'Status', 'Placement']
        const keys = ['code', 'name', 'designation', 'email', 'phone', 'joining', 'status', 'branch']
        const csv = [headers.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'EduManage_Staff_Export.csv'
        a.click()
        URL.revokeObjectURL(url)
        setIsBulkExporting(false)
        toast.success(`${ids.length} staff member(s) exported`)
    }

    const staffStats = [
        { title: 'Active Workforce', value: stats.total, icon: Users, color: 'indigo' as const, trend: 'Global Hierarchy' },
        { title: 'On Duty Today', value: stats.active, icon: UserCheck, color: 'emerald' as const, trend: 'Attendance High' },
        { title: 'Scheduled Leaves', value: stats.onLeave, icon: Clock, color: 'amber' as const, trend: 'Planned Absence' },
        { title: 'Open Positions', value: 0, icon: Briefcase, color: 'sky' as const, trend: 'Institutional Growth' },
    ]

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Staff Directory"
                description="Coordinate institutional hierarchy, manage professional profiles, and oversee regional personnel assignments."
                actions={[
                    { label: 'Onboard Staff', icon: Plus, variant: 'default', href: '/admin/staff/add' }
                ]}
            >
                <ExportButton 
                    data={staff.map(s => ({
                        code: s.employeeCode,
                        name: s.fullName,
                        designation: s.designation,
                        email: s.email,
                        phone: s.phone || 'N/A',
                        joining: s.dateOfJoining ? formatDate(s.dateOfJoining) : 'N/A',
                        status: s.status.toUpperCase(),
                        branch: s.branchName || 'Head Office'
                    }))}
                    columns={[
                        { header: 'Employee ID', dataKey: 'code' },
                        { header: 'Staff Name', dataKey: 'name' },
                        { header: 'Designation', dataKey: 'designation' },
                        { header: 'Email', dataKey: 'email' },
                        { header: 'Phone', dataKey: 'phone' },
                        { header: 'Joining Date', dataKey: 'joining' },
                        { header: 'Status', dataKey: 'status' },
                        { header: 'Placement', dataKey: 'branch' },
                    ]}
                    fileName="EduManage_Staff_Roster"
                    title="Institutional Workforce Registry"
                    variant="outline"
                />
            </PageHeader>

            <StatsGrid stats={staffStats} columns={4} />

            {/* Controls Bar */}
            <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        <Input
                            placeholder="Search by name, employee code, or phone..."
                            className="pl-11 h-12 border-none bg-gray-50/50 dark:bg-gray-800/50 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button variant="ghost" className="h-12 px-4 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                        <Badge variant="secondary" className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none font-black text-[10px] uppercase tracking-widest">
                            {staff.length} Personnel
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Personnel Registry</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Authorized institutional workforce</p>
                        </div>
                    </div>
                    <div className="flex-none">
                        <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                    </div>
                </div>
                <div className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-50 dark:border-gray-800 hover:bg-transparent h-16">
                                <TableHead className="w-[50px] pl-8">
                                    <Checkbox
                                        checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                                        onCheckedChange={selectAll}
                                        aria-label="Select all"
                                    />
                                </TableHead>
                                {isColumnVisible('profile') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 pl-4">Profile & ID</TableHead>}
                                {isColumnVisible('role') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Role & Placement</TableHead>}
                                {isColumnVisible('contact') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Connectivity</TableHead>}
                                {isColumnVisible('tenure') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Tenure</TableHead>}
                                {isColumnVisible('status') && <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Status</TableHead>}
                                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-gray-400 pr-8">Ops</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell colSpan={6} className="h-20 bg-gray-50/10 dark:bg-gray-800/10" />
                                    </TableRow>
                                ))
                            ) : staff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
                                            <LayoutGrid className="w-12 h-12 text-gray-300" />
                                            <p className="font-black text-xs uppercase tracking-widest text-gray-400">No personnel found</p>
                                            <Button variant="link" onClick={() => setSearch('')} className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Clear all filters</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                staff.map((s) => {
                                    const isSelected = selectedIds.has(s.id)
                                    return (
                                    <TableRow key={s.id} className={cn(
                                        "group transition-all border-b border-gray-50 dark:border-gray-800 last:border-0",
                                        isSelected
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
                                            : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                                    )}>
                                        {/* Per-row checkbox */}
                                        <TableCell className="w-[50px] pl-8 py-5" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleSelection(s.id)}
                                                aria-label={`Select ${s.fullName}`}
                                            />
                                        </TableCell>
                                        {isColumnVisible('profile') && (
                                        <TableCell className="pl-4 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative shrink-0">
                                                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-md">
                                                        <AvatarImage src={s.profileImage} />
                                                        <AvatarFallback className="bg-indigo-600 text-white font-black text-xs uppercase">{s.fullName.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 ${s.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{s.fullName}</span>
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mt-0.5">{s.employeeCode}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        )}
                                        {isColumnVisible('role') && (
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="font-black text-xs text-gray-700 dark:text-gray-300 uppercase tracking-tight">{s.designation}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{s.branchName || 'Central Head Office'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        )}
                                        {isColumnVisible('contact') && (
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 group/link cursor-pointer">
                                                    <div className="h-6 w-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover/link:bg-indigo-50 transition-colors">
                                                        <Phone className="w-3 h-3 text-gray-400 group-hover/link:text-indigo-600" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover/link:text-indigo-600 transition-colors">{s.phone || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 group/link cursor-pointer">
                                                    <div className="h-6 w-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover/link:bg-indigo-50 transition-colors">
                                                        <Mail className="w-3 h-3 text-gray-400 group-hover/link:text-indigo-600" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover/link:text-indigo-600 transition-colors truncate max-w-[150px]">{s.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        )}
                                        {isColumnVisible('tenure') && (
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tenure Since</span>
                                                <span className="text-xs font-black text-gray-900 dark:text-white mt-0.5">{s.dateOfJoining ? formatDate(s.dateOfJoining) : 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        )}
                                        {isColumnVisible('status') && (
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "rounded-lg font-black text-[10px] px-2 py-0.5 uppercase tracking-widest border",
                                                s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                s.status === 'on_leave' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                            )}>
                                                {s.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        )}
                                        <TableCell className="text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-none bg-white dark:bg-gray-900">
                                                    <DropdownMenuItem 
                                                        className="rounded-xl gap-3 cursor-pointer py-3 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 font-bold text-[10px] uppercase tracking-widest"
                                                        onClick={() => router.push(`/admin/staff/${s.id}`)}
                                                    >
                                                        <Eye className="w-4 h-4" /> View Full Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl gap-3 cursor-pointer py-3 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 font-bold text-[10px] uppercase tracking-widest"
                                                        onClick={() => router.push(`/admin/staff/${s.id}/edit`)}
                                                    >
                                                        <Edit className="w-4 h-4" /> Professional Settings
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl gap-3 cursor-pointer py-3 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20 font-black text-[10px] uppercase tracking-widest" 
                                                        onClick={() => handleDelete(s)}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Terminate Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <BulkActionBar
                selectedCount={selectedIds.size}
                onClearSelection={clearSelection}
                onExport={() => handleBulkExport(selectedArray)}
                onDelete={() => handleBulkDelete(selectedArray)}
                isExporting={isBulkExporting}
                isDeleting={isBulkDeleting}
            />
        </div>
    )
}
