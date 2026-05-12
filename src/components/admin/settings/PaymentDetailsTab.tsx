'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Info, CreditCard, Calendar, ShieldCheck, Sparkles, Zap } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PaymentDetailsTab() {
    // Mock plan data
    const plan = {
        name: "Enterprise Demo",
        amount: "Complementary Access",
        startDate: "03/02/2026",
        expiryDate: "10/12/2026",
        status: "ACTIVE"
    }

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
            <CardContent className="p-10">
                <h4 className={sectionHeaderClasses}>
                    <CreditCard className="h-4 w-4" />
                    Payment Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="h-6 w-6 text-indigo-200 dark:text-indigo-800 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2">Active Plan</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">{plan.name}</h3>
                            <Badge className="bg-white dark:bg-gray-800 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-gray-700 shadow-sm">
                                {plan.status}
                            </Badge>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                    <Zap className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{plan.amount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Date</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{plan.startDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="h-5 w-5 text-rose-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{plan.expiryDate}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950/30 px-6 h-10 rounded-xl transition-all">
                                    Renew Now
                                </Button>
                            </div>
                        </div>

                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="w-full flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 group transition-all">
                                    <span className="text-[10px] font-black text-gray-500 group-hover:text-indigo-600 uppercase tracking-widest">Plan Features</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-data-[state=open]:rotate-180 transition-transform" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
                                <div className="mt-4 p-8 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-800/20">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            "Unlimited Users",
                                            "Detailed Reports",
                                            "Automated Backups",
                                            "Support",
                                            "Customization",
                                            "API Access"
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                                <span className="text-[10px] font-black text-indigo-700/70 dark:text-indigo-400/70 uppercase tracking-widest">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
