'use client'

import { Button } from '@/components/ui/button'
import { Plus, Download, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Action {
    label: string
    href?: string
    onClick?: () => void
    icon?: any
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
    loading?: boolean
    className?: string
}

interface PageHeaderProps {
    title: string
    description?: string
    backHref?: string
    actions?: Action[]
    className?: string
    children?: React.ReactNode
}

export function PageHeader({
    title,
    description,
    backHref,
    actions,
    className,
    children
}: PageHeaderProps) {
    const router = useRouter()

    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8", className)}>
            <div className="space-y-1">
                {backHref && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto text-muted-foreground hover:text-indigo-600 mb-2 transition-colors -ml-1"
                        onClick={() => router.push(backHref)}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to List
                    </Button>
                )}
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="text-muted-foreground text-sm font-medium">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {children}
                {actions && actions.length > 0 && (
                    <>
                    {actions.map((action, i) => {
                        const Icon = action.icon || (action.label.toLowerCase().includes('add') ? Plus : null)
                        
                        const buttonContent = (
                            <>
                                {Icon && <Icon className="w-4 h-4 mr-2" />}
                                {action.label}
                            </>
                        )

                        if (action.href) {
                            return (
                                <Link key={i} href={action.href}>
                                    <Button 
                                        variant={action.variant || 'default'}
                                        className={cn(
                                            "h-11 px-5 rounded-xl transition-all font-bold uppercase tracking-wider text-xs",
                                            action.variant === 'default' && "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none",
                                            action.className
                                        )}
                                    >
                                        {buttonContent}
                                    </Button>
                                </Link>
                            )
                        }

                        return (
                            <Button
                                key={i}
                                variant={action.variant || 'outline'}
                                onClick={action.onClick}
                                disabled={action.loading}
                                className={cn(
                                    "h-11 px-5 rounded-xl transition-all font-bold uppercase tracking-wider text-xs",
                                    (!action.variant || action.variant === 'outline') && !action.className ? "border-gray-200 dark:border-gray-800" : "",
                                    action.className
                                )}
                            >
                                {buttonContent}
                            </Button>
                        )
                    })}
                    </>
                )}
            </div>
        </div>
    )
}
