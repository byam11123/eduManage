'use client'

import React, { useState } from 'react'
import { useReports } from '@/hooks/useReports'
import { useAuth } from '@/hooks/useAuth'
import { ReportStatsCards } from '@/components/admin/reports/ReportStatsCards'
import { ReportCharts } from '@/components/admin/reports/ReportCharts'
import { ReportRegisters } from '@/components/admin/reports/ReportRegisters'
import { exportReportsToExcel, exportReportsToPDF } from '@/lib/utils/report-exports'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Building2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAuth()
  const { data, loading, error, filters, updateFilters, refetch } = useReports()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = () => {
    if (!data) return
    setIsExporting(true)
    try {
      exportReportsToExcel(data, (user as any)?.organization?.name || 'EduManage Institute')
    } catch (err) {
      console.error('Failed to export excel:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = () => {
    if (!data) return
    setIsExporting(true)
    try {
      exportReportsToPDF(data, (user as any)?.organization?.name || 'EduManage Institute')
    } catch (err) {
      console.error('Failed to export PDF:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Institutional Reports & Analytics
                <Badge variant="outline" className="text-xs font-normal border-primary/30 text-primary bg-primary/5">
                  Live Audit
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Executive metrics, fee collection ledgers, pending dues, student enrollments, and compliance reports.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Branch, Range, Exports, Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch Filter */}
          {data?.branches && data.branches.length > 0 && (
            <div className="flex items-center">
              <Select
                value={filters.branchId || 'all'}
                onValueChange={(val) => updateFilters({ branchId: val })}
              >
                <SelectTrigger className="h-9 text-xs w-[140px] md:w-[160px] bg-background/50 border-border/50">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-medium">
                    All Branches
                  </SelectItem>
                  {data.branches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs">
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range Selector */}
          <div className="flex items-center">
            <Select
              value={filters.range || '30d'}
              onValueChange={(val: any) => updateFilters({ range: val })}
            >
              <SelectTrigger className="h-9 text-xs w-[125px] bg-background/50 border-border/50">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d" className="text-xs">Past 7 Days</SelectItem>
                <SelectItem value="30d" className="text-xs">Past 30 Days</SelectItem>
                <SelectItem value="90d" className="text-xs">Past 90 Days</SelectItem>
                <SelectItem value="year" className="text-xs">Academic Year</SelectItem>
                <SelectItem value="all" className="text-xs">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
            className="h-9 px-3 text-xs bg-background/50 border-border/50"
            title="Refresh reports"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                disabled={loading || !data || isExporting}
                className="h-9 px-3.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportExcel} className="text-xs cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" />
                <span>Export Excel (.xlsx)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF} className="text-xs cursor-pointer">
                <FileText className="w-4 h-4 mr-2 text-rose-500" />
                <span>Export PDF Report (.pdf)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Unable to load report data</p>
            <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs h-7 border-rose-500/40">
            Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && !data && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">
            Aggregating institutional registers, fee ledgers, and attendance analytics...
          </p>
        </div>
      )}

      {/* Content */}
      {data && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <ReportStatsCards kpis={data.kpis} />

          {/* Visual Trends & Analytics */}
          <ReportCharts charts={data.charts} />

          {/* Transactional Registers & Audit Ledgers */}
          <ReportRegisters registers={data.registers} />
        </div>
      )}
    </div>
  )
}
