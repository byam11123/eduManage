'use client'

import {
    Pencil,
    Trash2,
    RefreshCw,
    Megaphone,
    Smartphone,
    Mail,
    MapPin,
    Calendar,
    Hash,
    IdCard,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getUserInitials, formatDate } from '@/lib/utils'
import type { Student } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ProfileSidebarProps {
    student: Student
    onEdit: (student: Student) => void
    onDelete: (student: Student) => void
    onPrev?: () => void
    onNext?: () => void
    hasPrev?: boolean
    hasNext?: boolean
    currentIndex?: number
    totalCount?: number
}

export function ProfileSidebar({ student, onEdit, onDelete, onPrev, onNext, hasPrev, hasNext, currentIndex, totalCount }: ProfileSidebarProps) {
    const router = useRouter()
    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"

    return (
        <Card className="h-full border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden flex flex-col">
            <CardContent className="p-8 flex flex-col items-center flex-1">
                {/* Header Actions */}
                <div className="w-full flex justify-between items-center mb-10">
                    {/* Prev / Next Student Navigator */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!hasPrev}
                            onClick={onPrev}
                            className="h-9 w-9 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                            aria-label="Previous student"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {totalCount != null && currentIndex != null && totalCount > 0 && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 min-w-[40px] text-center">
                                {currentIndex + 1}<span className="text-gray-300"> / </span>{totalCount}
                            </span>
                        )}

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!hasNext}
                            onClick={onNext}
                            className="h-9 w-9 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
                            aria-label="Next student"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-2xl gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02]">
                        ANNOUNCEMENT
                        <Megaphone className="h-3 w-3" />
                    </Button>
                </div>

                {/* Profile Identity */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-10 rounded-full scale-150" />
                    <Avatar className="h-32 w-32 border-8 border-gray-50 dark:border-gray-800 shadow-2xl relative">
                        <AvatarImage src={student.imageUrl} className="object-cover" />
                        <AvatarFallback className="text-4xl font-black bg-indigo-600 text-white">
                            {getUserInitials(`${student.firstName} ${student.lastName}`)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 right-0">
                        <Badge
                            className={cn(
                                "rounded-xl px-4 py-1.5 text-[10px] uppercase font-black tracking-widest border-4 border-white dark:border-gray-900 shadow-xl",
                                student.status === 'active' ? 'bg-emerald-500 text-white' : 
                                student.status === 'inactive' ? 'bg-gray-500 text-white' : 
                                student.status === 'dropped' ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'
                            )}
                        >
                            {student.status}
                        </Badge>
                    </div>
                </div>

                {/* Name & ID */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {student.firstName} {student.lastName}
                    </h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mt-1">
                        SID: {student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || 'PENDING'}
                    </p>
                </div>

                {/* Institutional Matrix */}
                <div className="w-full space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Student Information</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                onClick={() => onEdit(student)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                                onClick={() => onDelete(student)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Smartphone className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <span className={labelClasses}>Phone Number</span>
                                    <p className={valueClasses}>{student.phone || 'NOT_AVAILABLE'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <span className={labelClasses}>Email Address</span>
                                    <p className={cn(valueClasses, "truncate max-w-[200px]")} title={student.email}>
                                        {student.email || 'NO_RECORD'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Calendar className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <span className={labelClasses}>Enrollment Date</span>
                                    <p className={valueClasses}>
                                        {student.enrollmentDate ? formatDate(student.enrollmentDate) : 'NOT_INITIATED'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <span className={labelClasses}>Current Address</span>
                                    <p className={cn(valueClasses, "line-clamp-2 leading-relaxed")}>
                                        {student.address || [student.addressLine1, student.addressLine2, student.city, student.state, student.zipCode].filter(Boolean).join(', ') || 'UNMAPPED'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-10 w-full">
                    <Button 
                        onClick={() => router.push(`/admin/id-cards?studentId=${student.id}`)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] h-14 rounded-2xl shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <IdCard className="w-4 h-4 mr-2" />
                        GENERATE ID CARD
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
