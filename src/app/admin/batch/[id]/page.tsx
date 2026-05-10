'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    RotateCw,
    Search,
    Pencil,
    MoreVertical,
    HelpCircle,
    LayoutDashboard,
    ChevronRight,
    Calendar,
    Users,
    TrendingUp,
    CreditCard,
    AlertCircle,
    Download,
    Filter,
    Mail,
    Phone,
    MapPin,
    Clock,
    BookOpen,
    Layers,
    UserCheck,
    Briefcase,
    Trash2,
    Eye,
    UserMinus,
    Archive,
    FileSpreadsheet,
    FileText
} from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { EditBatchDialog } from '@/components/admin/batches/BatchDialogs'
import type { Batch, BatchFormData, Course, Student } from '@/lib/types'
import { toast } from 'sonner'

interface ExtendedBatch extends Batch {
    course: { id: string; name: string }
    students: Student[]
}

interface BatchStats {
    activeStudents: number
    inactiveStudents: number
    forecastPayment: number
    receivedPayment: number
    overdueAmount: number
}

export default function BatchDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [batch, setBatch] = useState<ExtendedBatch | null>(null)
    const [stats, setStats] = useState<BatchStats>({
        activeStudents: 0,
        inactiveStudents: 0,
        forecastPayment: 0,
        receivedPayment: 0,
        overdueAmount: 0
    })
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    
    // Dialog States
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isArchiveOpen, setIsArchiveOpen] = useState(false)
    const [isRemoveStudentOpen, setIsRemoveStudentOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [saving, setSaving] = useState(false)
    
    const [editFormData, setEditFormData] = useState<BatchFormData>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        courseId: '',
        status: 'active'
    })

    useEffect(() => {
        if (params.id) {
            fetchBatchDetails()
            fetchCourses()
        }
    }, [params.id])

    const fetchBatchDetails = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/batches/${params.id}`)
            const data = await res.json()
            if (data.success) {
                setBatch(data.batch)
                setStats(data.stats)
                setEditFormData({
                    name: data.batch.name,
                    description: data.batch.description || '',
                    startDate: data.batch.startDate ? new Date(data.batch.startDate).toISOString().split('T')[0] : '',
                    endDate: data.batch.endDate ? new Date(data.batch.endDate).toISOString().split('T')[0] : '',
                    startTime: data.batch.startTime || '',
                    endTime: data.batch.endTime || '',
                    courseId: data.batch.courseId,
                    status: data.batch.status
                })
            }
        } catch (error) {
            console.error('Error fetching batch details:', error)
            toast.error('Failed to load batch details')
        } finally {
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) {
                setCourses(data.courses)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
        }
    }

    const handleUpdateBatch = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSaving(true)
            const res = await fetch(`/api/batches/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Batch updated successfully')
                setIsEditOpen(false)
                fetchBatchDetails()
            } else {
                toast.error(data.error || 'Update failed')
            }
        } catch (error) {
            toast.error('Network error')
        } finally {
            setSaving(false)
        }
    }

    const handleArchiveBatch = async () => {
        try {
            setSaving(true)
            const res = await fetch(`/api/batches/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Batch archived successfully')
                setIsArchiveOpen(false)
                fetchBatchDetails()
            }
        } catch (error) {
            toast.error('Failed to archive batch')
        } finally {
            setSaving(false)
        }
    }

    const handleRemoveStudent = async () => {
        if (!selectedStudent) return
        try {
            setSaving(true)
            const res = await fetch(`/api/batches/${params.id}/students/${selectedStudent.id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Student removed from batch')
                setIsRemoveStudentOpen(false)
                fetchBatchDetails()
            }
        } catch (error) {
            toast.error('Failed to remove student')
        } finally {
            setSaving(false)
        }
    }

    const handleExport = (format: 'xlsx' | 'pdf') => {
        if (!batch) return
        
        const data = batch.students.map(s => ({
            enrollmentNo: s.enrollmentNo || 'N/A',
            name: `${s.firstName} ${s.lastName}`,
            email: s.email || 'N/A',
            phone: s.phone || 'N/A',
            status: s.status,
            payment: s.paymentStatus
        }))

        const fileName = `Batch_${batch.name}_Registry`
        const title = `Batch Registry: ${batch.name}`
        const columns = [
            { header: 'Enrollment', dataKey: 'enrollmentNo' },
            { header: 'Student Name', dataKey: 'name' },
            { header: 'Email', dataKey: 'email' },
            { header: 'Phone', dataKey: 'phone' },
            { header: 'Status', dataKey: 'status' },
            { header: 'Payment', dataKey: 'payment' },
        ]

        if (format === 'xlsx') {
            const success = exportToExcel(data, fileName)
            if (success) toast.success('Excel registry exported')
        } else {
            const success = exportToPDF(data, fileName, title, columns)
            if (success) toast.success('PDF registry exported')
        }
    }

    const filteredStudents = useMemo(() => {
        if (!batch) return []
        return batch.students.filter(student =>
            student.firstName.toLowerCase().includes(search.toLowerCase()) ||
            student.lastName.toLowerCase().includes(search.toLowerCase()) ||
            student.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
            student.phone?.includes(search)
        )
    }, [batch, search])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Synchronizing Batch Registry...</p>
            </div>
        )
    }

    if (!batch) {
        return (
            <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <AlertCircle className="h-12 w-12 text-rose-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Batch Not Found</p>
                <Button variant="outline" onClick={() => router.push('/admin/batch')} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Back to List</Button>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-10 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            
            {/* High-Fidelity Header */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <Layers className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-gray-400">ACADEMIC</span>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <Link href="/admin/batch" className="text-gray-400 hover:text-indigo-600 transition-colors">BATCHES</Link>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <span className="text-indigo-600">PROFILE_VIEW</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                                {batch.name}
                            </h1>
                            <Badge className="bg-indigo-600/10 text-indigo-600 border-indigo-600/20 hover:bg-indigo-600/20 rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                                {batch.status}
                            </Badge>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            {batch.course.name} • Operational Period: {batch.startDate ? format(new Date(batch.startDate), 'MMM yyyy') : 'N/A'} - {batch.endDate ? format(new Date(batch.endDate), 'MMM yyyy') : 'N/A'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={fetchBatchDetails}
                            className="h-12 px-6 rounded-2xl bg-white dark:bg-gray-900 border-none shadow-sm text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest gap-3 transition-all active:scale-95"
                        >
                            <RotateCw className="h-4 w-4" />
                            REFRESH
                        </Button>
                        <Button 
                            onClick={() => setIsEditOpen(true)}
                            className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Pencil className="h-4 w-4" />
                            EDIT BATCH
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">

                {/* Left Sidebar - Profile Summary */}
                <div className="w-full xl:w-[320px] shrink-0 space-y-6">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                        <div className="bg-indigo-600 p-8 flex flex-col items-center text-white relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black mb-4 shadow-xl border border-white/20">
                                {batch.name.substring(0, 2).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-center">{batch.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-2">Active Cohort</p>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Operational Metadata</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                    {batch.startDate ? format(new Date(batch.startDate), 'dd MMM yyyy') : 'N/A'} - {batch.endDate ? format(new Date(batch.endDate), 'dd MMM yyyy') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mode</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">OFFLINE_CAMPUS</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Program</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{batch.course.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                variant="ghost" 
                                onClick={() => setIsArchiveOpen(true)}
                                className="w-full h-12 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-[0.3em] transition-all"
                            >
                                ARCHIVE_COHORT
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Students</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">{stats.activeStudents}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Forecast Revenue</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">₹{stats.forecastPayment.toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all border-l-4 border-rose-500">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 group-hover:rotate-12 transition-transform">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Pending Dues</p>
                                    <p className="text-2xl font-black text-rose-600 uppercase leading-none mt-1">₹{stats.overdueAmount.toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Registry Tabs */}
                    <Tabs defaultValue="registry" className="w-full space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList className="bg-transparent h-auto p-0 gap-8">
                                <TabsTrigger
                                    value="registry"
                                    className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 data-[state=active]:text-indigo-600 relative after:absolute after:bottom-[-12px] after:left-0 after:h-1 after:w-0 data-[state=active]:after:w-full after:bg-indigo-600 after:transition-all after:rounded-full"
                                >
                                    STUDENT_REGISTRY
                                </TabsTrigger>
                                <TabsTrigger
                                    value="attendance"
                                    className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 data-[state=active]:text-indigo-600 relative after:absolute after:bottom-[-12px] after:left-0 after:h-1 after:w-0 data-[state=active]:after:w-full after:bg-indigo-600 after:transition-all after:rounded-full"
                                >
                                    ATTENDANCE_LOGS
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                    <Input
                                        placeholder="Search registry..."
                                        className="pl-10 pr-4 h-10 w-64 bg-white dark:bg-gray-900 border-none shadow-sm rounded-xl text-xs font-bold focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 p-2">Export Registry</DropdownMenuLabel>
                                        <DropdownMenuItem 
                                            onClick={() => handleExport('xlsx')}
                                            className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                                        >
                                            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                            Export as Excel (.xlsx)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => handleExport('pdf')}
                                            className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                                        >
                                            <FileText className="h-4 w-4 text-rose-500" />
                                            Export as PDF (.pdf)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <TabsContent value="registry" className="mt-0">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-none">
                                            <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Enrollment</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Student Name</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Contact Details</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</TableHead>
                                            <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Payment</TableHead>
                                            <TableHead className="px-8 py-5 text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-20">
                                                    <div className="flex flex-col items-center gap-3 opacity-40">
                                                        <Users className="h-12 w-12" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">No matching student records found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredStudents.map(student => (
                                                <TableRow key={student.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all border-b border-gray-50 dark:border-gray-800 last:border-0">
                                                    <TableCell className="px-8 py-6">
                                                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                            {student.enrollmentNo || 'ID_PENDING'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                                                                <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                                                                    {student.firstName[0].toUpperCase()}{student.lastName[0].toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                                                {student.firstName} {student.lastName}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                                                <Phone className="h-3 w-3 text-indigo-400" />
                                                                {student.phone}
                                                            </span>
                                                            <span className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                                                <Mail className="h-3 w-3 text-indigo-400/50" />
                                                                {student.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest">
                                                            {student.status.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <Badge className={cn(
                                                            "rounded-lg px-2.5 py-1 font-black text-[9px] uppercase tracking-widest",
                                                            student.paymentStatus === 'paid' 
                                                                ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                                                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                                        )}>
                                                            {student.paymentStatus.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 p-2">Student Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem 
                                                                    onClick={() => router.push(`/admin/students/${student.id}`)}
                                                                    className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                                                                >
                                                                    <Eye className="h-4 w-4 text-indigo-600" />
                                                                    View Profile
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="rounded-xl py-3 cursor-pointer gap-3 font-bold text-sm"
                                                                    onClick={() => {
                                                                        setSelectedStudent(student)
                                                                        setIsRemoveStudentOpen(true)
                                                                    }}
                                                                >
                                                                    <UserMinus className="h-4 w-4 text-rose-500" />
                                                                    Remove from Batch
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                                <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                        Registry Scan: {filteredStudents.length} Students Detected
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 border-none bg-gray-50/50 dark:bg-gray-800/30">Previous</Button>
                                        <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 border-none bg-gray-50/50 dark:bg-gray-800/30">Next</Button>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="attendance" className="mt-0">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-6">
                                <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shadow-xl border border-indigo-100 dark:border-indigo-800">
                                    <Clock className="h-10 w-10" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Attendance Logging Pending</h3>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Functional module integration is in the institution pipeline.</p>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Dialogs */}
            <EditBatchDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={editFormData}
                courses={courses}
                onChange={setEditFormData}
                onSubmit={handleUpdateBatch}
                saving={saving}
            />

            <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
                <AlertDialogContent className="rounded-[2rem] border-none p-0 overflow-hidden bg-white dark:bg-gray-950 shadow-2xl">
                    <div className="bg-amber-500 p-8 text-white relative overflow-hidden text-center">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl">
                                <Archive className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Archive Cohort</p>
                            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Confirm Archive</AlertDialogTitle>
                        </div>
                    </div>
                    <div className="p-10 text-center">
                        <AlertDialogDescription className="text-sm font-medium text-gray-500 leading-relaxed">
                            Are you sure you want to archive <strong>{batch.name}</strong>? This will mark the batch as completed and restrict further modifications.
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogFooter className="p-10 pt-0 gap-3 sm:gap-0 flex flex-col sm:flex-row">
                        <AlertDialogCancel className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 border-none bg-gray-50/50 dark:bg-gray-800/30">CANCEL</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleArchiveBatch}
                            disabled={saving}
                            className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                        >
                            {saving ? 'ARCHIVING...' : 'CONFIRM ARCHIVE'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isRemoveStudentOpen} onOpenChange={setIsRemoveStudentOpen}>
                <AlertDialogContent className="rounded-[2rem] border-none p-0 overflow-hidden bg-white dark:bg-gray-950 shadow-2xl">
                    <div className="bg-rose-500 p-8 text-white relative overflow-hidden text-center">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-xl">
                                <UserMinus className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Registry Removal</p>
                            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight">Remove Student</AlertDialogTitle>
                        </div>
                    </div>
                    <div className="p-10 text-center">
                        <AlertDialogDescription className="text-sm font-medium text-gray-500 leading-relaxed">
                            Are you sure you want to remove <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong> from this batch? This action cannot be undone.
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogFooter className="p-10 pt-0 gap-3 sm:gap-0 flex flex-col sm:flex-row">
                        <AlertDialogCancel className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 border-none bg-gray-50/50 dark:bg-gray-800/30">CANCEL</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleRemoveStudent}
                            disabled={saving}
                            className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                        >
                            {saving ? 'REMOVING...' : 'CONFIRM REMOVAL'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Help Button - Floating */}
            <div className="fixed bottom-10 right-10">
                <Button className="h-16 w-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-110 active:scale-95 group">
                    <HelpCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
                </Button>
            </div>
        </div>
    )
}
