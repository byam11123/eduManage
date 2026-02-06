'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
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

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { fetchStudentById, deleteStudent } = useStudents()
    const [student, setStudent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // Unwrap params using React.use()
    const resolvedParams = use(params)

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-sm text-gray-500">Loading student details...</p>
                </div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Student Not Found</h2>
                <Button onClick={() => router.push('/admin/students')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Students
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span className="cursor-pointer hover:text-indigo-600" onClick={() => router.push('/admin/students')}>Students</span>
                <span>›</span>
                <span className="cursor-pointer hover:text-indigo-600" onClick={() => router.push('/admin/students')}>Student list</span>
                <span>›</span>
                <span className="text-indigo-600 font-medium">Single student</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Left Sidebar - Profile (3 cols) */}
                <div className="lg:col-span-3 h-full">
                    <ProfileSidebar
                        student={student}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Right Content - Tabs (9 cols) */}
                <div className="lg:col-span-9">
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 mb-6 gap-6 overflow-x-auto">
                            <TabsTrigger
                                value="profile"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Student Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="course"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Course Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Payment Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="attendance"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Attendance Details
                            </TabsTrigger>
                            {/* <TabsTrigger
                                value="announcement"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Announcement History
                            </TabsTrigger> */}
                            <TabsTrigger
                                value="documents"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none bg-transparent px-0 pb-2 uppercase text-xs font-semibold tracking-wide text-gray-500"
                            >
                                Documents
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <ProfileDetailsTab student={student} onEdit={handleEdit} />
                        </TabsContent>

                        <TabsContent value="course">
                            <CourseDetailsTab student={student} />
                        </TabsContent>

                        <TabsContent value="payment">
                            <PaymentDetailsTab student={student} onRefresh={handleRefresh} />
                        </TabsContent>

                        <TabsContent value="attendance">
                            <AttendanceDetailsTab />
                        </TabsContent>

                        <TabsContent value="announcement">
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">No announcements found.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="documents">
                            <DocumentsTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            {/* Deletion Dialog */}
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
