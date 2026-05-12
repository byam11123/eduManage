'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { 
    ArrowLeft, 
    RefreshCw, 
    User, 
    GraduationCap, 
    Wallet, 
    LayoutGrid, 
    Briefcase,
    ShieldCheck,
    CalendarCheck,
    FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStaff } from '@/hooks'
import {
    ProfileSidebar,
    StaffDetailsTab,
    QualificationTab,
    SalaryBankTab,
    DocumentsTab
} from '@/components/admin/staff/view'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const { fetchStaffById, deleteStaff, staff: allStaff, fetchStaff } = useStaff()
    const [staffMember, setStaffMember] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    const resolvedParams = use(params)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        fetchStaff()
    }, [fetchStaff])

    useEffect(() => {
        const loadStaff = async () => {
            if (resolvedParams.id) {
                const data = await fetchStaffById(resolvedParams.id)
                setStaffMember(data)
                setLoading(false)
            }
        }
        loadStaff()
    }, [resolvedParams.id, fetchStaffById])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        router.replace(`${pathname}?tab=${value}`, { scroll: false })
    }

    const handleEdit = () => {
        router.push(`/admin/staff/${staffMember.id}/edit`)
    }

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete ${staffMember.fullName}? This action cannot be undone.`)) {
            setDeleting(true)
            await deleteStaff(staffMember.id)
            setDeleting(false)
            router.push('/admin/staff')
        }
    }

    const handleRefresh = async () => {
        setLoading(true)
        if (resolvedParams.id) {
            const data = await fetchStaffById(resolvedParams.id)
            setStaffMember(data)
            setLoading(false)
        }
    }

    const currentIndex = allStaff.findIndex(s => s.id === resolvedParams.id)
    const prevStaff = currentIndex > 0 ? allStaff[currentIndex - 1] : null
    const nextStaff = currentIndex !== -1 && currentIndex < allStaff.length - 1 ? allStaff[currentIndex + 1] : null

    const handlePrev = () => {
        if (prevStaff) router.push(`/admin/staff/${prevStaff.id}?tab=${activeTab}`)
    }
    const handleNext = () => {
        if (nextStaff) router.push(`/admin/staff/${nextStaff.id}?tab=${activeTab}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-20 rounded-full animate-pulse" />
                    <div className="h-20 w-20 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl flex items-center justify-center relative border border-gray-100 dark:border-gray-800">
                        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Loading...</p>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading staff details...</p>
                </div>
            </div>
        )
    }

    if (!staffMember) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col items-center justify-center gap-8">
                <div className="h-24 w-24 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                    <LayoutGrid className="h-10 w-10 text-rose-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Staff Not Found</h2>
                    <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">The requested staff record could not be found.</p>
                </div>
                <Button 
                    onClick={() => router.push('/admin/staff')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl shadow-2xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-105"
                >
                    <ArrowLeft className="h-4 w-4 mr-3" />
                    BACK TO STAFF LIST
                </Button>
            </div>
        )
    }

    const tabTriggerClasses = "rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-100 dark:data-[state=active]:shadow-none flex items-center gap-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-8 space-y-10">
            {/* Breadcrumb Matrix */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => router.push('/admin/staff')}>STAFF</span>
                        <span className="text-gray-300">›</span>
                        <span className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={() => router.push('/admin/staff')}>STAFF LIST</span>
                        <span className="text-gray-300">›</span>
                        <span className="text-indigo-600">STAFF DETAILS</span>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => router.push('/admin/staff')}
                    className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    BACK TO LIST
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Profile Sidebar */}
                <div className="lg:col-span-3 lg:sticky lg:top-8">
                    <ProfileSidebar
                        staff={staffMember}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        hasPrev={!!prevStaff}
                        hasNext={!!nextStaff}
                        currentIndex={currentIndex}
                        totalCount={allStaff.length}
                    />
                </div>

                {/* Right Content Matrix */}
                <div className="lg:col-span-9 space-y-8">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center">
                                <Wallet className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Pay</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">₹ {staffMember.salaryAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{staffMember.designation}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center">
                                <CalendarCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joining</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{staffMember.dateOfJoining ? new Date(staffMember.dateOfJoining).getFullYear() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className="h-12 w-12 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center">
                                <FileText className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Docs Status</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">Verified</p>
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-[2.5rem] shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-50 dark:border-gray-800 mb-10 overflow-x-auto no-scrollbar">
                            <TabsList className="bg-transparent h-auto p-0 gap-2 flex justify-start">
                                <TabsTrigger value="profile" className={tabTriggerClasses}>
                                    <User className="h-3.5 w-3.5" />
                                    Personal Details
                                </TabsTrigger>
                                <TabsTrigger value="qualification" className={tabTriggerClasses}>
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Qualifications
                                </TabsTrigger>
                                <TabsTrigger value="salary" className={tabTriggerClasses}>
                                    <Wallet className="h-3.5 w-3.5" />
                                    Payroll & Bank
                                </TabsTrigger>
                                <TabsTrigger value="documents" className={tabTriggerClasses}>
                                    <FileText className="h-3.5 w-3.5" />
                                    Documents
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="min-h-[600px]">
                            <TabsContent value="profile" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <StaffDetailsTab staff={staffMember} />
                            </TabsContent>

                            <TabsContent value="qualification" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <QualificationTab staff={staffMember} />
                            </TabsContent>

                            <TabsContent value="salary" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <SalaryBankTab staff={staffMember} />
                            </TabsContent>

                            <TabsContent value="documents" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                                <DocumentsTab staff={staffMember} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
