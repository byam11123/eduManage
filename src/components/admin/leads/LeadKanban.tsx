import { DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, Phone, Mail } from "lucide-react"
import type { Lead, LeadStage } from "@/lib/types"

interface LeadKanbanProps {
    leads: Lead[]
    loading: boolean
    onStageChange: (id: string, stage: string) => void
    onEdit: (lead: Lead) => void
}

const STAGES: { id: LeadStage; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
    { id: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-700' },
    { id: 'proposal', label: 'Proposal', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
    { id: 'won', label: 'Won', color: 'bg-green-100 text-green-700' },
    { id: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
]

export function LeadKanban({ leads, loading, onStageChange, onEdit }: LeadKanbanProps) {

    const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData('leadId', id)
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>, stage: string) => {
        e.preventDefault()
        const leadId = e.dataTransfer.getData('leadId')
        if (leadId) {
            onStageChange(leadId, stage)
        }
    }

    const getLeadsByStage = (stage: string) => {
        return leads.filter(lead => lead.stage === stage)
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading leads...</div>
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
            {STAGES.map(stage => (
                <div
                    key={stage.id}
                    className="min-w-[300px] flex flex-col bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${stage.color} border-0`}>
                                {getLeadsByStage(stage.id).length}
                            </Badge>
                            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{stage.label}</h3>
                        </div>
                    </div>

                    <div className="p-2 space-y-2 flex-1">
                        {getLeadsByStage(stage.id).map(lead => (
                            <div
                                key={lead.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, lead.id)}
                                className="bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow"
                                onClick={() => onEdit(lead)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                        {lead.firstName} {lead.lastName}
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                {lead.company && (
                                    <div className="text-xs text-gray-500 mb-2 truncate">
                                        {lead.company}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-700">₹{(lead.value || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lead.phone && <Phone className="h-3 w-3" />}
                                        {lead.email && <Mail className="h-3 w-3" />}
                                    </div>
                                </div>

                                <div className="mt-2 text-[10px] text-gray-400 text-right">
                                    {new Date(lead.updatedAt).toLocaleDateString('en-GB')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
