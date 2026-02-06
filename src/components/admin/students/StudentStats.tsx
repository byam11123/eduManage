// ============================================
// STUDENT STATS COMPONENT
// Stats overview cards for students
// ============================================

'use client'

import { Card, CardContent } from '@/components/ui/card'
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
    const stats = [
        // Row 1
        {
            title: 'Total Students',
            value: total,
            icon: Users,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            isCurrency: false
        },
        {
            title: 'Received Payment',
            value: received,
            icon: IndianRupee,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            isCurrency: true
        },
        {
            title: 'Cash Received',
            value: cash,
            icon: Banknote,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            isCurrency: true
        },
        {
            title: 'Online Received',
            value: online,
            icon: CreditCard,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            isCurrency: true
        },
        {
            title: 'Unknown Mode Payment',
            value: unknown,
            icon: HelpCircle,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            isCurrency: true
        },
        // Row 2
        {
            title: 'Overdue Payment',
            value: overdue,
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            isCurrency: true
        },
        {
            title: 'Upcoming Payment',
            value: upcoming,
            icon: CalendarClock,
            color: 'text-sky-600',
            bgColor: 'bg-sky-50',
            isCurrency: true
        },
        {
            title: 'Refunded Students',
            value: refundedCount,
            icon: UserX,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            isCurrency: false
        },
        {
            title: 'Refunded Amount',
            value: refundedAmount,
            icon: RotateCcw,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            isCurrency: true
        },
        {
            title: 'Defaulter Students',
            value: defaulters,
            icon: AlertTriangle,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            isCurrency: false
        }
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${stat.bgColor} shrink-0`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div className="overflow-hidden">
                            <p className={`font-bold text-gray-900 dark:text-white truncate ${stat.isCurrency ? 'text-lg' : 'text-xl'}`}>
                                {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
                            </p>
                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide truncate">
                                {stat.title}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
