import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Enquiry } from '@/lib/types'
import { format } from 'date-fns'

interface RecentEnquiriesTableProps {
    enquiries: Enquiry[]
    loading?: boolean
}

export function RecentEnquiriesTable({ enquiries, loading }: RecentEnquiriesTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'interested':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Interested</Badge>
            case 'contacted':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Contacted</Badge>
            case 'new':
                return <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200">New</Badge>
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>
        }
    }

    return (
        <Card className="border-none shadow-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Recent Enquiries</CardTitle>
                <Link href="/admin/enquiry">
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
                    ) : enquiries.length === 0 ? (
                        <p className="text-sm text-center text-gray-500 py-4">No recent enquiries found.</p>
                    ) : (
                        enquiries.map((enq) => (
                            <div key={enq.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                                        {enq.firstName[0]}{enq.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                            {enq.firstName} {enq.lastName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {enq.mobile || 'N/A'}
                                            </span>
                                            <span>•</span>
                                            <span>{format(new Date(enq.createdAt), 'dd MMM')}</span>
                                        </div>
                                    </div>
                                </div>
                                {getStatusBadge(enq.status)}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
