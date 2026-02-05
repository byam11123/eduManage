'use client'

import { CreditCard, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Student } from '@/lib/types'

interface PaymentDetailsTabProps {
    student: Student
}

export function PaymentDetailsTab({ student }: PaymentDetailsTabProps) {
    // Mock Data based on design
    const paymentStats = {
        totalAmount: 23000,
        paid: 23000,
        due: 0,
        refund: 0,
        status: 'PAID'
    }

    const coursePayment = {
        name: student.course?.name || 'Course Name',
        amount: 23000,
        status: 'PAID',
        due: 0,
        refund: 0,
        received: 23000,
        discount: 0,
        gst: 0
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-gray-800">Payment History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Main Stats Card */}
                    <div className="bg-white border rounded-xl p-6 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">₹ {paymentStats.paid.toLocaleString()}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 uppercase font-bold tracking-wider px-3 py-1">
                            {paymentStats.status}
                        </Badge>
                    </div>

                    {/* Detailed Stats List */}
                    <div className="grid gap-4 max-w-2xl">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 font-medium">All Payment Status</span>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge className="bg-green-100 text-green-600 hover:bg-green-100 uppercase font-bold text-[10px] w-20 justify-center">
                                    {paymentStats.status}
                                </Badge>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 font-medium">Overall Course Fees</span>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 font-bold w-20 justify-center">
                                    ₹ {paymentStats.totalAmount.toLocaleString()}
                                </Badge>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500 font-medium">Grand Total Payment</span>
                                <Info className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 font-bold w-20 justify-center">
                                    ₹ {paymentStats.paid.toLocaleString()}
                                </Badge>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 font-medium">Grand Refund Payment</span>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-50 font-bold w-20 justify-center">
                                    ₹ {paymentStats.refund}
                                </Badge>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 font-medium">Total Due Payment</span>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 font-bold w-20 justify-center">
                                    ₹ {paymentStats.due}
                                </Badge>
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 font-medium">Total Received Payment</span>
                            <span className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50 font-bold w-20 justify-center">
                                    ₹ {paymentStats.paid.toLocaleString()}
                                </Badge>
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Specific Payment Card */}
            <Card className="border-none shadow-sm max-w-sm">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-medium text-gray-800 capitalize">{coursePayment.name}</h3>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 font-bold">
                                ₹ {coursePayment.amount.toLocaleString()}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge className="bg-green-100 text-green-600 hover:bg-green-100 uppercase font-bold text-[10px] w-20 justify-center">
                                    {coursePayment.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Due</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-50 font-bold w-20 justify-center">
                                    ₹ {coursePayment.due}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Refund</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50 font-bold w-20 justify-center">
                                    ₹ {coursePayment.refund}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Received</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50 font-bold w-20 justify-center">
                                    ₹ {coursePayment.received.toLocaleString()}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Discount</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 font-bold w-20 justify-center">
                                    ₹ {coursePayment.discount}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">GST</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 hover:bg-cyan-50 font-bold w-20 justify-center">
                                    ₹ {coursePayment.gst}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Certificate</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">:</span>
                                <div className="w-20 flex justify-center text-gray-600">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
