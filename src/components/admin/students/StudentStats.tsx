'use client'

import {
    Users,
    IndianRupee,
    Banknote,
    CreditCard,
    HelpCircle,
    AlertCircle,
    CalendarClock,
    UserX,
    RotateCcw,
    AlertTriangle
} from 'lucide-react'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { formatCurrency } from '@/lib/utils'

interface StudentStatsProps {
    total: number
    received: number
    cash: number
    online: number
    unknown: number
    overdue: number
    upcoming: number
    refundedCount: number
    refundedAmount: number
    defaulters: number
}

export function StudentStats({
    total,
    received,
    cash,
    online,
    unknown,
    overdue,
    upcoming,
    refundedCount,
    refundedAmount,
    defaulters
}: StudentStatsProps) {
    const statsData = [
        {
            title: 'Total Students',
            value: total,
            icon: Users,
            color: 'indigo' as const,
            trend: 'Base Population'
        },
        {
            title: 'Total Collection',
            value: formatCurrency(received),
            icon: IndianRupee,
            color: 'emerald' as const,
            trend: 'Revenue Stream'
        },
        {
            title: 'Overdue Dues',
            value: formatCurrency(overdue),
            icon: AlertCircle,
            color: 'rose' as const,
            trend: 'Critical Attention'
        },
        {
            title: 'Upcoming Dues',
            value: formatCurrency(upcoming),
            icon: CalendarClock,
            color: 'amber' as const,
            trend: 'Projection'
        },
        {
            title: 'Defaulters',
            value: defaulters,
            icon: AlertTriangle,
            color: 'violet' as const,
            trend: 'Risk Management'
        }
    ]

    return (
        <StatsGrid stats={statsData} columns={5} />
    )
}
