'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatItem {
    title: string
    value: string | number
    icon: any
    color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'blue' | 'sky'
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
    blue: 'from-blue-600 to-blue-700 shadow-blue-200 text-blue-600 bg-blue-50',
    sky: 'from-sky-600 to-sky-700 shadow-sky-200 text-sky-600 bg-sky-50'
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
            {stats.map((stat, i) => {
                const colorConfig = colorMap[stat.color] || colorMap.indigo
                const colorParts = colorConfig.split(' ')
                const textColor = colorParts.find(p => p.startsWith('text-')) || 'text-indigo-600'
                const bgColor = colorParts.find(p => p.startsWith('bg-')) || 'bg-indigo-50'
                const shadowColor = colorParts.find(p => p.startsWith('shadow-')) || 'shadow-indigo-200'
                const gradientColors = colorParts.slice(0, 2).join(' ')

                return (
                    <Card
                        key={i}
                        className="group relative overflow-hidden border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl"
                    >
                        {/* Background Decorative Element */}
                        <div className={cn(
                            "absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-[0.03] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.08]",
                            bgColor
                        )} />

                        <CardContent className="p-4 2xl:p-5">
                            <div className="flex items-center justify-between gap-2 2xl:gap-4">
                                <div className="space-y-3 2xl:space-y-4 flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 2xl:gap-2">
                                        <span className={cn(
                                            "h-1.5 w-1.5 2xl:h-2 2xl:w-2 rounded-full shrink-0",
                                            {
                                                'bg-indigo-600': stat.color === 'indigo',
                                                'bg-emerald-600': stat.color === 'emerald',
                                                'bg-rose-600': stat.color === 'rose',
                                                'bg-amber-600': stat.color === 'amber',
                                                'bg-violet-600': stat.color === 'violet',
                                                'bg-blue-600': stat.color === 'blue',
                                                'bg-sky-600': stat.color === 'sky',
                                            }
                                        )} />
                                        <p className="text-[9px] 2xl:text-[10px] font-black uppercase tracking-[0.15em] 2xl:tracking-[0.2em] text-gray-400 truncate">
                                            {stat.title}
                                        </p>
                                    </div>

                                    <div className="space-y-2 2xl:space-y-3">
                                        <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-none whitespace-nowrap">
                                            {(() => {
                                                const val = stat.value.toString()
                                                let formatted = val.replace('₹', '₹ ')
                                                if (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 10) {
                                                    formatted = `0${Number(val)}`
                                                }
                                                return formatted
                                            })()}
                                        </h3>

                                        {stat.trend && (
                                            <div className="flex items-center">
                                                <span className={cn(
                                                    "text-[9px] 2xl:text-[10px] font-black uppercase tracking-[0.1em] rounded-lg whitespace-nowrap",
                                                    textColor
                                                )}>
                                                    {stat.trend}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={cn(
                                    "h-10 w-10 2xl:h-12 2xl:w-12 rounded-[1rem] 2xl:rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 bg-gradient-to-br shrink-0",
                                    gradientColors,
                                    shadowColor
                                )}>
                                    <stat.icon className="h-4 w-4 2xl:h-6 2xl:w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

