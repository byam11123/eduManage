'use client'

import { User, Phone, Mail, MapPin, Calendar, Heart, Users, ShieldCheck, GraduationCap, Briefcase, BookOpen, Banknote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, cn } from '@/lib/utils'
import type { Staff } from '@/lib/types'

interface StaffDetailsTabProps {
    staff: Staff
}

export function StaffDetailsTab({ staff }: StaffDetailsTabProps) {
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"
    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"
    const cardClasses = "bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-50 dark:shadow-none rounded-[3rem] overflow-hidden"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Personal Details Section */}
            <Card className={cardClasses}>
                <CardContent className="p-10">
                    <h3 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        Personal Information
                    </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                    <div className="space-y-1">
                        <span className={labelClasses}>Full Name</span>
                        <p className={valueClasses}>{staff.fullName}</p>
                    </div>
                    <div className="space-y-1">
                        <span className={labelClasses}>Employee Code</span>
                        <p className={valueClasses}>{staff.employeeCode}</p>
                    </div>
                    <div className="space-y-1">
                        <span className={labelClasses}>Gender</span>
                        <p className={valueClasses}><span className="capitalize">{staff.gender || 'Not Specified'}</span></p>
                    </div>
                    <div className="space-y-1">
                        <span className={labelClasses}>Date of Birth</span>
                        <p className={valueClasses}>{staff.dateOfBirth ? formatDate(staff.dateOfBirth) : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className={labelClasses}>Email Address</span>
                        <p className={valueClasses}>{staff.email}</p>
                    </div>
                    <div className="space-y-1">
                        <span className={labelClasses}>Phone Number</span>
                        <p className={valueClasses}>{staff.phone || 'N/A'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

            {/* Family & Address Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className={cardClasses}>
                    <CardContent className="p-10">
                        <h3 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Father's Details
                        </h3>
                    <div className="space-y-8">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <Users className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <span className={labelClasses}>Father's Name</span>
                                <p className={valueClasses}>{staff.fathersName || 'NO_RECORD'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <span className={labelClasses}>Father's Phone</span>
                                <p className={valueClasses}>{staff.fathersPhone || 'NO_RECORD'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

                <Card className={cardClasses}>
                    <CardContent className="p-10">
                        <h3 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Address Details
                        </h3>
                    <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <span className={labelClasses}>Current Address</span>
                            <p className={cn(valueClasses, "leading-relaxed")}>
                                {staff.address || 'No registered residential address found in the system mapping.'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>

            {/* Verification Status */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200 dark:shadow-none">
                <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black tracking-tight">Staff Verification Status</h4>
                        <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mt-1">Verify staff credentials and access status</p>
                    </div>
                </div>
                <div className="h-14 px-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black uppercase tracking-[0.2em] text-[10px]">
                    Access Level: {staff.designation?.toUpperCase() || 'GENERAL'}
                </div>
            </div>
        </div>
    )
}
