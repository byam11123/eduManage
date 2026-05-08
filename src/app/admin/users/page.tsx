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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

import { AVAILABLE_MODULES } from '@/lib/constants/modules'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
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
    // Auto-select all permissions for Super Admin
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

      toast.success(editingUser ? 'User updated' : 'User created')
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
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) {
          toast.success('User deleted')
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

  return (
    <div className="p-8 space-y-8 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase tracking-widest">User Management</h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-tighter mt-1">Control access levels and module permissions</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 dark:shadow-none">
              <Plus className="h-4 w-4 mr-2" />
              Onboard User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
            <div className="p-12 bg-white dark:bg-gray-900">
              <DialogHeader className="mb-10 text-center md:text-left">
                <DialogTitle className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">New User Onboarding</DialogTitle>
                <DialogDescription className="font-bold text-sm uppercase tracking-widest text-gray-400 mt-2">Define roles, branches, and module access permissions</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column: Personal Info & Role */}
                  <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Personal Info</Label>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Full Name" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleInputChange} 
                          required 
                          className="h-14 rounded-2xl bg-white border-2 border-gray-100 focus:border-indigo-500 font-bold px-6 text-base" 
                        />
                        <Input 
                          placeholder="Email Address" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          required 
                          className="h-14 rounded-2xl bg-[#f0f7ff] border-none font-bold px-6 text-base text-gray-700" 
                        />
                        {!editingUser && (
                          <Input 
                            placeholder="Secure Password" 
                            name="password" 
                            type="password" 
                            value={formData.password} 
                            onChange={handleInputChange} 
                            required 
                            className="h-14 rounded-2xl bg-[#f0f7ff] border-none font-bold px-6 text-base" 
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">System Role</Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-bold px-6">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-2xl p-2">
                          <SelectItem value="super_admin" className="rounded-xl py-3">Super Admin (All Access)</SelectItem>
                          <SelectItem value="branch_admin" className="rounded-xl py-3">Branch Admin</SelectItem>
                          <SelectItem value="user" className="rounded-xl py-3">Standard User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Branch Access</Label>
                      <div className="bg-[#f8fafc] p-6 rounded-[2rem] space-y-3 border border-gray-100">
                        {branches.map(branch => (
                          <label key={branch.id} className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                checked={selectedBranches.includes(branch.id)} 
                                onChange={() => handleBranchChange(branch.id)} 
                                className="peer h-5 w-5 rounded-md border-2 border-gray-200 text-indigo-600 focus:ring-0 checked:border-indigo-600 transition-all cursor-pointer" 
                              />
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">{branch.name}</span>
                          </label>
                        ))}
                        {branches.length === 0 && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase italic">No branches available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: RBAC */}
                  <div className="lg:col-span-8 space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Module Permissions (RBAC)</Label>
                    <div className="bg-[#f8fafc] p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {AVAILABLE_MODULES.map(module => (
                          <label 
                            key={module.id} 
                            className={cn(
                              "flex items-center gap-4 py-2 group cursor-pointer transition-all",
                              selectedPermissions.includes(module.id) ? "opacity-100" : "opacity-40 hover:opacity-100"
                            )}
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedPermissions.includes(module.id)} 
                              onChange={() => handlePermissionChange(module.id)} 
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0 cursor-pointer" 
                            />
                            <div className="flex items-center gap-3">
                              <span className="text-2xl filter grayscale-0 group-hover:scale-110 transition-transform">{module.icon}</span>
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap",
                                selectedPermissions.includes(module.id) ? "text-gray-900" : "text-gray-500"
                              )}>
                                {module.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        Selected: <span className="text-indigo-600">{selectedPermissions.length}</span> / {AVAILABLE_MODULES.length} Modules
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-6 pt-10 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => setOpenDialog(false)} 
                    className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button 
                    type="submit" 
                    className="h-16 px-12 rounded-[1.5rem] bg-[#5a46ff] hover:bg-[#4a36ef] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-200 border-none transition-all hover:scale-105 active:scale-95"
                  >
                    {editingUser ? 'Sync Changes' : 'Confirm Onboarding'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-black uppercase tracking-widest text-[10px] text-gray-500">Retrieving system users...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-y border-gray-50">
                  <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">User Profile</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role & Context</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Module Access</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Branches</TableHead>
                  <TableHead className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                          {user.fullName[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{user.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge variant="outline" className={cn(
                        "rounded-lg px-2.5 py-1 font-black uppercase tracking-tighter text-[9px]",
                        user.role === 'super_admin' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        user.role === 'branch_admin' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-200"
                      )}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.permissions?.length > 0 ? (
                          user.permissions.slice(0, 3).map(p => (
                            <span key={p} className="text-[9px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50/50 px-1.5 py-0.5 rounded">
                              {p}
                            </span>
                          ))
                        ) : <span className="text-[9px] text-gray-300 font-bold uppercase">No access</span>}
                        {user.permissions?.length > 3 && <span className="text-[9px] font-black text-gray-400">+{user.permissions.length - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter truncate max-w-[150px]">
                        {getBranchNames(user.branches) || 'Global'}
                      </p>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="h-9 w-9 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-9 w-9 rounded-xl text-gray-400 hover:text-destructive hover:bg-destructive/5">
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
    </div>
  )
}