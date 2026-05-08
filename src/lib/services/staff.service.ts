import { ApiResponse, PaginatedResponse, Staff, StaffFormData } from '@/lib/types'

class StaffService {
    async getAll(params?: { page?: number, limit?: number, search?: string, status?: string }): Promise<PaginatedResponse<Staff>> {
        const query = new URLSearchParams()
        if (params?.search) query.set('search', params.search)
        if (params?.status) query.set('status', params.status)
        if (params?.page) query.set('page', params.page.toString())
        if (params?.limit) query.set('limit', params.limit.toString())

        const response = await fetch(`/api/staff?${query.toString()}`)
        return await response.json()
    }

    async getById(id: string): Promise<ApiResponse<Staff>> {
        const response = await fetch(`/api/staff/${id}`)
        return await response.json()
    }

    async create(data: StaffFormData): Promise<ApiResponse<Staff>> {
        const response = await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json()
    }

    async update(id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
        const response = await fetch(`/api/staff/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json()
    }

    async delete(id: string): Promise<ApiResponse<null>> {
        const response = await fetch(`/api/staff/${id}`, {
            method: 'DELETE'
        })
        return await response.json()
    }
}

export const staffService = new StaffService()
