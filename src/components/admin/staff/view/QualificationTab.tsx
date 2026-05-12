'use client'

import { GraduationCap, BookOpen, Briefcase, Award, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Staff } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface QualificationTabProps {
    staff: Staff
}

export function QualificationTab({ staff }: QualificationTabProps) {
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"
    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Academic Qualifications Section */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <h3 className={sectionHeaderClasses}>
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        Education
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
                            <div className="space-y-1">
                                <span className={labelClasses}>Highest Qualification</span>
                                <p className={valueClasses}><span className="capitalize">{staff.highestQualification?.replace('_', ' ') || 'Not Specified'}</span></p>
                            </div>
                        </div>

                        {/* 10th Details */}
                        {staff.hsSchoolName && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    10TH (High School)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>School Name</span>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                            <p className={valueClasses}>{staff.hsSchoolName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Board</span>
                                        <p className={valueClasses}>{staff.hsBoard}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Year</span>
                                        <p className={valueClasses}>{staff.hsPassingYear}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Percentage</span>
                                        <p className={valueClasses}>{staff.hsPercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 12th Details */}
                        {staff.hssSchoolName && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    12TH (Higher Secondary)
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>School Name</span>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                            <p className={valueClasses}>{staff.hssSchoolName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Board</span>
                                        <p className={valueClasses}>{staff.hssBoard}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Stream</span>
                                        <p className={cn(valueClasses, "capitalize")}>{staff.hssStream}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Year</span>
                                        <p className={valueClasses}>{staff.hssPassingYear}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Percentage</span>
                                        <p className={valueClasses}>{staff.hssPercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Graduation Details */}
                        {staff.gradCollegeName && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    Graduation
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Degree</span>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                            <p className={valueClasses}>{staff.gradDegree}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <span className={labelClasses}>College / University</span>
                                        <p className={valueClasses}>{staff.gradCollegeName} {staff.gradUniversity ? `(${staff.gradUniversity})` : ''}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Year</span>
                                        <p className={valueClasses}>{staff.gradPassingYear}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Score</span>
                                        <p className={valueClasses}>{staff.gradPercentage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PG Details */}
                        {staff.pgCollegeName && (
                            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-xl">
                                <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">
                                    Post Graduation
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Degree</span>
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                            <p className={valueClasses}>{staff.pgDegree}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <span className={labelClasses}>College / University</span>
                                        <p className={valueClasses}>{staff.pgCollegeName} {staff.pgUniversity ? `(${staff.pgUniversity})` : ''}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Year</span>
                                        <p className={valueClasses}>{staff.pgPassingYear}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Score</span>
                                        <p className={valueClasses}>{staff.pgPercentage}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Professional Details Section */}
            <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                <CardContent className="p-10">
                    <h3 className={sectionHeaderClasses}>
                        <span className="h-2 w-2 rounded-full bg-violet-600" />
                        Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <span className={labelClasses}>Total Experience</span>
                            <p className={valueClasses}>{staff.experienceYears || '0'} Years</p>
                        </div>
                        <div className="space-y-1">
                            <span className={labelClasses}>Joining Date</span>
                            <p className={valueClasses}>{staff.dateOfJoining ? formatDate(staff.dateOfJoining) : 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className={labelClasses}>Department</span>
                            <p className={valueClasses}>{staff.department || 'General'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className={labelClasses}>Designation</span>
                            <p className={valueClasses}>{staff.designation || 'Staff'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className={labelClasses}>Referred By</span>
                            <p className={valueClasses}>{staff.referredBy || 'Direct'}</p>
                        </div>
                        <div className="col-span-full space-y-1">
                            <span className={labelClasses}>Skills</span>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                                {staff.skills || 'No specific skills listed.'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
