'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface ReportChartsProps {
  charts: {
    monthlyRevenue: Array<{
      month: string
      collected: number
      due: number
    }>
    paymentModes: Array<{
      name: string
      value: number
    }>
    courseDistribution: Array<{
      course: string
      students: number
      revenue: number
    }>
    attendanceSplit: Array<{
      name: string
      value: number
      color: string
    }>
    leadSources: Array<{
      source: string
      count: number
    }>
  }
}

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6']

export function ReportCharts({ charts }: ReportChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Monthly Revenue Collection vs Due */}
      <Card className="bg-card/50 backdrop-blur-md border-border/40 shadow-sm">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Monthly Fee Collection vs Due</CardTitle>
          <CardDescription className="text-xs">
            Historical payment collections compared to outstanding installments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="h-[280px] w-full">
            {charts.monthlyRevenue && charts.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [formatCurrency(Number(value)), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="due" name="Outstanding" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No revenue trends available for the selected period.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Top Courses Enrollment & Revenue */}
      <Card className="bg-card/50 backdrop-blur-md border-border/40 shadow-sm">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Top Courses by Enrollment</CardTitle>
          <CardDescription className="text-xs">
            Number of enrolled students and gross revenue per course
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="h-[280px] w-full">
            {charts.courseDistribution && charts.courseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charts.courseDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="course"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [
                      name === 'Revenue' ? formatCurrency(Number(val)) : `${val} Students`,
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="students" name="Students" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No course enrollment data found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Payment Modes Breakdown */}
      <Card className="bg-card/50 backdrop-blur-md border-border/40 shadow-sm">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Payment Modes Distribution</CardTitle>
          <CardDescription className="text-xs">
            Fee transactions segmented by payment channel (UPI, Cash, Bank Transfer, Card)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="h-[260px] w-full flex items-center justify-center">
            {charts.paymentModes && charts.paymentModes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.paymentModes}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {charts.paymentModes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Total Collected']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No payments recorded in this period.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Enquiry & Lead Sources */}
      <Card className="bg-card/50 backdrop-blur-md border-border/40 shadow-sm">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Lead & Enquiry Acquisition</CardTitle>
          <CardDescription className="text-xs">
            Where prospective students discover the coaching institute
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <div className="h-[260px] w-full flex items-center justify-center">
            {charts.leadSources && charts.leadSources.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.leadSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="source"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {charts.leadSources.map((entry, index) => (
                      <Cell key={`cell-source-${index}`} fill={PIE_COLORS[(index + 2) % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} Inquiries`, 'Count']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No enquiry sources registered yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
