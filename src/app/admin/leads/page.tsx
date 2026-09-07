'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    LeadList,
    LeadKanban,
    LeadForm
} from '@/components/admin/leads'
import { useLeads } from '@/hooks'
import type { Lead, LeadFormData } from '@/lib/types'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { Plus, List, Kanban, Target, TrendingUp, DollarSign, Users, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ExportButton } from '@/components/shared/ExportButton'
import { toast } from 'sonner'

export default function LeadsPage() {
    const [view, setView] = useState<'list' | 'kanban'>('list')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined)
    
    const [searchQuery, setSearchQuery] = useState('')
    const [stageFilter, setStageFilter] = useState<string>('all')

    const {
        loading,
        saving,
        leads,
        fetchLeads,
        createLead,
        updateLead,
        deleteLead,
        updateLeadStage
    } = useLeads()

    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isBulkExporting, setIsBulkExporting] = useState(false)

    const handleBulkDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} lead(s)? This cannot be undone.`)) return
        setIsBulkDeleting(true)
        for (const id of ids) {
            await deleteLead(id)
        }
        setIsBulkDeleting(false)
        toast.success(`${ids.length} lead(s) deleted`)
    }

    const handleBulkExport = (ids: string[]) => {
        setIsBulkExporting(true)
        const selected = leads.filter(l => ids.includes(l.id))
        const data = selected.map(l => ({
            name: `${l.firstName} ${l.lastName}`,
            email: l.email || 'N/A',
            phone: l.phone || 'N/A',
            stage: l.stage.toUpperCase(),
            value: `₹${(l.value || 0).toLocaleString()}`,
            source: l.source || 'N/A'
        }))
        const headers = ['Lead Name', 'Email', 'Phone', 'Stage', 'Value', 'Source']
        const keys = ['name', 'email', 'phone', 'stage', 'value', 'source']
        const csv = [headers.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'EduManage_Leads_Export.csv'
        a.click()
        URL.revokeObjectURL(url)
        setIsBulkExporting(false)
        toast.success(`${ids.length} lead(s) exported`)
    }

    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            const matchesSearch = 
                l.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                l.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (l.phone && l.phone.includes(searchQuery))
            
            const matchesStage = stageFilter === 'all' ? true : l.stage === stageFilter

            return matchesSearch && matchesStage
        })
    }, [leads, searchQuery, stageFilter])

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const handleAddClick = () => {
        setEditingLead(undefined)
        setIsFormOpen(true)
    }

    const handleEditClick = (lead: Lead) => {
        setEditingLead(lead)
        setIsFormOpen(true)
    }

    const handleDeleteClick = async (lead: Lead) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            await deleteLead(lead.id)
        }
    }

    const handleFormSubmit = async (data: LeadFormData) => {
        if (editingLead) {
            return await updateLead(editingLead.id, data)
        } else {
            return await createLead(data)
        }
    }

    const stats = useMemo(() => [
        { title: 'Total Leads', value: filteredLeads.length, icon: Users, color: 'indigo' as const, trend: 'Total' },
        { title: 'Active Leads', value: filteredLeads.filter(l => !['won', 'lost'].includes(l.stage)).length, icon: Target, color: 'emerald' as const, trend: 'Active' },
        { title: 'Total Value', value: `₹${filteredLeads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'amber' as const, trend: 'Estimated' },
        { title: 'Conversion Rate', value: filteredLeads.length > 0 ? `${Math.round((filteredLeads.filter(l => l.stage === 'won').length / filteredLeads.length) * 100)}%` : '0%', icon: TrendingUp, color: 'sky' as const, trend: 'Rate' },
    ], [filteredLeads])

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-8 space-y-8">
            <PageHeader 
                title="Lead Management"
                description="Manage your leads and sales pipeline."
                actions={[
                    { 
                        label: 'Add New Lead', 
                        icon: Plus, 
                        variant: 'default',
                        onClick: handleAddClick
                    }
                ]}
            />

            <StatsGrid stats={stats} columns={4} />

            {/* View Controls & Filters */}
            <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                view === 'list' 
                                    ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600 scale-[1.02]" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                            List View
                        </button>
                        <button
                            onClick={() => setView('kanban')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                view === 'kanban' 
                                    ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600 scale-[1.02]" 
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Kanban className="h-3.5 w-3.5" />
                            Kanban View
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            <input 
                                placeholder="Search leads..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={stageFilter !== 'all' ? 'default' : 'ghost'} size="icon" className={cn("h-10 w-10 rounded-xl", stageFilter !== 'all' ? "bg-indigo-600 hover:bg-indigo-700" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50")}>
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-none shadow-xl">
                                <DropdownMenuItem onClick={() => setStageFilter('all')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'all' && "bg-indigo-50 text-indigo-600")}>All Stages</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('new')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'new' && "bg-indigo-50 text-indigo-600")}>New Opportunity</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('contacted')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'contacted' && "bg-indigo-50 text-indigo-600")}>Contacted</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('qualified')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'qualified' && "bg-indigo-50 text-indigo-600")}>Qualified</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('proposal')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'proposal' && "bg-indigo-50 text-indigo-600")}>Proposal Sent</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('negotiation')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'negotiation' && "bg-indigo-50 text-indigo-600")}>Negotiation</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('won')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'won' && "bg-emerald-50 text-emerald-600")}>Won / Enrolled</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStageFilter('lost')} className={cn("font-medium text-xs py-2.5 px-3", stageFilter === 'lost' && "bg-rose-50 text-rose-600")}>Lost</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Badge variant="secondary" className="h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-none font-black text-[10px] uppercase tracking-widest">
                            {filteredLeads.length} Leads
                        </Badge>
                        <ExportButton 
                            data={filteredLeads.map(l => ({
                                name: `${l.firstName} ${l.lastName}`,
                                email: l.email || 'N/A',
                                phone: l.phone || 'N/A',
                                stage: l.stage.toUpperCase(),
                                value: `₹${(l.value || 0).toLocaleString()}`,
                                source: l.source || 'N/A'
                            }))}
                            columns={[
                                { header: 'Lead Name', dataKey: 'name' },
                                { header: 'Email', dataKey: 'email' },
                                { header: 'Phone', dataKey: 'phone' },
                                { header: 'Stage', dataKey: 'stage' },
                                { header: 'Value', dataKey: 'value' },
                                { header: 'Source', dataKey: 'source' },
                            ]}
                            fileName="EduManage_Leads_Report"
                            title="Sales Leads Pipeline Report"
                            variant="ghost"
                            className="h-10 rounded-xl"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4">
                        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-gray-400 italic">Loading leads...</span>
                    </div>
                ) : (
                    <>
                        {view === 'list' ? (
                            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden border border-gray-50 dark:border-gray-800">
                                <LeadList
                                    leads={filteredLeads}
                                    loading={loading}
                                    onStageChange={updateLeadStage}
                                    onDelete={handleDeleteClick}
                                    onEdit={handleEditClick}
                                    onBulkDelete={handleBulkDelete}
                                    onBulkExport={handleBulkExport}
                                    isBulkDeleting={isBulkDeleting}
                                    isBulkExporting={isBulkExporting}
                                />
                            </div>
                        ) : (
                            <LeadKanban
                                leads={filteredLeads}
                                loading={loading}
                                onStageChange={updateLeadStage}
                                onEdit={handleEditClick}
                            />
                        )}
                    </>
                )}
            </div>

            <LeadForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleFormSubmit}
                initialData={editingLead}
                loading={saving}
            />
        </div>
    )
}

