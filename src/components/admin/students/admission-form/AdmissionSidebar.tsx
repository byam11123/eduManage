'use client'

import {
    User,
    GraduationCap,
    BookOpen,
    CreditCard,
    FileCheck,
    Check,
    Banknote,
    LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const ADMISSION_STEPS = [
    { id: 1, title: 'Personal Details', description: 'Contact and basic info', icon: User },
    { id: 2, title: 'Academic History', description: 'Previous education background', icon: GraduationCap },
    { id: 3, title: 'Course Selection', description: 'Select course and batch', icon: BookOpen },
    { id: 4, title: 'Fee Details', description: 'Configure course fees', icon: CreditCard },
    { id: 5, title: 'Payment Plan', description: 'Setup installments', icon: Banknote },
    { id: 6, title: 'Review & Submit', description: 'Finalize registration', icon: FileCheck },
]

interface AdmissionSidebarProps {
    currentStep: number
    onStepSelect: (stepId: number) => void
}

export function AdmissionSidebar({ currentStep, onStepSelect }: AdmissionSidebarProps) {
    return (
        <div className="w-full md:w-80 h-full overflow-y-auto hidden md:block bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
            <div className="space-y-10">
                <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Admission</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mt-1">New Registration</p>
                </div>

                <div className="space-y-6 relative">
                    {/* Progress Vertical Line */}
                    <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gray-100 dark:bg-gray-800" />
                    
                    {ADMISSION_STEPS.map((step) => {
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        const Icon = step.icon as LucideIcon

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "relative flex items-center gap-5 group transition-all duration-300",
                                    isCompleted ? "cursor-pointer" : "cursor-default"
                                )}
                                onClick={() => isCompleted && onStepSelect(step.id)}
                            >
                                {/* Step Indicator */}
                                <div className={cn(
                                    "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10",
                                    isActive 
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none scale-110 rotate-[5deg]" 
                                        : isCompleted 
                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none" 
                                            : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className={cn("w-5 h-5", isActive ? "animate-pulse" : "")} />
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                                        isActive ? "text-indigo-600" : isCompleted ? "text-emerald-500" : "text-gray-400"
                                    )}>
                                        Step 0{step.id}
                                    </span>
                                    <span className={cn(
                                        "text-sm font-black tracking-tight transition-colors",
                                        isActive ? "text-gray-900 dark:text-white" : "text-gray-500"
                                    )}>
                                        {step.title}
                                    </span>
                                    {isActive && (
                                        <span className="text-[9px] font-bold text-gray-400 mt-0.5 leading-none">
                                            {step.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="pt-8 mt-10 border-t border-gray-100 dark:border-gray-800">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl">
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600 mb-1">Status Overview</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500">Completion</span>
                            <span className="text-[10px] font-black text-indigo-600">{Math.round(((currentStep - 1) / ADMISSION_STEPS.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-indigo-600 transition-all duration-700" 
                                style={{ width: `${((currentStep - 1) / ADMISSION_STEPS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
