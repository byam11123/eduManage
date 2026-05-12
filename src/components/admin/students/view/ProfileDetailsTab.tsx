'use client'

import { Pencil, User, MapPin, GraduationCap, Users, Info, ShieldCheck, HeartPulse, Building2, MapPinned, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Student } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProfileDetailsTabProps {
    student: Student
    onEdit: () => void
}

export function ProfileDetailsTab({ student, onEdit }: ProfileDetailsTabProps) {

    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    const RenderField = ({ label, value, icon: Icon, isMono = false, colSpan = 1 }: { label: string, value: string | number | undefined | null, icon?: any, isMono?: boolean, colSpan?: number }) => (
        <div className={cn("space-y-1", colSpan > 1 && `sm:col-span-${colSpan}`)}>
            <span className={labelClasses}>{label}</span>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                <p className={cn(valueClasses, isMono && "font-mono tracking-tight")}>
                    {value || '—'}
                </p>
            </div>
        </div>
    )

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* 1. Profile Matrix: Basic & Family */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Basic Details */}
                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <CardContent className="p-10">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Basic Info
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-10">
                            <RenderField label="First Name" value={student.firstName} icon={User} />
                            <RenderField label="Last Name" value={student.lastName} />
                            <RenderField label="Student ID" value={student.studentDisplayId} icon={ShieldCheck} isMono />
                            <RenderField label="Admission ID" value={student.admissionDisplayId} isMono />
                            <RenderField label="Email Address" value={student.email} />
                            <RenderField label="Phone Number" value={student.phone} isMono />
                            <RenderField label="Date of Birth" value={formatDate(student.dateOfBirth)} />
                            <RenderField label="Gender" value={student.gender?.toUpperCase()} />
                            <RenderField label="Aadhaar No." value={student.aadhaarNumber} isMono />
                            <RenderField label="Alternate Phone" value={student.alternatePhone} isMono />
                        </div>
                    </CardContent>
                </Card>

                {/* Family Details */}
                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <CardContent className="p-10">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Family Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-10">
                            <RenderField label="Father's Name" value={student.fathersName} icon={Users} />
                            <RenderField label="Father's Phone" value={student.fathersPhone} isMono />
                            <RenderField label="Mother's Name" value={student.mothersName} />
                            <RenderField label="Marital Status" value={student.maritalStatus?.toUpperCase()} icon={HeartPulse} />
                            <RenderField label="Category" value={student.category?.toUpperCase()} />
                            <RenderField 
                                label="Referred By" 
                                value={
                                    student.referral?.referrer 
                                        ? `${student.referral.referrer.name} (${student.referral.referrer.type.toUpperCase()})`
                                        : student.referredBy
                                } 
                                icon={BadgeCheck}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Educational Portfolio */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <h4 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Education
                    </h4>

                    <div className="space-y-6">
                        {/* High School */}
                        <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                            <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                10TH (High School)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                <RenderField label="School Name" value={student.hsSchoolName} icon={Building2} />
                                <RenderField label="Board" value={student.hsBoard} />
                                <RenderField label="Year" value={student.hsPassingYear} />
                                <RenderField label="Percentage" value={student.hsPercentage ? `${student.hsPercentage}%` : null} />
                            </div>
                        </div>

                        {/* Higher Secondary */}
                        <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                            <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                12TH (Higher Secondary)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                <RenderField label="School Name" value={student.hssSchoolName} icon={Building2} />
                                <RenderField label="Board" value={student.hssBoard} />
                                <RenderField label="Stream" value={student.hssStream} />
                                <RenderField label="Year" value={student.hssPassingYear} />
                                <RenderField label="Percentage" value={student.hssPercentage ? `${student.hssPercentage}%` : null} />
                            </div>
                        </div>

                        {/* Graduation */}
                        {(student.gradCollegeName || student.gradDegree) && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    Graduation
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                    <RenderField label="Degree" value={student.gradDegree} icon={GraduationCap} />
                                    <RenderField label="University" value={student.gradUniversity} icon={Building2} />
                                    <RenderField label="College" value={student.gradCollegeName} />
                                    <RenderField label="Year" value={student.gradPassingYear} />
                                    <RenderField label="Score / CGPA" value={student.gradPercentage ? `${student.gradPercentage}` : null} />
                                </div>
                            </div>
                        )}

                        {/* Post Graduation */}
                        {(student.pgCollegeName || student.pgDegree) && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    Post Graduation
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                    <RenderField label="Degree" value={student.pgDegree} icon={GraduationCap} />
                                    <RenderField label="University" value={student.pgUniversity} icon={Building2} />
                                    <RenderField label="College" value={student.pgCollegeName} />
                                    <RenderField label="Year" value={student.pgPassingYear} />
                                    <RenderField label="Score / CGPA" value={student.pgPercentage ? `${student.pgPercentage}` : null} />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 3. Address Matrix */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <h4 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10">
                        <RenderField label="Address Line 1" value={student.addressLine1} icon={MapPinned} colSpan={2} />
                        <RenderField label="Address Line 2" value={student.addressLine2} colSpan={2} />
                        <RenderField label="City" value={student.city} />
                        <RenderField label="District" value={student.district} />
                        <RenderField label="State" value={student.state} />
                        <RenderField label="Zip Code" value={student.zipCode} isMono />
                    </div>
                </CardContent>
            </Card>

            {/* 4. System Footprint */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10 opacity-60">
                        <RenderField label="Created" value={formatDate(student.createdAt)} icon={Info} />
                        <RenderField label="Updated" value={formatDate(student.updatedAt)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
