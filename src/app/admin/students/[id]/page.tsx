'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowLeft, RefreshCw, User, GraduationCap, Wallet, CalendarCheck, FileText, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStudents } from '@/hooks'
import {
    ProfileSidebar,
    ProfileDetailsTab,
    CourseDetailsTab,
    PaymentDetailsTab,
    AttendanceDetailsTab,
    DocumentsTab
} from '@/components/admin/students/view'
import { DeleteStudentDialog } from '@/components/admin/students'
import { cn, calculateAggregatedFinancials } from '@/lib/utils'

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const { fetchStudentById, deleteStudent, filteredStudents, fetchStudents } = useStudents()
    const [student, setStudent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Unwrap params using React.use()
    const resolvedParams = use(params)

    // Sync tab from URL
    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    useEffect(() => {
        const loadStudent = async () => {
            if (resolvedParams.id) {
                const data = await fetchStudentById(resolvedParams.id)
                setStudent(data)
                setLoading(false)
            }
        }
        loadStudent()
    }, [resolvedParams.id, fetchStudentById])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        router.replace(`${pathname}?tab=${value}`, { scroll: false })
    }

    const handleEdit = () => {
        router.push(`/admin/students/${student.id}/edit`)
    }

    const handleDelete = () => {
        setIsDeleteOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (student) {
            setDeleting(true)
            const success = await deleteStudent(student.id)
            setDeleting(false)
            if (success) {
                setIsDeleteOpen(false)
                router.push('/admin/students')
            }
        }
    }

    const handleRefresh = async () => {
        setLoading(true)
        if (resolvedParams.id) {
            const data = await fetchStudentById(resolvedParams.id)
            setStudent(data)
            setLoading(false)
        }
    }

    // Prev / Next navigation
    const currentIndex = filteredStudents.findIndex(s => s.id === resolvedParams.id)
    const prevStudent = currentIndex > 0 ? filteredStudents[currentIndex - 1] : null
    const nextStudent = currentIndex !== -1 && currentIndex < filteredStudents.length - 1 ? filteredStudents[currentIndex + 1] : null

    const handlePrev = () => {
        if (prevStudent) router.push(`/admin/students/${prevStudent.id}?tab=${activeTab}`)
    }
    const handleNext = () => {
        if (nextStudent) router.push(`/admin/students/${nextStudent.id}?tab=${activeTab}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 rounded-full animate-pulse" />
                    <div className="h-20 w-20 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl flex items-center justify-center relative border border-gray-100 dark:border-gray-800">
                        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Loading...</p>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading student details...</p>
                </div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col items-center justify-center gap-8">
                <div className="h-24 w-24 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                    <LayoutGrid className="h-10 w-10 text-rose-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Student Not Found</h2>
                    <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">The requested student record could not be located in the database.</p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/students')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105"
                >
                    <ArrowLeft className="h-4 w-4 mr-3" />
                    BACK TO STUDENTS
                </Button>
            </div>
        )
    }

    const tabTriggerClasses = "rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-100 dark:data-[state=active]:shadow-none flex items-center gap-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"

    const aggregated = calculateAggregatedFinancials(student.studentCourses || [])
    const totalAttendance = student.attendances?.length || 0
    const presentCount = student.attendances?.filter((a: any) => a.status === 'present').length || 0
    const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0
    const docCount = [
        student.aadhaarNumber,
        student.hsSchoolName,
        student.hssSchoolName,
        student.imageUrl,
        student.enrollmentNo
    ].filter(Boolean).length

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-8 space-y-10">
            {/* Breadcrumb Matrix */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => router.push('/admin/students')}>STUDENTS</span>
                        <span className="text-gray-300">›</span>
                        <span className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => router.push('/admin/students')}>STUDENT LIST</span>
                        <span className="text-gray-300">›</span>
                        <span className="text-indigo-600">STUDENT DETAILS</span>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/admin/students')}
                    className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    BACK TO LIST
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Profile Sidebar (3 cols) */}
                <div className="lg:col-span-3 lg:sticky lg:top-8">
                    <ProfileSidebar
                        student={student}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        hasPrev={!!prevStudent}
                        hasNext={!!nextStudent}
                        currentIndex={currentIndex}
                        totalCount={filteredStudents.length}
                    />
                </div>

                {/* Right Content Matrix (9 cols) */}
                <div className="lg:col-span-9 space-y-8">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center shadow-inner">
                                <Wallet className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Due</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">₹ {aggregated.totalDue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center shadow-inner">
                                <CalendarCheck className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">
                                    {totalAttendance > 0 ? `${attendancePercentage}%` : '—'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center shadow-inner">
                                <GraduationCap className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courses</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{student.studentCourses?.length || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center shadow-inner">
                                <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documents</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">
                                    {docCount} / 5
                                </p>
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-[2.5rem] shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-50 dark:border-gray-800 mb-10 overflow-x-auto no-scrollbar">
                            <TabsList className="bg-transparent h-auto p-0 gap-2 flex justify-start">
                                <TabsTrigger value="profile" className={tabTriggerClasses}>
                                    <User className="h-3.5 w-3.5" />
                                    Student Profile
                                </TabsTrigger>
                                <TabsTrigger value="course" className={tabTriggerClasses}>
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Course Details
                                </TabsTrigger>
                                <TabsTrigger value="payment" className={tabTriggerClasses}>
                                    <Wallet className="h-3.5 w-3.5" />
                                    Payment Details
                                </TabsTrigger>
                                <TabsTrigger value="attendance" className={tabTriggerClasses}>
                                    <CalendarCheck className="h-3.5 w-3.5" />
                                    Attendance Details
                                </TabsTrigger>
                                <TabsTrigger value="documents" className={tabTriggerClasses}>
                                    <FileText className="h-3.5 w-3.5" />
                                    Documents
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="min-h-[600px]">
                            <TabsContent value="profile" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <ProfileDetailsTab student={student} onEdit={handleEdit} />
                            </TabsContent>

                            <TabsContent value="course" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <CourseDetailsTab student={student} onRefresh={handleRefresh} />
                            </TabsContent>

                            <TabsContent value="payment" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <PaymentDetailsTab student={student} onRefresh={handleRefresh} />
                            </TabsContent>

                            <TabsContent value="attendance" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <AttendanceDetailsTab student={student} />
                            </TabsContent>

                            <TabsContent value="documents" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <DocumentsTab student={student} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>

            {/* Deletion Protocol Dialog */}
            <DeleteStudentDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                student={student}
                onConfirm={handleConfirmDelete}
                loading={deleting}
            />
        </div>
    )
}
