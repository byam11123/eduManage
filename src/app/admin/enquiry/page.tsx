'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
    GraduationCap
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Enquiry {
    id: string
    firstName: string
    lastName: string
    mobile: string
    email: string
    status: string
    source: string
    course: { name: string } | null
    branch: { name: string }
    createdAt: string
}

export default function EnquiryListPage() {
    const router = useRouter()
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
    const [activeTab, setActiveTab] = useState('all')

    // Counts for tabs (mocked for now, can be calculated from data)
    const counts = {
        all: enquiries.length,
        new: enquiries.filter(e => e.status === 'new').length,
        active: enquiries.filter(e => ['new', 'contacted', 'interested'].includes(e.status)).length,
        inactive: enquiries.filter(e => ['lost', 'dropped'].includes(e.status)).length,
        successful: enquiries.filter(e => e.status === 'admitted').length
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    const fetchEnquiries = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/enquiries')
            const data = await res.json()
            if (data.success) {
                setEnquiries(data.enquiries)
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.firstName.toLowerCase().includes(search.toLowerCase()) ||
            enquiry.lastName.toLowerCase().includes(search.toLowerCase()) ||
            enquiry.mobile.includes(search) ||
            (enquiry.email && enquiry.email.toLowerCase().includes(search.toLowerCase()))

        // Simple tab filtering logic
        let matchesTab = true
        if (activeTab === 'new') matchesTab = enquiry.status === 'new'
        if (activeTab === 'active') matchesTab = ['new', 'contacted', 'interested'].includes(enquiry.status)
        if (activeTab === 'inactive') matchesTab = ['lost', 'dropped'].includes(enquiry.status)
        if (activeTab === 'successful') matchesTab = enquiry.status === 'admitted'

        return matchesSearch && matchesTab
    })

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-indigo-600 font-medium">Enquiry</span>
                    <span className="text-gray-400">›</span>
                    <span>Enquiry list</span>
                </div>

                <div className="flex bg-white rounded-full border border-gray-200 p-1">
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                            viewMode === 'list' ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <ListIcon className="w-4 h-4" />
                        LIST
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                            viewMode === 'kanban' ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        KANBAN
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">

                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        {/* Refresh */}
                        <Button variant="outline" size="icon" onClick={fetchEnquiries} className="h-10 w-10 text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700">
                            <RotateCw className="h-4 w-4" />
                        </Button>

                        {/* Date Picker Placeholder */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 w-[240px] justify-start text-left font-normal text-gray-500 border-gray-200">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Select start and end date
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="p-4 text-sm text-gray-500">Date picker would go here</div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                        {/* Action Buttons */}
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium uppercase text-xs h-9">
                            STATUS
                        </Button>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium uppercase text-xs h-9">
                            ASSIGN
                        </Button>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium uppercase text-xs h-9">
                            ANNOUNCEMENT
                        </Button>

                        <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

                        {/* Chart Button */}
                        <Button variant="outline" size="icon" className="h-9 w-9 text-indigo-600 border-indigo-200 bg-indigo-50">
                            <BarChart3 className="h-4 w-4" />
                        </Button>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search"
                                className="pl-9 h-9 w-[200px] bg-white border-gray-200"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="border-b border-gray-100 px-4">
                    <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'all', label: 'ALL ENQUIRIES', count: counts.all },
                            { id: 'new', label: 'NEW ENQUIRIES', count: counts.new },
                            { id: 'active', label: 'ACTIVE', count: counts.active },
                            { id: 'inactive', label: 'INACTIVE', count: counts.inactive },
                            { id: 'successful', label: 'SUCCESSFUL LEADS', count: counts.successful },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "py-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2",
                                    activeTab === tab.id
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-sm text-[10px]",
                                    activeTab === tab.id ? "bg-indigo-100" : "bg-gray-100"
                                )}>: {tab.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Content */}
                <div className="min-h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="w-[80px] text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Serial No.</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enquiry Course</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email ID</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Manager</TableHead>
                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Group Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEnquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                                        No enquiries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEnquiries.map((enquiry, index) => (
                                    <TableRow key={enquiry.id} className="hover:bg-gray-50/50 group text-sm">
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    {enquiry.status !== 'admitted' && (
                                                        <DropdownMenuItem
                                                            className="text-emerald-600 font-medium"
                                                            onClick={() => {
                                                                const params = new URLSearchParams({
                                                                    fromEnquiry: 'true',
                                                                    enquiryId: enquiry.id,
                                                                    firstName: enquiry.firstName || '',
                                                                    lastName: enquiry.lastName || '',
                                                                    phone: enquiry.mobile || '',
                                                                    email: enquiry.email || '',
                                                                    courseId: enquiry.course?.name || ''
                                                                })
                                                                router.push(`/admin/students/add?${params.toString()}`)
                                                            }}
                                                        >
                                                            <GraduationCap className="w-4 h-4 mr-2" />
                                                            Admit as Student
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="text-gray-500">{index + 1}</TableCell>
                                        <TableCell className="uppercase font-medium text-gray-700">{enquiry.firstName} {enquiry.lastName}</TableCell>
                                        <TableCell className="text-gray-600">{enquiry.course?.name || '-'}</TableCell>
                                        <TableCell className="text-gray-600 tracking-wide font-mono text-xs">{enquiry.mobile}</TableCell>
                                        <TableCell className="text-gray-600">{enquiry.email || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 uppercase text-[10px] font-bold tracking-wider rounded-sm px-2">
                                                {enquiry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-400">-</TableCell>
                                        <TableCell className="text-gray-400">-</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / Pagination */}
                <div className="border-t border-gray-100 p-4 flex items-center justify-end gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        Rows per page:
                        <select className="border-none bg-transparent font-medium text-gray-900 focus:ring-0">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div>
                        1-{Math.min(filteredEnquiries.length, 10)} of {filteredEnquiries.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
