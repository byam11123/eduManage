'use client'

import React, { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { Search, Wallet, AlertCircle, Users, ClipboardList, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ReportRegistersProps {
  registers: {
    feeCollections: Array<{
      id: string
      studentId: string
      studentName: string
      course: string
      branch: string
      installmentNo: number
      paidAmount: number
      paymentMode: string
      paidDate: string
      status: string
    }>
    pendingDues: Array<{
      id: string
      studentId: string
      studentName: string
      phone: string
      branch: string
      course: string
      installmentNo: number
      totalAmount: number
      paidAmount: number
      dueAmount: number
      dueDate: string
      status: string
      isOverdue: boolean
    }>
    students: Array<{
      id: string
      studentId: string
      name: string
      email: string
      phone: string
      gender: string
      branch: string
      courses: string
      status: string
      enrollmentDate: string
    }>
    enquiries: Array<{
      id: string
      name: string
      phone: string
      email: string
      branch: string
      source: string
      status: string
      date: string
    }>
  }
}

export function ReportRegisters({ registers }: ReportRegistersProps) {
  const [activeTab, setActiveTab] = useState<'collections' | 'dues' | 'students' | 'enquiries'>('collections')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return registers.feeCollections
    const q = searchQuery.toLowerCase()
    return registers.feeCollections.filter(
      (c) =>
        c.studentName.toLowerCase().includes(q) ||
        c.studentId.toLowerCase().includes(q) ||
        c.course.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
    )
  }, [registers.feeCollections, searchQuery])

  const filteredDues = useMemo(() => {
    if (!searchQuery.trim()) return registers.pendingDues
    const q = searchQuery.toLowerCase()
    return registers.pendingDues.filter(
      (d) =>
        d.studentName.toLowerCase().includes(q) ||
        d.studentId.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.course.toLowerCase().includes(q) ||
        d.branch.toLowerCase().includes(q)
    )
  }, [registers.pendingDues, searchQuery])

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return registers.students
    const q = searchQuery.toLowerCase()
    return registers.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.courses.toLowerCase().includes(q)
    )
  }, [registers.students, searchQuery])

  const filteredEnquiries = useMemo(() => {
    if (!searchQuery.trim()) return registers.enquiries
    const q = searchQuery.toLowerCase()
    return registers.enquiries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.source.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q)
    )
  }, [registers.enquiries, searchQuery])

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/40 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold">Institutional Registers & Audits</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Live transactional records and detailed ledgers with quick search and navigation
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/50"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="bg-muted/40 p-1 mb-4">
            <TabsTrigger value="collections" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-background">
              <Wallet className="w-3.5 h-3.5" />
              Collections ({filteredCollections.length})
            </TabsTrigger>
            <TabsTrigger value="dues" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-background">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              Pending Dues ({filteredDues.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-background">
              <Users className="w-3.5 h-3.5" />
              Student Roster ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-background">
              <ClipboardList className="w-3.5 h-3.5" />
              Enquiries ({filteredEnquiries.length})
            </TabsTrigger>
          </TabsList>

          {/* 1. Collections Register */}
          <TabsContent value="collections" className="m-0">
            <div className="rounded-md border border-border/40 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Student</TableHead>
                    <TableHead className="text-xs font-semibold">Course & Branch</TableHead>
                    <TableHead className="text-xs font-semibold">Installment</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Amount Paid</TableHead>
                    <TableHead className="text-xs font-semibold">Mode</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5">
                          <div className="font-medium text-xs text-foreground">{c.studentName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{c.studentId}</div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="text-xs text-foreground">{c.course}</div>
                          <div className="text-[11px] text-muted-foreground">{c.branch}</div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            Inst #{c.installmentNo}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-medium text-xs text-emerald-400 tabular-nums">
                          {formatCurrency(c.paidAmount)}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="text-[11px] font-mono uppercase bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">
                            {c.paymentMode}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {c.paidDate ? new Date(c.paidDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                            <Link href={`/admin/fees?studentId=${c.studentId}`}>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                        No fee collection records match the criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 2. Pending Dues Register */}
          <TabsContent value="dues" className="m-0">
            <div className="rounded-md border border-border/40 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Student</TableHead>
                    <TableHead className="text-xs font-semibold">Course & Branch</TableHead>
                    <TableHead className="text-xs font-semibold">Installment</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Due Amount</TableHead>
                    <TableHead className="text-xs font-semibold">Due Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDues.length > 0 ? (
                    filteredDues.map((d) => (
                      <TableRow key={d.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5">
                          <div className="font-medium text-xs text-foreground">{d.studentName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" /> {d.phone || 'No phone'}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="text-xs text-foreground">{d.course}</div>
                          <div className="text-[11px] text-muted-foreground">{d.branch}</div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            Inst #{d.installmentNo}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-xs text-muted-foreground tabular-nums">
                          {formatCurrency(d.totalAmount)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-bold text-xs text-rose-400 tabular-nums">
                          {formatCurrency(d.dueAmount)}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {d.dueDate ? new Date(d.dueDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="py-2.5">
                          {d.isOverdue ? (
                            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px]">
                              OVERDUE
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">
                              PENDING
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button variant="outline" size="sm" asChild className="h-7 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/10">
                            <Link href={`/admin/fees?studentId=${d.studentId}`}>
                              Collect
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-xs text-muted-foreground">
                        No pending installments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 3. Students Roster */}
          <TabsContent value="students" className="m-0">
            <div className="rounded-md border border-border/40 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Student ID</TableHead>
                    <TableHead className="text-xs font-semibold">Name & Contact</TableHead>
                    <TableHead className="text-xs font-semibold">Branch</TableHead>
                    <TableHead className="text-xs font-semibold">Courses</TableHead>
                    <TableHead className="text-xs font-semibold">Enrolled On</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5 font-mono text-xs text-primary font-semibold">
                          {s.studentId}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="font-medium text-xs text-foreground">{s.name}</div>
                          <div className="text-[11px] text-muted-foreground">{s.phone}</div>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {s.branch}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-[11px]">
                            {s.courses}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge
                            className={
                              s.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]'
                                : 'bg-muted text-muted-foreground text-[10px]'
                            }
                          >
                            {s.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                            <Link href={`/admin/students/${s.id}`}>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                        No students enrolled under current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 4. Enquiries Register */}
          <TabsContent value="enquiries" className="m-0">
            <div className="rounded-md border border-border/40 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Candidate</TableHead>
                    <TableHead className="text-xs font-semibold">Contact</TableHead>
                    <TableHead className="text-xs font-semibold">Branch</TableHead>
                    <TableHead className="text-xs font-semibold">Source</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.length > 0 ? (
                    filteredEnquiries.map((e) => (
                      <TableRow key={e.id} className="hover:bg-muted/20">
                        <TableCell className="py-2.5 font-medium text-xs text-foreground">
                          {e.name}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          <div>{e.phone}</div>
                          {e.email && <div className="text-[11px] text-muted-foreground/70">{e.email}</div>}
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {e.branch}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <span className="text-[11px] capitalize bg-secondary/50 px-2 py-0.5 rounded text-foreground">
                            {e.source || 'Direct'}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-xs text-muted-foreground">
                          {e.date ? new Date(e.date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge
                            className={
                              e.status === 'admitted'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]'
                                : e.status === 'interested'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px]'
                                : 'bg-muted text-muted-foreground text-[10px]'
                            }
                          >
                            {e.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                            <Link href={`/admin/enquiry`}>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                        No enquiry records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
