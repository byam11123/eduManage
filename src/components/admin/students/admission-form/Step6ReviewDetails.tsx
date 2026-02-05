'use client'

import { FileCheck, CreditCard, Calendar, Receipt } from 'lucide-react'
import type { StudentAdmissionFormData, Course, Batch } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Step6Props {
    formData: StudentAdmissionFormData
    courses: Course[]
    batches: Batch[]
}

export function Step6ReviewDetails({
    formData,
    courses,
    batches
}: Step6Props) {
    const course = courses.find(c => c.id === formData.courseId)
    const batch = batches.find(b => b.id === formData.batchId)

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
            <div className="bg-indigo-50/50 p-6 border border-indigo-100 rounded-2xl text-indigo-900 flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-full text-indigo-600"><FileCheck className="h-5 w-5" /></div>
                <div>
                    <h3 className="font-bold">Final Verification</h3>
                    <p className="text-sm opacity-80">Please ensure all financial and personal details are correct. Once confirmed, the student record and financial schedule will be generated.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal & Course Info */}
                <div className="space-y-6">
                    <div className="p-6 border rounded-2xl bg-white space-y-4 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-gray-500 uppercase font-medium">Student Name</span>
                                <p className="text-sm font-semibold">{formData.firstName} {formData.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-gray-500 uppercase font-medium">Phone</span>
                                <p className="text-sm font-semibold">{formData.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-gray-500 uppercase font-medium">Course</span>
                                <p className="text-sm font-semibold truncate" title={course?.name}>{course?.name || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-gray-500 uppercase font-medium">Batch</span>
                                <p className="text-sm font-semibold">{batch?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border rounded-2xl bg-white space-y-6 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Financial Summary</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Course Fee</span>
                                <span className="font-medium text-gray-400 line-through">₹{formData.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                <span>Discount Apply</span>
                                <span>- ₹{formData.discountAmount}</span>
                            </div>
                            <div className="pt-3 border-t flex justify-between items-center">
                                <span className="font-bold text-gray-900">Net Payable Fee</span>
                                <span className="text-xl font-black text-indigo-600">₹{formData.netPayableFee}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                            <CreditCard className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-semibold text-indigo-700 uppercase">
                                Payment Mode: {formData.isPartPayment === 'yes' ? 'Part Payment (Installments)' : 'Full One-Time Payment'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Installment Plan Summary */}
                <div className="space-y-4">
                    <div className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Payment Schedule</h4>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {formData.isPartPayment === 'yes' ? (
                                formData.installmentPlan.map((ip, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border text-sm",
                                        ip.status === 'paid' ? "bg-green-50 border-green-100" : "bg-gray-50/50 border-gray-100"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                                                ip.status === 'paid' ? "bg-green-100 text-green-700 border-green-200" : "bg-white text-gray-400 border-gray-200"
                                            )}>{i + 1}</div>
                                            <div>
                                                <p className="font-semibold text-gray-900">₹{ip.amount}</p>
                                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5" /> Due: {ip.dueDate || 'TBD'}
                                                </p>
                                                {ip.status === 'paid' && ip.receivedBy && (
                                                    <p className="text-[9px] text-green-600 font-medium">Received by: {ip.receivedBy}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                                            ip.status === 'paid' ? "bg-green-200 text-green-800" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {ip.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-green-700 font-medium">Full Amount Received</span>
                                        <span className="font-black text-green-800">₹{formData.netPayableFee}</span>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 pt-3 border-t border-green-100">
                                        <div className="text-[10px] space-y-1">
                                            <span className="text-green-600/70 block uppercase font-bold">Mode</span>
                                            <span className="text-green-800 font-bold uppercase">{formData.paymentMode}</span>
                                        </div>
                                        <div className="text-[10px] space-y-1">
                                            <span className="text-green-600/70 block uppercase font-bold">Receipt No</span>
                                            <span className="text-green-800 font-bold">{formData.receiptNo || 'N/A'}</span>
                                        </div>
                                        <div className="text-[10px] space-y-1">
                                            <span className="text-green-600/70 block uppercase font-bold">Received By</span>
                                            <span className="text-green-800 font-bold uppercase">{formData.receivedBy || 'Staff'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {formData.installmentPlan.length > 0 && formData.isPartPayment === 'yes' && (
                            <div className="mt-4 p-4 bg-indigo-900 rounded-xl text-white">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">Total Installments</p>
                                        <p className="text-2xl font-black">{formData.installmentPlan.length}</p>
                                    </div>
                                    <Receipt className="w-8 h-8 opacity-20" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
