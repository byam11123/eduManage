'use client'

import { Suspense } from 'react'
import OrganizationSettingsPage from './organization/page'
import { Loader2 } from 'lucide-react'

export default function SettingsMainPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-gray-950">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <OrganizationSettingsPage />
    </Suspense>
  )
}
