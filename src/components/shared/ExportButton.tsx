'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileSpreadsheet, FileText, Download } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ExportButtonProps {
    data: any[]
    fileName?: string
    title?: string
    columns: { header: string; dataKey: string }[]
    variant?: 'outline' | 'ghost' | 'secondary' | 'default'
    className?: string
    showLabel?: boolean
}

export function ExportButton({
    data,
    fileName = 'Export_Data',
    title = 'Data Report',
    columns,
    variant = 'outline',
    className,
    showLabel = true
}: ExportButtonProps) {
    const handleExcelExport = () => {
        if (!data || data.length === 0) {
            toast.error('No data available to export')
            return
        }
        const success = exportToExcel(data, fileName)
        if (success) toast.success('Excel report generated')
    }

    const handlePDFExport = () => {
        if (!data || data.length === 0) {
            toast.error('No data available to export')
            return
        }
        if (!columns || columns.length === 0) {
            toast.error('Export configuration missing')
            return
        }
        const success = exportToPDF(data, fileName, title, columns)
        if (success) toast.success('PDF report generated')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    className={cn(
                        "h-11 px-5 rounded-xl transition-all font-bold uppercase tracking-wider text-[10px] gap-2.5",
                        variant === 'outline' && "border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50",
                        className
                    )}
                >
                    <Download className="h-3.5 w-3.5" />
                    {showLabel && "Export"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 p-2">Export Formats</DropdownMenuLabel>
                <DropdownMenuItem 
                    onClick={handleExcelExport}
                    className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    Excel Document (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={handlePDFExport}
                    className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                >
                    <FileText className="h-4 w-4 text-rose-500" />
                    PDF Document (.pdf)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
