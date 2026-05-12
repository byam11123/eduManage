'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrganizationInfoTab } from "@/components/admin/settings/OrganizationInfoTab"
import { PaymentDetailsTab } from "@/components/admin/settings/PaymentDetailsTab"
import { MarketingWalletTab } from "@/components/admin/settings/MarketingWalletTab"
import { OrganizationRulesTab } from "@/components/admin/settings/OrganizationRulesTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, CreditCard, Wallet, FileText, Settings2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OrganizationSettingsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState('organizations')

    // Sync tab from URL
    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab) setActiveTab(tab)
    }, [searchParams])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', value)
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    const tabTriggerClasses = "rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-100 dark:data-[state=active]:shadow-none flex items-center gap-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-8 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-gray-100 dark:shadow-none flex items-center justify-center border border-gray-100 dark:border-gray-800 relative group transition-all hover:scale-110">
                        <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full" />
                        <Settings2 className="h-6 w-6 text-indigo-600 relative z-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-3 w-3 text-indigo-600" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Settings</p>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Organization Settings</h1>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-[2.5rem] shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-50 dark:border-gray-800 mb-10 overflow-x-auto no-scrollbar">
                    <TabsList className="bg-transparent h-auto p-0 gap-2 flex justify-start">
                        <TabsTrigger value="organizations" className={tabTriggerClasses}>
                            <Building2 className="h-3.5 w-3.5" />
                            General Info
                        </TabsTrigger>
                        <TabsTrigger value="payment" className={tabTriggerClasses}>
                            <CreditCard className="h-3.5 w-3.5" />
                            Payment Details
                        </TabsTrigger>
                        <TabsTrigger value="marketing" className={tabTriggerClasses}>
                            <Wallet className="h-3.5 w-3.5" />
                            Marketing Wallet
                        </TabsTrigger>
                        <TabsTrigger value="rules" className={tabTriggerClasses}>
                            <FileText className="h-3.5 w-3.5" />
                            Organization Rules
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <TabsContent value="organizations" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <OrganizationInfoTab />
                    </TabsContent>

                    <TabsContent value="payment" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <PaymentDetailsTab />
                    </TabsContent>

                    <TabsContent value="marketing" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <MarketingWalletTab />
                    </TabsContent>

                    <TabsContent value="rules" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <OrganizationRulesTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
