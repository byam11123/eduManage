'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
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
  Share2,
  Award,
  Shield,
  Settings,
  Bell,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/lib/utils'
import { TopNav } from '@/components/admin/TopNav'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  branches: string[]
  defaultBranchId?: string
  image?: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // New state for desktop collapse if needed
  const pathname = usePathname()

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (data.success && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/?view=login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const navItems: NavItem[] = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    {
      title: 'Branches',
      url: '/admin/branches',
      icon: Building2,
      children: [
        { title: 'All Branches', url: '/admin/branches' },
        { title: 'Create Branch', url: '/admin/branches/new' },
      ]
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
    {
      title: 'Attendance',
      url: '/admin/attendance',
      icon: Calendar,
      children: [
        { title: 'Mark Attendance', url: '/admin/attendance' },
        { title: 'Reports', url: '/admin/attendance/reports' },
      ]
    },
    {
      title: 'Enquiry',
      url: '/admin/enquiry',
      icon: ClipboardList,
      children: [
        { title: 'All Enquiries', url: '/admin/enquiry' },
        { title: 'New Enquiry', url: '/admin/enquiry/add' },
      ]
    },
    { title: 'Lead Management', url: '/admin/leads', icon: Users },
    { title: 'Forms', url: '/admin/forms', icon: FileText },
    { title: 'Courses', url: '/admin/courses', icon: BookOpen },
    { title: 'Batch', url: '/admin/batch', icon: Users },
    { title: 'Chat', url: '/admin/chat', icon: MessageSquare },
    { title: 'Time Table', url: '/admin/timetable', icon: Clock },
    { title: 'Coupons', url: '/admin/coupons', icon: Ticket },
    { title: 'Employee', url: '/admin/employees', icon: UserCheck },
    { title: 'Teacher', url: '/admin/teachers', icon: UserCog },
    {
      title: 'Expenses',
      url: '/admin/expenses',
      icon: Wallet,
      children: [
        { title: 'All Expenses', url: '/admin/expenses' },
        { title: 'Add Expense', url: '/admin/expenses/add' },
        { title: 'Categories', url: '/admin/expenses/categories' },
      ]
    },
    { title: 'Marketing', url: '/admin/marketing', icon: Megaphone },
    { title: 'Reference Management', url: '/admin/references', icon: Share2 },
    { title: 'Certificates', url: '/admin/certificates', icon: Award },
    { title: 'User & Permissions', url: '/admin/users', icon: Shield },
  ]

  // Render a simple layout during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduManage
              </span>
            </div>
          </div>
        </aside>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" />
          <main className="flex-1 overflow-auto" >{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar trigger handled in TopNav or here? TopNav has menu button. */}
      {/* Mobile Drawer */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r border-gray-200 dark:border-gray-800">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            navItems={navItems}
            pathname={pathname}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          user={user}
          handleLogout={handleLogout}
          onSidebarToggle={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  navItems,
  pathname,
  expandedItems,
  toggleExpanded,
  isCollapsed = false,
  toggleCollapse
}: {
  navItems: NavItem[]
  pathname: string
  expandedItems: string[]
  toggleExpanded: (title: string) => void
  isCollapsed?: boolean
  toggleCollapse?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 min-w-[2rem] rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              EduManage
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

        {/* Collapse Toggle Button - visible only on desktop passed down? Or handled here */}
        {toggleCollapse && (
          <button onClick={toggleCollapse} className="hidden lg:flex p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><ChevronDown className="h-4 w-4 rotate-90" /></div>}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3'} scrollbar-thin`}>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.includes(item.title)

            if (isCollapsed) {
              return (
                <li key={item.title} title={item.title}>
                  <Link
                    href={item.url}
                    className={`flex justify-center p-2 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.title}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children!.map((child) => (
                          <li key={child.url}>
                            <Link
                              href={child.url}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === child.url
                                ? 'text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/30'
                                }`}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      {/* Footer removed, moved to TopNav */}
    </div>
  )
}