'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageCircle, MessageSquare, RefreshCw, Smartphone } from "lucide-react"

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Balances & Recharge */}
            <div className="space-y-6 lg:col-span-1">
                <Card className="border-none shadow-sm drop-shadow-sm h-fit">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">Current Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <div className="font-semibold text-gray-700 dark:text-gray-300">Bulk Email Messaging Service</div>
                                <div className="text-xs text-gray-500">Remaining Email Messages</div>
                            </div>
                            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{balances.email}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <div className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                    WhatsApp <InfoIcon className="h-3 w-3 text-gray-400" />
                                </div>
                                <div className="text-xs text-gray-500">Remaining WhatsApp MARKETING Messages</div>
                                <div className="text-[10px] text-gray-400 text-center font-medium my-0.5">OR</div>
                                <div className="text-xs text-gray-500">Remaining WhatsApp UTILITY Messages</div>
                            </div>
                            <div className="text-right font-mono font-bold text-gray-900 dark:text-gray-100 space-y-1">
                                <div>{balances.whatsappMarketing}</div>
                                <div className="h-3"></div>
                                <div>{balances.whatsappUtility}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <div className="font-semibold text-gray-700 dark:text-gray-300">Text</div>
                                <div className="text-xs text-gray-500">Remaining Text Messages</div>
                            </div>
                            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{balances.text}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm drop-shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">Recharge Now</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1 text-xs uppercase bg-white hover:bg-gray-50 dark:bg-gray-900 border-gray-200">
                            EMAIL <Mail className="ml-2 h-3 w-3 text-gray-600" />
                        </Button>
                        <Button variant="outline" className="flex-1 text-xs uppercase bg-white hover:bg-gray-50 dark:bg-gray-900 border-gray-200">
                            TEXT <MessageSquare className="ml-2 h-3 w-3 text-gray-600" />
                        </Button>
                        <Button variant="outline" className="flex-1 text-xs uppercase bg-white hover:bg-gray-50 dark:bg-gray-900 border-gray-200">
                            WHATSAPP <MessageCircle className="ml-2 h-3 w-3 text-green-600" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-2">
                <Card className="border-none shadow-sm drop-shadow-sm h-full flex flex-col">
                    <div className="p-6 pb-0">
                        <Tabs defaultValue="recharge">
                            <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700 w-full justify-start rounded-none p-0 h-auto">
                                <TabsTrigger value="recharge" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 px-4 py-2 uppercase text-xs font-semibold text-gray-500">Recharge History</TabsTrigger>
                                <TabsTrigger value="usage" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 px-4 py-2 uppercase text-xs font-semibold text-gray-500">Usage History</TabsTrigger>
                            </TabsList>

                            <div className="mt-6 mb-4 flex justify-between items-center">
                                <Button variant="outline" size="icon" className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Input placeholder="Search..." className="w-[200px] h-8 text-xs" />
                            </div>

                            <TabsContent value="recharge">
                                <div className="border border-gray-100 rounded-md overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 font-medium">
                                            <tr>
                                                <th className="p-3">Recharge By</th>
                                                <th className="p-3">Medium</th>
                                                <th className="p-3 text-center">Status</th>
                                                <th className="p-3">Amount</th>
                                                <th className="p-3 text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {recharges.map(tx => (
                                                <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                                    <td className="p-3 flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-[10px] font-bold">
                                                            {tx.by[0]}
                                                        </div>
                                                        <span className="font-medium text-xs">{tx.by}</span>
                                                    </td>
                                                    <td className="p-3">
                                                        <MessageSquare className="h-4 w-4 text-gray-400" />
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-[10px] font-normal uppercase">
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{tx.amount}</td>
                                                    <td className="p-3 text-right text-gray-500 text-xs">{tx.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-end space-x-2 py-3 px-3 text-xs text-gray-500 border-t border-gray-100">
                                        <div>Rows per page: 5</div>
                                        <div>1-1 of 1</div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled>&lt;</Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled>&gt;</Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="usage">
                                <div className="p-8 text-center text-gray-400 text-sm">No usage history found</div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function InfoIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
