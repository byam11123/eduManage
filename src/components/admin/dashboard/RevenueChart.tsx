'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Wallet, ArrowUpRight } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib/utils'

interface RevenueChartProps {
    data: any[]
    loading?: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
            <CardContent className="p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                    <h4 className={sectionHeaderClasses + " border-none pb-0 mb-0"}>
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        Revenue Performance Overview
                    </h4>
                    
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">+12.5% VS LAST CYCLE</span>
                    </div>
                </div>

                {loading ? (
                    <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 animate-pulse">
                        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing_Financial_Data</p>
                    </div>
                ) : (
                    <div className="h-[400px] w-full mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    dx={-15}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-2xl">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                        {payload[0].payload.name} CYCLE
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-lg font-black text-indigo-600 tracking-tighter">
                                                            ₹{payload[0].value?.toLocaleString()}
                                                        </p>
                                                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    animationDuration={2000}
                                    dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5 shadow-xl' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
