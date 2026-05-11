import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Mail, Phone, Building2, Calendar, Target } from "lucide-react"
import type { Lead } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useTableFeatures, ColumnDef } from "@/hooks/useTableFeatures"
import { TableToolbar } from "@/components/shared/table/TableToolbar"
import { BulkActionBar } from "@/components/shared/table/BulkActionBar"

interface LeadListProps {
    leads: Lead[]
    loading: boolean
    onEdit: (lead: Lead) => void
    onDelete: (lead: Lead) => void
    onBulkDelete?: (ids: string[]) => void
    onBulkExport?: (ids: string[]) => void
    isBulkDeleting?: boolean
    isBulkExporting?: boolean
}

const STAGE_COLORS: Record<string, string> = {
    new: 'bg-blue-50 text-blue-600 border-blue-100',
    contacted: 'bg-amber-50 text-amber-600 border-amber-100',
    qualified: 'bg-violet-50 text-violet-600 border-violet-100',
    proposal: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    negotiation: 'bg-orange-50 text-orange-600 border-orange-100',
    won: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    lost: 'bg-rose-50 text-rose-600 border-rose-100',
}

export function LeadList({
    leads,
    loading,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkExport,
    isBulkDeleting,
    isBulkExporting
}: LeadListProps) {
    const columns: ColumnDef[] = [
        { id: 'lead', label: 'Target Lead' },
        { id: 'context', label: 'Context & Pipeline' },
        { id: 'communication', label: 'Communication' },
        { id: 'value', label: 'Projected Value' },
        { id: 'stage', label: 'Pipeline Stage' },
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
    } = useTableFeatures(leads, columns)

    if (loading) return null // Handled by parent

    return (
        <div className="flex flex-col">
            {/* Toolbar header row */}
            <div className="px-8 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-end">
                <TableToolbar columns={availableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 h-16 hover:bg-transparent">
                        <TableHead className="w-[50px] px-8">
                            <Checkbox
                                checked={isAllSelected || (isSomeSelected ? 'indeterminate' : false)}
                                onCheckedChange={selectAll}
                                aria-label="Select all"
                            />
                        </TableHead>
                        {isColumnVisible('lead') && <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Target Lead</TableHead>}
                        {isColumnVisible('context') && <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Context & Pipeline</TableHead>}
                        {isColumnVisible('communication') && <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Communication</TableHead>}
                        {isColumnVisible('value') && <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Projected Value</TableHead>}
                        {isColumnVisible('stage') && <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Pipeline Stage</TableHead>}
                        <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Ops</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="h-12 w-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <p className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-400">Pipeline Empty</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        leads.map((lead) => {
                            const isSelected = selectedIds.has(lead.id)
                            return (
                                <TableRow
                                    key={lead.id}
                                    className={cn(
                                        'group transition-all border-b border-gray-50 dark:border-gray-800 last:border-0',
                                        isSelected
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30'
                                            : 'hover:bg-gray-50/30 dark:hover:bg-gray-800/30'
                                    )}
                                >
                                    <TableCell className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleSelection(lead.id)}
                                            aria-label={`Select ${lead.firstName}`}
                                        />
                                    </TableCell>
                                    {isColumnVisible('lead') && (
                                        <TableCell className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                    {lead.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">
                                                        {lead.firstName} {lead.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('context') && (
                                        <TableCell className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                                    {lead.company || 'Private Opportunity'}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-5">
                                                    Source: <span className="text-indigo-500">{lead.source.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('communication') && (
                                        <TableCell className="px-8 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer">
                                                    <Phone className="h-3.5 w-3.5" />
                                                    {lead.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('value') && (
                                        <TableCell className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-gray-900 dark:text-white tracking-tighter">
                                                    ₹{(lead.value || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Valuation</span>
                                            </div>
                                        </TableCell>
                                    )}
                                    {isColumnVisible('stage') && (
                                        <TableCell className="px-8 py-5">
                                            <Badge variant="outline" className={cn(
                                                "rounded-lg px-2.5 py-1 font-black uppercase tracking-widest text-[9px] border",
                                                STAGE_COLORS[lead.stage]
                                            )}>
                                                {lead.stage}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    <TableCell className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(lead)} className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(lead)} className="h-10 w-10 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            <BulkActionBar
                selectedCount={selectedIds.size}
                onClearSelection={clearSelection}
                onExport={() => onBulkExport?.(selectedArray)}
                onDelete={() => onBulkDelete?.(selectedArray)}
                isExporting={isBulkExporting}
                isDeleting={isBulkDeleting}
            />
        </div>
    )
}
