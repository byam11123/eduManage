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
    Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/lib/utils'
import { useAuth, useBranches } from '@/hooks'
import { useUIStore } from '@/lib/stores'
import { useRouter } from 'next/navigation'

interface NavItem {
    title: string
    url: string
    icon: any
    children?: { title: string; url: string }[]
}

export function SidebarContent() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const {
        closeSidebar,
        sidebarExpandedItems,
        toggleSidebarItem
    } = useUIStore()

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const navItems: NavItem[] = [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
        {
            title: 'Enquiry',
            url: '/admin/enquiry',
            icon: ClipboardList,
            children: [
                { title: 'All Enquiries', url: '/admin/enquiry' },
                { title: 'New Enquiry', url: '/admin/enquiry/add' },
            ]
        },
        {
            title: 'Leads',
            url: '/admin/leads',
            icon: Users
        },
        {
            title: 'Student',
            url: '/admin/students',
            icon: GraduationCap,
            children: [
                { title: 'All Students', url: '/admin/students' },
                { title: 'Student Admission', url: '/admin/students/add' },
                { title: 'Bulk Upload', url: '/admin/students/upload' },
            ]
        },
        { title: 'Batch', url: '/admin/batch', icon: Users },
        {
            title: 'Attendance',
            url: '/admin/attendance',
            icon: Calendar,
            children: [
                { title: 'Employee', url: '/admin/attendance/employee' },
                { title: 'Student', url: '/admin/attendance/student' },
                { title: 'Mark Attendance', url: '/admin/attendance' },
                { title: 'Reports', url: '/admin/attendance/reports' },
            ]
        },
        { title: 'Courses', url: '/admin/courses', icon: BookOpen },
        {
            title: 'Branches',
            url: '/admin/branches',
            icon: Building2,
            children: [
                { title: 'All Branches', url: '/admin/branches' },
                { title: 'Create Branch', url: '/admin/branches/new' },
            ]
        },
        { title: 'Time Table', url: '/admin/timetable', icon: Clock },
        { title: 'Staff', url: '/admin/staff', icon: UserCheck },
        { title: 'Users & Roles', url: '/admin/users', icon: UserCog },
        { title: 'Chat', url: '/admin/chat', icon: MessageSquare },
        { title: 'Notice Board', url: '/admin/notice', icon: Megaphone },
        { title: 'Tickets', url: '/admin/tickets', icon: Ticket },
        { title: 'Forms', url: '/admin/forms', icon: FileText },
        { title: 'Expenses', url: '/admin/expenses', icon: Wallet },
        { title: 'Certificate', url: '/admin/certificate', icon: Award },
        {
            title: 'Settings',
            url: '/admin/settings/organization',
            icon: Settings,
            children: [
                { title: 'Organization Info', url: '/admin/settings/organization' },
                { title: 'Devices', url: '/admin/settings/devices' },
                { title: 'Notification', url: '/admin/settings/notification' },
            ]
        },
    ]

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        EduManage
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.url || pathname?.startsWith(item.url + '/')
                    const isExpanded = sidebarExpandedItems.includes(item.title) || (item.children && item.children.some(child => pathname === child.url))

                    if (item.children) {
                        return (
                            <div key={item.title}>
                                <button
                                    onClick={() => toggleSidebarItem(item.title)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive || isExpanded
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.url}
                                                href={child.url}
                                                onClick={closeSidebar}
                                                className={`block px-3 py-2 text-sm rounded-md transition-colors
                          ${pathname === child.url
                                                        ? 'text-indigo-600 bg-indigo-50/50 font-medium dark:text-indigo-400'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200'
                                                    }`}
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
                        <Link
                            key={item.title}
                            href={item.url}
                            onClick={closeSidebar}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Avatar className="h-9 w-9 border border-gray-200">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {getUserInitials(user?.fullName || 'User')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.fullName || 'Loading...'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.role || 'Admin'}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
