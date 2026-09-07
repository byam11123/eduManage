'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (!data.success || !data.user) {
          router.replace('/login')
          return
        }

        if (data.user.role === 'super_admin') {
          router.replace('/admin')
        } else if (data.user.role === 'branch_admin') {
          router.replace('/branch')
        } else {
          router.replace('/login')
        }
      } catch {
        router.replace('/login')
      }
    }

    redirect()
  }, [router])

  // Minimal loading skeleton while redirect happens
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 gap-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">EduManage</span>
      </div>

      {/* Animated bar */}
      <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '40%', animation: 'slide 1.5s ease-in-out infinite' }} />
      </div>

      <p className="text-sm text-muted-foreground">Redirecting you to your dashboard…</p>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}
