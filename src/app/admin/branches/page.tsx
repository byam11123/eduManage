'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Branch {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  email: string
  isActive: boolean
  createdAt: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState<Omit<Branch, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    email: '',
    isActive: true
  })

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      // Mock data for now - will be replaced with actual API call
      const mockBranches: Branch[] = [
        {
          id: '1',
          name: 'Main Campus',
          description: 'Primary campus location',
          address: '123 Education St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          phone: '+1-555-123-4567',
          email: 'main@educenter.com',
          isActive: true,
          createdAt: '2023-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Downtown Branch',
          description: 'Downtown learning center',
          address: '456 Learning Ave',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10002',
          phone: '+1-555-987-6543',
          email: 'downtown@educenter.com',
          isActive: true,
          createdAt: '2023-03-22T00:00:00Z'
        },
        {
          id: '3',
          name: 'Westside Campus',
          description: 'Westside educational facility',
          address: '789 Knowledge Blvd',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10003',
          phone: '+1-555-456-7890',
          email: 'westside@educenter.com',
          isActive: false,
          createdAt: '2023-05-10T00:00:00Z'
        }
      ]
      setBranches(mockBranches)
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast.error('Failed to load branches')
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBranch) {
        // Update existing branch
        const updatedBranches = branches.map(branch => 
          branch.id === editingBranch.id 
            ? { ...branch, ...formData } 
            : branch
        )
        setBranches(updatedBranches)
        toast.success('Branch updated successfully')
      } else {
        // Create new branch
        const newBranch: Branch = {
          ...formData,
          id: `branch-${Date.now()}`,
          createdAt: new Date().toISOString()
        } as Branch
        
        setBranches([...branches, newBranch])
        toast.success('Branch created successfully')
      }
      
      setOpenDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error saving branch:', error)
      toast.error(editingBranch ? 'Failed to update branch' : 'Failed to create branch')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phone: '',
      email: '',
      isActive: true
    })
    setEditingBranch(null)
  }

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      description: branch.description || '',
      address: branch.address || '',
      city: branch.city || '',
      state: branch.state || '',
      country: branch.country || '',
      zipCode: branch.zipCode || '',
      phone: branch.phone || '',
      email: branch.email || '',
      isActive: branch.isActive
    })
    setOpenDialog(true)
  }

  const handleDelete = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        const updatedBranches = branches.filter(branch => branch.id !== branchId)
        setBranches(updatedBranches)
        toast.success('Branch deleted successfully')
      } catch (error) {
        console.error('Error deleting branch:', error)
        toast.error('Failed to delete branch')
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
        <p className="text-muted-foreground">
          Manage your organization's branches and locations
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Branches</CardTitle>
            <CardDescription>List of all branches in your organization</CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm()
                  setEditingBranch(null)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
                <DialogDescription>
                  {editingBranch 
                    ? 'Update the branch information' 
                    : 'Fill in the details for the new branch'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Branch Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleStatusChange}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive">Branch is Active</Label>
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
                    {editingBranch ? 'Update Branch' : 'Create Branch'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading branches...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>
                      {branch.city}, {branch.state}
                      <br />
                      <span className="text-xs text-muted-foreground">{branch.country}</span>
                    </TableCell>
                    <TableCell>
                      {branch.email && <div>{branch.email}</div>}
                      {branch.phone && <div className="text-xs">{branch.phone}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(branch)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(branch.id)}
                          className="text-destructive hover:text-destructive"
                        >
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