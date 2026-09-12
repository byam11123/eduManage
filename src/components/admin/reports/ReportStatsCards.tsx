'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp,
  AlertCircle,
  Users,
  GraduationCap,
  CalendarCheck,
  Building2,
  DollarSign,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react'

interface ReportStatsCardsProps {
  kpis: {
    totalRevenue: number
    totalPending: number
    overduePending: number
    totalProjected: number
    collectionEfficiency: number
    totalStudents: number
    activeStudents: number
    inactiveStudents: number
    totalEnquiries: number
    conversionRate: number
    overallAttendanceRate: number
    totalStaff: number
    totalCourses: number
  }
}

export function ReportStatsCards({ kpis }: ReportStatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue Collected',
      value: formatCurrency(kpis.totalRevenue),
      subtitle: `${kpis.collectionEfficiency}% collection rate`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      badge: '+Live',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Outstanding Receivables',
      value: formatCurrency(kpis.totalPending),
      subtitle: `${formatCurrency(kpis.overduePending)} overdue`,
      icon: AlertCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      badge: 'Action req',
      badgeColor: 'text-rose-400 bg-rose-500/10',
    },
    {
      title: 'Total Enrolled Students',
      value: kpis.totalStudents.toLocaleString(),
      subtitle: `${kpis.activeStudents} currently active`,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      badge: `${kpis.inactiveStudents} inactive`,
      badgeColor: 'text-muted-foreground bg-muted',
    },
    {
      title: 'CRM Conversion Rate',
      value: `${kpis.conversionRate}%`,
      subtitle: `${kpis.totalEnquiries} enquiries logged`,
      icon: ArrowUpRight,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      badge: 'Pipeline',
      badgeColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Overall Attendance',
      value: `${kpis.overallAttendanceRate}%`,
      subtitle: 'Average presence across batches',
      icon: CalendarCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      badge: 'Academic',
      badgeColor: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      title: 'Active Faculty & Staff',
      value: kpis.totalStaff.toLocaleString(),
      subtitle: `Across ${kpis.totalCourses} courses`,
      icon: UserCheck,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      badge: 'Team',
      badgeColor: 'text-violet-400 bg-violet-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className={`border ${card.border} bg-card/60 backdrop-blur-md relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-border`}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-0.5 truncate">
                  {card.title}
                </div>
                <div className="text-[11px] text-muted-foreground/80 mt-1">
                  {card.subtitle}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
