'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Download, Filter, ChevronRight, Info } from 'lucide-react'
import {
  IndianRupee,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  GraduationCap,
  UserCheck,
  UserX,
  UserMinus
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  branches: string[]
  defaultBranchId?: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

// Chart colors
const COLORS = {
  primary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  purple: '#a855f7',
}

const PIE_COLORS = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b']

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area')
  const [stats, setStats] = useState({
    totalRevenue: 125000,
    receivedAmount: 98500,
    dueAmount: 26500,
    totalStudents: 156,
    totalEmployees: 12,
    collectionRate: 78.8,
    upcomingAmount: 15000,
    overdueAmount: 11500,
  })

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/auth/me')
        const userData = await userResponse.json()
        if (userData.success && userData.user) {
          setUser(userData.user)
        }

        const orgResponse = await fetch('/api/organization')
        const orgData = await orgResponse.json()
        if (orgData.success && orgData.organization) {
          setOrganization(orgData.organization)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Monthly revenue data for charts
  const monthlyRevenueData = [
    { month: 'Jan', received: 12000, overdue: 2000, upcoming: 5000 },
    { month: 'Feb', received: 15000, overdue: 3000, upcoming: 4000 },
    { month: 'Mar', received: 18000, overdue: 2500, upcoming: 6000 },
    { month: 'Apr', received: 14000, overdue: 4000, upcoming: 5500 },
    { month: 'May', received: 20000, overdue: 3500, upcoming: 4500 },
    { month: 'Jun', received: 16000, overdue: 2000, upcoming: 3000 },
    { month: 'Jul', received: 22000, overdue: 1500, upcoming: 4000 },
    { month: 'Aug', received: 19000, overdue: 2800, upcoming: 5200 },
    { month: 'Sep', received: 21000, overdue: 2200, upcoming: 4800 },
    { month: 'Oct', received: 24000, overdue: 1800, upcoming: 3500 },
    { month: 'Nov', received: 23000, overdue: 2500, upcoming: 4200 },
    { month: 'Dec', received: 25000, overdue: 2000, upcoming: 5000 },
  ]

  // Student status data for pie chart
  const studentStatusData = [
    { name: 'Active', value: 120, color: '#22c55e' },
    { name: 'Inactive', value: 25, color: '#f59e0b' },
    { name: 'Deleted', value: 8, color: '#ef4444' },
    { name: 'Default', value: 3, color: '#6366f1' },
  ]

  // Fee status distribution
  const feeStatusData = [
    { name: 'Upcoming', amount: 45000, percentage: 36, color: '#6366f1' },
    { name: 'Overdue', amount: 26500, percentage: 21, color: '#ef4444' },
    { name: 'Received', amount: 53500, percentage: 43, color: '#22c55e' },
  ]

  // Student analytics data
  const studentAnalyticsData = [
    { name: 'Active', count: 120, percentage: 77, color: '#22c55e' },
    { name: 'Inactive', count: 25, percentage: 16, color: '#f59e0b' },
    { name: 'Defaulter', count: 11, percentage: 7, color: '#ef4444' },
  ]

  // Upcoming payments table data
  const upcomingPayments = [
    { enrollNo: 'STU001', name: 'Rahul Sharma', course: 'IIT-JEE', amount: 15000, dueDate: '2026-02-08' },
    { enrollNo: 'STU002', name: 'Priya Patel', course: 'NEET', amount: 12000, dueDate: '2026-02-09' },
    { enrollNo: 'STU003', name: 'Amit Kumar', course: 'IIT-JEE', amount: 18000, dueDate: '2026-02-10' },
  ]

  // Recent received payments
  const recentPayments = [
    { enrollNo: 'STU004', name: 'Neha Singh', course: 'NEET', amount: 15000, date: '2026-02-02' },
    { enrollNo: 'STU005', name: 'Vikram Roy', course: 'IIT-JEE', amount: 20000, date: '2026-02-01' },
    { enrollNo: 'STU006', name: 'Anita Joshi', course: 'Foundation', amount: 8000, date: '2026-01-31' },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const renderRevenueChart = () => {
    const commonProps = {
      data: monthlyRevenueData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    }

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
          <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
          <Legend />
          <Bar dataKey="received" fill={COLORS.success} name="Received" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overdue" fill={COLORS.danger} name="Overdue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="upcoming" fill={COLORS.warning} name="Upcoming" radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
          <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
          <Legend />
          <Line type="monotone" dataKey="received" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} name="Received" />
          <Line type="monotone" dataKey="overdue" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 4 }} name="Overdue" />
          <Line type="monotone" dataKey="upcoming" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 4 }} name="Upcoming" />
        </LineChart>
      )
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
        <Legend />
        <Area type="monotone" dataKey="received" stroke={COLORS.success} fillOpacity={1} fill="url(#colorReceived)" name="Received" />
        <Area type="monotone" dataKey="overdue" stroke={COLORS.danger} fillOpacity={1} fill="url(#colorOverdue)" name="Overdue" />
      </AreaChart>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Organization Info */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {organization?.name?.charAt(0) || 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {organization?.name || 'Your Organization'}
                </h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">LIVE</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="jan">January</SelectItem>
                <SelectItem value="feb">February</SelectItem>
                <SelectItem value="mar">March</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview & Statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <IndianRupee className="h-4 w-4" />{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Received Amount</p>
                  <p className="text-xl font-bold text-green-600 flex items-center">
                    <IndianRupee className="h-4 w-4" />{stats.receivedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Due Amount</p>
                  <p className="text-xl font-bold text-red-600 flex items-center">
                    <IndianRupee className="h-4 w-4" />{stats.dueAmount.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Students</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Employees</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Collection Rate</p>
                  <p className="text-xl font-bold text-emerald-600">{stats.collectionRate}%</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Section */}
        <Tabs defaultValue="student-fee" className="space-y-4">
          <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700 w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger value="student-fee" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 bg-transparent px-0 pb-3 pt-0 text-sm font-medium">
              STUDENT FEE DETAILS
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 bg-transparent px-0 pb-3 pt-0 text-sm font-medium text-gray-500">
              ATTENDANCE DETAILS
            </TabsTrigger>
            <TabsTrigger value="expenses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 bg-transparent px-0 pb-3 pt-0 text-sm font-medium text-gray-500">
              EXPENSE & WALLET DETAILS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student-fee" className="space-y-6">
            {/* Chart Type Selector & Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overdue Payment Status */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Overdue Payment Status</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" className="text-xs">
                      EXPAND <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600">Overdue amount:</span>
                    <span className="text-sm font-semibold text-red-500">₹{stats.overdueAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenueData}>
                        <defs>
                          <linearGradient id="colorOverdueArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="overdue" stroke="#ef4444" fillOpacity={1} fill="url(#colorOverdueArea)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Received Payment */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">Received Payment</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Filter className="h-3 w-3 mr-1" /> FILTER
                    </Button>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Received payment:</span>
                    <span className="text-sm font-semibold text-green-500">₹{stats.receivedAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Due Payments */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">Next 5 Days Upcoming Due Payments</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-sm text-gray-600">Due payment:</span>
                      <span className="text-sm font-semibold text-yellow-500">₹{stats.upcomingAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    <Download className="h-3 w-3 mr-1" /> EXPORT
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-2 font-medium text-gray-500">ENROLL NO</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-500">DETAILS</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-500">DUE AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingPayments.map((payment, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="py-3 px-2 text-indigo-600 font-medium">{payment.enrollNo}</td>
                            <td className="py-3 px-2">
                              <div className="font-medium text-gray-900 dark:text-white">{payment.name}</div>
                              <div className="text-xs text-gray-500">{payment.course}</div>
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-yellow-600">₹{payment.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Last 5 Days Received */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      Last 5 Days Received Payment
                      <Info className="h-4 w-4 text-gray-400" />
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-600">Received payment:</span>
                      <span className="text-sm font-semibold text-green-500">₹43,000</span>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-xs">
                    <Download className="h-3 w-3 mr-1" /> EXPORT
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-2 font-medium text-gray-500">ENROLL NO</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-500">DETAILS</th>
                          <th className="text-right py-3 px-2 font-medium text-gray-500">RECEIVED AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map((payment, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="py-3 px-2 text-indigo-600 font-medium">{payment.enrollNo}</td>
                            <td className="py-3 px-2">
                              <div className="font-medium text-gray-900 dark:text-white">{payment.name}</div>
                              <div className="text-xs text-gray-500">{payment.course}</div>
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-green-600">₹{payment.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Status & Fee Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Status Pie Chart */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Student Status</CardTitle>
                  <p className="text-xs text-gray-500">Monthly student status report</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="space-y-3 flex-1">
                      {studentStatusData.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {item.name === 'Active' && <UserCheck className="h-4 w-4 text-green-600" />}
                            {item.name === 'Inactive' && <UserMinus className="h-4 w-4 text-yellow-600" />}
                            {item.name === 'Deleted' && <UserX className="h-4 w-4 text-red-600" />}
                            {item.name === 'Default' && <Users className="h-4 w-4 text-indigo-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name} Students</p>
                            <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="w-48 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={studentStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {studentStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Status Distribution */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Fee Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feeStatusData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: item.color }}>
                          ₹{item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Student Analytics & Chart Type Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Analytics */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Student Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentAnalyticsData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-semibold" style={{ color: item.color }}>
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                            opacity: 0.2 + (item.percentage / 100) * 0.8
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Overview with Chart Type Selector */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Payment Overview</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${chartType === 'area' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'
                          }`}
                      >
                        Area
                      </button>
                      <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${chartType === 'line' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'
                          }`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'
                          }`}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderRevenueChart()}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Batch & Course Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Batch Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No data found</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Course Status</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No data found</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Attendance analytics coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Expense & wallet analytics coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EduManage Powered by <span className="font-semibold text-indigo-600">Your Company</span>
      </footer>
    </div>
  )
}