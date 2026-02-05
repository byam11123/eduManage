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
import { Pencil, Trash2 } from "lucide-react"
import type { Lead } from "@/lib/types"

interface LeadListProps {
    leads: Lead[]
    loading: boolean
    onEdit: (lead: Lead) => void
    onDelete: (lead: Lead) => void
}

const STAGE_COLORS: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-purple-100 text-purple-700',
    proposal: 'bg-indigo-100 text-indigo-700',
    negotiation: 'bg-orange-100 text-orange-700',
    won: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700',
}

export function LeadList({ leads, loading, onEdit, onDelete }: LeadListProps) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading leads...</div>
    }

    return (
        <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800">
                        <TableHead>NAME</TableHead>
                        <TableHead>COMPANY</TableHead>
                        <TableHead>CONTACT</TableHead>
                        <TableHead>VALUE</TableHead>
                        <TableHead>SOURCE</TableHead>
                        <TableHead>STAGE</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                No leads found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        leads.map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">
                                    {lead.firstName} {lead.lastName}
                                </TableCell>
                                <TableCell className="text-gray-500">{lead.company || '-'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs text-gray-500">
                                        <span>{lead.email}</span>
                                        <span>{lead.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>₹{(lead.value || 0).toLocaleString()}</TableCell>
                                <TableCell className="capitalize text-gray-500">{lead.source.replace('_', ' ')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${STAGE_COLORS[lead.stage]} border-0 uppercase text-[10px]`}>
                                        {lead.stage}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(lead)}>
                                            <Pencil className="h-4 w-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(lead)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
