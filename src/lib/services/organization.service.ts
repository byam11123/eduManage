import { Organization, ApiResponse } from '@/lib/types'

export const organizationService = {
    // Get organization details by ID
    async getOrganization(id: string): Promise<ApiResponse<Organization>> {
        try {
            const response = await fetch(`/api/admin/settings/organization/${id}`)
            return await response.json()
        } catch (error) {
            console.error('Error in getOrganization:', error)
            return { success: false, error: 'Failed to fetch organization details' }
        }
    },

    // Update organization details
    async updateOrganization(id: string, data: Partial<Organization>): Promise<ApiResponse<Organization>> {
        try {
            const response = await fetch(`/api/admin/settings/organization/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (error) {
            console.error('Error in updateOrganization:', error)
            return { success: false, error: 'Failed to update organization details' }
        }
    },

    // Get current organization (helper)
    async getCurrentOrganization(): Promise<ApiResponse<Organization>> {
        try {
            const response = await fetch('/api/admin/settings/organization/current')
            return await response.json()
        } catch (error) {
            console.error('Error in getCurrentOrganization:', error)
            return { success: false, error: 'Failed to fetch current organization' }
        }
    }
}
