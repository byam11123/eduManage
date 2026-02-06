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
import type { Student, InstallmentPlanItem } from '@/lib/types'
import { PayInstallmentDialog } from './PayInstallmentDialog'
import { useRouter } from 'next/navigation'

interface PaymentDetailsTabProps {
    student: Student
    onRefresh?: () => void
}

export function PaymentDetailsTab({ student, onRefresh }: PaymentDetailsTabProps) {
    const router = useRouter()
    const [selectedInstallment, setSelectedInstallment] = useState<{ item: InstallmentPlanItem, index: number } | null>(null)

    // 1. Parse Installment Plan
    let installments: InstallmentPlanItem[] = []
    try {
        const parsed = student.installmentPlan ? JSON.parse(student.installmentPlan) : []
        installments = Array.isArray(parsed) ? parsed : []
    } catch (e) {
        console.error("Failed to parse installment plan", e)
        installments = []
    }

    // 2. Calculate Stats
    const grossFee = Number(student.totalAmount) || 0
    const discount = Number(student.discountAmount) || 0
    const netPayable = Number(student.netPayableFee) || (grossFee - discount)

    const totalPaid = installments.reduce((acc, item) => acc + (item.status === 'paid' ? (Number(item.paidAmount) || 0) : 0), 0)

    // Total Due is Net Payable - Total Paid
    const totalDue = Math.max(0, netPayable - totalPaid)

    // Status Logic
    let paymentStatus = 'PENDING'
    if (totalDue === 0 && totalPaid > 0) paymentStatus = 'PAID'
    else if (totalPaid > 0 && totalDue > 0) paymentStatus = 'PARTIAL'
    else if (totalPaid === 0) paymentStatus = 'DUE'

    // Helper to check overdue
    const isOverdue = (dateStr: string) => {
        if (!dateStr) return false
        return new Date(dateStr) < new Date()
    }

    return (
        <div className="space-y-6">
            {/* 1. Payment Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <SummaryCard title="Course Fee" value={grossFee} />
                <SummaryCard title="Discount" value={discount} className="text-red-600" prefix="- " />
                <SummaryCard title="Net Payable" value={netPayable} className="bg-indigo-50 border-indigo-100 text-indigo-700 font-bold" />
                <SummaryCard title="Total Paid" value={totalPaid} className="bg-green-50 border-green-100 text-green-700 font-bold" />
                <SummaryCard title="Total Due" value={totalDue} className="bg-orange-50 border-orange-100 text-orange-700 font-bold" />

                <Card className="shadow-sm border-l-4 border-l-indigo-500">
                    <CardContent className="p-4 flex flex-col justify-center h-full items-center">
                        <span className="text-xs text-gray-500 font-medium uppercase mb-1">Status</span>
                        <Badge variant={
                            paymentStatus === 'PAID' ? 'default' :
                                paymentStatus === 'PARTIAL' ? 'secondary' : 'destructive'
                        } className="font-bold">
                            {paymentStatus}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Installment Table */}
            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                        Installment Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Paid Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Receipt No.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {installments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                                        No installment plan found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                installments.map((inst, index) => {
                                    const isPaid = inst.status === 'paid'
                                    const overdue = !isPaid && isOverdue(inst.dueDate)

                                    return (
                                        <TableRow key={index} className="hover:bg-gray-50/30">
                                            <TableCell className="font-medium text-gray-500">
                                                {inst.installmentNo}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-700">{inst.dueDate}</span>
                                                    {overdue && (
                                                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                                                            <AlertCircle className="h-3 w-3" /> Overdue
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {inst.paymentDate ? inst.paymentDate : '—'}
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
                                            <TableCell className="text-right">
                                                {isPaid ? (
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4"
                                                        onClick={() => setSelectedInstallment({ item: inst, index })}
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

            {/* Pay Dialog */}
            {selectedInstallment && (
                <PayInstallmentDialog
                    isOpen={!!selectedInstallment}
                    onClose={() => setSelectedInstallment(null)}
                    studentId={student.id}
                    installment={selectedInstallment.item}
                    installmentIndex={selectedInstallment.index}
                    allInstallments={installments}
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
