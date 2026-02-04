// ============================================
// DASHBOARD HEADER COMPONENT
// Header section for dashboard with title and actions
// ============================================

'use client'

import { Button } from '@/components/ui/button'
import { RotateCw, Download, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface DashboardHeaderProps {
    onRefresh?: () => void
    loading?: boolean
}

export function DashboardHeader({ onRefresh, loading }: DashboardHeaderProps) {
    const today = new Date()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(today, 'EEEE, MMMM d, yyyy')}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RotateCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
                <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                </Button>
            </div>
        </div>
    )
}
