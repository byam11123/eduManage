'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, RotateCw, Loader2, Save, FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface Course {
    id: string
    name: string
    fee: number
    description: string
    status: string
    durationYears: number
    durationMonths: number
}

interface NewCourse {
    name: string
    description: string
    fee: string
    feeDescription: string
    durationYears: string
    durationMonths: string
    maxInstallments: string
}

export default function CoursesPage() {
    const [mounted, setMounted] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState<NewCourse>({
        name: '',
        description: '',
        fee: '',
        feeDescription: '',
        durationYears: '0',
        durationMonths: '0',
        maxInstallments: '1'
    })

    useEffect(() => {
        setMounted(true)
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) {
                setCourses(data.courses)
            }
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        if (!formData.name || !formData.fee) return

        try {
            setSaving(true)
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (data.success) {
                setIsAddOpen(false)
                fetchCourses() // Refresh list
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    fee: '',
                    feeDescription: '',
                    durationYears: '0',
                    durationMonths: '0',
                    maxInstallments: '1'
                })
            }
        } catch (error) {
            console.error('Error creating course:', error)
        } finally {
            setSaving(false)
        }
    }

    if (!mounted) return null

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Courses</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your institute's courses</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Plus className="h-4 w-4" />
                            ADD COURSE
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Add Course</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Course name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter course name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Course description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fee">Course fee *</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    value={formData.fee}
                                    onChange={e => setFormData({ ...formData, fee: e.target.value })}
                                    placeholder="Enter fee amount"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feeDescription">Course fee description</Label>
                                <Input
                                    id="feeDescription"
                                    value={formData.feeDescription}
                                    onChange={e => setFormData({ ...formData, feeDescription: e.target.value })}
                                    placeholder="Fee details"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Course duration (In year)</Label>
                                <Select
                                    value={formData.durationYears}
                                    onValueChange={val => setFormData({ ...formData, durationYears: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[0, 1, 2, 3, 4, 5].map(y => (
                                            <SelectItem key={y} value={y.toString()}>{y} Year</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Course duration (In month)</Label>
                                <Select
                                    value={formData.durationMonths}
                                    onValueChange={val => setFormData({ ...formData, durationMonths: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <SelectItem key={i} value={i.toString()}>{i} Month</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Max installment *</Label>
                                <Select
                                    value={formData.maxInstallments}
                                    onValueChange={val => setFormData({ ...formData, maxInstallments: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Installments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 12].map(n => (
                                            <SelectItem key={n} value={n.toString()}>{n} Installments</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 pt-2">
                                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto font-medium">
                                    <Plus className="h-4 w-4 mr-1" /> ADD SUBJECTS
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>CANCEL</Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleCreate}
                                disabled={saving || !formData.name || !formData.fee}
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                SUBMIT
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                        <Button variant="outline" size="icon" className="h-9 w-9 text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100" onClick={fetchCourses}>
                            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border-t border-gray-100 dark:border-gray-800">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow>
                                    <TableHead className="w-[300px] font-semibold text-xs uppercase tracking-wider text-gray-500">NAME</TableHead>
                                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">FEE</TableHead>
                                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">DESCRIPTION</TableHead>
                                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            Loading courses...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCourses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileText className="h-8 w-8 text-gray-300" />
                                                <p>No data found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCourses.map((course) => (
                                        <TableRow
                                            key={course.id}
                                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                                            onClick={() => router.push(`/admin/courses/${course.id}`)}
                                        >
                                            <TableCell className="font-medium text-gray-900 dark:text-white">{course.name}</TableCell>
                                            <TableCell className="text-gray-600 dark:text-gray-300">₹{course.fee.toLocaleString()}</TableCell>
                                            <TableCell className="text-gray-500 dark:text-gray-400 max-w-md truncate">{course.description || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className={course.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : ''}>
                                                    {course.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span>Rows per page: 10</span>
                        <span>{filteredCourses.length > 0 ? `1-${filteredCourses.length} of ${filteredCourses.length}` : '0-0 of 0'}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
