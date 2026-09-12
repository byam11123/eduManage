'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const authStr = localStorage.getItem('auth-storage')
      if (authStr) {
        const auth = JSON.parse(authStr)
        if (auth?.state?.token) {
          window.location.replace('/admin')
          return
        }
      }
    } catch {}
    window.location.replace('/login')
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
          <GraduationCap className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">EduManage</span>
      </div>
      <div className="w-32 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  )
}

