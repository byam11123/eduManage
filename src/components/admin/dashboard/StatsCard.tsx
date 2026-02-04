// ============================================
// STATS CARD COMPONENT
// Reusable card component for displaying statistics
// ============================================

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon?: LucideIcon
    iconColor?: string
    iconBgColor?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    className?: string
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-indigo-600',
    iconBgColor = 'bg-indigo-100',
    trend,
    className
}: StatsCardProps) {
    return (
        <Card className={cn('border-none shadow-sm', className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                        {trend && (
                            <p className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            )}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </p>
                        )}
                    </div>
                    {Icon && (
                        <div className={cn('p-3 rounded-lg', iconBgColor)}>
                            <Icon className={cn('h-6 w-6', iconColor)} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
