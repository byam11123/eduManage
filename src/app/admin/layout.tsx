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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInitials } from '@/lib/utils'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  branches: string[]
  defaultBranchId?: string
  image?: string
}

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  badge?: string
  children?: { title: string; url: string }[]
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
      title: 'Student',
      url: '/admin/students',
      icon: GraduationCap,
      children: [
        { title: 'All Students', url: '/admin/students' },
        { title: 'Add Student', url: '/admin/students/add' },
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
    {
      title: 'Courses',
      url: '/admin/courses',
      icon: BookOpen,
      children: [
        { title: 'All Courses', url: '/admin/courses' },
        { title: 'Add Course', url: '/admin/courses/add' },
      ]
    },
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
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar trigger */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            user={user}
            navItems={navItems}
            pathname={pathname}
            handleLogout={handleLogout}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-hidden">
        <SidebarContent
          user={user}
          navItems={navItems}
          pathname={pathname}
          handleLogout={handleLogout}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function SidebarContent({
  user,
  navItems,
  pathname,
  handleLogout,
  expandedItems,
  toggleExpanded
}: {
  user: User | null
  navItems: NavItem[]
  pathname: string
  handleLogout: () => void
  expandedItems: string[]
  toggleExpanded: (title: string) => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EduManage
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.includes(item.title)

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

      {/* User Footer */}
      {user && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
              <AvatarImage src={user.image || ''} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
                {getUserInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role?.replace('_', ' ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}