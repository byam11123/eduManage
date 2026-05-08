'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
    status: string
    className?: string
}

const statusConfig: Record<string, { label: string, color: string }> = {
    // General
    active: { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
    inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    
    // Employee/Staff
    on_leave: { label: 'On Leave', color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
    
    // Students
    graduated: { label: 'Graduated', color: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    dropped: { label: 'Dropped', color: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800' },
    ongoing: { label: 'Ongoing', color: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800' },

    // Financials
    paid: { label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
    pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
    overdue: { label: 'Overdue', color: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800' },
    partial: { label: 'Partial', color: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },

    // Enquiry/Leads
    new: { label: 'New', color: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800' },
    contacted: { label: 'Contacted', color: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
    interested: { label: 'Interested', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
    lost: { label: 'Lost', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status.toLowerCase()] || { label: status, color: 'bg-gray-100 text-gray-600' }
    
    return (
        <Badge variant="outline" className={cn(
            "rounded-lg px-2 py-0.5 border font-black uppercase tracking-tighter text-[10px] flex items-center w-fit",
            config.color,
            className
        )}>
            <div className={cn(
                "h-1 w-1 rounded-full mr-1.5",
                status.toLowerCase() === 'active' || status.toLowerCase() === 'paid' ? "bg-emerald-500" :
                status.toLowerCase() === 'pending' || status.toLowerCase() === 'on_leave' ? "bg-amber-500" :
                status.toLowerCase() === 'overdue' || status.toLowerCase() === 'dropped' ? "bg-rose-500" :
                "bg-gray-400"
            )} />
            {config.label}
        </Badge>
    )
}
