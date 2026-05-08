'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatItem {
    title: string
    value: string | number
    icon: any
    color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'blue'
    trend?: string
}

interface StatsGridProps {
    stats: StatItem[]
    columns?: 2 | 3 | 4 | 5 | 6 | 7 | 8
}

const colorMap = {
    indigo: 'from-indigo-600 to-indigo-700 shadow-indigo-200 text-indigo-600 bg-indigo-50',
    emerald: 'from-emerald-600 to-emerald-700 shadow-emerald-200 text-emerald-600 bg-emerald-50',
    rose: 'from-rose-600 to-rose-700 shadow-rose-200 text-rose-600 bg-rose-50',
    amber: 'from-amber-600 to-amber-700 shadow-amber-200 text-amber-600 bg-amber-50',
    violet: 'from-violet-600 to-violet-700 shadow-violet-200 text-violet-600 bg-violet-50',
    blue: 'from-blue-600 to-blue-700 shadow-blue-200 text-blue-600 bg-blue-50'
}

export function StatsGrid({ stats, columns = 3 }: StatsGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        7: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7',
        8: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8'
    }

    return (
        <div className={cn("grid gap-3", gridCols[columns as keyof typeof gridCols])}>
            {stats.map((stat, i) => (
                <Card 
                    key={i} 
                    className="group relative overflow-hidden border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
                >
                    {/* Background Decorative Element */}
                    <div className={cn(
                        "absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-[0.03] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.08]",
                        colorMap[stat.color].split(' ').slice(2, 3)[0].replace('text-', 'bg-')
                    )} />

                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "h-1.5 w-1.5 rounded-full animate-pulse",
                                        colorMap[stat.color].split(' ').slice(2, 3)[0].replace('text-', 'bg-')
                                    )} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        {stat.title}
                                    </p>
                                </div>
                                
                                <div className="space-y-0.5">
                                    <h3 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
                                        {stat.value}
                                    </h3>
                                    {stat.trend && (
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                colorMap[stat.color].split(' ').slice(2, 3)[0],
                                                colorMap[stat.color].split(' ').slice(3, 4)[0]
                                            )}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={cn(
                                "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 bg-gradient-to-br",
                                colorMap[stat.color].split(' ').slice(0, 2).join(' '),
                                colorMap[stat.color].split(' ').slice(2, 3)[0].replace('text-', 'shadow-')
                            )}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
