'use client'

import { useEffect, useState } from 'react'
import { Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function DashboardPage() {
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [joinedDate, setJoinedDate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user data only once on mount
    const fetchUserData = async () => {
      try {
        console.log('[Dashboard] Fetching user data...')
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        console.log('[Dashboard] Response:', data)

        if (data.success && data.user) {
          // Check if user is super admin and redirect to admin panel
          if (data.user.role === 'super_admin') {
            console.log('[Dashboard] Super admin detected, redirecting to /admin')
            window.location.href = '/admin'
            return
          } else if (data.user.role === 'branch_admin') {
            console.log('[Dashboard] Branch admin detected, redirecting to /branch')
            window.location.href = '/branch'
            return
          }

          setFullName(data.user.fullName || '')
          setEmail(data.user.email || '')

          if (data.user.createdAt) {
            setJoinedDate(format(new Date(data.user.createdAt), 'MMMM dd, yyyy'))
          }
        } else {
          console.error('[Dashboard] User not authenticated')
          // Redirect to login if not authenticated
          window.location.href = '/?view=login'
          return
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching user:', err)
        // Redirect to login on error
        window.location.href = '/?view=login'
        return
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = async () => {
    try {
      console.log('[Dashboard] Logging out...')
      await fetch('/api/auth/logout', { method: 'POST' })
      // Simple navigation to login page
      window.location.href = '/?view=login'
    } catch (err) {
      console.error('[Dashboard] Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6">
          <h1 className="text-2xl font-bold text-white text-center">
            Profile
          </h1>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <p className="text-lg font-semibold text-foreground">
              {fullName || 'Not available'}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-base text-foreground">
              {email || 'Not available'}
            </p>
          </div>

          {/* Joined Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Joined
            </label>
            <p className="text-base text-foreground">
              {joinedDate || 'Not available'}
            </p>
          </div>

          {/* Last Activity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Last Activity
            </label>
            <p className="text-base text-foreground">
              Just now
            </p>
          </div>

          {/* Logout Button */}
          <div className="space-y-3">
            <Button
              onClick={() => (window.location.href = '/organization')}
              variant="outline"
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Organization Settings
            </Button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        © {new Date().getFullYear()} Coaching Management System
      </p>
    </div>
  )
}
