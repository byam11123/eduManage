'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Search,
    RotateCw,
    Users,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface Batch {
    id: string
    name: string
    startDate: string
    endDate: string
    startTime?: string
    endTime?: string
    status: string
    course: { name: string }
}

export default function BatchListPage() {
    const [batches, setBatches] = useState<Batch[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchBatches()
    }, [])

    const fetchBatches = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/batches')
            const data = await res.json()
            if (data.success) {
                setBatches(data.batches)
            }
        } catch (error) {
            console.error('Error fetching batches:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredBatches = batches.filter(batch =>
        batch.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-indigo-600 font-medium">Batch</span>
                    <span className="text-gray-400">›</span>
                    <span>Batch list</span>
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    <Link href="/admin/batch/add">
                        ADD BATCH <Users className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button variant="outline" size="icon" onClick={fetchBatches} className="h-9 w-9 text-indigo-600 border-indigo-100 bg-indigo-50">
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Select>
                            <SelectTrigger className="w-[180px] h-9 bg-gray-50 border-gray-200 text-gray-600">
                                <SelectValue placeholder="Batch Status: All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Batch Status: All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 h-9 border-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider w-[40%]">NAME</TableHead>
                            <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-8 border-l border-gray-100">INTERVAL</TableHead>
                            <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-8 border-l border-gray-100">TIME</TableHead>
                            <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-8 border-l border-gray-100">STATUS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">Loading...</TableCell>
                            </TableRow>
                        ) : filteredBatches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">No batches found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredBatches.map(batch => (
                                <TableRow key={batch.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <Link href={`/admin/batch/${batch.id}`} className="block">
                                            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                                                <Avatar className="h-8 w-8 bg-gray-100">
                                                    <AvatarFallback className="text-gray-500 text-xs font-medium">
                                                        {batch.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold text-gray-700 uppercase text-sm">
                                                    {batch.name}
                                                </span>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="pl-8 border-l border-gray-100 text-sm text-gray-500">
                                        {format(new Date(batch.startDate), 'dd/MM/yyyy')} - {format(new Date(batch.endDate), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell className="pl-8 border-l border-gray-100 text-sm text-gray-500 uppercase">
                                        {batch.startTime && batch.endTime ? (
                                            `${batch.startTime} - ${batch.endTime}`
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="pl-8 border-l border-gray-100">
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 uppercase text-[10px] ">
                                            {batch.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 flex items-center justify-end gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        Rows per page:
                        <select className="border-none bg-transparent font-medium text-gray-900 focus:ring-0">
                            <option>10</option>
                            <option>20</option>
                        </select>
                    </div>
                    <div>
                        1-{Math.min(filteredBatches.length, 10)} of {filteredBatches.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" disabled><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
