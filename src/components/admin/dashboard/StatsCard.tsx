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
    color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet'
    loading?: boolean
}

const colorMap = {
    indigo: 'bg-indigo-600/10 text-indigo-600 border-indigo-100 dark:border-indigo-900/30 glow-indigo',
    emerald: 'bg-emerald-600/10 text-emerald-600 border-emerald-100 dark:border-emerald-900/30 glow-emerald',
    amber: 'bg-amber-600/10 text-amber-600 border-amber-100 dark:border-amber-900/30 glow-amber',
    rose: 'bg-rose-600/10 text-rose-600 border-rose-100 dark:border-rose-900/30 glow-rose',
    violet: 'bg-violet-600/10 text-violet-600 border-violet-100 dark:border-violet-900/30 glow-violet',
}

const dotColors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    violet: 'bg-violet-600'
}

const glowColors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    violet: 'bg-violet-600'
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
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none animate-pulse bg-white dark:bg-gray-900 rounded-[2rem]">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="h-3 w-20 bg-gray-50 dark:bg-gray-800 rounded-full" />
                            <div className="h-10 w-24 bg-gray-50 dark:bg-gray-800 rounded-2xl" />
                        </div>
                        <div className="h-14 w-14 bg-gray-50 dark:bg-gray-800 rounded-2xl" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const config = colorMap[color] || colorMap.indigo

    return (
        <Card className="group relative overflow-hidden border-none shadow-2xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-100 dark:hover:bg-gray-800/80">
            {/* Dynamic Glow Layer */}
            <div className={cn(
                "absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.03] transition-all duration-700 group-hover:opacity-[0.08] blur-3xl",
                glowColors[color]
            )} />

            <CardContent className="p-5 2xl:p-8">
                <div className="flex items-center justify-between gap-3 2xl:gap-6">
                    <div className="space-y-3 2xl:space-y-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 2xl:gap-3">
                            <span className={cn(
                                "h-1.5 w-1.5 2xl:h-2 2xl:w-2 rounded-full shrink-0",
                                dotColors[color]
                            )} />
                            <p className="text-[9px] 2xl:text-[10px] font-black uppercase tracking-[0.2em] 2xl:tracking-[0.3em] text-gray-400 truncate">
                                {title}
                            </p>
                        </div>
                        
                        <div className="space-y-2 2xl:space-y-3">
                            <div className="flex items-end gap-2 2xl:gap-3">
                                <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none whitespace-nowrap">
                                    {(() => {
                                        const val = value.toString()
                                        let formatted = val.replace('₹', '₹ ')
                                        if (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 10) {
                                            formatted = `0${Number(val)}`
                                        }
                                        return formatted
                                    })()}
                                </h3>
                                {trend && (
                                    <span className={cn(
                                        "flex items-center text-[8px] 2xl:text-[10px] font-black px-2 2xl:px-3 py-1 rounded-lg 2xl:rounded-xl shadow-sm mb-0.5 whitespace-nowrap",
                                        trend.isUp 
                                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                            : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                                    )}>
                                        {trend.isUp ? <ArrowUpRight className="h-3 w-3 2xl:h-3.5 2xl:w-3.5 mr-0.5 2xl:mr-1" /> : <ArrowDownRight className="h-3 w-3 2xl:h-3.5 2xl:w-3.5 mr-0.5 2xl:mr-1" />}
                                        {trend.value}
                                    </span>
                                )}
                            </div>
                            
                            {description && (
                                <p className="text-[8px] 2xl:text-[9px] font-black text-gray-400 uppercase tracking-widest truncate opacity-80 leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={cn(
                        "h-12 w-12 2xl:h-16 2xl:w-16 rounded-2xl 2xl:rounded-[1.5rem] flex items-center justify-center border-2 2xl:border-4 border-white dark:border-gray-900 shadow-xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shrink-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
                        config.split(' ')[2]
                    )}>
                        <Icon className={cn("h-5 w-5 2xl:h-7 2xl:w-7", config.split(' ')[1])} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
