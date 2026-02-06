'use client'

import { OrganizationInfoTab } from "@/components/admin/settings/OrganizationInfoTab"
import { PaymentDetailsTab } from "@/components/admin/settings/PaymentDetailsTab"
import { MarketingWalletTab } from "@/components/admin/settings/MarketingWalletTab"
import { OrganizationRulesTab } from "@/components/admin/settings/OrganizationRulesTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Building2, CreditCard, Wallet, FileText } from "lucide-react"

export default function OrganizationSettingsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Organization Settings</h1>
            </div>

            <Tabs defaultValue="organizations" className="w-full space-y-6">
                <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-800 rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                        value="organizations"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 uppercase"
                    >
                        ORGANIZATIONS
                    </TabsTrigger>
                    <TabsTrigger
                        value="payment"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 uppercase"
                    >
                        PAYMENT DETAILS
                    </TabsTrigger>
                    <TabsTrigger
                        value="marketing"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 uppercase"
                    >
                        MARKETING WALLET
                    </TabsTrigger>
                    <TabsTrigger
                        value="rules"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:bg-transparent px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 uppercase"
                    >
                        ORGANIZATION RULES
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="organizations" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <OrganizationInfoTab />
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <PaymentDetailsTab />
                </TabsContent>

                <TabsContent value="marketing" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <MarketingWalletTab />
                </TabsContent>

                <TabsContent value="rules" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <OrganizationRulesTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
