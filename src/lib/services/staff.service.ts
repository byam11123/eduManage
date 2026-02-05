import { ApiResponse, PaginatedResponse, Staff, StaffFormData } from '@/lib/types'

// Mock Data for Staff
const MOCK_STAFF: Staff[] = [
    {
        id: '1',
        firstName: 'Rahul',
        lastName: 'Sharma',
        employeeCode: 'EMP001',
        email: 'rahul.s@edumanage.com',
        phone: '9876543210',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        designation: 'Teacher',
        department: 'Mathematics',
        dateOfJoining: '2023-01-10',
        status: 'active',
        salaryType: 'fixed',
        salaryAmount: 45000,
        highestQualification: 'M.Sc Mathematics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        firstName: 'Priya',
        lastName: 'Verma',
        employeeCode: 'EMP002',
        email: 'priya.v@edumanage.com',
        phone: '9876543211',
        dateOfBirth: '1992-08-22',
        gender: 'female',
        designation: 'Counselor',
        department: 'Admissions',
        dateOfJoining: '2023-03-01',
        status: 'active',
        salaryType: 'fixed',
        salaryAmount: 35000,
        highestQualification: 'MBA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

class StaffService {
    // Simulate API delay
    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async getAll(params?: { page?: number, limit?: number, search?: string, status?: string }): Promise<PaginatedResponse<Staff>> {
        await this.delay(800)

        let filtered = [...MOCK_STAFF]

        if (params?.search) {
            const searchLower = params.search.toLowerCase()
            filtered = filtered.filter(s =>
                s.firstName.toLowerCase().includes(searchLower) ||
                s.lastName.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower) ||
                s.employeeCode.toLowerCase().includes(searchLower)
            )
        }

        if (params?.status && params.status !== 'all') {
            filtered = filtered.filter(s => s.status === params.status)
        }

        return {
            success: true,
            data: filtered,
            total: filtered.length,
            page: params?.page || 1,
            pageSize: params?.limit || 10,
            totalPages: Math.ceil(filtered.length / (params?.limit || 10))
        }
    }

    async getById(id: string): Promise<ApiResponse<Staff>> {
        await this.delay(500)
        const staff = MOCK_STAFF.find(s => s.id === id)
        if (!staff) return { success: false, error: 'Staff not found' }
        return { success: true, data: staff }
    }

    async create(data: StaffFormData): Promise<ApiResponse<Staff>> {
        await this.delay(1000)
        const newStaff: Staff = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            salaryAmount: Number(data.salaryAmount),
            experienceYears: Number(data.experienceYears),
            skills: data.skills.split(',').map(s => s.trim()),
            // Set defaults for complex conversions
            gender: data.gender as 'male' | 'female' | 'other',
            salaryType: data.salaryType as 'fixed' | 'hourly',
            status: 'active',
            designation: 'Staff', // Default, should be in form
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Bank details would be mapped here
            bankDetails: {
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                ifscCode: data.ifscCode,
                accountHolderName: `${data.firstName} ${data.lastName}`
            }
        }
        MOCK_STAFF.unshift(newStaff)
        return { success: true, data: newStaff, message: 'Staff created successfully' }
    }

    async update(id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
        await this.delay(1000)
        const index = MOCK_STAFF.findIndex(s => s.id === id)
        if (index === -1) return { success: false, error: 'Staff not found' }

        MOCK_STAFF[index] = { ...MOCK_STAFF[index], ...data, updatedAt: new Date().toISOString() }
        return { success: true, data: MOCK_STAFF[index], message: 'Staff updated successfully' }
    }

    async delete(id: string): Promise<ApiResponse<null>> {
        await this.delay(800)
        const index = MOCK_STAFF.findIndex(s => s.id === id)
        if (index === -1) return { success: false, error: 'Staff not found' }

        MOCK_STAFF.splice(index, 1)
        return { success: true, message: 'Staff deleted successfully' }
    }
}

export const staffService = new StaffService()
