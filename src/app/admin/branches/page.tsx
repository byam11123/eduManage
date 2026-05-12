'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Loader2, 
  Building2, 
  Globe, 
  Users,
  LayoutGrid
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBranches } from '@/hooks'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { cn } from '@/lib/utils'
import { ExportButton } from '@/components/shared/ExportButton'

export default function BranchesPage() {
  const router = useRouter()
  const {
    branches,
    loading,
    deleteBranch,
    stats
  } = useBranches()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      setDeletingId(branchId)
      const success = await deleteBranch(branchId)
      if (success) {
        toast.success('Branch deleted successfully')
      } else {
        toast.error('Failed to delete branch')
      }
      setDeletingId(null)
    }
  }

  const handleEdit = (branchId: string) => {
    router.push(`/admin/branches/${branchId}/edit`)
  }

  const branchStats = [
    { title: 'Total Branches', value: stats.total, icon: Building2, color: 'indigo' as const, trend: 'Global Network' },
    { title: 'Active Locations', value: stats.active, icon: Globe, color: 'emerald' as const, trend: 'Operational' },
    { title: 'Aggregate Students', value: stats.totalStudents, icon: Users, color: 'amber' as const, trend: 'System Wide' },
    { title: 'Inactive', value: stats.total - stats.active, icon: MapPin, color: 'rose' as const, trend: 'Maintenance' },
  ]

  return (
    <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
      <PageHeader 
        title="Branch Management"
        description="Oversee regional operations, coordinate location-specific resources, and manage institutional expansion."
        actions={[
          { label: 'Register New Branch', icon: Plus, variant: 'default', href: '/admin/branches/new' }
        ]}
      >
        <ExportButton 
            data={branches.map(b => ({
                name: b.name,
                city: b.city,
                state: b.state,
                country: b.country,
                email: b.email || 'N/A',
                phone: b.phone || 'N/A',
                students: b._count?.students || 0,
                status: b.isActive ? 'ACTIVE' : 'INACTIVE'
            }))}
            columns={[
                { header: 'Branch Name', dataKey: 'name' },
                { header: 'City', dataKey: 'city' },
                { header: 'State', dataKey: 'state' },
                { header: 'Email', dataKey: 'email' },
                { header: 'Phone', dataKey: 'phone' },
                { header: 'Students', dataKey: 'students' },
                { header: 'Status', dataKey: 'status' },
            ]}
            fileName="EduManage_Branch_Registry"
            title="Institutional Regional Network Report"
            variant="outline"
        />
      </PageHeader>

      <StatsGrid stats={branchStats} columns={4} />

      <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Institutional Network</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Directory of all registered regional centers</p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Synchronizing branch registry...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-50 dark:border-gray-800 hover:bg-transparent">
                    <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-widest text-gray-400 pl-8">Action</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Branch Details</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Geo-Location</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400">Communication</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Enrollment</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 opacity-50">
                          <LayoutGrid className="h-12 w-12 text-gray-300" />
                          <p className="font-black text-xs uppercase tracking-widest text-gray-400">No regional centers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    branches.map((branch) => (
                      <TableRow key={branch.id} className="group border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 transition-all">
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(branch.id)}
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(branch.id)}
                              disabled={deletingId === branch.id}
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            >
                              {deletingId === branch.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-gray-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">
                              {branch.name}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 mt-0.5">
                              ID: {branch.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                {branch.city}, {branch.state}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{branch.country}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            {branch.email && (
                              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                                <Mail className="h-3 w-3" />
                                <span>{branch.email}</span>
                              </div>
                            )}
                            {branch.phone && (
                              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{branch.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-black text-gray-700 dark:text-gray-200">
                              {branch._count?.students || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge variant="outline" className={cn(
                            "rounded-lg font-black text-[10px] px-2 py-0.5 uppercase tracking-widest border",
                            branch.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-gray-50 text-gray-700 border-gray-100'
                          )}>
                            {branch.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Institutional Directory {branches.length} Entries
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </Card>
    </div>
  )
}