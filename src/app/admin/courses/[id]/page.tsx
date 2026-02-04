'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Users,
    UserCheck,
    UserX,
    AlertCircle,
    IndianRupee,
    Clock,
    Pencil,
    Search,
    RotateCw,
    Download,
    Send,
    Trash2,
    Plus,
    Loader2
} from 'lucide-react'
import { useParams } from 'next/navigation'

interface Subject {
    id: string
    name: string
    description: string
}

interface Student {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    status: string
    enrollmentDate: string
}

interface Course {
    id: string
    name: string
    description: string
    fee: number
    status: string
    subjects: Subject[]
    students: Student[]
}

export default function CourseDetailsPage() {
    const params = useParams()
    const id = params?.id as string

    const [mounted, setMounted] = useState(false)
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('details')

    // Search states
    const [studentSearch, setStudentSearch] = useState('')
    const [subjectSearch, setSubjectSearch] = useState('')

    // Add Subject Dialog
    const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false)
    const [newSubject, setNewSubject] = useState({ name: '', description: '' })
    const [savingSubject, setSavingSubject] = useState(false)

    useEffect(() => {
        setMounted(true)
        fetchCourseDetails()
    }, [])

    const fetchCourseDetails = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/courses/${id}`)
            const data = await res.json()
            if (data.success) {
                setCourse(data.course)
            }
        } catch (error) {
            console.error('Error fetching course:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddSubject = async () => {
        if (!newSubject.name) return
        try {
            setSavingSubject(true)
            const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newSubject,
                    courseId: id
                })
            })
            const data = await res.json()
            if (data.success) {
                setIsSubjectDialogOpen(false)
                setNewSubject({ name: '', description: '' })
                fetchCourseDetails()
            }
        } catch (error) {
            console.error('Error adding subject:', error)
        } finally {
            setSavingSubject(false)
        }
    }

    const handleDeleteSubject = async (subjectId: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return
        try {
            const res = await fetch(`/api/subjects?id=${subjectId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                fetchCourseDetails()
            }
        } catch (error) {
            console.error('Error deleting subject:', error)
        }
    }

    if (!mounted) return null
    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
    if (!course) return <div className="p-8 text-center">Course not found</div>

    // Stats
    const activeStudents = course.students.filter(s => s.status === 'active').length
    const inactiveStudents = course.students.filter(s => s.status === 'inactive').length
    // Mocking defaults for now as schema doesn't have detailed payment tracking per student yet
    const defaulterStudents = 0
    const receivedPayment = 0
    const overduePayment = 0
    const upcomingPayment = 0

    // Filtering
    const filteredStudents = course.students.filter(s =>
        (s.firstName + ' ' + s.lastName).toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email?.toLowerCase().includes(studentSearch.toLowerCase())
    )

    const filteredSubjects = course.subjects.filter(s =>
        s.name.toLowerCase().includes(subjectSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6">
            {/* Breadcrumb - mocked via text for now */}
            <div className="mb-6 text-sm text-gray-500">
                <span className="cursor-pointer hover:text-indigo-600">Courses</span> &gt; <span className="cursor-pointer hover:text-indigo-600">Course list</span> &gt; <span className="font-medium text-gray-900 dark:text-gray-200">Single course</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - Course Info */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-sm h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-4xl font-bold text-indigo-600">
                                    {course.name.substring(0, 1).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{course.name}</h2>

                            <div className="w-full text-left space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Course Details</h3>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <span className="text-gray-500 font-medium">Name</span>
                                    <span className="col-span-2 text-gray-700 dark:text-gray-300">: {course.name}</span>

                                    <span className="text-gray-500 font-medium">Fee</span>
                                    <span className="col-span-2 text-gray-700 dark:text-gray-300">: ₹{course.fee.toLocaleString()}</span>

                                    <span className="text-gray-500 font-medium">Description</span>
                                    <span className="col-span-2 text-gray-700 dark:text-gray-300 truncate">: {course.description || '-'}</span>

                                    <span className="text-gray-500 font-medium">Status</span>
                                    <span className="col-span-2">
                                        : <Badge className={`ml-1 ${course.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700'}`}>{course.status.toUpperCase()}</Badge>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-3">
                    <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700 w-full justify-start rounded-none h-auto p-0 gap-8 mb-6">
                            <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 bg-transparent px-4 pb-3 pt-0 text-sm font-medium uppercase">
                                Course Details
                            </TabsTrigger>
                            <TabsTrigger value="subjects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 bg-transparent px-4 pb-3 pt-0 text-sm font-medium uppercase">
                                Subject Details
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            {/* Stats Row */}
                            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Active Students</p>
                                            <p className="text-xl font-bold text-indigo-600">{activeStudents}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Inactive Students</p>
                                            <p className="text-xl font-bold text-yellow-500">{inactiveStudents}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Defaulter Students</p>
                                            <p className="text-xl font-bold text-red-500">{defaulterStudents}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Received Payment</p>
                                            <p className="text-xl font-bold text-green-500">₹{receivedPayment}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Overdue Payment</p>
                                            <p className="text-xl font-bold text-red-500">₹{overduePayment}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Upcoming Payment</p>
                                            <p className="text-xl font-bold text-blue-500">₹{upcomingPayment}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Students Table */}
                            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-semibold text-gray-700">Registered Students</CardTitle>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-indigo-600" onClick={fetchCourseDetails}>
                                            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                                            <Download className="h-3 w-3 mr-1" /> EXPORT
                                        </Button>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                                            <Send className="h-3 w-3 mr-1" /> SEND CERTIFICATE
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="relative max-w-sm ml-auto">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search..."
                                                className="pl-9 h-9"
                                                value={studentSearch}
                                                onChange={e => setStudentSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="round-md border-t border-gray-100 dark:border-gray-700">
                                        <Table>
                                            <TableHeader className="bg-gray-50/50 dark:bg-gray-700/50">
                                                <TableRow>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">ENROLLMENT NO</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">NAME</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">MOBILE NUM...</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">EMAIL-ID</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">STATUS</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">PAYMENT STATUS</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                                                            No data found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredStudents.map((student) => (
                                                        <TableRow key={student.id}>
                                                            <TableCell className="font-medium text-indigo-600">STU-{student.id.substring(20)}</TableCell>
                                                            <TableCell>{student.firstName} {student.lastName}</TableCell>
                                                            <TableCell>{student.phone || '-'}</TableCell>
                                                            <TableCell>{student.email || '-'}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={student.status === 'active' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                                                    {student.status.toUpperCase()}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="text-gray-500 border-gray-200">PENDING</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="p-4 flex items-center justify-end gap-2 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700">
                                        <span>Rows per page: 10</span>
                                        <span>{filteredStudents.length > 0 ? `1-${filteredStudents.length} of ${filteredStudents.length}` : '0-0 of 0'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="subjects" className="space-y-6">
                            <Card className="border-none shadow-sm bg-white dark:bg-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex justify-end mb-4">
                                        <div className="relative w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search..."
                                                className="pl-9 h-9"
                                                value={subjectSearch}
                                                onChange={e => setSubjectSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-md border border-gray-100 dark:border-gray-700">
                                        <Table>
                                            <TableHeader className="bg-gray-50/50 dark:bg-gray-700/50">
                                                <TableRow>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase w-1/4">NAME</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase w-1/2">DESCRIPTION</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase w-24">EDIT</TableHead>
                                                    <TableHead className="text-xs font-semibold text-gray-500 uppercase w-24">DELETE</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredSubjects.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                                            No subjects found
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredSubjects.map((subject) => (
                                                        <TableRow key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                            <TableCell className="font-medium">{subject.name}</TableCell>
                                                            <TableCell className="text-gray-500 text-sm">{subject.description || '-'}</TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-indigo-600">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                                                                    onClick={() => handleDeleteSubject(subject.id)}
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

                                    <div className="mt-4 flex items-center justify-between">
                                        <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 pl-0">
                                                    <Plus className="h-4 w-4 mr-1" /> ADD SUBJECTS
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add New Subject</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="subjectName">Subject Name *</Label>
                                                        <Input
                                                            id="subjectName"
                                                            value={newSubject.name}
                                                            onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                                            placeholder="e.g. CorelDraw"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="subjectDesc">Description</Label>
                                                        <Input
                                                            id="subjectDesc"
                                                            value={newSubject.description}
                                                            onChange={e => setNewSubject({ ...newSubject, description: e.target.value })}
                                                            placeholder="Short description"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
                                                    <Button
                                                        className="bg-indigo-600 text-white"
                                                        onClick={handleAddSubject}
                                                        disabled={!newSubject.name || savingSubject}
                                                    >
                                                        {savingSubject ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                        Add Subject
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <div className="text-xs text-gray-500">
                                            {filteredSubjects.length > 0 ? `Rows per page: 10   1-${filteredSubjects.length} of ${filteredSubjects.length}` : ''}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
