'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

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
  _count?: {
    students: number
  }
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/branches')
      const data = await res.json()

      if (data.success) {
        setBranches(data.branches)
      } else {
        toast.error(data.error || 'Failed to load branches')
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast.error('Failed to load branches')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      // TODO: Implement delete API
      toast.info('Delete functionality to be implemented')
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
          <Button asChild>
            <Link href="/admin/branches/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Link>
          </Button>
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
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No branches found. Create your first branch!
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
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
                        {/* Branch Student Count */}
                        <Badge variant="secondary">
                          {branch._count?.students || 0} Students
                        </Badge>
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
                          <Button variant="outline" size="sm" asChild>
                            {/* Future: /admin/branches/[id]/edit */}
                            <Link href="#" onClick={(e) => { e.preventDefault(); toast.info('Edit coming soon') }}>
                              <Edit className="h-4 w-4" />
                            </Link>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}