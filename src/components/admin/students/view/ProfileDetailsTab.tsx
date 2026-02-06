'use client'

import { Pencil, User, MapPin, GraduationCap, Users, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Student } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ProfileDetailsTabProps {
    student: Student
    onEdit: () => void
}

export function ProfileDetailsTab({ student, onEdit }: ProfileDetailsTabProps) {

    // Helper to render field w/ standardized alignment
    const RenderField = ({ label, value, isMono = false }: { label: string, value: string | undefined | null, isMono?: boolean }) => (
        <div className="grid grid-cols-[140px_10px_1fr] gap-x-2 items-start text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-400 select-none">:</span>
            <span className={`text-gray-900 font-medium ${isMono ? 'font-mono' : ''}`}>
                {value || '-'}
            </span>
        </div>
    )

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <div className="bg-indigo-50 p-1.5 rounded-md">
                <Icon className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Actions */}
            {/* <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Student Profile</h2>
                    <p className="text-xs text-gray-500">Manage student personal and academic information</p>
                </div>
                <Button onClick={onEdit} size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Profile
                </Button>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Basic & Contact Details */}
                <Card className="shadow-none border-gray-200 h-full">
                    <CardContent className="pt-6">
                        <SectionHeader icon={User} title="Basic & Contact Details" />
                        <div className="space-y-3">
                            <RenderField label="Full Name" value={`${student.firstName} ${student.lastName}`} />
                            <RenderField label="Student ID" value={student.studentDisplayId || student.admissionDisplayId} isMono />
                            <RenderField label="Gender" value={student.gender} />
                            <RenderField label="Date of Birth" value={formatDate(student.dateOfBirth)} />
                            <RenderField label="Mobile Number" value={student.phone} isMono />
                            <RenderField label="Alternate Number" value={student.alternatePhone} isMono />
                            <RenderField label="Email Address" value={student.email} />
                            <RenderField label="Aadhaar Number" value={student.aadhaarNumber} isMono />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Family Details */}
                <Card className="shadow-none border-gray-200 h-full">
                    <CardContent className="pt-6">
                        <SectionHeader icon={Users} title="Family Details" />
                        <div className="space-y-3">
                            <RenderField label="Father's Name" value={student.fathersName} />
                            <RenderField label="Father's Phone" value={student.fathersPhone} isMono />
                            <RenderField label="Mother's Name" value={student.mothersName} />
                            <RenderField label="Marital Status" value={student.maritalStatus} />
                            <RenderField label="Category" value={student.category} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Educational Qualifications */}
            <Card className="shadow-none border-gray-200">
                <CardContent className="pt-6">
                    <SectionHeader icon={GraduationCap} title="Educational Qualifications" />

                    <div className="grid grid-cols-1 gap-4">
                        {/* High School (10th) */}
                        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 relative group hover:border-indigo-100 transition-all">
                            <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 group-hover:text-indigo-500">
                                10th Standard
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">School Name</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate" title={student.hsSchoolName || ''}>{student.hsSchoolName || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Board</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.hsBoard || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Passing Year</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.hsPassingYear || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Percentage</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.hsPercentage ? `${student.hsPercentage}%` : '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Higher Secondary (12th) */}
                        <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 relative group hover:border-indigo-100 transition-all">
                            <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 group-hover:text-indigo-500">
                                12th Standard
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">School/College</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate" title={student.hssSchoolName || ''}>{student.hssSchoolName || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Board</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.hssBoard || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Stream</p>
                                    <p className="text-sm font-semibold text-gray-900">{student.hssStream || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Passing Year / %</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {student.hssPassingYear || '-'} {student.hssPercentage ? `(${student.hssPercentage}%)` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Graduation (if present) */}
                        {(student.gradCollegeName || student.gradDegree) && (
                            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 relative group hover:border-indigo-100 transition-all">
                                <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 group-hover:text-indigo-500">
                                    Graduation
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">College Name</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate" title={student.gradCollegeName || ''}>{student.gradCollegeName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">University</p>
                                        <p className="text-sm font-semibold text-gray-900">{student.gradUniversity || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Degree</p>
                                        <p className="text-sm font-semibold text-gray-900">{student.gradDegree || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Passing Year / %</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {student.gradPassingYear || '-'} {student.gradPercentage ? `(${student.gradPercentage}%)` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Post Graduation (if present) */}
                        {(student.pgCollegeName || student.pgDegree) && (
                            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100 relative group hover:border-indigo-100 transition-all">
                                <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 group-hover:text-indigo-500">
                                    Post Graduation
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">College Name</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate" title={student.pgCollegeName || ''}>{student.pgCollegeName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">University</p>
                                        <p className="text-sm font-semibold text-gray-900">{student.pgUniversity || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Degree</p>
                                        <p className="text-sm font-semibold text-gray-900">{student.pgDegree || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Passing Year / %</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {student.pgPassingYear || '-'} {student.pgPercentage ? `(${student.pgPercentage}%)` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fallback if no education details */}
                        {(!student.hsSchoolName && !student.hssSchoolName && !student.gradDegree && !student.pgDegree) && (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                                No educational qualifications added.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <Card className="shadow-none border-gray-200 h-full">
                    <CardContent className="pt-6">
                        <SectionHeader icon={MapPin} title="Address Details" />
                        <div className="space-y-3">
                            <RenderField label="Address Line 1" value={student.addressLine1} />
                            <RenderField label="Address Line 2" value={student.addressLine2} />
                            <RenderField label="City" value={student.city} />
                            <RenderField label="District" value={student.district} />
                            <RenderField label="State" value={student.state} />
                            <RenderField label="PIN Code" value={student.zipCode} isMono />
                            <RenderField label="Country" value={student.country} />
                        </div>
                    </CardContent>
                </Card>

                
                <Card className="shadow-none border-gray-200 h-full">
                    <CardContent className="pt-6">
                        <SectionHeader icon={Info} title="Meta Information" />
                        <div className="space-y-3">
                            <RenderField label="Date of Admission" value={formatDate(student.enrollmentDate)} />
                            <RenderField label="Last Updated" value={formatDate(student.updatedAt)} />
                            <div className="grid grid-cols-[140px_10px_1fr] gap-x-2 items-start text-sm">
                                <span className="text-gray-500 font-medium">Student Status</span>
                                <span className="text-gray-400 select-none">:</span>
                                <div>
                                    <span className={`
                                        px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide
                                        ${student.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                                        ${student.status === 'inactive' ? 'bg-gray-100 text-gray-700' : ''}
                                        ${student.status === 'dropped' ? 'bg-red-100 text-red-700' : ''}
                                        ${student.status === 'graduated' ? 'bg-indigo-100 text-indigo-700' : ''}
                                    `}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                            {(student.receivedBy) && (
                                <RenderField label="Admission By" value={student.receivedBy} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div> 
            */}
        </div>
    )
}
