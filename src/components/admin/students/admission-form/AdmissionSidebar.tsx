'use client'

import {
    User,
    GraduationCap,
    BookOpen,
    CreditCard,
    FileCheck,
    ChevronRight,
    Banknote,
    LucideIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const ADMISSION_STEPS = [
    { id: 1, title: 'Student Details', description: 'Enter Student Information', icon: User },
    { id: 2, title: 'Qualification Details', description: 'Enter Education Information', icon: GraduationCap },
    { id: 3, title: 'Course & Batch Details', description: 'Select Course and Batch', icon: BookOpen },
    { id: 4, title: 'Payment Details', description: 'Enter Payment Information', icon: CreditCard },
    { id: 5, title: 'Installment Details', description: 'Enter Installment Information', icon: Banknote },
    { id: 6, title: 'Review Details', description: 'Check your Filled Details', icon: FileCheck },
]

interface AdmissionSidebarProps {
    currentStep: number
    onStepSelect: (stepId: number) => void
}

export function AdmissionSidebar({ currentStep, onStepSelect }: AdmissionSidebarProps) {
    return (
        <Card className="w-full md:w-64 h-full border-r border-gray-100 dark:border-gray-800 shadow-sm overflow-y-auto hidden md:block">
            <CardContent className="p-6 space-y-8">
                {ADMISSION_STEPS.map((step) => {
                    const isActive = currentStep === step.id
                    const isCompleted = currentStep > step.id
                    const Icon = step.icon as LucideIcon

                    return (
                        <div
                            key={step.id}
                            className="relative flex items-center gap-4 group cursor-pointer"
                            onClick={() => isCompleted && onStepSelect(step.id)}
                        >
                            {/* Connector Line */}
                            {step.id !== ADMISSION_STEPS.length && (
                                <div className={cn(
                                    "absolute left-4 top-10 bottom-[-2rem] w-0.5",
                                    isCompleted ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                                )} />
                            )}

                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                isActive ? "border-indigo-600 text-indigo-600 bg-indigo-50" :
                                    isCompleted ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-300 text-gray-400"
                            )}>
                                {isCompleted ? (
                                    <ChevronRight className="w-4 h-4 text-white" />
                                ) : (
                                    <Icon className="w-4 h-4" />
                                )}
                            </div>

                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-sm font-semibold transition-colors",
                                    isActive ? "text-indigo-600" : "text-gray-500"
                                )}>
                                    {step.title}
                                </span>
                                <span className="text-xs text-gray-400 hidden lg:block">
                                    {step.description}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
