// ============================================
// LEAD SERVICE
// API service for managing leads
// ============================================

import type { Lead, ApiResponse, LeadFormData } from '@/lib/types'

// Mock data
let MOCK_LEADS: Lead[] = [
    {
        id: '1',
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.sharma@example.com',
        phone: '9876543210',
        source: 'website',
        stage: 'new',
        company: 'Tech Solutions',
        value: 15000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        firstName: 'Priya',
        lastName: 'Verma',
        email: 'priya.v@example.com',
        phone: '9876543211',
        source: 'referral',
        stage: 'contacted',
        value: 25000,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        firstName: 'Rahul',
        lastName: 'Singh',
        email: 'rahul.s@example.com',
        phone: '9876543212',
        source: 'social_media',
        stage: 'qualified',
        company: 'EduCorp',
        value: 50000,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '4',
        firstName: 'Sneha',
        lastName: 'Patel',
        email: 'sneha.p@example.com',
        phone: '9876543213',
        source: 'campaign',
        stage: 'proposal',
        value: 75000,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '5',
        firstName: 'Vikram',
        lastName: 'Malhotra',
        email: 'vikram.m@example.com',
        phone: '9876543214',
        source: 'website',
        stage: 'won',
        company: 'Global Inc',
        value: 120000,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date().toISOString()
    }
]

export const leadService = {
    // Get all leads
    async getLeads(): Promise<ApiResponse<{ leads: Lead[] }>> {
        await new Promise(resolve => setTimeout(resolve, 800))
        return { success: true, data: { leads: [...MOCK_LEADS] } }
    },

    // Get single lead
    async getLeadById(id: string): Promise<ApiResponse<{ lead: Lead }>> {
        await new Promise(resolve => setTimeout(resolve, 500))
        const lead = MOCK_LEADS.find(l => l.id === id)
        if (!lead) throw new Error('Lead not found')
        return { success: true, data: { lead } }
    },

    // Create lead
    async createLead(data: LeadFormData): Promise<ApiResponse<{ lead: Lead }>> {
        await new Promise(resolve => setTimeout(resolve, 800))
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            source: data.source as any,
            stage: data.stage as any,
            value: data.value ? parseFloat(data.value) : 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        MOCK_LEADS.unshift(newLead)
        return { success: true, data: { lead: newLead } }
    },

    // Update lead
    async updateLead(id: string, data: Partial<LeadFormData>): Promise<ApiResponse<{ lead: Lead }>> {
        await new Promise(resolve => setTimeout(resolve, 800))
        const index = MOCK_LEADS.findIndex(l => l.id === id)
        if (index === -1) throw new Error('Lead not found')

        const updatedLead = {
            ...MOCK_LEADS[index],
            ...data,
            value: data.value ? parseFloat(data.value) : MOCK_LEADS[index].value,
            updatedAt: new Date().toISOString()
        }
        MOCK_LEADS[index] = updatedLead
        return { success: true, data: { lead: updatedLead } }
    },

    // Delete lead
    async deleteLead(id: string): Promise<ApiResponse> {
        await new Promise(resolve => setTimeout(resolve, 500))
        MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== id)
        return { success: true, message: 'Lead deleted successfully' }
    },

    // Update lead stage (drag and drop)
    async updateLeadStage(id: string, stage: string): Promise<ApiResponse<{ lead: Lead }>> {
        await new Promise(resolve => setTimeout(resolve, 300)) // Faster for drag and drop
        const index = MOCK_LEADS.findIndex(l => l.id === id)
        if (index === -1) throw new Error('Lead not found')

        const updatedLead = {
            ...MOCK_LEADS[index],
            stage: stage as any,
            updatedAt: new Date().toISOString()
        }
        MOCK_LEADS[index] = updatedLead
        return { success: true, data: { lead: updatedLead } }
    }
}
