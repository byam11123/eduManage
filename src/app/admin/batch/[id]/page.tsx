'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ArrowLeft,
    RotateCw,
    Search,
    Pencil,
    MoreVertical,
    HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'

interface Student {
    id: string
    firstName: string
    lastName: string
    enrollmentNo: string
    phone: string
    email: string
    status: string
    paymentStatus: string
}

interface Batch {
    id: string
    name: string
    startDate: string
    endDate: string
    status: string
    course: { name: string }
}

interface Stats {
    activeStudents: number
    inactiveStudents: number
    forecastPayment: number
    receivedPayment: number
    overdueAmount: number
}

export default function BatchDetailsPage() {
    const params = useParams()
    const [batch, setBatch] = useState<Batch | null>(null)
    const [students, setStudents] = useState<Student[]>([])
    const [stats, setStats] = useState<Stats>({
        activeStudents: 0,
        inactiveStudents: 0,
        forecastPayment: 0,
        receivedPayment: 0,
        overdueAmount: 0
    })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (params.id) {
            fetchBatchDetails()
        }
    }, [params.id])

    const fetchBatchDetails = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/batches/${params.id}`)
            const data = await res.json()
            if (data.success) {
                setBatch(data.batch)
                setStudents(data.batch.students)
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching batch details:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        student.enrollmentNo.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return <div className="p-6 flex items-center justify-center">Loading batch details...</div>
    }

    if (!batch) {
        return <div className="p-6">Batch not found</div>
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
            {/* Breadcrumb / Header */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/admin/batch" className="hover:text-indigo-600">Batch</Link>
                <span>›</span>
                <Link href="/admin/batch" className="hover:text-indigo-600">Batch list</Link>
                <span>›</span>
                <span className="text-indigo-600 font-medium">Single batch</span>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">

                {/* Left Sidebar - Batch Info */}
                <Card className="w-full xl:w-1/4 h-fit p-6 flex flex-col items-center bg-white border-gray-200 shadow-sm relative">
                    <div className="absolute top-4 left-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/batch"><RotateCw className="h-4 w-4 text-gray-400" /></Link>
                        </Button>
                    </div>

                    <div className="h-24 w-24 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold mb-4 mt-6">
                        {batch.name.substring(0, 2).toUpperCase()}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-8">{batch.name}</h2>

                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Batch Details</h3>
                            <Pencil className="h-4 w-4 text-indigo-600 cursor-pointer" />
                        </div>

                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-gray-500 font-medium mr-2">Name:</span>
                                <span className="text-gray-700">{batch.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 font-medium mr-2">Interval:</span>
                                <span className="text-gray-700">
                                    {format(new Date(batch.startDate), 'dd/MM/yyyy')} To {format(new Date(batch.endDate), 'dd/MM/yyyy')}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 font-medium mr-2">Mode:</span>
                                <span className="text-gray-700">Offline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">Status:</span>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase text-xs">
                                    {batch.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Content */}
                <div className="flex-1 space-y-6">
                    {/* Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start h-auto p-0 rounded-none">
                            <TabsTrigger
                                value="details"
                                className="border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wide"
                            >
                                BATCH DETAILS
                            </TabsTrigger>
                            <TabsTrigger
                                value="attendance"
                                className="border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-6 py-3 font-semibold text-gray-500 uppercase text-xs tracking-wide"
                            >
                                STUDENT ATTENDANCE
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6 pt-6">

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-white shadow-sm border-gray-200">
                                    <span className="text-gray-500 text-sm font-medium">Active students</span>
                                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded text-sm font-bold">{stats.activeStudents}</span>
                                </Card>
                                <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-white shadow-sm border-gray-200">
                                    <span className="text-gray-500 text-sm font-medium">Inactive students</span>
                                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-sm font-bold">{stats.inactiveStudents}</span>
                                </Card>
                                <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-white shadow-sm border-gray-200">
                                    <span className="text-gray-500 text-sm font-medium">Forecast payment</span>
                                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded text-sm font-bold">₹ {stats.forecastPayment}</span>
                                </Card>
                                <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-white shadow-sm border-gray-200">
                                    <span className="text-gray-500 text-sm font-medium">Received payment</span>
                                    <span className="bg-cyan-100 text-cyan-600 px-3 py-1 rounded text-sm font-bold">₹ {stats.receivedPayment}</span>
                                </Card>
                            </div>

                            {/* Overdue Card */}
                            <div className="flex justify-center">
                                <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-white shadow-sm border-gray-200 min-w-[200px]">
                                    <span className="text-gray-500 text-sm font-medium">Overdue amount</span>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-bold">₹ {stats.overdueAmount}</span>
                                </Card>
                            </div>

                            {/* Student List */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-indigo-600 border-indigo-100 bg-indigo-50">
                                        <RotateCw className="h-3 w-3" />
                                    </Button>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search..."
                                            className="pl-9 h-8 text-sm"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 uppercase text-xs font-bold text-gray-500">
                                            <TableHead className="w-[150px]">STUDENT ENROLLMENT</TableHead>
                                            <TableHead>STUDENT NAME</TableHead>
                                            <TableHead>MOBILE NUMBER</TableHead>
                                            <TableHead>EMAIL ID</TableHead>
                                            <TableHead>STUDENT STATUS</TableHead>
                                            <TableHead>PAYMENT STATUS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No students found in this batch.</TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredStudents.map(student => (
                                                <TableRow key={student.id} className="text-sm">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6 text-[10px] bg-cyan-100 text-cyan-700">
                                                                <AvatarFallback>{student.firstName[0].toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            {student.enrollmentNo || 'S-1'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                                                    <TableCell>{student.phone}</TableCell>
                                                    <TableCell className="text-gray-500">{student.email}</TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-cyan-100 text-cyan-600 hover:bg-cyan-100 text-[10px] rounded-sm px-2">
                                                            ACTIVE
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-100 text-green-600 hover:bg-green-100 text-[10px] rounded-sm px-2">
                                                            PAID
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                        </TabsContent>

                        <TabsContent value="attendance">
                            <div className="flex items-center justify-center p-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                                Attendance functionality coming soon.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Help Button - Floating */}
            <div className="fixed bottom-6 right-6">
                <Button className="rounded-full h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                    <HelpCircle className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
