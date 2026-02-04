// ============================================
// STUDENT STATS COMPONENT
// Stats overview cards for students
// ============================================

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, UserX, GraduationCap } from 'lucide-react'

interface StudentStatsProps {
    total: number
    active: number
    inactive: number
    graduated: number
    dropped?: number
}

export function StudentStats({ total, active, inactive, graduated, dropped = 0 }: StudentStatsProps) {
    const stats = [
        {
            title: 'Total Students',
            value: total,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Active',
            value: active,
            icon: UserCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Inactive',
            value: inactive,
            icon: UserX,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100'
        },
        {
            title: 'Graduated',
            value: graduated,
            icon: GraduationCap,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500">{stat.title}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
