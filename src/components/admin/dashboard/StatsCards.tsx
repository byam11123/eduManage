import { 
    Users, 
    UserCheck, 
    TrendingUp, 
    AlertCircle, 
    BookOpen, 
    Layers, 
    PhoneCall,
    Target
} from 'lucide-react'
import { StatsCard } from './StatsCard'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
    stats: DashboardStats
    loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                <StatsCard
                    title="Total Enrollment"
                    value={stats.totalStudents}
                    icon={Users}
                    description="Total Registered"
                    trend={stats.trends?.enrollment}
                    color="indigo"
                    loading={loading}
                />
                <StatsCard
                    title="Active Cohorts"
                    value={stats.activeStudents}
                    icon={UserCheck}
                    description="Currently Participating"
                    color="emerald"
                    loading={loading}
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    description="Total Amount Collected"
                    trend={stats.trends?.revenue}
                    color="violet"
                    loading={loading}
                />
                <StatsCard
                    title="Pending Fees"
                    value={`₹${stats.pendingFees.toLocaleString()}`}
                    icon={AlertCircle}
                    description="Total Due Amount"
                    color="rose"
                    loading={loading}
                />
            </div>
            
            {/* Secondary Operational KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 opacity-90">
                <StatsCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    description="Active Programs"
                    color="indigo"
                    loading={loading}
                />
                <StatsCard
                    title="Total Batches"
                    value={stats.totalBatches}
                    icon={Layers}
                    description="Running Batches"
                    color="emerald"
                    loading={loading}
                />
                <StatsCard
                    title="Total Leads"
                    value={stats.totalEnquiries}
                    icon={PhoneCall}
                    description="Total Enquiries"
                    trend={stats.trends?.enquiries}
                    color="amber"
                    loading={loading}
                />
                <StatsCard
                    title="Conversion Rate"
                    value={`${Math.round((stats.activeStudents / (stats.totalEnquiries || 1)) * 100)}%`}
                    icon={Target}
                    description="Lead Conversion"
                    color="indigo"
                    loading={loading}
                />
            </div>
        </div>
    )
}
