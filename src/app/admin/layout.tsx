// ============================================
// ADMIN LAYOUT
// Refactored to use centralized stores and hooks
// ============================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarContent } from '@/components/admin/Sidebar'
import { useUIStore } from '@/lib/stores'
import { GraduationCap, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { TopNav } from '@/components/admin/TopNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    isSidebarOpen,
    toggleSidebar,
  } = useUIStore()

  // Hydration handling
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
        {/* Mobile Header Trigger */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 sticky top-0 z-50">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">EduManage</span>
          </Link>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
        </div>

        <SheetContent side="left" className="p-0 w-80 border-r-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 h-full">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}