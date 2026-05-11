import { DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical, Phone, Mail, Building2, Calendar, Target, DollarSign } from "lucide-react"
import type { Lead, LeadStage } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LeadKanbanProps {
    leads: Lead[]
    loading: boolean
    onStageChange: (id: string, stage: string) => void
    onEdit: (lead: Lead) => void
}

const STAGES: { id: LeadStage; label: string; color: string; dot: string }[] = [
    { id: 'new', label: 'New Opportunity', color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' },
    { id: 'contacted', label: 'Initial Contact', color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500' },
    { id: 'qualified', label: 'Qualified Prospect', color: 'bg-violet-50 text-violet-600 border-violet-100', dot: 'bg-violet-500' },
    { id: 'proposal', label: 'Proposal Sent', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', dot: 'bg-indigo-500' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-50 text-orange-600 border-orange-100', dot: 'bg-orange-500' },
    { id: 'won', label: 'Enrolled / Won', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' },
    { id: 'lost', label: 'Closed / Lost', color: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-500' },
]

export function LeadKanban({ leads, loading, onStageChange, onEdit }: LeadKanbanProps) {

    const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData('leadId', id)
        e.currentTarget.classList.add('opacity-50')
    }

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50')
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

    if (loading) return null // Handled by parent

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-320px)] scrollbar-hide">
            {STAGES.map(stage => {
                const stageLeads = getLeadsByStage(stage.id)
                const totalValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0)

                return (
                    <div
                        key={stage.id}
                        className="min-w-[340px] flex flex-col bg-gray-50/30 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 transition-all"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.id)}
                    >
                        {/* Stage Header */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-3 sticky top-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl z-10 rounded-t-[2rem]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className={cn("h-2 w-2 rounded-full", stage.dot)} />
                                    <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-gray-900 dark:text-white">{stage.label}</h3>
                                </div>
                                <Badge variant="secondary" className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-none font-black text-[10px] px-2.5 rounded-lg">
                                    {stageLeads.length}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span>Pipeline Value</span>
                                <span className="text-gray-900 dark:text-white">₹{totalValue.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Leads Container */}
                        <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide max-h-[calc(100vh-420px)]">
                            {stageLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    onDragEnd={handleDragEnd}
                                    className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none hover:-translate-y-1 cursor-grab active:cursor-grabbing transition-all group"
                                    onClick={() => onEdit(lead)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                {lead.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {lead.firstName} {lead.lastName}
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                                    <Building2 className="h-2.5 w-2.5" />
                                                    {lead.company || 'Private'}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-300 hover:text-indigo-600 transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Evaluation</span>
                                            <span className="text-xs font-black text-gray-900 dark:text-white tracking-tighter">
                                                ₹{(lead.value || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all cursor-pointer">
                                                <Phone className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all cursor-pointer">
                                                <Mail className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">
                                            Last Sync: {new Date(lead.updatedAt).toLocaleDateString('en-GB')}
                                        </span>
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0 px-1.5 border-gray-100 text-gray-400">
                                            {lead.source.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {stageLeads.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                                    <Target className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">No Prospects</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

