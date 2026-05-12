// ============================================
// ADMIN LAYOUT
// Refactored to use centralized stores and hooks
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { SidebarContent } from '@/components/admin/Sidebar'
import { useAuth, useUIStore } from '@/hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { TopNav } from '@/components/admin/TopNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    isSidebarOpen,
    setSidebarOpen,
  } = useUIStore()
  const { fetchUser } = useAuth()

  // Hydration handling
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    fetchUser()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[240px] max-w-[calc(100vw-2rem)] gap-0 border-r-0 bg-transparent p-0 shadow-none sm:max-w-none [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent isMobile={true} />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block h-full shrink-0 transition-all duration-300">
          <SidebarContent isMobile={false} />
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
