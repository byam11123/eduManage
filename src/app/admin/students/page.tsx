'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Megaphone, Users, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { StudentList, StudentFilters, StudentStats, DeleteStudentDialog, BulkUploadDialog } from '@/components/admin/students'
import { useStudents, useCourses, useBranches } from '@/hooks'
import type { Student } from '@/lib/types'
import { ExportButton } from '@/components/shared/ExportButton'
import { exportToCSV } from '@/lib/utils/export-utils'
import { toast } from 'sonner'

export default function StudentsPage() {
    const router = useRouter()
    const {
        filteredStudents,
        loading,
        fetchStudents,
        deleteStudent,
        bulkCreate,
        saving,
        stats
    } = useStudents()

    const { courses } = useCourses()
    const { branches } = useBranches()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isBulkOpen, setIsBulkOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [isBulkDeleting, setIsBulkDeleting] = useState(false)
    const [isBulkExporting, setIsBulkExporting] = useState(false)

    const handleEdit = (student: Student) => {
        router.push(`/admin/students/${student.id}/edit`)
    }

    const handleDelete = (student: Student) => {
        setSelectedStudent(student)
        setIsDeleteOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (selectedStudent) {
            await deleteStudent(selectedStudent.id)
            setIsDeleteOpen(false)
            setSelectedStudent(null)
        }
    }

    const handleBulkDelete = async (ids: string[]) => {
        if (!confirm(`Are you sure you want to permanently delete ${ids.length} students?`)) return
        
        setIsBulkDeleting(true)
        try {
            const res = await fetch('/api/students/bulk/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            })
            
            const data = await res.json()
            if (data.success) {
                toast.success(`Successfully deleted ${data.deletedCount} students`)
                await fetchStudents() // Refresh list
            } else {
                toast.error(data.error || 'Failed to delete students')
            }
        } catch (error) {
            console.error('Bulk delete error:', error)
            toast.error('An error occurred during bulk deletion')
        } finally {
            setIsBulkDeleting(false)
        }
    }

    const generateExportData = (studentsToExport: Student[]) => {
        return studentsToExport.map(s => ({
            firstName: s.firstName || '',
            lastName: s.lastName || '',
            email: s.email || '',
            phone: s.phone || '',
            dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
            gender: s.gender || '',
            aadhaarNumber: s.aadhaarNumber || '',
            category: s.category || '',
            maritalStatus: s.maritalStatus || '',
            alternatePhone: s.alternatePhone || '',
            fathersName: s.fathersName || '',
            fathersPhone: s.fathersPhone || '',
            mothersName: s.mothersName || '',
            addressLine1: s.addressLine1 || '',
            addressLine2: s.addressLine2 || '',
            city: s.city || '',
            district: s.district || '',
            state: s.state || '',
            country: s.country || '',
            zipCode: s.zipCode || '',
            highestQualification: s.highestQualification || '',
            hsSchoolName: s.hsSchoolName || '',
            hsBoard: s.hsBoard || '',
            hsPassingYear: s.hsPassingYear || '',
            hsPercentage: s.hsPercentage || '',
            hssSchoolName: s.hssSchoolName || '',
            hssBoard: s.hssBoard || '',
            hssStream: s.hssStream || '',
            hssPassingYear: s.hssPassingYear || '',
            hssPercentage: s.hssPercentage || '',
            gradCollegeName: s.gradCollegeName || '',
            gradUniversity: s.gradUniversity || '',
            gradDegree: s.gradDegree || '',
            gradPassingYear: s.gradPassingYear || '',
            gradPercentage: s.gradPercentage || '',
            pgCollegeName: s.pgCollegeName || '',
            pgUniversity: s.pgUniversity || '',
            pgDegree: s.pgDegree || '',
            pgPassingYear: s.pgPassingYear || '',
            pgPercentage: s.pgPercentage || '',
            totalFee: s.totalFees || ''
        }))
    }

    const handleBulkExport = async (ids: string[]) => {
        setIsBulkExporting(true)
        try {
            const selectedStudents = filteredStudents.filter(s => ids.includes(s.id))
            const exportData = generateExportData(selectedStudents)
            
            exportToCSV('EduManage_Selected_Students_Backup.csv', exportData)
            toast.success('Export downloaded successfully')
        } catch (error) {
            console.error('Bulk export error:', error)
            toast.error('Failed to export students')
        } finally {
            setIsBulkExporting(false)
        }
    }

    const handleView = (student: Student) => {
        router.push(`/admin/students/${student.id}`)
    }

    const handleBulkUpload = async (data: any) => {
        return await bulkCreate(data)
    }

    return (
        <div className="p-4 lg:p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Student Directory"
                description="Manage student records and track their progress."
                actions={[
                    { 
                        label: 'Announcement', 
                        icon: Megaphone, 
                        variant: 'outline',
                        className: 'bg-violet-600 text-white hover:bg-violet-700 hover:text-white border-none shadow-lg shadow-violet-100 dark:shadow-none'
                    },
                    { 
                        label: 'Bulk Upload', 
                        icon: Upload, 
                        variant: 'outline',
                        onClick: () => setIsBulkOpen(true)
                    },
                    { label: 'Add New Student', icon: Plus, variant: 'default', href: '/admin/students/add' }
                ]}
            >
                <ExportButton 
                    data={generateExportData(filteredStudents)}
                    columns={Object.keys(generateExportData([filteredStudents[0] || {} as any])[0] || {}).map(key => ({ header: key, dataKey: key }))}
                    fileName="EduManage_Full_Students_Backup"
                    title="Student Directory Master Backup"
                    variant="outline"
                />
            </PageHeader>

            <StudentStats {...stats} />

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                <div className="w-full lg:flex-1">
                    <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                        <CardContent className="p-4">
                            <StudentFilters
                                onRefresh={fetchStudents}
                                loading={loading}
                                courses={courses}
                                branches={branches}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main List Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <StudentList
                            students={filteredStudents}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                            onBulkDelete={handleBulkDelete}
                            onBulkExport={handleBulkExport}
                            isBulkDeleting={isBulkDeleting}
                            isBulkExporting={isBulkExporting}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing {filteredStudents.length} Students
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400" disabled>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DeleteStudentDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                student={selectedStudent}
                onConfirm={handleConfirmDelete}
                loading={loading}
            />

            <BulkUploadDialog 
                open={isBulkOpen}
                onOpenChange={setIsBulkOpen}
                branches={branches}
                courses={courses}
                onUpload={handleBulkUpload}
                loading={saving}
            />
        </div>
    )
}
