// ============================================
// RECENT STUDENTS TABLE COMPONENT
// Table showing recent student registrations
// ============================================

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Users } from 'lucide-react'
import Link from 'next/link'
import type { Student } from '@/lib/types'

interface RecentStudentsTableProps {
    students: Student[]
    loading?: boolean
    limit?: number
}

export function RecentStudentsTable({
    students,
    loading,
    limit = 5
}: RecentStudentsTableProps) {
    const displayStudents = students.slice(0, limit)

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Recent Students
                </CardTitle>
                <Link href="/admin/students">
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                        View All
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-48 flex items-center justify-center text-gray-500">
                        Loading students...
                    </div>
                ) : displayStudents.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Users className="h-8 w-8 text-gray-300" />
                        <p>No students found</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Name</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Email</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium">
                                        {student.firstName} {student.lastName}
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {student.email || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                student.status === 'active'
                                                    ? 'text-green-600 border-green-200 bg-green-50'
                                                    : 'text-gray-500 border-gray-200'
                                            }
                                        >
                                            {student.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
