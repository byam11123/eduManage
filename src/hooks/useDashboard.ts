// ============================================
// USE DASHBOARD HOOK
// Custom hook for dashboard data
// ============================================

import { useState, useEffect, useCallback } from 'react'
import type { DashboardStats, RevenueData, Student, Enquiry } from '@/lib/types'

interface UseDashboardReturn {
    // Stats
    stats: DashboardStats
    revenueData: RevenueData[]
    recentStudents: Student[]
    recentEnquiries: Enquiry[]

    // Loading States
    loading: boolean

    // Actions
    fetchDashboardData: () => Promise<void>
    refreshStats: () => Promise<void>
}

const defaultStats: DashboardStats = {
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    pendingFees: 0,
    totalCourses: 0,
    totalBatches: 0,
    totalEnquiries: 0,
    recentEnquiries: 0,
    trends: {
        enrollment: { value: '0%', isUp: true },
        revenue: { value: '0%', isUp: true },
        enquiries: { value: '0%', isUp: true }
    }
}

export function useDashboard(): UseDashboardReturn {
    const [stats, setStats] = useState<DashboardStats>(defaultStats)
    const [revenueData, setRevenueData] = useState<RevenueData[]>([])
    const [recentStudents, setRecentStudents] = useState<Student[]>([])
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch all dashboard data
    const fetchDashboardData = useCallback(async () => {
        setLoading(true)
        try {
            // Fetch stats
            const statsRes = await fetch('/api/dashboard/stats', { cache: 'no-store' })
            const statsData = await statsRes.json()
            if (statsData.success) {
                setStats(statsData.stats)
            }

            // Fetch revenue data
            const revenueRes = await fetch('/api/dashboard/revenue', { cache: 'no-store' })
            const revenueDataRes = await revenueRes.json()
            if (revenueDataRes.success) {
                setRevenueData(revenueDataRes.data)
            }

            // Fetch recent students
            const studentsRes = await fetch('/api/students?limit=5&sort=createdAt:desc', { cache: 'no-store' })
            const studentsData = await studentsRes.json()
            if (studentsData.success) {
                setRecentStudents(studentsData.students?.slice(0, 5) || [])
            }

            // Fetch recent enquiries
            const enquiriesRes = await fetch('/api/enquiries?limit=5&sort=createdAt:desc', { cache: 'no-store' })
            const enquiriesData = await enquiriesRes.json()
            if (enquiriesData.success) {
                setRecentEnquiries(enquiriesData.enquiries?.slice(0, 5) || [])
            }
        } catch (error) {
            console.error('useDashboard.fetchDashboardData error:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Refresh just the stats
    const refreshStats = useCallback(async () => {
        try {
            const statsRes = await fetch('/api/dashboard/stats', { cache: 'no-store' })
            const statsData = await statsRes.json()
            if (statsData.success) {
                setStats(statsData.stats)
            }
        } catch (error) {
            console.error('useDashboard.refreshStats error:', error)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    return {
        stats,
        revenueData,
        recentStudents,
        recentEnquiries,
        loading,
        fetchDashboardData,
        refreshStats
    }
}
