// ============================================
// DASHBOARD PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import {
  DashboardHeader,
  StatsCards,
  RevenueChart,
  RecentStudentsTable
} from '@/components/admin/dashboard'
import { useDashboard, useAuth } from '@/hooks'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const {
    stats,
    revenueData,
    recentStudents,
    loading,
    refreshStats,
    fetchDashboardData
  } = useDashboard()

  const handleRefresh = async () => {
    await fetchDashboardData()
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Stats Overview */}
      <StatsCards
        stats={stats}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart
            data={revenueData}
            loading={loading}
          />
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-1">
          <RecentStudentsTable
            students={recentStudents}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}