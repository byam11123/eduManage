'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBranches } from '@/hooks'

export default function BranchesPage() {
  const router = useRouter()
  const {
    branches,
    loading,
    deleteBranch,
    fetchBranches
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
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/admin/branches/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold">{branch.name}</span>
                          {branch.description && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{branch.description}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 mt-0.5" />
                          <span>
                            {branch.city}, {branch.state}
                            <br />
                            <span className="text-xs text-muted-foreground">{branch.country}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {branch.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span>{branch.email}</span>
                            </div>
                          )}
                          {branch.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span>{branch.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {branch._count?.students || 0} Students
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={branch.isActive ? 'default' : 'secondary'} className={branch.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700'}>
                          {branch.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(branch.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(branch.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(branch.id)}
                            disabled={deletingId === branch.id}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            {deletingId === branch.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
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