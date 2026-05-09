'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Eye, CreditCard, AlertCircle, CheckCircle2, Clock, Landmark, IndianRupee, ReceiptText, ArrowUpRight } from 'lucide-react'
import type { Student, Installment } from '@/lib/types'
import { PayInstallmentDialog } from './PayInstallmentDialog'
import { ViewPaymentDialog } from './ViewPaymentDialog'
import { useRouter } from 'next/navigation'
import { calculateCourseFinancials, calculateAggregatedFinancials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PaymentDetailsTabProps {
    student: Student
    onRefresh?: () => void
}

export function PaymentDetailsTab({ student, onRefresh }: PaymentDetailsTabProps) {
    const router = useRouter()
    const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
    const [viewInstallment, setViewInstallment] = useState<Installment | null>(null)

    // 1. Get Aggregated Stats
    const studentCourses = student.studentCourses || []
    const aggregated = calculateAggregatedFinancials(studentCourses)

    // Helper to check overdue
    const isOverdue = (dateStr: string) => {
        if (!dateStr) return false
        return new Date(dateStr) < new Date()
    }

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* 1. Payment Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <SummaryCard title="Total Course Fee" value={aggregated.totalCourseFee} icon={Landmark} />
                <SummaryCard title="Total Discount" value={aggregated.totalDiscount} icon={ArrowUpRight} className="text-rose-500" prefix="- " />
                <SummaryCard title="Net Payable" value={aggregated.netPayable} icon={IndianRupee} className="bg-indigo-600 text-white shadow-2xl shadow-indigo-100 dark:shadow-none border-none" isPrimary />
                <SummaryCard title="Total Paid" value={aggregated.totalPaid} icon={CheckCircle2} className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30" />
                <SummaryCard title="Total Due" value={aggregated.totalDue} icon={AlertCircle} className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-100 dark:border-rose-900/30" />
            </div>

            {/* 2. Course Payments */}
            {studentCourses.map((courseEnrollment) => {
                const courseStats = calculateCourseFinancials(courseEnrollment)
                if (!courseStats) return null

                return (
                    <Card key={courseEnrollment.id} className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                        <CardContent className="p-10">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-gray-100 dark:border-gray-800 pb-8">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                            {courseEnrollment.course?.name || 'Course'}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Amount:</span>
                                                <span className="text-sm font-black text-indigo-600">₹{courseStats.netPayable.toLocaleString()}</span>
                                            </div>
                                            <div className="h-1 w-1 rounded-full bg-gray-200" />
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status:</span>
                                                <Badge className={cn(
                                                    "rounded-xl px-4 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm border-none",
                                                    courseStats.status === 'PAID' ? 'bg-emerald-500 text-white' :
                                                    courseStats.status === 'PARTIAL' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                                                )}>
                                                    {courseStats.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Paid</p>
                                        <p className="text-lg font-black text-emerald-600 tracking-tight">₹{courseStats.totalPaid.toLocaleString()}</p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Due</p>
                                        <p className="text-lg font-black text-rose-600 tracking-tight">₹{courseStats.totalDue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-50/50 dark:bg-gray-950/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="h-14 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">#</TableHead>
                                            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Due Date</TableHead>
                                            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Paid Date</TableHead>
                                            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Amount</TableHead>
                                            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Receipt No.</TableHead>
                                            <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</TableHead>
                                            <TableHead className="h-14 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courseStats.installments.length === 0 ? (
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableCell colSpan={7} className="text-center py-20 text-gray-400 text-xs font-black uppercase tracking-widest italic">
                                                    No installments found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            courseStats.installments.map((inst: any) => {
                                                const isPaid = inst.status === 'paid'
                                                const overdue = !isPaid && isOverdue(inst.dueDate)
                                                const dueDateVal = inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-IN') : '-'
                                                const paidDateVal = inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('en-IN') : '—'

                                                return (
                                                    <TableRow key={inst.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 border-gray-100 dark:border-gray-800 transition-colors">
                                                        <TableCell className="px-8 py-6">
                                                            <span className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                                {inst.installmentNo.toString().padStart(2, '0')}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{dueDateVal}</span>
                                                                {overdue && (
                                                                    <div className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-widest mt-0.5">
                                                                        <AlertCircle className="h-2.5 w-2.5" /> OVERDUE
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm font-black text-gray-400">
                                                                {paidDateVal}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm font-black text-gray-900 dark:text-white">
                                                                ₹ {Number(inst.amount).toLocaleString()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <ReceiptText className="h-3.5 w-3.5 text-gray-300" />
                                                                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    {inst.receiptNo || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {isPaid ? (
                                                                <Badge className="bg-emerald-500 text-white rounded-xl px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-lg shadow-emerald-100 dark:shadow-none">
                                                                    PAID
                                                                </Badge>
                                                            ) : overdue ? (
                                                                <Badge className="bg-rose-500 text-white rounded-xl px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-lg shadow-rose-100 dark:shadow-none animate-pulse">
                                                                    OVERDUE
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-amber-500 text-white rounded-xl px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-lg shadow-amber-100 dark:shadow-none">
                                                                    UNPAID
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-8 text-right">
                                                            {isPaid ? (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all"
                                                                    onClick={() => setViewInstallment(inst as Installment)}
                                                                >
                                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[9px] px-6 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.05] active:scale-95"
                                                                    onClick={() => setSelectedInstallment(inst as Installment)}
                                                                >
                                                                    PAY
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {studentCourses.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 text-gray-400 text-xs font-black uppercase tracking-widest italic">
                    No payments found.
                </div>
            )}

            {/* Pay Dialog */}
            {selectedInstallment && (
                <PayInstallmentDialog
                    isOpen={!!selectedInstallment}
                    onClose={() => setSelectedInstallment(null)}
                    installment={selectedInstallment}
                    onSuccess={() => {
                        if (onRefresh) {
                            onRefresh()
                        } else {
                            router.refresh()
                        }
                    }}
                />
            )}

            {/* View Payment Dialog */}
            {viewInstallment && (
                <ViewPaymentDialog
                    isOpen={!!viewInstallment}
                    onClose={() => setViewInstallment(null)}
                    installment={viewInstallment}
                />
            )}
        </div>
    )
}

function SummaryCard({ title, value, className, prefix = '', icon: Icon, isPrimary = false }: { title: string, value: number, className?: string, prefix?: string, icon: any, isPrimary?: boolean }) {
    return (
        <Card className={cn("border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] transition-all hover:scale-[1.02] overflow-hidden group", className)}>
            <CardContent className="p-8 relative">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110", isPrimary ? "bg-white/20 text-white" : "bg-gray-50 dark:bg-gray-800 text-indigo-600")}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h4 className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1.5", isPrimary ? "text-white/70" : "text-gray-400")}>{title}</h4>
                    <p className="text-2xl font-black tracking-tight leading-none">
                        {prefix}₹ {value.toLocaleString()}
                    </p>
                </div>
                {isPrimary && (
                    <div className="absolute top-0 right-0 h-full w-24 bg-white/5 skew-x-12 translate-x-12 pointer-events-none" />
                )}
            </CardContent>
        </Card>
    )
}
