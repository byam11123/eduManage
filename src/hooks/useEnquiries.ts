// ============================================
// USE ENQUIRIES HOOK
// Custom hook for enquiry data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Enquiry, EnquiryFormData } from '@/lib/types'
import { enquiryService } from '@/lib/services'

interface UseEnquiriesReturn {
    // Data
    enquiries: Enquiry[]
    loading: boolean
    saving: boolean

    // Actions
    fetchEnquiries: () => Promise<void>
    createEnquiry: (data: EnquiryFormData) => Promise<boolean>
    updateEnquiry: (id: string, data: Partial<EnquiryFormData>) => Promise<boolean>
    deleteEnquiry: (id: string) => Promise<boolean>
}

export function useEnquiries(): UseEnquiriesReturn {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch all enquiries
    const fetchEnquiries = useCallback(async () => {
        setLoading(true)
        try {
            const response = await enquiryService.getAll()
            if (response.success && response.data) {
                setEnquiries(response.data)
            }
        } catch (error) {
            console.error('useEnquiries.fetchEnquiries error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Create enquiry
    const createEnquiry = useCallback(async (data: EnquiryFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await enquiryService.create(data)
            if (response.success) {
                await fetchEnquiries()
                return true
            }
            return false
        } catch (error) {
            console.error('useEnquiries.createEnquiry error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchEnquiries])

    // Update enquiry
    const updateEnquiry = useCallback(async (id: string, data: Partial<EnquiryFormData>): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await enquiryService.update(id, data)
            if (response.success) {
                await fetchEnquiries()
                return true
            }
            return false
        } catch (error) {
            console.error('useEnquiries.updateEnquiry error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchEnquiries])

    // Delete enquiry
    const deleteEnquiry = useCallback(async (id: string): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await enquiryService.delete(id)
            if (response.success) {
                await fetchEnquiries()
                return true
            }
            return false
        } catch (error) {
            console.error('useEnquiries.deleteEnquiry error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchEnquiries])

    // Initial fetch
    useEffect(() => {
        fetchEnquiries()
    }, [fetchEnquiries])

    return {
        enquiries,
        loading,
        saving,
        fetchEnquiries,
        createEnquiry,
        updateEnquiry,
        deleteEnquiry
    }
}
