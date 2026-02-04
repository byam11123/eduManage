'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Loader2,
    Save,
    Plus,
    QrCode
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Course {
    id: string
    name: string
}

export default function GenerateEnquiryPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [courses, setCourses] = useState<Course[]>([])

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        courseId: '',
        description: ''
    })

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) {
                setCourses(data.courses)
            }
        } catch (error) {
            console.error('Error fetching courses', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCourseChange = (value: string) => {
        setFormData(prev => ({ ...prev, courseId: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to generate enquiry')
            }

            // Success
            alert('Enquiry generated successfully!')
            router.push('/admin/enquiry')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/enquiry">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-700">Generate Enquiry</h1>
                </div>
                <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white border-none gap-2">
                    SHOW QR <QrCode className="h-4 w-4" />
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 space-y-8">

                    {/* Student Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Student Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Input
                                    name="firstName"
                                    placeholder="First name *"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="lastName"
                                    placeholder="Last name *"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="mobile"
                                    placeholder="Mobile number *"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Course Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Select onValueChange={handleCourseChange} value={formData.courseId}>
                                    <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 text-gray-500">
                                        <SelectValue placeholder="Interested course *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(course => (
                                            <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                                        ))}
                                        {courses.length === 0 && <SelectItem value="disabled" disabled>No courses available</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="description"
                                    placeholder="Course description *"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="bg-gray-50 dark:bg-gray-900 border-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Extra Field Button */}
                    <div>
                        <Button type="button" variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white border-none gap-2 text-xs uppercase font-semibold">
                            <Plus className="h-4 w-4" /> Add Extra Field
                        </Button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px] uppercase font-semibold" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}
