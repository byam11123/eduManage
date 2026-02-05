'use client'

import { useState, useEffect } from 'react'
import { Toaster } from 'sonner' // Assuming setup for toasts, or simple alerts
import {
    LeadHeader,
    LeadList,
    LeadKanban,
    LeadForm
} from '@/components/admin/leads'
import { useLeads } from '@/hooks'
import type { Lead, LeadFormData } from '@/lib/types'

export default function LeadsPage() {
    const [view, setView] = useState<'list' | 'kanban'>('kanban')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined)

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

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            <LeadHeader
                view={view}
                onViewChange={setView}
                onAddClick={handleAddClick}
            />

            {view === 'list' ? (
                <LeadList
                    leads={leads}
                    loading={loading}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            ) : (
                <LeadKanban
                    leads={leads}
                    loading={loading}
                    onStageChange={updateLeadStage}
                    onEdit={handleEditClick}
                />
            )}

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
