// ============================================
// STATS CARDS GRID COMPONENT
// Grid of stats cards for dashboard overview
// ============================================

'use client'

import { StatsCard } from './StatsCard'
import {
    Users,
    UserCheck,
    IndianRupee,
    Clock,
    BookOpen,
    Calendar
} from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
    stats: DashboardStats
    loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
    const cards = [
        {
            title: 'Total Students',
            value: loading ? '...' : stats.totalStudents,
            icon: Users,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
        },
        {
            title: 'Active Students',
            value: loading ? '...' : stats.activeStudents,
            icon: UserCheck,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
        },
        {
            title: 'Total Revenue',
            value: loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            iconColor: 'text-indigo-600',
            iconBgColor: 'bg-indigo-100',
        },
        {
            title: 'Pending Fees',
            value: loading ? '...' : `₹${stats.pendingFees.toLocaleString()}`,
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
        },
        {
            title: 'Total Courses',
            value: loading ? '...' : stats.totalCourses,
            icon: BookOpen,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
        },
        {
            title: 'Total Batches',
            value: loading ? '...' : stats.totalBatches,
            icon: Calendar,
            iconColor: 'text-teal-600',
            iconBgColor: 'bg-teal-100',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
                <StatsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    iconColor={card.iconColor}
                    iconBgColor={card.iconBgColor}
                />
            ))}
        </div>
    )
}
