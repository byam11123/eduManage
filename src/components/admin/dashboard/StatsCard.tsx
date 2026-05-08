import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: string
        isUp: boolean
    }
    color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'
    loading?: boolean
}

const colorMap = {
    indigo: 'from-indigo-600 to-indigo-700 shadow-indigo-200 text-indigo-600 bg-indigo-50',
    emerald: 'from-emerald-600 to-emerald-700 shadow-emerald-200 text-emerald-600 bg-emerald-50',
    amber: 'from-amber-600 to-amber-700 shadow-amber-200 text-amber-600 bg-amber-50',
    rose: 'from-rose-600 to-rose-700 shadow-rose-200 text-rose-600 bg-rose-50',
    purple: 'from-purple-600 to-purple-700 shadow-purple-200 text-purple-600 bg-purple-50',
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'indigo',
    loading
}: StatsCardProps) {
    if (loading) {
        return (
            <Card className="border-none shadow-sm animate-pulse bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-3">
                            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded-full" />
                            <div className="h-8 w-24 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                        </div>
                        <div className="h-11 w-11 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const colorClasses = colorMap[color] || colorMap.indigo
    const accentColor = colorClasses.split(' ').find(c => c.startsWith('text-')) || 'text-indigo-600'
    const bgColor = accentColor.replace('text-', 'bg-')
    const shadowColor = colorClasses.split(' ').find(c => c.startsWith('shadow-')) || 'shadow-indigo-200'

    return (
        <Card className="group relative overflow-hidden border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] transition-all duration-500 hover:-translate-y-2">
            {/* Decorative Background Element */}
            <div className={cn(
                "absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-[0.03] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.08]",
                bgColor
            )} />

            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", bgColor)} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                {title}
                            </p>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                                {value}
                            </h3>
                            
                            <div className="flex items-center gap-2">
                                {trend && (
                                    <span className={cn(
                                        "flex items-center text-[10px] font-black px-2 py-0.5 rounded-full",
                                        trend.isUp 
                                            ? "bg-emerald-50 text-emerald-600" 
                                            : "bg-rose-50 text-rose-600"
                                    )}>
                                        {trend.isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                        {trend.value}
                                    </span>
                                )}
                                {description && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate max-w-[120px]">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 bg-gradient-to-br",
                        colorClasses.split(' ').slice(0, 2).join(' '),
                        shadowColor
                    )}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
