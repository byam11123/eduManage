'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import {
    Loader2,
    IndianRupee,
    Clock,
    UserCheck,
    BookOpen,
    ArrowLeft,
    Pencil,
    ChevronRight,
    RotateCw,
    Trash2,
    Layers,
    TrendingUp,
    ShieldCheck,
    Download,
    Share2,
    AlertCircle,
    GraduationCap,
    BookMarked,
    Calendar,
    Briefcase,
    HelpCircle,
    LayoutDashboard,
    Users
} from 'lucide-react'

// Modular components
import {
    EditCourseDialog,
    DeleteCourseDialog
} from '@/components/admin/courses'
import {
    EditBatchDialog,
    DeleteBatchDialog
} from '@/components/admin/batches'
import { StudentList } from '@/components/admin/students'
import { BatchList } from '@/components/admin/batches'

// Custom hooks
import { useCourses, useStudents, useBatches } from '@/hooks'
import type { CourseFormData, Batch, BatchFormData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function CourseDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    // Custom hooks
    const {
        getCourseById,
        fetchCourseById,
        updateCourse,
        deleteCourse,
        saving: savingCourse
    } = useCourses()

    const { courses } = useCourses()

    const {
        students,
        fetchStudents,
        loading: loadingStudents
    } = useStudents()

    const {
        batches,
        fetchBatches,
        loading: loadingBatches,
        getBatchesByCourse,
        updateBatch,
        deleteBatch,
        saving: savingBatch
    } = useBatches()

    // Local state
    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('details')

    // Dialog states
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [editFormData, setEditFormData] = useState<CourseFormData>({
        name: '',
        code: '',
        description: '',
        courseType: '',
        mode: 'offline',
        fee: '',
        feeDescription: '',
        registrationFee: '',
        discountAllowed: false,
        discountPercentage: '',
        durationYears: '0',
        durationMonths: '0',
        maxInstallments: '1',
        installmentAmounts: [],
        subjects: [],
        eligibility: '',
        status: 'active'
    })

    // Batch Dialog states
    const [isBatchEditOpen, setIsBatchEditOpen] = useState(false)
    const [isBatchDeleteOpen, setIsBatchDeleteOpen] = useState(false)
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [batchEditFormData, setBatchEditFormData] = useState<BatchFormData>({
        name: '',
        description: '',
        courseId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        status: 'active'
    })

    // Batch Handlers
    const handleBatchEdit = (batch: Batch) => {
        setSelectedBatch(batch)
        setBatchEditFormData({
            name: batch.name,
            description: batch.description || '',
            courseId: batch.courseId,
            startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
            endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
            startTime: batch.startTime || '',
            endTime: batch.endTime || '',
            status: batch.status
        })
        setIsBatchEditOpen(true)
    }

    const handleBatchDelete = (batch: Batch) => {
        setSelectedBatch(batch)
        setIsBatchDeleteOpen(true)
    }

    const onBatchEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBatch) return
        const success = await updateBatch(selectedBatch.id, batchEditFormData)
        if (success) {
            setIsBatchEditOpen(false)
            fetchBatches()
            toast.success('Batch updated successfully')
        }
    }

    const onBatchDeleteConfirm = async () => {
        if (!selectedBatch) return
        const success = await deleteBatch(selectedBatch.id)
        if (success) {
            setIsBatchDeleteOpen(false)
            fetchBatches()
            toast.success('Batch deleted successfully')
        }
    }

    // Fetch data
    useEffect(() => {
        const init = async () => {
            setLoading(true)
            const data = await fetchCourseById(id)
            if (data) {
                setCourse(data)
                setEditFormData({
                    name: data.name,
                    code: data.code || '',
                    description: data.description || '',
                    courseType: data.courseType || '',
                    mode: data.mode || 'offline',
                    fee: data.fee.toString(),
                    feeDescription: data.feeDescription || '',
                    registrationFee: (data.registrationFee || 0).toString(),
                    discountAllowed: data.discountAllowed || false,
                    discountPercentage: (data.discountPercentage || 0).toString(),
                    durationYears: (data.durationYears || 0).toString(),
                    durationMonths: (data.durationMonths || 0).toString(),
                    maxInstallments: (data.maxInstallments || 1).toString(),
                    installmentAmounts: data.installmentAmounts ? JSON.parse(data.installmentAmounts) : [],
                    subjects: data.subjects?.map((s: any) => s.name) || [],
                    eligibility: data.eligibility || '',
                    status: data.status
                })
            }
            setLoading(false)

            // Fetch related data
            fetchStudents({ courseId: id })
            fetchBatches()
        }
        init()
    }, [id, fetchCourseById, fetchStudents, fetchBatches])

    // Handlers
    const handleUpdate = async () => {
        if (!course) return
        const success = await updateCourse(course.id, editFormData)
        if (success) {
            setIsEditOpen(false)
            toast.success('Course updated successfully')
            const updated = await fetchCourseById(id)
            if (updated) setCourse(updated)
        }
    }

    const handleDelete = async () => {
        if (!course) return
        const success = await deleteCourse(course.id)
        if (success) {
            toast.success('Course deleted successfully')
            router.push('/admin/courses')
        }
    }

    const courseStudents = students.filter(s => s.courseId === id)
    const courseBatches = getBatchesByCourse(id)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Accessing Curriculum Repository...</p>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <AlertCircle className="h-12 w-12 text-rose-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Curriculum Not Found</p>
                <Button variant="outline" onClick={() => router.push('/admin/courses')} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Back to Courses</Button>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-10 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            
            {/* High-Fidelity Header */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <BookMarked className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-gray-400">ACADEMIC</span>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <Link href="/admin/courses" className="text-gray-400 hover:text-indigo-600 transition-colors">CURRICULUM</Link>
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        <span className="text-indigo-600">PROGRAM_DETAILS</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                                {course.name}
                            </h1>
                            <Badge className={cn(
                                "rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest",
                                course.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                            )}>
                                {course.status}
                            </Badge>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                            Program Code: {course.code || 'UNASSIGNED'} • Mode: {course.mode?.toUpperCase() || 'OFFLINE'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditOpen(true)}
                            className="h-12 px-6 rounded-2xl bg-white dark:bg-gray-900 border-none shadow-sm text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest gap-3 transition-all active:scale-95"
                        >
                            <Pencil className="h-4 w-4" />
                            EDIT PROGRAM
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={() => setIsDeleteOpen(true)}
                            className="h-12 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-rose-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Trash2 className="h-4 w-4" />
                            DELETE
                        </Button>
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform">
                            <IndianRupee className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Program Fee</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">₹{course.fee.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Duration</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">
                                {course.durationYears > 0 ? `${course.durationYears}Y` : ''}{course.durationMonths > 0 ? `${course.durationMonths}M` : ''}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:rotate-12 transition-transform">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Intake</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">{courseStudents.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Active Batches</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mt-1">{courseBatches.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col xl:flex-row gap-8">
                
                {/* Left Side: Details & Tabs */}
                <div className="flex-1 space-y-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                        <div className="flex items-center justify-between">
                            <TabsList className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 h-auto p-1.5 gap-2 rounded-2xl shadow-sm">
                                <TabsTrigger
                                    value="details"
                                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 dark:data-[state=active]:shadow-none data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-600 data-[state=inactive]:hover:bg-indigo-50/50"
                                >
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    CURRICULUM
                                </TabsTrigger>
                                <TabsTrigger
                                    value="students"
                                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 dark:data-[state=active]:shadow-none data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-600 data-[state=inactive]:hover:bg-indigo-50/50"
                                >
                                    <Users className="h-3.5 w-3.5" />
                                    STUDENTS
                                </TabsTrigger>
                                <TabsTrigger
                                    value="batches"
                                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 dark:data-[state=active]:shadow-none data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-600 data-[state=inactive]:hover:bg-indigo-50/50"
                                >
                                    <Layers className="h-3.5 w-3.5" />
                                    BATCHES
                                </TabsTrigger>
                                <TabsTrigger
                                    value="subjects"
                                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200 dark:data-[state=active]:shadow-none data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-600 data-[state=inactive]:hover:bg-indigo-50/50"
                                >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    SUBJECTS
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="details" className="mt-0 space-y-8 animate-in fade-in-50 duration-500">
                            {/* Program Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 space-y-8">
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Financial Orchestration</p>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                                        <IndianRupee className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Standard Fee</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">₹{course.fee.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Registration</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">₹{(course.registrationFee || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                                        <TrendingUp className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Installments</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{course.maxInstallments} Payment Cycles</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 space-y-8">
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Academic parameters</p>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                                        <GraduationCap className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Eligibility</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{course.eligibility?.replace('_', ' ') || 'OPEN_ENROLLMENT'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600">
                                                        <Layers className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Type</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{course.courseType?.toUpperCase() || 'STANDARD'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                                                        <Clock className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mode</p>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{course.mode?.toUpperCase() || 'OFFLINE'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Description Card */}
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-8">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-4">Curriculum Overview</p>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-4xl">
                                    {course.description || "No curriculum description has been provided for this program yet."}
                                </p>
                            </Card>
                        </TabsContent>

                        <TabsContent value="students" className="mt-0 animate-in fade-in-50 duration-500">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                                <StudentList
                                    students={courseStudents}
                                    loading={loadingStudents}
                                />
                            </Card>
                        </TabsContent>

                        <TabsContent value="batches" className="mt-0 animate-in fade-in-50 duration-500">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                                <BatchList
                                    batches={courseBatches}
                                    loading={loadingBatches}
                                    onEdit={handleBatchEdit}
                                    onDelete={handleBatchDelete}
                                />
                            </Card>
                        </TabsContent>

                        <TabsContent value="subjects" className="mt-0 animate-in fade-in-50 duration-500">
                            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-20 flex flex-col items-center justify-center gap-6">
                                <div className="h-20 w-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shadow-xl border border-indigo-100 dark:border-indigo-800">
                                    <BookOpen className="h-10 w-10" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Subject Mapping Pending</h3>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Functional integration is in the curriculum pipeline.</p>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Side: Quick Info */}
                <div className="w-full xl:w-[320px] shrink-0 space-y-6">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 space-y-8">
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Quick Actions</p>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" className="h-12 rounded-xl border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest gap-3 justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                    <Download className="h-4 w-4" />
                                    Download Syllabus
                                </Button>
                                <Button variant="outline" className="h-12 rounded-xl border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest gap-3 justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                    <Share2 className="h-4 w-4" />
                                    Share Program
                                </Button>
                            </div>
                        </div>

                        <DropdownMenuSeparator className="bg-gray-50 dark:bg-gray-800" />

                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Administrative Logs</p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5" />
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">Course Initialized</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">24 APR 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5" />
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">Fee Structure Revised</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">12 MAY 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <EditCourseDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={editFormData}
                onChange={setEditFormData}
                onSubmit={handleUpdate}
                saving={savingCourse}
            />

            <DeleteCourseDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                course={course}
                onConfirm={handleDelete}
                saving={savingCourse}
            />

            {/* Batch Dialogs */}
            <EditBatchDialog
                open={isBatchEditOpen}
                onOpenChange={setIsBatchEditOpen}
                formData={batchEditFormData}
                onChange={setBatchEditFormData}
                courses={courses}
                onSubmit={onBatchEditSubmit}
                saving={savingBatch}
            />

            <DeleteBatchDialog
                open={isBatchDeleteOpen}
                onOpenChange={setIsBatchDeleteOpen}
                batch={selectedBatch}
                onConfirm={onBatchDeleteConfirm}
                saving={savingBatch}
            />

            {/* Help Button - Floating */}
            <div className="fixed bottom-10 right-10">
                <Button className="h-16 w-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-110 active:scale-95 group">
                    <HelpCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
                </Button>
            </div>
        </div>
    )
}
