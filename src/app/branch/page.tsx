'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, DollarSign, Calendar } from 'lucide-react'
import { BranchSwitcher } from '@/components/branch-switcher'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  branches: string[]
  defaultBranchId?: string
}

interface Branch {
  id: string
  name: string
}

export default function BranchDashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [currentBranchId, setCurrentBranchId] = useState<string>('')
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    monthlyRevenue: 0
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (data.success && data.user) {
          // Check if user is super admin and redirect to admin panel
          if (data.user.role === 'super_admin') {
            console.log('[Branch Dashboard] Super admin detected, redirecting to /admin')
            window.location.href = '/admin'
            return
          }
          
          setUser(data.user)
          
          // Get branches for the user
          const userBranches = await Promise.all(
            data.user.branches.map(async (branchId: string) => {
              // In a real app, this would come from an API call
              // For now, we'll create mock branch data
              return {
                id: branchId,
                name: `Branch ${branchId}`
              }
            })
          )
          
          setBranches(userBranches)
          
          // Set current branch to default or first available
          const defaultBranchId = data.user.defaultBranchId || data.user.branches[0]
          setCurrentBranchId(defaultBranchId || '')
        } else {
          console.error('[Branch Dashboard] User not authenticated')
          // Redirect to login if not authenticated
          window.location.href = '/?view=login'
          return
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        // Redirect to login if not authenticated
        window.location.href = '/?view=login'
        return
      }
    }

    fetchUserData()
  }, [])

  // Update stats when branch changes
  useEffect(() => {
    if (currentBranchId) {
      // In a real app, this would fetch branch-specific data
      setStats({
        totalStudents: 42,
        totalTeachers: 8,
        activeCourses: 12,
        monthlyRevenue: 8500
      })
    }
  }, [currentBranchId])

  const handleBranchChange = (branchId: string) => {
    setCurrentBranchId(branchId)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branch Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.fullName || 'User'}. Manage your branch operations.
            </p>
          </div>
          {branches.length > 0 && (
            <BranchSwitcher 
              branches={branches} 
              currentBranchId={currentBranchId} 
              onBranchChange={handleBranchChange} 
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent branch activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">New student enrolled</p>
                  <p className="text-xs text-muted-foreground">John Smith - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Course updated</p>
                  <p className="text-xs text-muted-foreground">Mathematics 101 - 5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Teacher added</p>
                  <p className="text-xs text-muted-foreground">Dr. Jane Doe - Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform common branch tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Manage Students</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Manage Teachers</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Courses</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors">
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <span className="font-medium">Finances</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}