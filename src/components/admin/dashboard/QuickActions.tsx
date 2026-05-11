'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
    UserPlus, 
    Target, 
    CreditCard, 
    Calendar, 
    FileText, 
    MessageSquare,
    ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function QuickActions() {
    const router = useRouter()

    const actions = [
        {
            title: 'New Student',
            description: 'Register Student',
            icon: UserPlus,
            href: '/admin/students/add',
            color: 'indigo'
        },
        {
            title: 'New Lead',
            description: 'Add Enquiry',
            icon: Target,
            href: '/admin/enquiry',
            color: 'emerald'
        },
        {
            title: 'Collect Fee',
            description: 'Payments',
            icon: CreditCard,
            href: '/admin/payments',
            color: 'purple'
        },
        {
            title: 'Attendance',
            description: 'Mark Attendance',
            icon: Calendar,
            href: '/admin/attendance',
            color: 'amber'
        }
    ]

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8">
                <h4 className={sectionHeaderClasses}>
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    Quick Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {actions.map((action) => (
                        <Button
                            key={action.title}
                            variant="ghost"
                            onClick={() => router.push(action.href)}
                            className="group h-auto p-6 rounded-[2rem] border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex flex-col items-start gap-4 transition-all hover:scale-[1.02]"
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                                action.color === 'indigo' && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30",
                                action.color === 'emerald' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
                                action.color === 'purple' && "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
                                action.color === 'amber' && "bg-amber-50 text-amber-600 dark:bg-amber-950/30"
                            )}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <div className="text-left w-full flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        {action.title}
                                    </p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        {action.description}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
