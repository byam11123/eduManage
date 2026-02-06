'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Info } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export function PaymentDetailsTab() {
    // Mock plan data
    const plan = {
        name: "Demo plan",
        amount: "Free plan",
        startDate: "03/02/2026",
        expiryDate: "10/02/2026",
        status: "ACTIVE"
    }

    return (
        <Card className="border-none shadow-sm drop-shadow-sm">
            <CardContent className="p-0">
                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-gray-500">Plan name :</span>
                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{plan.name}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-gray-500">Plan amount :</span>
                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{plan.amount}</span>
                            </div>
                        </div>

                        <div className="space-y-4 text-right">
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-gray-500">Plan start date :</span>
                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{plan.startDate}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-gray-500">Plan expiry date :</span>
                                <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{plan.expiryDate}</span>
                            </div>
                        </div>
                    </div>

                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <div className="flex justify-end pt-4 cursor-pointer hover:opacity-80 translate-y-2">
                                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase">
                                    More info... <ChevronDown className="ml-1 h-3 w-3" />
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-6 text-sm text-gray-500">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 text-indigo-500" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Plan Features</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>Unlimited Students</li>
                                            <li>Basic Reports</li>
                                            <li>Email Support</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    )
}
