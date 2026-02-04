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
  defaultBranchId?: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
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
      // Mock data for now - will be replaced with actual API calls
      const mockUsers: User[] = [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'super_admin',
          branches: ['1', '2', '3'],
          defaultBranchId: '1',
          createdAt: '2023-01-15T00:00:00Z'
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          role: 'branch_admin',
          branches: ['1'],
          defaultBranchId: '1',
          createdAt: '2023-02-20T00:00:00Z'
        },
        {
          id: '3',
          fullName: 'Robert Johnson',
          email: 'robert@example.com',
          role: 'user',
          branches: ['2', '3'],
          defaultBranchId: '2',
          createdAt: '2023-03-10T00:00:00Z'
        }
      ]

      const mockBranches: Branch[] = [
        { id: '1', name: 'Main Campus' },
        { id: '2', name: 'Downtown Branch' },
        { id: '3', name: 'Westside Campus' }
      ]

      setUsers(mockUsers)
      setBranches(mockBranches)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleBranchChange = (branchId: string) => {
    setSelectedBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(id => id !== branchId) 
        : [...prev, branchId]
    )
  }

  const handleDefaultBranchChange = (branchId: string) => {
    setDefaultBranch(branchId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that at least one branch is selected
    if (selectedBranches.length === 0) {
      toast.error('Please select at least one branch for the user')
      return
    }

    if (!defaultBranch) {
      toast.error('Please select a default branch for the user')
      return
    }

    try {
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                branches: selectedBranches,
                defaultBranchId: defaultBranch
              } 
            : user
        )
        setUsers(updatedUsers)
        toast.success('User updated successfully')
      } else {
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          branches: selectedBranches,
          defaultBranchId: defaultBranch,
          createdAt: new Date().toISOString()
        }
        
        setUsers([...users, newUser])
        toast.success('User created successfully')
      }
      
      setOpenDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error(editingUser ? 'Failed to update user' : 'Failed to create user')
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'user'
    })
    setSelectedBranches([])
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
    setDefaultBranch(user.defaultBranchId || user.branches[0] || '')
    setOpenDialog(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const updatedUsers = users.filter(user => user.id !== userId)
        setUsers(updatedUsers)
        toast.success('User deleted successfully')
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  const getBranchNames = (branchIds: string[]) => {
    return branchIds
      .map(id => branches.find(branch => branch.id === id)?.name)
      .filter(name => name) // Remove undefined values
      .join(', ')
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and assign them to branches
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>List of all users in your organization</CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm()
                  setEditingUser(null)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Update the user information and branch assignments' 
                    : 'Create a new user and assign them to branches'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="branch_admin">Branch Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Branch Assignments</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {branches.map(branch => (
                      <div key={branch.id} className="flex items-center space-x-2">
                        <input
                          id={`branch-${branch.id}`}
                          type="checkbox"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => handleBranchChange(branch.id)}
                          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`branch-${branch.id}`} className="text-sm font-normal">
                          {branch.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultBranch">Default Branch</Label>
                  <Select value={defaultBranch} onValueChange={handleDefaultBranchChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedBranches.map(branchId => {
                        const branch = branches.find(b => b.id === branchId)
                        return branch ? (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ) : null
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Update User' : 'Create User'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Default Branch</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const defaultBranchName = branches.find(b => b.id === user.defaultBranchId)?.name || 'N/A'
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'super_admin' ? 'default' : 
                          user.role === 'branch_admin' ? 'secondary' : 'outline'
                        }>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getBranchNames(user.branches)}
                      </TableCell>
                      <TableCell>
                        {defaultBranchName}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(user.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}