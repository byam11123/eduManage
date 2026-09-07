'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Search,
    RotateCw,
    Calendar as CalendarIcon,
    BarChart3,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    List as ListIcon,
    LayoutGrid,
    GraduationCap,
    Plus,
    Filter,
    Download,
    Users,
    ClipboardList
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEnquiries, useCourses } from '@/hooks'
import { EditEnquiryDialog, DeleteEnquiryDialog, AddEnquiryDialog, EnquiryKanban } from '@/components/admin/enquiry'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Enquiry, EnquiryFormData } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { ExportButton } from '@/components/shared/ExportButton'

export default function EnquiryListPage() {
    const router = useRouter()
    const { enquiries, loading, saving, fetchEnquiries, createEnquiry, updateEnquiry, deleteEnquiry } = useEnquiries()
    const { courses } = useCourses()

    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
    const [activeTab, setActiveTab] = useState('all')

    // Dialog states
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
    
    const [addFormData, setAddFormData] = useState<EnquiryFormData>({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        description: '',
        courseId: 'none',
        status: 'new',
        source: 'web'
    })
    
    const [editFormData, setEditFormData] = useState<EnquiryFormData>({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        description: '',
        courseId: 'none',
        status: 'new',
        source: 'web'
    })

    // Counts for tabs
    const counts = {
        all: enquiries.length,
        new: enquiries.filter(e => e.status === 'new').length,
        active: enquiries.filter(e => ['new', 'contacted', 'interested'].includes(e.status)).length,
        inactive: enquiries.filter(e => ['lost', 'dropped'].includes(e.status)).length,
        successful: enquiries.filter(e => e.status === 'admitted').length
    }

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.firstName.toLowerCase().includes(search.toLowerCase()) ||
            enquiry.lastName.toLowerCase().includes(search.toLowerCase()) ||
            enquiry.mobile.includes(search) ||
            (enquiry.email && enquiry.email.toLowerCase().includes(search.toLowerCase()))

        let matchesTab = true
        if (activeTab === 'new') matchesTab = enquiry.status === 'new'
        if (activeTab === 'active') matchesTab = ['new', 'contacted', 'interested'].includes(enquiry.status)
        if (activeTab === 'inactive') matchesTab = ['lost', 'dropped'].includes(enquiry.status)
        if (activeTab === 'successful') matchesTab = enquiry.status === 'admitted'

        return matchesSearch && matchesTab
    })

    const handleEdit = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry)
        setEditFormData({
            firstName: enquiry.firstName,
            lastName: enquiry.lastName,
            mobile: enquiry.mobile,
            email: enquiry.email || '',
            description: enquiry.description || '',
            courseId: enquiry.courseId || 'none',
            status: enquiry.status,
            source: enquiry.source || 'web'
        })
        setIsEditOpen(true)
    }

    const stats = [
        {
            title: 'Total Enquiries',
            value: counts.all.toString(),
            icon: ClipboardList,
            color: 'indigo' as const,
            trend: 'Total'
        },
        {
            title: 'New Opportunities',
            value: counts.new.toString(),
            icon: Plus,
            color: 'emerald' as const,
            trend: 'Fresh'
        },
        {
            title: 'Active Interest',
            value: counts.active.toString(),
            icon: Users,
            color: 'amber' as const,
            trend: 'Active'
        },
        {
            title: 'Conversion Rate',
            value: `${((counts.successful / (counts.all || 1)) * 100).toFixed(1)}%`,
            icon: GraduationCap,
            color: 'sky' as const,
            trend: 'Converted'
        }
    ]

    const onAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const dataToSubmit = {
            ...addFormData,
            courseId: addFormData.courseId === 'none' ? null : addFormData.courseId
        } as EnquiryFormData

        const success = await createEnquiry(dataToSubmit)
        if (success) {
            setIsAddOpen(false)
            setAddFormData({
                firstName: '',
                lastName: '',
                mobile: '',
                email: '',
                description: '',
                courseId: 'none',
                status: 'new',
                source: 'web'
            })
        }
    }

    const handleDelete = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry)
        setIsDeleteOpen(true)
    }

    const onEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEnquiry) return
        const dataToSubmit = {
            ...editFormData,
            courseId: editFormData.courseId === 'none' ? null : editFormData.courseId
        } as Partial<EnquiryFormData>

        const success = await updateEnquiry(selectedEnquiry.id, dataToSubmit)
        if (success) {
            setIsEditOpen(false)
        }
    }

    const onDeleteConfirm = async () => {
        if (!selectedEnquiry) return
        const success = await deleteEnquiry(selectedEnquiry.id)
        if (success) {
            setIsDeleteOpen(false)
        }
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
            <PageHeader 
                title="Enquiry Management"
                description="Track and manage student enquiries and follow-ups."
                actions={[
                    { label: 'Add New Enquiry', icon: Plus, variant: 'default', onClick: () => setIsAddOpen(true) }
                ]}
            >
                <ExportButton 
                    data={enquiries.map(e => ({
                        name: `${e.firstName} ${e.lastName}`,
                        mobile: e.mobile,
                        email: e.email || 'N/A',
                        course: e.course?.name || 'General',
                        status: e.status.toUpperCase(),
                        source: e.source || 'Direct'
                    }))}
                    columns={[
                        { header: 'Student Name', dataKey: 'name' },
                        { header: 'Mobile', dataKey: 'mobile' },
                        { header: 'Email', dataKey: 'email' },
                        { header: 'Target Course', dataKey: 'course' },
                        { header: 'Status', dataKey: 'status' },
                        { header: 'Source', dataKey: 'source' },
                    ]}
                    fileName="EduManage_Enquiries_Registry"
                    title="Student Enquiry Ledger"
                    variant="outline"
                />
            </PageHeader>

            <StatsGrid stats={stats} columns={4} />

            {/* View Mode & Tabs Bar */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                <div className="flex bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-1.5 shadow-sm">
                    {[
                        { id: 'all', label: 'All', count: counts.all },
                        { id: 'new', label: 'New', count: counts.new },
                        { id: 'active', label: 'Active', count: counts.active },
                        { id: 'inactive', label: 'Lost', count: counts.inactive },
                        { id: 'successful', label: 'Admitted', count: counts.successful },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600"
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-md",
                                activeTab === tab.id ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                            )}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <div className="relative flex-1 xl:w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        <Input
                            placeholder="Search enquiries..."
                            className="pl-11 h-12 bg-white dark:bg-gray-900 border-none shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={fetchEnquiries} 
                        className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-900 border-none shadow-sm text-indigo-600 hover:bg-indigo-50"
                    >
                        <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 w-fit">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn("h-10 w-10 rounded-xl", viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-400")}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn("h-10 w-10 rounded-xl", viewMode === 'kanban' ? "bg-white dark:bg-gray-700 shadow-sm" : "text-gray-400")}
                            onClick={() => setViewMode('kanban')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Enquiry List</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Recent enquiries and their status</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
                    {viewMode === 'kanban' ? (
                        <div className="p-8 bg-gray-50/30 dark:bg-gray-900/50 min-h-[500px]">
                            <EnquiryKanban 
                                enquiries={filteredEnquiries}
                                loading={loading}
                                onStageChange={async (id, stage) => {
                                    await updateEnquiry(id, { status: stage as any })
                                }}
                                onEdit={handleEdit}
                            />
                        </div>
                    ) : (
                        <div className="min-h-[400px] overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-none">
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Action</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Student</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Course</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Details</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Source</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">Loading enquiries...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredEnquiries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-2 opacity-50">
                                                    <Users className="h-12 w-12 mb-2" />
                                                    <p className="font-bold uppercase tracking-widest text-xs">No active enquiries found.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEnquiries.map((enquiry) => (
                                            <TableRow key={enquiry.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all border-b border-gray-50 dark:border-gray-800">
                                                <TableCell className="px-8 py-5">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800">
                                                            <DropdownMenuItem onClick={() => handleEdit(enquiry)} className="rounded-xl py-3 cursor-pointer">
                                                                Edit Enquiry Info
                                                            </DropdownMenuItem>
                                                            {enquiry.status !== 'admitted' && (
                                                                <DropdownMenuItem
                                                                    className="text-emerald-600 font-bold rounded-xl py-3 cursor-pointer"
                                                                    onClick={() => {
                                                                        const params = new URLSearchParams({
                                                                            fromEnquiry: 'true',
                                                                            enquiryId: enquiry.id,
                                                                            firstName: enquiry.firstName || '',
                                                                            lastName: enquiry.lastName || '',
                                                                            phone: enquiry.mobile || '',
                                                                            email: enquiry.email || '',
                                                                            courseId: enquiry.courseId || ''
                                                                        })
                                                                        router.push(`/admin/students/add?${params.toString()}`)
                                                                    }}
                                                                >
                                                                    <GraduationCap className="w-4 h-4 mr-2" />
                                                                    Admit as Student
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 font-bold rounded-xl py-3 cursor-pointer mt-1"
                                                                onClick={() => handleDelete(enquiry)}
                                                            >
                                                                Delete Record
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                            {enquiry.firstName} {enquiry.lastName}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-0.5">
                                                            {enquiry.branch?.name || 'Main Branch'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px] border-indigo-100 text-indigo-600 bg-indigo-50/30">
                                                        {enquiry.course?.name || 'General Inquiry'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{enquiry.mobile}</span>
                                                        <span className="text-[11px] text-gray-400">{enquiry.email || 'No email provided'}</span>
                                                        {enquiry.followUpDate && (
                                                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md w-fit">
                                                                Follow up: {new Date(enquiry.followUpDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <StatusBadge status={enquiry.status} />
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                                                        {enquiry.source || 'Direct'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing {filteredEnquiries.length} of {enquiries.length} Enquiries
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

            {/* Dialogs */}
            <AddEnquiryDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                formData={addFormData}
                courses={courses}
                onChange={setAddFormData}
                onSubmit={onAddSubmit}
                saving={saving}
            />

            <EditEnquiryDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                formData={editFormData}
                courses={courses}
                onChange={setEditFormData}
                onSubmit={onEditSubmit}
                saving={saving}
            />

            <DeleteEnquiryDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                enquiry={selectedEnquiry}
                onConfirm={onDeleteConfirm}
                saving={saving}
            />
        </div>
    )
}
