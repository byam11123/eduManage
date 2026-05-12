'use client'

import { Banknote, CreditCard, Landmark, ShieldCheck, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Staff } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SalaryBankTabProps {
    staff: Staff
}

export function SalaryBankTab({ staff }: SalaryBankTabProps) {
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"
    const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block"
    const valueClasses = "text-sm font-black text-gray-900 dark:text-white"
    const cardClasses = "bg-white dark:bg-gray-900 border-none shadow-xl shadow-gray-50 dark:shadow-none rounded-[3rem] overflow-hidden"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Financial Overview & Salary Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <Card className={cn(cardClasses, "lg:col-span-8")}>
                    <CardContent className="p-10">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className={sectionHeaderClasses}>
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                Salary Details
                            </h3>
                            <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-emerald-100 dark:shadow-none">
                                PAYROLL ACTIVE
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="p-8 rounded-[2rem] bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center gap-6">
                                <div className="h-16 w-16 bg-white dark:bg-gray-900 rounded-[1.25rem] shadow-xl flex items-center justify-center shrink-0">
                                    <Banknote className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <span className={labelClasses}>Monthly Remuneration</span>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                        ₹ {staff.salaryAmount?.toLocaleString() || '0'}
                                    </p>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                                        Type: {staff.salaryType?.toUpperCase() || 'FIXED'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-8 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>Increment Eligibility</span>
                                        <p className={valueClasses}>Oct 2026</p>
                                    </div>
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className={labelClasses}>PF Enrollment</span>
                                        <p className={valueClasses}>Verified</p>
                                    </div>
                                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-4 bg-gray-900 rounded-[3rem] p-10 text-white space-y-8 flex flex-col justify-between shadow-2xl shadow-gray-200 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 blur-[80px] rounded-full" />
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <Wallet className="h-6 w-6 text-white/40" />
                            <ArrowUpRight className="h-5 w-5 text-white/40" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-2">Annual Projection</h4>
                        <p className="text-4xl font-black tracking-tighter">₹ {(Number(staff.salaryAmount) * 12).toLocaleString()}</p>
                    </div>
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Next Payout</span>
                            <span className="text-xs font-black">June 1, 2026</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[65%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Details Section */}
            <Card className={cardClasses}>
                <CardContent className="p-10">
                    <h3 className={sectionHeaderClasses}>
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        Banking Details protocol
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
                        <div className="flex items-start gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center shrink-0">
                                <Landmark className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <span className={labelClasses}>Bank Name</span>
                                <p className={valueClasses}>{staff.bankName || 'NOT_LINKED'}</p>
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">Verified Gateway</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center shrink-0">
                                <CreditCard className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <span className={labelClasses}>Account Number</span>
                                <p className={valueClasses}>{staff.accountNumber || 'N/A'}</p>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Secure Mapping</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <span className={labelClasses}>IFSC Code</span>
                                <p className={valueClasses}>{staff.ifscCode || 'N/A'}</p>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Authorized Node</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
