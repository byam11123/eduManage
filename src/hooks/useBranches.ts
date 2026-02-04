// ============================================
// USE BRANCHES HOOK
// Custom hook for branch data management
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { Branch } from '@/lib/types'
import { branchService, type BranchFormData } from '@/lib/services/branch.service'

interface UseBranchesReturn {
    // Data
    branches: Branch[]
    selectedBranch: Branch | null
    defaultBranch: Branch | null

    // Loading States
    loading: boolean
    saving: boolean

    // Actions
    fetchBranches: () => Promise<void>
    fetchBranchById: (id: string) => Promise<Branch | null>
    createBranch: (data: BranchFormData) => Promise<boolean>
    updateBranch: (id: string, data: Partial<BranchFormData>) => Promise<boolean>
    deleteBranch: (id: string) => Promise<boolean>
    selectBranch: (branch: Branch | null) => void
    setDefaultBranch: (branch: Branch) => void
}

export function useBranches(): UseBranchesReturn {
    const [branches, setBranches] = useState<Branch[]>([])
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
    const [defaultBranch, setDefaultBranchState] = useState<Branch | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch all branches
    const fetchBranches = useCallback(async () => {
        setLoading(true)
        try {
            const response = await branchService.getAll()
            if (response.success && response.data) {
                setBranches(response.data)
                // Set first branch as default if none set
                if (!defaultBranch && response.data.length > 0) {
                    setDefaultBranchState(response.data[0])
                }
            }
        } catch (error) {
            console.error('useBranches.fetchBranches error:', error)
        } finally {
            setLoading(false)
        }
    }, [defaultBranch])

    // Fetch single branch by ID
    const fetchBranchById = useCallback(async (id: string): Promise<Branch | null> => {
        try {
            const response = await branchService.getById(id)
            if (response.success && response.data) {
                return response.data
            }
            return null
        } catch (error) {
            console.error('useBranches.fetchBranchById error:', error)
            return null
        }
    }, [])

    // Create branch
    const createBranch = useCallback(async (data: BranchFormData): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await branchService.create(data)
            if (response.success) {
                await fetchBranches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBranches.createBranch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBranches])

    // Update branch
    const updateBranch = useCallback(async (id: string, data: Partial<BranchFormData>): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await branchService.update(id, data)
            if (response.success) {
                await fetchBranches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBranches.updateBranch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBranches])

    // Delete branch
    const deleteBranch = useCallback(async (id: string): Promise<boolean> => {
        setSaving(true)
        try {
            const response = await branchService.delete(id)
            if (response.success) {
                await fetchBranches()
                return true
            }
            return false
        } catch (error) {
            console.error('useBranches.deleteBranch error:', error)
            return false
        } finally {
            setSaving(false)
        }
    }, [fetchBranches])

    // Select a branch
    const selectBranch = useCallback((branch: Branch | null) => {
        setSelectedBranch(branch)
    }, [])

    // Set default branch
    const setDefaultBranch = useCallback((branch: Branch) => {
        setDefaultBranchState(branch)
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchBranches()
    }, [fetchBranches])

    return {
        branches,
        selectedBranch,
        defaultBranch,
        loading,
        saving,
        fetchBranches,
        fetchBranchById,
        createBranch,
        updateBranch,
        deleteBranch,
        selectBranch,
        setDefaultBranch
    }
}
