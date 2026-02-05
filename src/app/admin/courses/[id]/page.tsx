// ============================================
// COURSE DETAILS PAGE
// Thin wrapper using modular components and hooks
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
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
    Pencil
} from 'lucide-react'

// Modular components
import {
    EditCourseDialog,
    DeleteCourseDialog
} from '@/components/admin/courses'
import { StudentList } from '@/components/admin/students'
import { BatchList } from '@/components/admin/batches'

// Custom hooks
import { useCourses, useStudents, useBatches } from '@/hooks'
import type { CourseFormData } from '@/lib/types'

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
        saving
    } = useCourses()

    const {
        students,
        fetchStudents,
        loading: loadingStudents
    } = useStudents()

    const {
        batches,
        fetchBatches,
        loading: loadingBatches,
        getBatchesByCourse
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
        description: '',
        fee: '',
        feeDescription: '',
        durationYears: '0',
        durationMonths: '0',
        maxInstallments: '1',
        status: 'active'
    })

    // Fetch data
    useEffect(() => {
        const init = async () => {
            setLoading(true)
            const data = await fetchCourseById(id)
            if (data) {
                setCourse(data)
                setEditFormData({
                    name: data.name,
                    description: data.description || '',
                    fee: data.fee.toString(),
                    feeDescription: data.feeDescription || '',
                    durationYears: (data.durationYears || 0).toString(),
                    durationMonths: (data.durationMonths || 0).toString(),
                    maxInstallments: (data.maxInstallments || 1).toString(),
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
            // Refresh course data
            const updated = await fetchCourseById(id)
            if (updated) setCourse(updated)
        }
    }

    const handleDelete = async () => {
        if (!course) return
        const success = await deleteCourse(course.id)
        if (success) {
            router.push('/admin/courses')
        }
    }

    const courseStudents = students.filter(s => s.courseId === id)
    const courseBatches = getBatchesByCourse(id)

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">Course not found</h2>
                <Link href="/admin/courses">
                    <Button variant="link" className="mt-2 text-indigo-600">
                        Go back to courses
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/admin/courses" className="hover:text-indigo-600">
                    Courses
                </Link>
                <span>›</span>
                <span className="text-gray-900 dark:text-white font-medium">
                    {course.name}
                </span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {course.name}
                        </h1>
                        <Badge
                            variant={course.status === 'active' ? 'default' : 'secondary'}
                            className={course.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                        >
                            {course.status.toUpperCase()}
                        </Badge>
                    </div>
                    <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-2xl">
                        {course.description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Course
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">FEE STRUCTURE</span>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="h-5 w-5 text-indigo-600" />
                            <span className="text-xl font-bold">₹{course.fee.toLocaleString()}</span>
                        </div>
                        {course.feeDescription && (
                            <span className="text-xs text-gray-400">{course.feeDescription}</span>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">DURATION</span>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span className="text-xl font-bold">
                                {course.durationYears > 0 ? `${course.durationYears} Yr ` : ''}
                                {course.durationMonths > 0 ? `${course.durationMonths} Mo` : ''}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            {course.maxInstallments} Installments allowed
                        </span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">STUDENTS</span>
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-green-600" />
                            <span className="text-xl font-bold">{courseStudents.length}</span>
                        </div>
                        <span className="text-xs text-gray-400">Total Enrolled</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">BATCHES</span>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span className="text-xl font-bold">{courseBatches.length}</span>
                        </div>
                        <span className="text-xs text-gray-400">Active Batches</span>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="students">Students ({courseStudents.length})</TabsTrigger>
                    <TabsTrigger value="batches">Batches ({courseBatches.length})</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Course Name</h4>
                                    <p>{course.name}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <Badge variant="outline">{course.status}</Badge>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Fees</h4>
                                    <p>₹{course.fee.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                                    <p>{course.durationYears} Years, {course.durationMonths} Months</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <StudentList
                                students={courseStudents}
                                loading={loadingStudents}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="batches" className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            <BatchList
                                batches={courseBatches}
                                loading={loadingBatches}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subjects">
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            Subject management coming soon...
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <EditCourseDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={editFormData}
                onChange={setEditFormData}
                onSubmit={handleUpdate}
                saving={saving}
            />

            <DeleteCourseDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                course={course}
                onConfirm={handleDelete}
                saving={saving}
            />
        </div>
    )
}
