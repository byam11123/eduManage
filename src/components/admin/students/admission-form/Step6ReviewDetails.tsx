'use client'

import { FileCheck, CreditCard, Calendar, Receipt, User, Smartphone, GraduationCap, Users } from 'lucide-react'
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

    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex items-center gap-8 shadow-2xl shadow-indigo-100 dark:shadow-none">
                <div className="h-16 w-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md shadow-inner">
                    <FileCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black tracking-tight">Review Admission Form</h3>
                    <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">Final review of student details and fee information.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Personal & Course Info */}
                <div className="space-y-10">
                    <div className="p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl shadow-gray-50 dark:shadow-none border border-gray-50 dark:border-gray-800">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            Basic Details
                        </h4>
                        <div className="grid grid-cols-2 gap-y-8 gap-x-10">
                            <div className="space-y-1">
                                <span className={labelClasses}>Student Name</span>
                                <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-indigo-600" />
                                    <p className={valueClasses}>{formData.firstName} {formData.lastName}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className={labelClasses}>Comm. Details</span>
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-3.5 w-3.5 text-indigo-600" />
                                    <p className={valueClasses}>{formData.phone}</p>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <span className={labelClasses}>Course</span>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                                    <p className={cn(valueClasses, "truncate")} title={course?.name}>{course?.name || 'NOT SELECTED'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className={labelClasses}>Batch</span>
                                <div className="flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-indigo-600" />
                                    <p className={valueClasses}>{batch?.name || 'NOT ASSIGNED'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl shadow-gray-50 dark:shadow-none border border-gray-50 dark:border-gray-800">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Fee Summary
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Fee</span>
                                    <p className="text-lg font-black text-gray-400 line-through mt-1">₹{formData.totalAmount}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Discount</span>
                                    <p className="text-lg font-black text-emerald-600 mt-1">- ₹{formData.discountAmount}</p>
                                </div>
                            </div>
                            <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-100 dark:shadow-none flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Payable Amount</span>
                                    <p className="text-3xl font-black mt-1">₹{formData.netPayableFee}</p>
                                </div>
                                <CreditCard className="h-10 w-10 opacity-20" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-5 mt-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                                Type: {formData.isPartPayment === 'yes' ? 'Installments' : 'Full Payment'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Installment Plan Summary */}
                <div className="space-y-4">
                    <div className="p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-xl shadow-gray-50 dark:shadow-none border border-gray-50 dark:border-gray-800 h-full">
                        <h4 className={sectionHeaderClasses}>
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Payment Schedule
                        </h4>

                        <div className="space-y-5 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                            {formData.isPartPayment === 'yes' ? (
                                formData.installmentPlan.map((ip, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-500",
                                        ip.status === 'paid' 
                                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30" 
                                            : "bg-gray-50/30 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800"
                                    )}>
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 shadow-inner",
                                                ip.status === 'paid' 
                                                    ? "bg-white dark:bg-gray-900 text-emerald-600 border-emerald-100 dark:border-emerald-900/30" 
                                                    : "bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800"
                                            )}>{i + 1}</div>
                                            <div>
                                                <p className={cn("text-lg font-black", ip.status === 'paid' ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white")}>₹{ip.amount}</p>
                                                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" /> Due: {ip.dueDate || 'Not Set'}
                                                </p>
                                                {ip.status === 'paid' && ip.receivedBy && (
                                                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Collected By: {ip.receivedBy}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "text-[9px] px-4 py-2 rounded-xl font-black uppercase tracking-widest",
                                            ip.status === 'paid' ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700"
                                        )}>
                                            {ip.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-[2.5rem] space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Payment Details</span>
                                            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">₹{formData.netPayableFee}</p>
                                        </div>
                                        <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                                            <FileCheck className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 mt-4 pt-8 border-t border-emerald-100 dark:border-emerald-900/20">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-emerald-600/70 block uppercase tracking-widest">Channel</span>
                                            <span className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase">{formData.paymentMode}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-emerald-600/70 block uppercase tracking-widest">Receipt No</span>
                                            <span className="text-sm font-black text-emerald-800 dark:text-emerald-400">{formData.receiptNo || 'System Generated'}</span>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <span className="text-[10px] font-black text-emerald-600/70 block uppercase tracking-widest">Collected By</span>
                                            <span className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase">{formData.receivedBy || 'Staff Member'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {formData.installmentPlan.length > 0 && formData.isPartPayment === 'yes' && (
                            <div className="mt-10 p-8 bg-gray-900 dark:bg-black rounded-[2.5rem] text-white shadow-2xl flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] opacity-50 uppercase font-black tracking-[0.3em]">No. of Installments</p>
                                    <p className="text-3xl font-black mt-1">{formData.installmentPlan.length} <span className="text-sm font-bold opacity-50">Months</span></p>
                                </div>
                                <Receipt className="w-10 h-10 opacity-20" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
