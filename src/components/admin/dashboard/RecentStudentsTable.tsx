import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, UserCircle } from 'lucide-react'
import Link from 'next/link'
import type { Student } from '@/lib/types'

interface RecentStudentsTableProps {
    students: Student[]
    loading?: boolean
}

export function RecentStudentsTable({ students, loading }: RecentStudentsTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Active</Badge>
            case 'inactive':
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Inactive</Badge>
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>
        }
    }

    return (
        <Card className="border-none shadow-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Latest Admissions</CardTitle>
                <Link href="/admin/students">
                    <Button variant="ghost" size="sm" className="text-indigo-600 gap-1 hover:bg-indigo-50">
                        View All
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                        ))
                    ) : students.length === 0 ? (
                        <p className="text-sm text-center text-gray-500 py-4">No recent students found.</p>
                    ) : (
                        students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                                        <UserCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            ID: {student.studentDisplayId || 'Pending'}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(student.status)}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
