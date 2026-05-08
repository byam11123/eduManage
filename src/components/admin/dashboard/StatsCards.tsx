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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="Total Students"
                value={stats.totalStudents}
                icon={Users}
                description="Overall registered students"
                trend={{ value: '12%', isUp: true }}
                color="indigo"
                loading={loading}
            />
            <StatsCard
                title="Active Enrollment"
                value={stats.activeStudents}
                icon={UserCheck}
                description="Currently active in batches"
                trend={{ value: '5%', isUp: true }}
                color="emerald"
                loading={loading}
            />
            <StatsCard
                title="Revenue"
                value={`₹${stats.totalRevenue.toLocaleString()}`}
                icon={TrendingUp}
                description="Total fees collected"
                trend={{ value: '24%', isUp: true }}
                color="purple"
                loading={loading}
            />
            <StatsCard
                title="Pending Dues"
                value={`₹${stats.pendingFees.toLocaleString()}`}
                icon={AlertCircle}
                description="Awaiting collection"
                trend={{ value: '2%', isUp: false }}
                color="rose"
                loading={loading}
            />
            
            {/* Row 2: Operation Stats */}
            <StatsCard
                title="Courses"
                value={stats.totalCourses}
                icon={BookOpen}
                description="Active educational programs"
                color="indigo"
                loading={loading}
            />
            <StatsCard
                title="Live Batches"
                value={stats.totalBatches}
                icon={Layers}
                description="Currently running sessions"
                color="emerald"
                loading={loading}
            />
            <StatsCard
                title="Total Enquiries"
                value={stats.totalEnquiries}
                icon={PhoneCall}
                description="All-time CRM leads"
                trend={{ value: '18%', isUp: true }}
                color="amber"
                loading={loading}
            />
            <StatsCard
                title="Conversion Rate"
                value={`${Math.round((stats.activeStudents / (stats.totalEnquiries || 1)) * 100)}%`}
                icon={Target}
                description="Leads to Admission ratio"
                trend={{ value: '3%', isUp: true }}
                color="indigo"
                loading={loading}
            />
        </div>
    )
}
