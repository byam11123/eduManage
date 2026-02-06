'use client'

import {
    Pencil,
    Trash2,
    Users,
    RotateCw,
    Megaphone,
    CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getUserInitials, formatDate } from '@/lib/utils'
import type { Student } from '@/lib/types'

interface ProfileSidebarProps {
    student: Student
    onEdit: (student: Student) => void
    onDelete: (student: Student) => void
}

export function ProfileSidebar({ student, onEdit, onDelete }: ProfileSidebarProps) {
    return (
        <Card className="h-full border-none shadow-sm flex flex-col">
            <CardContent className="p-6 flex flex-col items-center flex-1">
                {/* Header Actions */}
                <div className="w-full flex justify-between items-center mb-6">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200">
                        <RotateCw className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                        ANNOUNCEMENT
                        <Megaphone className="h-3 w-3" />
                    </Button>
                </div>

                {/* Profile Image */}
                <div className="mb-4">
                    <Avatar className="h-24 w-24 border-4 border-indigo-50">
                        <AvatarImage src={student.imageUrl} />
                        <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-600">
                            {getUserInitials(`${student.firstName} ${student.lastName}`)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">
                    {student.firstName} {student.lastName}
                </h2>

                {/* Details Section */}
                <div className="w-full space-y-6">
                    <div className="flex items-center justify-between border-b pb-2 border-dashed border-gray-200">
                        <h3 className="text-base font-semibold text-gray-700">Student Details</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-indigo-600"
                                onClick={() => onEdit(student)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-600"
                                onClick={() => onDelete(student)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-[110px_10px_1fr] gap-x-2 gap-y-4 text-sm items-start">
                        {/* Name */}
                        <span className="text-gray-500 font-medium">Name</span>
                        <span className="text-gray-900 ">:</span>
                        <span className="text-gray-900 font-medium">
                            {student.firstName} {student.lastName}
                        </span>

                        {/* Student ID */}
                        <span className="text-gray-500 font-medium">Student ID</span>
                        <span className="text-gray-600 ">:</span>
                        <span className="text-gray-900 font-medium">
                            {student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '-'}
                        </span>

                        {/* Email */}
                        <span className="text-gray-500 font-medium">Email</span>
                        <span className="text-gray-600 ">:</span>
                        <span className="text-gray-900 truncate max-w-[170px] font-medium" title={student.email}>
                            {student.email || '-'}
                        </span>

                        {/* Contact */}
                        <span className="text-gray-500 font-medium">Contact</span>
                        <span className="text-gray-600 ">:</span>
                        <span className="text-gray-900 font-medium">
                            {student.phone || '-'}
                        </span>

                        {/* Date of birth */}
                        <span className="text-gray-500 font-medium">Date of birth</span>
                        <span className="text-gray-600 ">:</span>
                        <span className="text-gray-900 font-medium">
                            {student.dateOfBirth ? formatDate(student.dateOfBirth) : '-'}
                        </span>

                        {/* Date of admission */}
                        <span className="text-gray-500 font-medium">Date of admission</span>
                        <span className="text-gray-600   ">:</span>
                        <span className="text-gray-900 font-medium">
                            {student.enrollmentDate ? formatDate(student.enrollmentDate) : '-'}
                        </span>

                        {/* Address */}
                        <span className="text-gray-500 font-medium">Address</span>
                        <span className="text-gray-600">:</span>
                        <span className="text-gray-900 line-clamp-3 font-medium " title={student.address || [student.addressLine1, student.addressLine2, student.city, student.state, student.zipCode].filter(Boolean).join(', ')}>
                            {student.address || [student.addressLine1, student.addressLine2, student.city, student.state, student.zipCode].filter(Boolean).join(', ') || '-'}
                        </span>

                        {/* Status */}
                        <span className="text-gray-500 font-medium self-center">Status</span>
                        <span className="text-gray-600 self-center">:</span>
                        <div className="self-center">
                            <Badge
                                className={`
                                        ${student.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                        ${student.status === 'inactive' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' : ''}
                                        ${student.status === 'dropped' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                        ${student.status === 'graduated' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' : ''}
                                        rounded-sm px-2 py-0 text-[10px] uppercase font-bold tracking-wider
                                    `}
                            >
                                {student.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8 w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-semibold h-10 shadow-md shadow-indigo-200">
                        GENERATE ID CARD
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
