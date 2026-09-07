// ============================================
// LEAD SERVICE
// Real API calls to /api/leads
// ============================================

import type { Lead, ApiResponse, LeadFormData } from '@/lib/types'

const BASE_URL = '/api/leads'

export const leadService = {
    // Get all leads (with optional search/stage/branchId filter)
    async getLeads(params?: { search?: string; stage?: string; branchId?: string }): Promise<ApiResponse<{ leads: Lead[] }>> {
        try {
            const searchParams = new URLSearchParams()
            if (params?.search)   searchParams.set('search',   params.search)
            if (params?.stage)    searchParams.set('stage',    params.stage)
            if (params?.branchId) searchParams.set('branchId', params.branchId)

            const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL
            const res  = await fetch(url, { cache: 'no-store' })
            const data = await res.json()
            return {
                success: data.success,
                data:    data.success ? { leads: data.leads } : undefined,
                error:   data.error
            }
        } catch (error) {
            console.error('leadService.getLeads error:', error)
            return { success: false, error: 'Failed to fetch leads' }
        }
    },

    // Create lead
    async createLead(data: LeadFormData): Promise<ApiResponse<{ lead: Lead }>> {
        try {
            const res  = await fetch(BASE_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data)
            })
            const body = await res.json()
            return {
                success: body.success,
                data:    body.success ? { lead: body.lead } : undefined,
                error:   body.error
            }
        } catch (error) {
            console.error('leadService.createLead error:', error)
            return { success: false, error: 'Failed to create lead' }
        }
    },

    // Update lead (fields or stage)
    async updateLead(id: string, data: Partial<LeadFormData>): Promise<ApiResponse<{ lead: Lead }>> {
        try {
            const res  = await fetch(`${BASE_URL}/${id}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data)
            })
            const body = await res.json()
            return {
                success: body.success,
                data:    body.success ? { lead: body.lead } : undefined,
                error:   body.error
            }
        } catch (error) {
            console.error('leadService.updateLead error:', error)
            return { success: false, error: 'Failed to update lead' }
        }
    },

    // Delete lead
    async deleteLead(id: string): Promise<ApiResponse> {
        try {
            const res  = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
            const body = await res.json()
            return { success: body.success, message: body.message, error: body.error }
        } catch (error) {
            console.error('leadService.deleteLead error:', error)
            return { success: false, error: 'Failed to delete lead' }
        }
    },

    // Update lead stage only (optimistic-UI use case)
    async updateLeadStage(id: string, stage: string): Promise<ApiResponse<{ lead: Lead }>> {
        return leadService.updateLead(id, { stage })
    }
}
