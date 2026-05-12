'use client'

import {
  DashboardHeader,
  StatsCards,
  RevenueChart,
  RecentStudentsTable,
  RecentEnquiriesTable,
  QuickActions
} from '@/components/admin/dashboard'
import { useDashboard, useAuth } from '@/hooks'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const {
    stats,
    revenueData,
    recentStudents,
    recentEnquiries,
    loading,
    fetchDashboardData
  } = useDashboard()

  const handleRefresh = async () => {
    await fetchDashboardData()
  }

  const exportData = [
    { metric: 'Total Registered', value: stats.totalStudents },
    { metric: 'Active Students', value: stats.activeStudents },
    { metric: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}` },
    { metric: 'Pending Dues', value: `₹${stats.pendingFees.toLocaleString()}` },
    { metric: 'Total Courses', value: stats.totalCourses },
    { metric: 'Total Batches', value: stats.totalBatches },
    { metric: 'Total Enquiries', value: stats.totalEnquiries },
    { metric: 'Recent Enquiries', value: stats.recentEnquiries },
  ]

  const exportColumns = [
    { header: 'Metric Name', dataKey: 'metric' },
    { header: 'Status/Value', dataKey: 'value' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-10 space-y-12">
      {/* Institutional Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        loading={loading}
        exportData={exportData}
        exportColumns={exportColumns}
        exportFileName="EduManage_Dashboard_Summary"
        exportTitle="Executive Dashboard Summary"
      />

      {/* KPI Matrix Overview */}
      <StatsCards
        stats={stats}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Financials & Operational Core (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          <RevenueChart
            data={revenueData}
            loading={loading}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <RecentStudentsTable
              students={recentStudents}
              loading={loading}
            />
            <RecentEnquiriesTable
              enquiries={recentEnquiries}
              loading={loading}
            />
          </div>
        </div>

        {/* Right Column: Shortcuts & Global State (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          <QuickActions />
          
          {/* Decorative Institutional Card */}
          <div className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 dark:shadow-none">
            <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight">EduManage_Pro</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-2">Institutional System Overview</p>
              <div className="mt-10 pt-10 border-t border-white/10">
                <p className="text-sm font-medium leading-relaxed italic opacity-80">
                  "Efficiency is doing things right; effectiveness is doing the right things."
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-4 opacity-40">— SYSTEM_MOTTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}