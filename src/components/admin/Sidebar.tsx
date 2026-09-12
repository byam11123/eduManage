'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Building2,
    LogOut,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    Calendar,
    ClipboardList,
    MessageSquare,
    FileText,
    BookOpen,
    Clock,
    Ticket,
    UserCheck,
    UserCog,
    Wallet,
    Megaphone,
    Award,
    IdCard,
    Settings,
    Share2,
    LayoutGrid,
    Compass,
    BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/lib/utils'
import { useAuth, useUIStore } from '@/hooks'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { AVAILABLE_MODULES } from '@/lib/constants/modules'

interface NavItem {
    title: string
    url: string
    icon: any
    moduleId?: typeof AVAILABLE_MODULES[number]['id']
    children?: { title: string; url: string }[]
}

export function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isLoading, logout } = useAuth()
    const {
        closeSidebar,
        sidebarExpandedItems,
        toggleSidebarItem,
        isSidebarCollapsed,
    } = useUIStore()
    const collapsed = !isMobile && isSidebarCollapsed

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const activeNavItems: NavItem[] = [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, moduleId: 'dashboard' },
        {
            title: 'Enquiry',
            url: '/admin/enquiry',
            icon: ClipboardList,
            moduleId: 'enquiry',
            children: [
                { title: 'All Enquiries', url: '/admin/enquiry' },
                { title: 'New Enquiry', url: '/admin/enquiry/add' },
            ]
        },
        { title: 'Leads', url: '/admin/leads', icon: Compass, moduleId: 'leads' },
        {
            title: 'Student',
            url: '/admin/students',
            icon: GraduationCap,
            moduleId: 'students',
            children: [
                { title: 'All Students', url: '/admin/students' },
                { title: 'Draft Admissions', url: '/admin/students/drafts' },
                { title: 'Student Admission', url: '/admin/students/add' },
            ]
        },
        { 
            title: 'ID Cards', 
            url: '/admin/id-cards', 
            icon: IdCard, 
            moduleId: 'id_cards' 
        },
        {
            title: 'Fees',
            url: '/admin/fees',
            icon: Wallet,
            moduleId: 'fees',
            children: [
                { title: 'All Installments', url: '/admin/fees' },
                { title: 'Pending Dues', url: '/admin/fees?status=pending' },
            ]
        },
        { title: 'Batch', url: '/admin/batch', icon: LayoutGrid, moduleId: 'batches' },
        {
            title: 'Attendance',
            url: '/admin/attendance',
            icon: Calendar,
            moduleId: 'attendance',
            children: [
                { title: 'Employee', url: '/admin/attendance/employee' },
                { title: 'Student', url: '/admin/attendance/student' },
            ]
        },
        { title: 'Courses', url: '/admin/courses', icon: BookOpen, moduleId: 'courses' },
        {
            title: 'Branches',
            url: '/admin/branches',
            icon: Building2,
            moduleId: 'branches',
            children: [
                { title: 'All Branches', url: '/admin/branches' },
            ]
        },
        { title: 'Staff', url: '/admin/staff', icon: UserCheck, moduleId: 'staff' },
        { title: 'Referrals', url: '/admin/referrals', icon: Share2, moduleId: 'referrals' },
        { title: 'Reports', url: '/admin/reports', icon: BarChart3, moduleId: 'reports' },
        { title: 'Users & Roles', url: '/admin/users', icon: UserCog, moduleId: 'settings' },
        { title: 'Settings', url: '/admin/settings', icon: Settings, moduleId: 'settings' },
    ]

    const upcomingNavItems: NavItem[] = [
        { title: 'Time Table', url: '/admin/timetable', icon: Clock, moduleId: 'timetable' },
        { title: 'Chat', url: '/admin/chat', icon: MessageSquare, moduleId: 'chat' },
        { title: 'Notice Board', url: '/admin/notice', icon: Megaphone, moduleId: 'notice' },
        { title: 'Tickets', url: '/admin/tickets', icon: Ticket, moduleId: 'tickets' },
        { title: 'Forms', url: '/admin/forms', icon: FileText, moduleId: 'forms' },
        { title: 'Expenses', url: '/admin/expenses', icon: Wallet, moduleId: 'expenses' },
        { title: 'Certificate', url: '/admin/certificate', icon: Award, moduleId: 'certificate' },
    ]

    // RBAC Filter
    const filterItems = (items: NavItem[]) => items.filter(item => {
        if (isLoading && !user) return true
        if (!user) return false
        if (user.role === 'super_admin') return true
        if (!item.moduleId) return true
        return user.permissions?.includes(item.moduleId)
    })

    const filteredActive = filterItems(activeNavItems)
    const filteredUpcoming = filterItems(upcomingNavItems)

    return (
        <TooltipProvider>
            <div className={cn(
                "relative flex h-full flex-col border-r border-gray-100 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950",
                isMobile ? "w-full" : "",
                collapsed ? "w-24" : "w-[240px]"
            )}>

                {/* Logo Section */}
                <div className={cn(
                    "h-20 flex items-center px-6",
                    collapsed ? "justify-center px-0" : "justify-between"
                )}>
                    <Link href="/admin" className="flex items-center gap-4 group">
                        <div className={cn(
                            "bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 dark:shadow-none group-hover:rotate-6 transition-all duration-300",
                            collapsed ? "h-14 w-14 rounded-2xl" : "h-11 w-11 rounded-2xl"
                        )}>
                            <GraduationCap aria-hidden="true" className={cn("text-white", collapsed ? "h-8 w-8" : "h-6 w-6")} />
                        </div>
                        {!collapsed && (
                            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white transition-all">
                                EduManage
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className={cn(
                    "flex-1 overflow-y-auto py-6 space-y-8 custom-scrollbar",
                    collapsed ? "px-4" : "px-3"
                )}>
                    {/* Active Modules */}
                    <div className="space-y-1.5">
                        {!collapsed && (
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 flex items-center gap-2">
                                <span className="h-1 w-1 bg-indigo-600 rounded-full" />
                                Main Menu
                            </p>
                        )}
                        {filteredActive.map((item) => renderNavItem(item, pathname, sidebarExpandedItems, toggleSidebarItem, closeSidebar, collapsed, isMobile))}
                    </div>

                    {/* Upcoming Modules */}
                    <div className="space-y-1.5">
                        {!collapsed && (
                            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 flex items-center gap-2">
                                <span className="h-1 w-1 bg-amber-500 rounded-full" />
                                More Modules
                            </p>
                        )}
                        {filteredUpcoming.map((item) => renderNavItem(item, pathname, sidebarExpandedItems, toggleSidebarItem, closeSidebar, collapsed, isMobile))}
                    </div>
                </div>

                {/* Footer Section */}
                <div className={cn(
                    "p-6 border-t border-gray-50 dark:border-gray-800",
                    collapsed ? "flex justify-center px-0 py-5" : ""
                )}>
                    <div className={cn(
                        "flex items-center gap-4 p-3 rounded-2xl bg-gray-50/80 dark:bg-gray-800/30 transition-all",
                        collapsed ? "w-16 h-16 justify-center" : "w-full"
                    )}>
                        <Avatar className={cn(
                            "border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0 ring-2 ring-indigo-50 dark:ring-indigo-900/20",
                            collapsed ? "h-11 w-11" : "h-9 w-9"
                        )}>
                            <AvatarImage src={user?.image} />
                            <AvatarFallback className="bg-indigo-600 text-white text-[10px] font-bold">
                                {getUserInitials(user?.fullName || 'U')}
                            </AvatarFallback>
                        </Avatar>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-black text-gray-900 dark:text-white truncate">
                                    {user?.fullName || 'Administrator'}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                                    {user?.role?.replace('_', ' ') || 'Super Admin'}
                                </p>
                            </div>
                        )}
                        {!collapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Logout"
                                className="h-9 w-9 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all rounded-xl focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                                onClick={handleLogout}
                            >
                                <LogOut aria-hidden="true" className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}

function renderNavItem(
    item: NavItem, 
    pathname: string, 
    sidebarExpandedItems: string[], 
    toggleSidebarItem: (title: string) => void, 
    closeSidebar: () => void, 
    collapsed: boolean,
    isMobile: boolean
) {
    const isActive = pathname === item.url || (item.url !== '/admin' && pathname?.startsWith(item.url))
    const isExpanded = sidebarExpandedItems.includes(item.title)

    if (item.children && !collapsed) {
        return (
            <div key={item.title} className="space-y-1">
                <Link
                    href={item.url}
                    onClick={() => {
                        toggleSidebarItem(item.title)
                        if (isMobile) closeSidebar()
                    }}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-2xl transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        isActive || isExpanded
                            ? 'bg-gray-50/80 text-gray-900 dark:bg-gray-800/50 dark:text-white border border-gray-100 dark:border-gray-800 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/30 hover:text-indigo-600'
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-5 w-5 items-center justify-center">
                            <item.icon aria-hidden="true" className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", (isActive || isExpanded) ? "text-indigo-600" : "text-gray-400")} />
                        </div>
                        <span className="leading-none">{item.title}</span>
                    </div>
                    <ChevronDown aria-hidden="true" className={cn("h-3.5 w-3.5 transition-transform duration-300 opacity-40", isExpanded ? "rotate-180" : "rotate-0")} />
                </Link>

                {isExpanded && (
                    <div className="mt-1 space-y-1 ml-4 border-l-2 border-gray-100 dark:border-gray-800 pl-4 animate-in slide-in-from-top-2 duration-200">
                        {item.children.map((child) => (
                            <Link
                                key={child.url}
                                href={child.url}
                                onClick={closeSidebar}
                                className={cn(
                                    "block px-4 py-2.5 text-[13px] rounded-xl transition-all duration-200 font-bold",
                                    pathname === child.url
                                        ? 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10'
                                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                                )}
                            >
                                {child.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Tooltip key={item.title}>
            <TooltipTrigger asChild>
                <Link
                    href={item.url}
                    onClick={closeSidebar}
                    className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                        collapsed ? "h-14 justify-center px-0" : "justify-start",
                        isActive
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none'
                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-indigo-600'
                    )}
                >
                    <div className={cn("flex items-center justify-center shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")}>
                        <item.icon className={cn("shrink-0 transition-transform group-hover:scale-110", collapsed ? "h-6 w-6" : "h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                    </div>
                    {!collapsed && <span className="text-[15px] font-bold tracking-tight leading-none">{item.title}</span>}
                    {isActive && collapsed && (
                        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                    )}
                </Link>
            </TooltipTrigger>
            {collapsed && (
                <TooltipContent side="right" className="bg-indigo-600 text-white border-none font-black text-[11px] py-2 px-3 shadow-2xl rounded-lg">
                    {item.title}
                </TooltipContent>
            )}
        </Tooltip>
    )
}

