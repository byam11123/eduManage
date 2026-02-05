import { useState, useEffect, useCallback } from 'react'
import { Staff, PaginatedResponse } from '@/lib/types'
import { staffService } from '@/lib/services/staff.service'
import { toast } from 'sonner'

export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        onLeave: 0
    })

    const fetchStaff = useCallback(async () => {
        try {
            setLoading(true)
            const res = await staffService.getAll({ search })
            if (res.success) {
                setStaff(res.data)
                // Calculate stats from data (mock logic)
                setStats({
                    total: res.total,
                    active: res.data.filter(s => s.status === 'active').length,
                    onLeave: res.data.filter(s => s.status === 'on_leave').length
                })
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch staff')
        } finally {
            setLoading(false)
        }
    }, [search])

    useEffect(() => {
        fetchStaff()
    }, [fetchStaff])

    const deleteStaff = async (id: string) => {
        try {
            const res = await staffService.delete(id)
            if (res.success) {
                toast.success('Staff deleted successfully')
                fetchStaff()
            } else {
                toast.error(res.error || 'Failed to delete staff')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error deleting staff')
        }
    }

    return {
        staff,
        loading,
        stats,
        search,
        setSearch,
        fetchStaff,
        deleteStaff
    }
}
