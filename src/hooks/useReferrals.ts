import { useState, useCallback } from 'react'
import { ApiResponse } from '@/lib/types'
import { toast } from 'sonner'
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils'
import { format } from 'date-fns'

export function useReferrals() {
    const [referrers, setReferrers] = useState<any[]>([])
    const [referrals, setReferrals] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const fetchAllData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/referrals')
            const result: ApiResponse<any> = await response.json()
            if (result.success && result.data) {
                setReferrers(result.data.referrers || [])
                setReferrals(result.data.referrals || [])
                setStats(result.data.stats || null)
            }
        } catch (error) {
            console.error('Failed to fetch referrals data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const createReferrer = async (data: any) => {
        try {
            const response = await fetch('/api/admin/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createReferrer', data })
            })
            const result = await response.json()
            if (result.success) {
                fetchAllData()
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to create referrer:', error)
            return false
        }
    }

    const updateReferrer = async (id: string, data: any) => {
        try {
            const response = await fetch('/api/admin/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateReferrer', data: { id, ...data } })
            })
            const result = await response.json()
            if (result.success) {
                fetchAllData()
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to update referrer:', error)
            return false
        }
    }

    const deleteReferrer = async (id: string) => {
        try {
            const response = await fetch('/api/admin/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteReferrer', id })
            })
            const result = await response.json()
            if (result.success) {
                fetchAllData()
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to delete referrer:', error)
            return false
        }
    }

    const processPayout = async (id: string, data: any) => {
        try {
            const response = await fetch('/api/admin/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'processPayout', data: { id, ...data } })
            })
            const result = await response.json()
            if (result.success) {
                fetchAllData()
                return true
            }
            return false
        } catch (error) {
            console.error('Failed to process payout:', error)
            return false
        }
    }

    const exportReferrers = (type: 'excel' | 'pdf' = 'excel') => {
        if (!referrers.length) return toast.error("No partners to export")
        
        const fileName = `Referral_Partners_${format(new Date(), 'yyyy-MM-dd')}`
        const sheetName = 'Partners'

        if (type === 'excel') {
            const data = referrers.map(r => ({
                'Partner Name': r.name,
                'Type': r.type,
                'Email': r.email || 'N/A',
                'Phone': r.phone || 'N/A',
                'Total Referrals': r._count?.referrals || 0,
                'Total Earned (₹)': r.totalEarned || 0,
                'Status': r.status,
                'Joined On': format(new Date(r.createdAt), 'yyyy-MM-dd')
            }))
            exportToExcel(data, fileName, sheetName)
        } else {
            const columns = [
                { header: 'Name', dataKey: 'name' },
                { header: 'Type', dataKey: 'type' },
                { header: 'Email', dataKey: 'email' },
                { header: 'Phone', dataKey: 'phone' },
                { header: 'Referrals', dataKey: 'referralCount' },
                { header: 'Earned', dataKey: 'totalEarned' },
                { header: 'Status', dataKey: 'status' }
            ]
            const data = referrers.map(r => ({
                name: r.name,
                type: r.type,
                email: r.email || 'N/A',
                phone: r.phone || 'N/A',
                referralCount: r._count?.referrals || 0,
                totalEarned: r.totalEarned || 0,
                status: r.status
            }))
            exportToPDF(data, fileName, 'Referral Partners Report', columns)
        }
    }

    const exportReferralLog = (type: 'excel' | 'pdf' = 'excel') => {
        if (!referrals.length) return toast.error("No referral logs to export")

        const fileName = `Referral_Log_${format(new Date(), 'yyyy-MM-dd')}`
        
        if (type === 'excel') {
            const data = referrals.map(r => ({
                'Student Name': `${r.student?.firstName} ${r.student?.lastName}`,
                'Admission ID': r.student?.admissionDisplayId || 'N/A',
                'Referrer': r.referrer?.name,
                'Reward Amount (₹)': r.rewardAmount || 0,
                'Reward Status': r.rewardStatus,
                'Join Status': r.status,
                'Referral Date': format(new Date(r.createdAt), 'yyyy-MM-dd'),
                'Payout Date': r.paidDate ? format(new Date(r.paidDate), 'yyyy-MM-dd') : 'N/A',
                'Payout Mode': r.payoutMode || 'N/A'
            }))
            exportToExcel(data, fileName, 'Referrals')
        } else {
            const columns = [
                { header: 'Student', dataKey: 'student' },
                { header: 'Referrer', dataKey: 'referrer' },
                { header: 'Amount', dataKey: 'amount' },
                { header: 'Status', dataKey: 'status' },
                { header: 'Date', dataKey: 'date' },
                { header: 'Mode', dataKey: 'mode' }
            ]
            const data = referrals.map(r => ({
                student: `${r.student?.firstName} ${r.student?.lastName}`,
                referrer: r.referrer?.name,
                amount: r.rewardAmount || 0,
                status: r.rewardStatus,
                date: format(new Date(r.createdAt), 'yyyy-MM-dd'),
                mode: r.payoutMode || 'N/A'
            }))
            exportToPDF(data, fileName, 'Referral Payout History', columns)
        }
    }

    return {
        referrers,
        referrals,
        stats,
        loading,
        fetchAllData,
        createReferrer,
        updateReferrer,
        deleteReferrer,
        processPayout,
        exportReferrers,
        exportReferralLog
    }
}
