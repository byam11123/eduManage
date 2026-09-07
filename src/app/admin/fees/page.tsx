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
    History,
    Printer
} from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useFees, useBranches } from '@/hooks'
import { format } from 'date-fns'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'
import { CollectFeeDialog } from '@/components/admin/fees/CollectFeeDialog'
import { ViewPaymentDialog } from '@/components/admin/students/view/ViewPaymentDialog'
import { ExportButton } from '@/components/shared/ExportButton'
import { Checkbox } from '@/components/ui/checkbox'
import { useTableFeatures, ColumnDef } from '@/hooks/useTableFeatures'
import { TableToolbar } from '@/components/shared/table/TableToolbar'
import { BulkActionBar } from '@/components/shared/table/BulkActionBar'
import { Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function FeesPage() {
    const { installments, stats, loading, fetchFees } = useFees()
    const { branches } = useBranches()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [branchFilter, setBranchFilter] = useState('all')
    const [monthFilter, setMonthFilter] = useState('current')

    // Collection State
    const [isCollectOpen, setIsCollectOpen] = useState(false)
    const [selectedInstallment, setSelectedInstallment] = useState<any>(null)
    const [viewInstallment, setViewInstallment] = useState<any>(null)
    const [isBulkExporting, setIsBulkExporting] = useState(false)

    const feeColumns: ColumnDef[] = [
        { id: 'student', label: 'Student & Course' },
        { id: 'dueDate', label: 'Due Date' },
        { id: 'amount', label: 'Amount' },
        { id: 'paid', label: 'Paid' },
        { id: 'status', label: 'Status' },
        { id: 'branch', label: 'Branch' },
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
    } = useTableFeatures(installments, feeColumns)

    const handleFilter = () => {
        fetchFees({
            search: searchTerm,
            status: statusFilter,
            branchId: branchFilter,
            monthFilter: monthFilter
        })
    }

    const handleCollect = (inst: any) => {
        setSelectedInstallment(inst)
        setIsCollectOpen(true)
    }

    const handleBulkExport = (ids: string[]) => {
        setIsBulkExporting(true)
        const selected = installments.filter(i => ids.includes(i.id))
        const data = selected.map(inst => ({
            student: inst.studentCourse?.student ? `${inst.studentCourse.student.firstName} ${inst.studentCourse.student.lastName}` : 'N/A',
            course: inst.studentCourse?.course?.name || 'N/A',
            dueDate: inst.dueDate ? format(new Date(inst.dueDate), 'dd MMM yyyy') : 'N/A',
            amount: inst.amount || 0,
            paid: inst.paidAmount || 0,
            balance: (inst.amount || 0) - (inst.paidAmount || 0),
            status: inst.status?.toUpperCase() || 'UNKNOWN',
            branch: inst.studentCourse?.student?.branch?.name || 'N/A'
        }))
        const headers = ['Student Name', 'Program', 'Due Date', 'Expected (₹)', 'Received (₹)', 'Balance (₹)', 'Status', 'Branch']
        const keys = ['student', 'course', 'dueDate', 'amount', 'paid', 'balance', 'status', 'branch']
        const csv = [headers.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'EduManage_Fees_Selected_Export.csv'
        a.click()
        URL.revokeObjectURL(url)
        setIsBulkExporting(false)
        toast.success(`${ids.length} installment(s) exported`)
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
            <div className="print:hidden">
                <PageHeader 
                    title="Fees Management"
                    description="Monitor installments, track revenue, and manage student dues with automated collection tracking."
                    actions={[
                        { label: 'Revenue Insights', icon: TrendingUp, variant: 'default' }
                    ]}
                >
                <ExportButton 
                    data={installments.map(inst => ({
                        student: inst.studentCourse?.student ? `${inst.studentCourse.student.firstName} ${inst.studentCourse.student.lastName}` : 'N/A',
                        course: inst.studentCourse?.course?.name || 'N/A',
                        dueDate: inst.dueDate ? format(new Date(inst.dueDate), 'dd MMM yyyy') : 'N/A',
                        amount: inst.amount || 0,
                        paid: inst.paidAmount || 0,
                        balance: (inst.amount || 0) - (inst.paidAmount || 0),
                        status: inst.status?.toUpperCase() || 'UNKNOWN',
                        branch: inst.studentCourse?.student?.branch?.name || 'N/A'
                    }))}
                    columns={[
                        { header: 'Student Name', dataKey: 'student' },
                        { header: 'Program', dataKey: 'course' },
                        { header: 'Due Date', dataKey: 'dueDate' },
                        { header: 'Expected (₹)', dataKey: 'amount' },
                        { header: 'Received (₹)', dataKey: 'paid' },
                        { header: 'Balance (₹)', dataKey: 'balance' },
                        { header: 'Status', dataKey: 'status' },
                        { header: 'Branch', dataKey: 'branch' },
                    ]}
                    fileName="EduManage_Fees_Ledger"
                    title="Institutional Revenue & Installment Report"
                    variant="outline"
                />
            </PageHeader>
            </div>

            <div className="print:hidden">
                <StatsGrid stats={feeStats} columns={4} />
            </div>

            {/* Filters Bar */}
            <Card className="print:hidden border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
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
                            <option value="overdue">Overdue</option>
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

                        <select 
                            className="h-12 px-4 rounded-xl border-none bg-gray-50/50 dark:bg-gray-800/50 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500/20 outline-none min-w-[140px]"
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                        >
                            <option value="current">Current Month</option>
                            <option value="all">All Time</option>
                        </select>

                        <Button 
                            className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none"
                            onClick={handleFilter}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Apply
                        </Button>
                        
                        <Button
                            variant="outline"
                            className="h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold shadow-sm"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
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
                    <div className="flex items-center gap-3 print:hidden">
                        <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow className="border-y border-gray-50 dark:border-gray-800 hover:bg-transparent">
                                    <TableHead className="w-[50px] px-8 py-5 print:hidden">
                                        <Checkbox
                                            checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                                            onCheckedChange={selectAll}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    {isColumnVisible('student') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Student &amp; Course</TableHead>}
                                    {isColumnVisible('dueDate') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Due Date</TableHead>}
                                    {isColumnVisible('amount') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Amount</TableHead>}
                                    {isColumnVisible('paid') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Paid</TableHead>}
                                    {isColumnVisible('status') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Status</TableHead>}
                                    {isColumnVisible('branch') && <TableHead className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-gray-500">Branch</TableHead>}
                                    <TableHead className="px-8 py-5 text-right font-black uppercase tracking-widest text-[10px] text-gray-500 print:hidden">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="px-8 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="font-bold uppercase tracking-widest text-xs">Fetching ledger data...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : installments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="px-8 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Wallet className="h-12 w-12 mb-2" />
                                                <p className="font-bold uppercase tracking-widest text-xs">No records found matching your filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : installments.map((inst) => {
                                    const student = inst.studentCourse.student
                                    const course = inst.studentCourse.course
                                    const isOverdue = inst.status !== 'paid' && new Date(inst.dueDate) < new Date()
                                    const isSelected = selectedIds.has(inst.id)

                                    return (
                                        <TableRow
                                            key={inst.id}
                                            className={cn(
                                                'transition-all group',
                                                isSelected
                                                    ? 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
                                                    : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                                            )}
                                        >
                                            <TableCell className="px-8 py-5 print:hidden" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleSelection(inst.id)}
                                                    aria-label={`Select installment`}
                                                />
                                            </TableCell>
                                            {isColumnVisible('student') && (
                                            <TableCell className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                        {student.firstName} {student.lastName}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-500/70 mt-0.5">{course.name}</span>
                                                </div>
                                            </TableCell>
                                            )}
                                            {isColumnVisible('dueDate') && (
                                            <TableCell className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className={cn('h-4 w-4', isOverdue ? 'text-rose-500' : 'text-gray-400')} />
                                                    <span className={cn(
                                                        'text-[13px] font-bold',
                                                        isOverdue ? 'text-rose-600 underline decoration-rose-200 underline-offset-4' : 'text-gray-600 dark:text-gray-400'
                                                    )}>
                                                        {format(new Date(inst.dueDate), 'dd MMM yyyy')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            )}
                                            {isColumnVisible('amount') && (
                                            <TableCell className="px-8 py-5 font-black text-gray-900 dark:text-white">₹{inst.amount.toLocaleString()}</TableCell>
                                            )}
                                            {isColumnVisible('paid') && (
                                            <TableCell className="px-8 py-5 text-emerald-600 font-black">₹{inst.paidAmount.toLocaleString()}</TableCell>
                                            )}
                                            {isColumnVisible('status') && (
                                            <TableCell className="px-8 py-5">
                                                <StatusBadge status={inst.status} />
                                            </TableCell>
                                            )}
                                            {isColumnVisible('branch') && (
                                            <TableCell className="px-8 py-5">
                                                <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] border-gray-100 dark:border-gray-800 py-1 bg-gray-50/50 dark:bg-gray-800/50">
                                                    {student.branch.name}
                                                </Badge>
                                            </TableCell>
                                            )}
                                            <TableCell className="px-8 py-5 text-right print:hidden">
                                                {inst.status !== 'paid' ? (
                                                    <Button
                                                        className="h-10 px-5 rounded-xl bg-gray-50 dark:bg-gray-800 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all border-none"
                                                        onClick={() => handleCollect(inst)}
                                                    >
                                                        Collect
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 transition-all"
                                                        onClick={() => setViewInstallment(inst)}
                                                        title="View payment details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="print:hidden">
                <BulkActionBar
                    selectedCount={selectedIds.size}
                    onClearSelection={clearSelection}
                    onExport={() => handleBulkExport(selectedArray)}
                    onDelete={() => toast.info('Fee records cannot be bulk deleted for audit integrity.')}
                    isExporting={isBulkExporting}
                />
            </div>

            {/* Dialogs */}
            <CollectFeeDialog 
                open={isCollectOpen}
                onOpenChange={setIsCollectOpen}
                installment={selectedInstallment}
                onSuccess={() => fetchFees()}
            />

            <ViewPaymentDialog
                isOpen={!!viewInstallment}
                onClose={() => setViewInstallment(null)}
                installment={viewInstallment}
            />
        </div>
    )
}
