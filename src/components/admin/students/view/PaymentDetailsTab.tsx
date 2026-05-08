'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Eye, CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import type { Student, StudentCourse, Installment } from '@/lib/types'
import { PayInstallmentDialog } from './PayInstallmentDialog'
import { useRouter } from 'next/navigation'
import { calculateCourseFinancials, calculateAggregatedFinancials } from '@/lib/utils'

interface PaymentDetailsTabProps {
    student: Student
    onRefresh?: () => void
}

export function PaymentDetailsTab({ student, onRefresh }: PaymentDetailsTabProps) {
    const router = useRouter()
    const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)

    // 1. Get Aggregated Stats
    const studentCourses = student.studentCourses || []
    const aggregated = calculateAggregatedFinancials(studentCourses)

    // Helper to check overdue
    const isOverdue = (dateStr: string) => {
        if (!dateStr) return false
        return new Date(dateStr) < new Date()
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 1. Global Payment Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SummaryCard title="Total Course Fee" value={aggregated.totalCourseFee} />
                <SummaryCard title="Total Discount" value={aggregated.totalDiscount} className="text-red-600" prefix="- " />
                <SummaryCard title="Net Payable" value={aggregated.netPayable} className="bg-indigo-50 border-indigo-100 text-indigo-700 font-bold" />
                <SummaryCard title="Total Paid" value={aggregated.totalPaid} className="bg-green-50 border-green-100 text-green-700 font-bold" />
                <SummaryCard title="Total Due" value={aggregated.totalDue} className="bg-orange-50 border-orange-100 text-orange-700 font-bold" />
            </div>

            {/* 2. Course-wise Breakdown */}
            {studentCourses.map((courseEnrollment) => {
                const courseStats = calculateCourseFinancials(courseEnrollment)
                if (!courseStats) return null

                return (
                    <Card key={courseEnrollment.id} className="border border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 py-4 px-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-md">
                                        <CreditCard className="h-5 w-5 text-indigo-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold text-gray-900">
                                            {courseEnrollment.course?.name || 'Unknown Course'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            <span>Fee: ₹{courseStats.grossFee.toLocaleString()}</span>
                                            {courseStats.discount > 0 && (
                                                <span className="text-red-600">(-₹{courseStats.discount.toLocaleString()})</span>
                                            )}
                                            <span className="font-semibold text-gray-700">Net: ₹{courseStats.netPayable.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={
                                    courseStats.status === 'PAID' ? 'default' :
                                        courseStats.status === 'PARTIAL' ? 'secondary' : 'destructive'
                                } className="uppercase tracking-wide font-bold">
                                    {courseStats.status}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-white hover:bg-white">
                                        <TableHead className="w-[50px] pl-6">#</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Paid Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Receipt No.</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseStats.installments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-gray-500 italic">
                                                No installment plan generated for this course.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        courseStats.installments.map((inst: any, index: number) => {
                                            const isPaid = inst.status === 'paid'
                                            const overdue = !isPaid && isOverdue(inst.dueDate)
                                            // Handle potential string vs date object from API
                                            const dueDateVal = inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-IN') : '-'
                                            const paidDateVal = inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('en-IN') : '—'

                                            return (
                                                <TableRow key={inst.id} className="hover:bg-gray-50/30">
                                                    <TableCell className="font-medium text-gray-500 pl-6">
                                                        {inst.installmentNo}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-700">{dueDateVal}</span>
                                                            {overdue && (
                                                                <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                                                                    <AlertCircle className="h-3 w-3" /> Overdue
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500">
                                                        {paidDateVal}
                                                    </TableCell>
                                                    <TableCell className="font-bold text-gray-800">
                                                        ₹ {Number(inst.amount).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-gray-500">
                                                        {inst.receiptNo || '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isPaid ? (
                                                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 uppercase text-[10px] gap-1 pl-1">
                                                                <CheckCircle2 className="h-3 w-3" /> PAID
                                                            </Badge>
                                                        ) : overdue ? (
                                                            <Badge variant="destructive" className="uppercase text-[10px] gap-1 pl-1">
                                                                <AlertCircle className="h-3 w-3" /> OVERDUE
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200 uppercase text-[10px] gap-1 pl-1">
                                                                <Clock className="h-3 w-3" /> PENDING
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        {isPaid ? (
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4"
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
                        </CardContent>
                    </Card>
                )
            })}

            {studentCourses.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    No active course enrollments found for this student.
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
        </div>
    )
}

function SummaryCard({ title, value, className, prefix = '' }: { title: string, value: number, className?: string, prefix?: string }) {
    return (
        <Card className={`shadow-sm ${className}`}>
            <CardContent className="p-4">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">{title}</div>
                <div className="text-xl font-bold">
                    {prefix}₹ {value.toLocaleString()}
                </div>
            </CardContent>
        </Card>
    )
}
