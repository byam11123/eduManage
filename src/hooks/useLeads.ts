// ============================================
// USE LEADS HOOK
// Custom hook for managing leads
// ============================================

import { useState, useCallback } from 'react'
import { leadService } from '@/lib/services'
import type { Lead, LeadFormData } from '@/lib/types'
import { toast } from 'sonner' // Assuming sonner is installed or will be used, otherwise console

export function useLeads() {
    const [loading, setLoading] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [saving, setSaving] = useState(false)

    // Fetch leads
    const fetchLeads = useCallback(async () => {
        setLoading(true)
        try {
            const res = await leadService.getLeads()
            if (res.success && res.data) {
                setLeads(res.data.leads)
            }
        } catch (error) {
            console.error('Error fetching leads:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Create lead
    const createLead = async (data: LeadFormData) => {
        setSaving(true)
        try {
            const res = await leadService.createLead(data)
            if (res.success && res.data) {
                setLeads(prev => [res.data!.lead, ...prev])
                return true
            }
            return false
        } catch (error) {
            console.error('Error creating lead:', error)
            return false
        } finally {
            setSaving(false)
        }
    }

    // Update lead
    const updateLead = async (id: string, data: Partial<LeadFormData>) => {
        setSaving(true)
        try {
            const res = await leadService.updateLead(id, data)
            if (res.success && res.data) {
                setLeads(prev => prev.map(l => l.id === id ? res.data!.lead : l))
                return true
            }
            return false
        } catch (error) {
            console.error('Error updating lead:', error)
            return false
        } finally {
            setSaving(false)
        }
    }

    // Delete lead
    const deleteLead = async (id: string) => {
        try {
            const res = await leadService.deleteLead(id)
            if (res.success) {
                setLeads(prev => prev.filter(l => l.id !== id))
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting lead:', error)
            return false
        }
    }

    // Update Lead Stage (Optimistic UI)
    const updateLeadStage = async (id: string, newStage: string) => {
        // Optimistic update
        const previousLeads = [...leads]
        setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage as any } : l))

        try {
            const res = await leadService.updateLeadStage(id, newStage)
            if (!res.success) {
                // Revert on failure
                setLeads(previousLeads)
                return false
            }
            return true
        } catch (error) {
            // Revert on error
            setLeads(previousLeads)
            console.error('Error updating lead stage:', error)
            return false
        }
    }

    return {
        loading,
        saving,
        leads,
        fetchLeads,
        createLead,
        updateLead,
        deleteLead,
        updateLeadStage
    }
}
