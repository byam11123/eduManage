'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, ShieldCheck, Users, Briefcase, Lock, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsGrid } from '@/components/shared/StatsGrid'
import { AVAILABLE_MODULES } from '@/lib/constants/modules'

interface Branch {
  id: string
  name: string
}

interface User {
  id: string
  fullName: string
  email: string
  role: string
  branches: string[]
  permissions: string[]
  defaultBranchId?: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [defaultBranch, setDefaultBranch] = useState<string>('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const branchRes = await fetch('/api/branches')
      const branchData = await branchRes.json()
      if (branchData.success) setBranches(branchData.branches)

      const userRes = await fetch('/api/users')
      const userData = await userRes.json()
      if (userData.success) setUsers(userData.users)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
    if (value === 'super_admin') {
      setSelectedPermissions(AVAILABLE_MODULES.map(m => m.id))
    }
  }

  const handleBranchChange = (branchId: string) => {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(id => id !== branchId) : [...prev, branchId]
    )
  }

  const handlePermissionChange = (moduleId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedBranches.length === 0) {
      toast.error('Please select at least one branch')
      return
    }

    try {
      const payload = {
        ...formData,
        branches: selectedBranches,
        defaultBranchId: defaultBranch || selectedBranches[0],
        permissions: selectedPermissions
      }

      const url = editingUser ? `/api/users?id=${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      toast.success(editingUser ? 'Access credentials synchronized' : 'User onboarded successfully')
      setOpenDialog(false)
      resetForm()
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    }
  }

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '', role: 'user' })
    setSelectedBranches([])
    setSelectedPermissions([])
    setDefaultBranch('')
    setEditingUser(null)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role
    })
    setSelectedBranches(user.branches)
    setSelectedPermissions(user.permissions || [])
    setDefaultBranch(user.defaultBranchId || user.branches[0] || '')
    setOpenDialog(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to terminate this user access?')) {
      try {
        const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          toast.success('Access terminated')
          fetchData()
        }
      } catch (error) {
        toast.error('Failed to delete')
      }
    }
  }

  const getBranchNames = (branchIds: string[]) => {
    return branchIds
      .map(id => branches.find(branch => branch.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const stats = [
    { title: 'System Personnel', value: users.length, icon: Users, color: 'indigo' as const, trend: 'Global Roster' },
    { title: 'Super Admins', value: users.filter(u => u.role === 'super_admin').length, icon: ShieldCheck, color: 'emerald' as const, trend: 'Privileged Access' },
    { title: 'Branch Operators', value: users.filter(u => u.role === 'branch_admin').length, icon: Briefcase, color: 'amber' as const, trend: 'Regional Managers' },
    { title: 'Protected Modules', value: AVAILABLE_MODULES.length, icon: Lock, color: 'sky' as const, trend: 'RBAC Active' },
  ]

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
      <PageHeader 
        title="User Access Control"
        description="Manage organizational identity, define role-based permissions, and overseer global branch access."
        actions={[
          { 
            label: 'Onboard User', 
            icon: Plus, 
            variant: 'default',
            onClick: () => { resetForm(); setOpenDialog(true); }
          }
        ]}
      />

      <StatsGrid stats={stats} columns={4} />

      {/* Controls Bar */}
      <Card className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            <Input
              placeholder="Search by name or email address..."
              className="pl-11 h-12 border-none bg-gray-50/50 dark:bg-gray-800/50 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="ghost" className="h-12 px-4 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl font-bold uppercase tracking-widest text-[10px]">
              <Filter className="w-4 h-4 mr-2" />
              Access Filters
            </Button>
            <Badge variant="secondary" className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-none font-black text-[10px] uppercase tracking-widest">
              {filteredUsers.length} Credentials
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xl font-black tracking-tight">Identity Registry</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">Verified system access logs</p>
                </div>
            </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-black uppercase tracking-widest text-[10px] text-gray-500 italic">Synchronizing registry...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 h-16 hover:bg-transparent">
                  <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">User Profile</TableHead>
                  <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Security Role</TableHead>
                  <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Module RBAC</TableHead>
                  <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Operational Scope</TableHead>
                  <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Ops</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-gray-50/30 transition-all border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
                          {user.fullName[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{user.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold lowercase tracking-tighter mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-1 font-black uppercase tracking-widest text-[9px] border",
                        user.role === 'super_admin' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        user.role === 'branch_admin' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-200"
                      )}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                        {user.permissions?.length > 0 ? (
                          user.permissions.slice(0, 4).map(p => (
                            <span key={p} className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 px-2 py-0.5 rounded-md border border-indigo-100/50">
                              {p}
                            </span>
                          ))
                        ) : <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">No access logs</span>}
                        {user.permissions?.length > 4 && <span className="text-[9px] font-black text-gray-400 flex items-center">+{user.permissions.length - 4} more</span>}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scoped Branches</span>
                        <p className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter mt-0.5 truncate max-w-[180px]">
                            {getBranchNames(user.branches) || 'Global Network'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="h-10 w-10 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-10 w-10 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Re-using Dialog for Onboarding and Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-[1400px] w-[95vw] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-950">
          <div className="p-12">
            <DialogHeader className="mb-10 text-center md:text-left">
              <DialogTitle className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                {editingUser ? 'Credential Sync' : 'System Onboarding'}
              </DialogTitle>
              <DialogDescription className="font-black text-xs uppercase tracking-[0.25em] text-gray-400 mt-2">
                Define operational scope, regional access, and module-level RBAC
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Identity Details</Label>
                    <div className="space-y-4">
                      <Input 
                        placeholder="Full Legal Name" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        required 
                        className="h-14 rounded-2xl bg-gray-50 border-none font-bold px-6 text-base" 
                      />
                      <Input 
                        placeholder="Official Email Address" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        className="h-14 rounded-2xl bg-gray-50 border-none font-bold px-6 text-base" 
                      />
                      <div className="space-y-1.5">
                        <Input 
                          placeholder={editingUser ? "New Password (Optional)" : "Temporary Access Password"} 
                          name="password" 
                          type="password" 
                          value={formData.password} 
                          onChange={handleInputChange} 
                          required={!editingUser}
                          className="h-14 rounded-2xl bg-gray-50 border-none font-bold px-6 text-base" 
                        />
                        {editingUser && (
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 pl-2">
                            Leave blank to keep current password
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Access Tier</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="h-14 rounded-2xl bg-indigo-50/50 border-none font-black uppercase tracking-widest text-[10px] px-6 text-indigo-600">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white dark:bg-gray-900">
                        <SelectItem value="super_admin" className="rounded-xl py-3 font-bold">Super Admin (Universal)</SelectItem>
                        <SelectItem value="branch_admin" className="rounded-xl py-3 font-bold">Branch Admin (Scoped)</SelectItem>
                        <SelectItem value="user" className="rounded-xl py-3 font-bold">Standard User (Limited)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Branch Jurisdiction</Label>
                    <div className="bg-gray-50 p-6 rounded-[2rem] space-y-3 border border-gray-100 max-h-[200px] overflow-y-auto">
                      {branches.map(branch => (
                        <label key={branch.id} className="flex items-center gap-4 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={selectedBranches.includes(branch.id)} 
                            onChange={() => handleBranchChange(branch.id)} 
                            className="h-5 w-5 rounded-md border-2 border-gray-200 text-indigo-600 focus:ring-0 cursor-pointer" 
                          />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{branch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Module Access Permissions (RBAC)</Label>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {AVAILABLE_MODULES.map(module => (
                        <label 
                          key={module.id} 
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border-2",
                            selectedPermissions.includes(module.id) 
                              ? "bg-white border-indigo-500 shadow-xl shadow-indigo-100 scale-[1.02]" 
                              : "bg-transparent border-transparent hover:bg-white/50"
                          )}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedPermissions.includes(module.id)} 
                            onChange={() => handlePermissionChange(module.id)} 
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0 cursor-pointer" 
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{module.icon}</span>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap",
                              selectedPermissions.includes(module.id) ? "text-indigo-600" : "text-gray-400"
                            )}>
                              {module.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-6 pt-10 border-t border-gray-100">
                <button type="button" onClick={() => setOpenDialog(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
                <Button type="submit" className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-100 border-none transition-all hover:scale-[1.02] active:scale-95">
                  {editingUser ? 'Synchronize Credentials' : 'Finalize Onboarding'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}