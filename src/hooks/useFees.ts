import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export function useFees() {
    const [installments, setInstallments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalExpected: 0,
        totalReceived: 0,
        totalPending: 0,
        overdueCount: 0
    })

    const fetchFees = useCallback(async (filters: any = {}) => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams()
            if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status)
            if (filters.branchId && filters.branchId !== 'all') queryParams.append('branchId', filters.branchId)
            if (filters.search) queryParams.append('search', filters.search)

            const res = await fetch(`/api/fees?${queryParams.toString()}`)
            const data = await res.json()

            if (data.success) {
                setInstallments(data.installments)
                
                // Calculate stats
                const now = new Date()
                let expected = 0
                let received = 0
                let overdue = 0

                data.installments.forEach((inst: any) => {
                    expected += inst.amount
                    received += inst.paidAmount
                    if (inst.status !== 'paid' && new Date(inst.dueDate) < now) {
                        overdue++
                    }
                });

                setStats({
                    totalExpected: expected,
                    totalReceived: received,
                    totalPending: expected - received,
                    overdueCount: overdue
                })
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            console.error('Error fetching fees:', error)
            toast.error('Failed to load fees data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFees()
    }, [fetchFees])

    return {
        installments,
        loading,
        stats,
        fetchFees
    }
}
