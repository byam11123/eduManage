'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Upload,
    Download,
    Megaphone,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    RefreshCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Student {
    id: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    enrollmentNo: string | null
    paymentStatus: string
    status: string
    createdAt: string
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Mock stats for now as backend doesn't support full payment analytics yet
    const stats = [
        { label: 'Total Students', value: students.length.toString(), color: 'text-blue-600' },
        { label: 'Received Payment', value: '₹ 0', color: 'text-green-600' },
        { label: 'Cash Received', value: '₹ 0', color: 'text-cyan-600' },
        { label: 'Online Received', value: '₹ 0', color: 'text-blue-500' },
        { label: 'Unknown Mode Payment', value: '₹ 0', color: 'text-orange-500' },
        { label: 'Overdue Payment', value: '₹ 0', color: 'text-red-500' },
        { label: 'Upcoming Payment', value: '₹ 0', color: 'text-cyan-500' },
        { label: 'Refunded Students', value: '0', color: 'text-gray-500' },
        { label: 'Refunded Amount', value: '₹ 0', color: 'text-red-400' },
        { label: 'Defaulter Students', value: '0', color: 'text-red-600' },
    ]

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/students')
            const data = await res.json()
            if (data.success) {
                setStudents(data.students)
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(search.toLowerCase())) ||
        (student.enrollmentNo && student.enrollmentNo.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-indigo-600 font-medium">Students</span>
                <span>›</span>
                <span>Student list</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
                {stats.map((stat, index) => (
                    <Card key={index} className="shadow-sm border-gray-100 dark:border-gray-800">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                                {stat.label}
                            </p>
                            <p className={`text-xl font-bold ${stat.color}`}>
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="h-9 gap-2 text-indigo-600 border-indigo-100 hover:bg-indigo-50" onClick={fetchStudents}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Upload className="h-4 w-4" />
                        UPLOAD DATA
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Filter className="h-4 w-4" />
                        FILTER
                    </Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="h-9 gap-2 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white border-transparent">
                        <Download className="h-4 w-4" />
                        EXPORT
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-indigo-400 text-white hover:bg-indigo-500 hover:text-white border-transparent">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white border-transparent">
                        <Megaphone className="h-4 w-4" />
                        ANNOUNCEMENT
                    </Button>
                </div>
            </div>

            {/* Search and Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-end">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/50">
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">Student Name</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">Enrollment No</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">Mobile Number</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">E-Mail</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">Student Status</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase">Payment Status</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase text-center">Enroll</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase text-center">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                        Loading students...
                                    </TableCell>
                                </TableRow>
                            ) : filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="group">
                                        <TableCell className="font-medium">
                                            {student.firstName} {student.lastName}
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {student.enrollmentNo || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {student.phone || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {student.email || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize
                                                ${student.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                    student.paymentStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {student.paymentStatus || 'Pending'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={async () => {
                                                    if (confirm('Are you sure?')) {
                                                        // Implement delete logic here
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination (Visual only for now) */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select className="bg-transparent border rounded p-1">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <span>
                        {filteredStudents.length > 0 ? `1-${Math.min(10, filteredStudents.length)}` : '0-0'} of {filteredStudents.length}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" disabled className="h-8 w-8">
                            <span className="sr-only">Previous</span>
                            {'<'}
                        </Button>
                        <Button variant="ghost" size="icon" disabled className="h-8 w-8">
                            <span className="sr-only">Next</span>
                            {'>'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
