import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Mail, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Enquiry } from '@/lib/types'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RecentEnquiriesTableProps {
    enquiries: Enquiry[]
    loading?: boolean
}

export function RecentEnquiriesTable({ enquiries, loading }: RecentEnquiriesTableProps) {
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    const getStatusBadge = (status: string) => {
        const baseClasses = "rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2"
        switch (status) {
            case 'interested':
                return <Badge className={cn(baseClasses, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm")}>INTERESTED</Badge>
            case 'contacted':
                return <Badge className={cn(baseClasses, "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm")}>CONTACTED</Badge>
            case 'new':
                return <Badge className={cn(baseClasses, "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shadow-sm")}>NEW</Badge>
            default:
                return <Badge variant="outline" className={cn(baseClasses, "capitalize")}>{status}</Badge>
        }
    }

    return (
        <Card className="border-none shadow-xl shadow-gray-100/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <h4 className={cn(sectionHeaderClasses, "border-none pb-0 mb-0")}>
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        Recent Enquiries
                    </h4>
                    <Link href="/admin/enquiry">
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 gap-2 transition-all">
                            VIEW ALL
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-gray-50 dark:bg-gray-800 rounded-lg" />
                                    <div className="h-3 w-24 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-50" />
                                </div>
                            </div>
                        ))
                    ) : enquiries.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No Recent Enquiries</p>
                        </div>
                    ) : (
                        enquiries.map((enq) => (
                            <div key={enq.id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-[1rem] bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900/30 group-hover:scale-110 transition-transform font-black text-[10px] tracking-widest">
                                        {enq.firstName[0]}{enq.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {enq.firstName} {enq.lastName}
                                        </p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <Phone className="h-3 w-3 text-indigo-600/50" />
                                                {enq.mobile || 'N/A'}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(enq.createdAt), 'dd MMM')}</span>
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
