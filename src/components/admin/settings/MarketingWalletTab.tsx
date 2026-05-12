'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageCircle, MessageSquare, RefreshCw, Smartphone, Wallet, Zap, History, Search, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function MarketingWalletTab() {
    // Mock balances
    const balances = {
        email: 0,
        whatsappMarketing: 0,
        whatsappUtility: 0,
        text: 22
    }

    // Mock history
    const recharges = [
        { id: 1, by: 'Karomanage', medium: 'SMS', status: 'SUCCESS', amount: '₹10', date: '03/02/2026' }
    ]

    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Balances & Recharge (4 cols) */}
            <div className="space-y-10 xl:col-span-4">
                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex items-center gap-3 mb-1">
                            <Wallet className="h-4 w-4 text-indigo-600" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Marketing Wallet</p>
                        </div>
                        <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Current Balances</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-6">
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                    <Mail className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Credits</p>
                                    <p className="text-xs font-bold text-gray-500 line-clamp-1">Bulk Messaging</p>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{balances.email}</span>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4 group hover:bg-white dark:hover:bg-gray-800 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                        <MessageCircle className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Credits</p>
                                        <Info className="h-3 w-3 text-gray-300" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{balances.whatsappMarketing}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Marketing</p>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />
                            <div className="flex items-center justify-end">
                                <div className="text-right">
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{balances.whatsappUtility}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Utility</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                                    <Smartphone className="h-5 w-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SMS Credits</p>
                                    <p className="text-xs font-bold text-gray-500 line-clamp-1">Direct Texting</p>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{balances.text}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden">
                    <CardHeader className="p-10 pb-0">
                        <div className="flex items-center gap-3 mb-1">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Recharge</p>
                        </div>
                        <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recharge Now</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 flex flex-col gap-4">
                        <Button className="h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            RECHARGE EMAIL <Mail className="ml-3 h-4 w-4" />
                        </Button>
                        <Button className="h-14 bg-rose-50 dark:bg-rose-900/20 text-rose-600 border border-rose-100 dark:border-rose-800 hover:bg-rose-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            RECHARGE SMS <MessageSquare className="ml-3 h-4 w-4" />
                        </Button>
                        <Button className="h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            RECHARGE WHATSAPP <MessageCircle className="ml-3 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: History (8 cols) */}
            <div className="xl:col-span-8">
                <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden h-full flex flex-col">
                    <div className="p-10 flex-1 flex flex-col">
                        <Tabs defaultValue="recharge" className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <TabsList className="bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl h-auto gap-1">
                                    <TabsTrigger 
                                        value="recharge" 
                                        className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-gray-400 flex items-center gap-2"
                                    >
                                        <History className="h-3.5 w-3.5" />
                                        Recharge History
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="usage" 
                                        className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-gray-400 flex items-center gap-2"
                                    >
                                        <Zap className="h-3.5 w-3.5" />
                                        Usage History
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex items-center gap-4 -translate-y-2">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-indigo-600 hover:bg-indigo-50 rounded-xl">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input placeholder="Search here..." className="h-10 pl-11 w-[200px] bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold" />
                                    </div>
                                </div>
                            </div>

                            <TabsContent value="recharge" className="flex-1 animate-in fade-in-50 duration-500">
                                <div className="border border-gray-50 dark:border-gray-800 rounded-[2rem] overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recharged By</th>
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medium</th>
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {recharges.map(tx => (
                                                <tr key={tx.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-xs font-black border border-indigo-100 dark:border-indigo-800/50">
                                                                {tx.by[0]}
                                                            </div>
                                                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{tx.by}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                                            <MessageSquare className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{tx.amount}</span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tx.date}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between p-6 mt-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Records: 1</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100 dark:border-gray-800 text-gray-400" disabled>&lt;</Button>
                                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-100 dark:border-gray-800 text-gray-400" disabled>&gt;</Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="usage" className="flex-1 animate-in fade-in-50 duration-500">
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
                                    <div className="h-24 w-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center border border-gray-100 dark:border-gray-800">
                                        <History className="h-10 w-10 text-gray-200" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">No History Found</h5>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usage history will show up here.</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Card>
            </div>
        </div>
    )
}
