// ============================================
// REVENUE CHART COMPONENT
// Line chart showing revenue over time
// ============================================

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee } from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import type { RevenueData } from '@/lib/types'

interface RevenueChartProps {
    data: RevenueData[]
    loading?: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
    // Default data if none provided
    const chartData = data.length > 0 ? data : [
        { month: 'Jan', revenue: 0, students: 0 },
        { month: 'Feb', revenue: 0, students: 0 },
        { month: 'Mar', revenue: 0, students: 0 },
        { month: 'Apr', revenue: 0, students: 0 },
        { month: 'May', revenue: 0, students: 0 },
        { month: 'Jun', revenue: 0, students: 0 },
    ]

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-indigo-600" />
                    Revenue Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        Loading chart...
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    dot={{ fill: '#4f46e5', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
