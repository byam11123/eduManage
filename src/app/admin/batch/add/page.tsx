'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DateInput } from '@/components/ui/date-input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Course {
    id: string
    name: string
}

export default function AddBatchPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        courseId: '',
        startDate: '',
        endDate: '',
        setBatchTime: 'no',
        startTime: '',
        endTime: ''
    })

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) setCourses(data.courses)
        } catch (error) {
            console.error('Error fetching courses:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/batch')
                router.refresh()
            } else {
                // handle error
                console.error('Failed to create batch')
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {/* Using fixed positioning to simulate the modal look from the screenshot, detailed in task instructions as a page but looking like a modal */}
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Batch</h2>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/batch">
                            <X className="h-5 w-5 text-gray-500" />
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Row 1 */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Batch name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="MORNING BATCH"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Batch description</Label>
                            <Input
                                id="description"
                                name="description"
                                placeholder="CORELDRAW"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="space-y-2">
                            <Label htmlFor="courseId">Select course *</Label>
                            <Select value={formData.courseId} onValueChange={(val) => handleSelectChange('courseId', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Batch start date *</Label>
                            <DateInput
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={(val) => setFormData(prev => ({ ...prev, startDate: val }))}
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Batch end date *</Label>
                            <DateInput
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={(val) => setFormData(prev => ({ ...prev, endDate: val }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="setBatchTime">Do you want to set batch time? *</Label>
                            <Select value={formData.setBatchTime} onValueChange={(val) => handleSelectChange('setBatchTime', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Row 4 - Conditional Time Inputs */}
                        {formData.setBatchTime === 'yes' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Batch start time *</Label>
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">Batch end time *</Label>
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin/batch">CANCEL</Link>
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SUBMIT'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
