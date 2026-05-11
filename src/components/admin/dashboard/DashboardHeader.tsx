'use client'

import { Button } from '@/components/ui/button'
import { RotateCw, Download, Plus, LayoutDashboard, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/hooks'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileSpreadsheet, FileText } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils'
import { toast } from 'sonner'

interface DashboardHeaderProps {
    onRefresh?: () => void
    loading?: boolean
    exportData?: any[]
    exportFileName?: string
    exportTitle?: string
    exportColumns?: { header: string; dataKey: string }[]
}

export function DashboardHeader({ 
    onRefresh, 
    loading,
    exportData,
    exportFileName = 'Dashboard_Export',
    exportTitle = 'Dashboard Data Summary',
    exportColumns = []
}: DashboardHeaderProps) {
    const { user } = useAuth()
    const today = new Date()

    const handleExcelExport = () => {
        if (!exportData || exportData.length === 0) {
            toast.error('No data available to export')
            return
        }
        const success = exportToExcel(exportData, exportFileName)
        if (success) toast.success('Excel report generated')
    }

    const handlePDFExport = () => {
        if (!exportData || exportData.length === 0) {
            toast.error('No data available to export')
            return
        }
        if (exportColumns.length === 0) {
            toast.error('Export configuration missing')
            return
        }
        const success = exportToPDF(exportData, exportFileName, exportTitle, exportColumns)
        if (success) toast.success('PDF report generated')
    }

    return (
        <div className="flex flex-col gap-8 mb-10">
            {/* Institutional Breadcrumbs */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                    <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-gray-400">ADMIN</span>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <span className="text-indigo-600">DASHBOARD</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
                        Welcome Back, {user?.fullName?.split(' ')[0] || 'Admin'}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                            {format(today, 'EEEE, MMMM d, yyyy')} • System Online
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRefresh}
                        disabled={loading}
                        className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all active:scale-95 group"
                    >
                        <RotateCw className={`h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-12 px-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 gap-3 transition-all active:scale-95"
                            >
                                <Download className="h-4 w-4" />
                                EXPORT
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 p-2">Export Data</DropdownMenuLabel>
                            <DropdownMenuItem 
                                onClick={handleExcelExport}
                                className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                            >
                                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                Export as Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={handlePDFExport}
                                className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                            >
                                <FileText className="h-4 w-4 text-rose-500" />
                                Export as PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        ADD NEW
                    </Button>
                </div>
            </div>
        </div>
    )
}
