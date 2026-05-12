'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Loader2,
    QrCode,
    ClipboardList,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/hooks' // Wait, PageHeader is in components/shared
import { PageHeader as SharedPageHeader } from '@/components/shared/PageHeader'
import { EnquiryForm } from '@/components/admin/enquiry'
import type { EnquiryFormData, Course } from '@/lib/types'

export default function GenerateEnquiryPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])

    const [formData, setFormData] = useState<EnquiryFormData>({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        description: '',
        courseId: 'none',
        status: 'new',
        source: 'web'
    })

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            if (data.success) {
                setCourses(data.courses)
            }
        } catch (error) {
            console.error('Error fetching courses', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const dataToSubmit = {
                ...formData,
                courseId: formData.courseId === 'none' ? null : formData.courseId
            }

            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit)
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to generate enquiry')
            }

            router.push('/admin/enquiry')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            alert(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <SharedPageHeader 
                title="Enquiry Generation"
                description="Initialize student onboarding by capturing essential academic metadata and program intent."
                actions={[
                    { label: 'Show QR Code', icon: QrCode, variant: 'outline' }
                ]}
            />

            <div className="max-w-5xl">
                <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Onboarding Protocol</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Capture prospect identity and intent</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-10">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading configurations...</span>
                            </div>
                        ) : (
                            <EnquiryForm 
                                formData={formData}
                                courses={courses}
                                onChange={setFormData}
                                onSubmit={handleSubmit}
                                onCancel={() => router.push('/admin/enquiry')}
                                saving={isSaving}
                                mode="create"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
