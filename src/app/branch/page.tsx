'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Download, Filter, ChevronRight, Info } from 'lucide-react'
import { BranchSwitcher } from '@/components/branch-switcher'
import {
  IndianRupee,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  GraduationCap,
  UserCheck,
  UserX,
  UserMinus,
  Building2
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

interface Branch {
  id: string
  name: string
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

export default function BranchDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [currentBranchId, setCurrentBranchId] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area')
  const [statsLoading, setStatsLoading] = useState(false)
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<Array<any>>([])

  // Real stats from API
  const [stats, setStats] = useState({
    totalRevenue: 0,
    receivedAmount: 0,
    dueAmount: 0,
    totalStudents: 0,
    totalEmployees: 0,
    collectionRate: 0,
    upcomingAmount: 0,
    overdueAmount: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (data.success && data.user) {
          if (data.user.role === 'super_admin') {
            router.replace('/admin')
            return
          }

          setUser(data.user)

          // Fetch real branch details from /api/branches
          const branchRes = await fetch('/api/branches')
          const branchData = await branchRes.json()

          if (branchData.success && branchData.branches) {
            setBranches(branchData.branches)

            // Set default
            const defaultBranchId = data.user.defaultBranchId || (branchData.branches[0]?.id)
            setCurrentBranchId(defaultBranchId || '')
          }
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error('[Branch] Error fetching data:', error)
        router.replace('/login')
      }
    }

    fetchUserData()
  }, [router])

  // Fetch real stats whenever branch changes
  useEffect(() => {
    if (!currentBranchId) return
    const fetchData = async () => {
      setStatsLoading(true)
      try {
        // Fetch Stats
        const res = await fetch(`/api/dashboard/stats?branchId=${currentBranchId}`)
        const data = await res.json()
        if (data.success && data.stats) {
          const s = data.stats
          const total = (s.totalRevenue ?? 0)
          const received = (s.totalCollected ?? 0)
          setStats({
            totalRevenue: total,
            receivedAmount: received,
            dueAmount: total - received,
            totalStudents: s.totalStudents ?? 0,
            totalEmployees: s.totalStaff ?? 0,
            collectionRate: total > 0 ? Math.round((received / total) * 100 * 10) / 10 : 0,
            upcomingAmount: s.upcomingAmount ?? 0,
            overdueAmount: s.overdueAmount ?? 0,
          })
        }

        // Fetch Revenue for Charts
        const revRes = await fetch(`/api/dashboard/revenue?branchId=${currentBranchId}`)
        const revData = await revRes.json()
        if (revData.success && revData.data) {
          // The API currently returns { name: 'Jan', revenue: 1000 }
          // Branch charts expect { month: 'Jan', received: 1000, overdue: 0, upcoming: 0 }
          const formatted = revData.data.map((r: any) => ({
             month: r.name,
             received: r.revenue,
             overdue: 0, // Mock for now as API doesn't return overdue/upcoming per month yet
             upcoming: 0
          }))
          setMonthlyRevenueData(formatted)
        }
      } catch (err) {
        console.error('[Branch] Fetch error:', err)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchData()
  }, [currentBranchId])


  const handleBranchChange = (branchId: string) => {
    setCurrentBranchId(branchId)
  }

  // Chart data uses real stats for the summary view
  // (Monthly detailed breakdown requires /api/dashboard/revenue which uses org-level data)
  const studentStatusData = [
    { name: 'Active', value: stats.totalStudents, color: '#6366f1' },
  ]

  const feeStatusData = [
    { name: 'Received', amount: stats.receivedAmount, percentage: stats.totalRevenue > 0 ? Math.round((stats.receivedAmount / stats.totalRevenue) * 100) : 0, color: '#6366f1' },
    { name: 'Overdue', amount: stats.overdueAmount, percentage: stats.totalRevenue > 0 ? Math.round((stats.overdueAmount / stats.totalRevenue) * 100) : 0, color: '#ef4444' },
    { name: 'Upcoming', amount: stats.upcomingAmount, percentage: stats.totalRevenue > 0 ? Math.round((stats.upcomingAmount / stats.totalRevenue) * 100) : 0, color: '#f59e0b' },
  ]

  const studentAnalyticsData = [
    { name: 'Active', count: stats.totalStudents, percentage: 100, color: '#6366f1' },
  ]

  // NOTE: Upcoming payments and recent payments require dedicated endpoints
  const upcomingPayments: Array<{ enrollNo: string; name: string; course: string; amount: number; dueDate: string }> = []
  const recentPayments: Array<{ enrollNo: string; name: string; course: string; amount: number; date: string }> = []


  const currentBranchName = branches.find(b => b.id === currentBranchId)?.name || 'Branch Dashboard'
  const firstLetter = currentBranchName.charAt(0)

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-12">
      {/* Header with Branch Switcher */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {firstLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {currentBranchName}
                </h2>
                <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">ACTIVE</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Integrated Branch Switcher */}
            {branches.length > 0 && (
              <BranchSwitcher
                branches={branches}
                currentBranchId={currentBranchId}
                onBranchChange={handleBranchChange}
              />
            )}

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

      <div className="p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Branch Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Overview & Statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Branch Revenue</p>
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

          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Received</p>
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

          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
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

          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Students</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teachers</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Collection</p>
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold">Received Payment</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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
              <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
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