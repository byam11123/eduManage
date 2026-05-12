'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Clock, Info, AlertTriangle, ShieldCheck, Layers, Save, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from 'react'
import { organizationService } from "@/lib/services"
import { toast } from "sonner"
import { Organization } from "@/lib/types"

export function OrganizationRulesTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [category, setCategory] = useState("attendance")
    
    // Rule State
    const [rules, setRules] = useState({
        lateThreshold: 15,
        penaltyType: "warning",
        isEnabled: false
    })

    const fetchOrganization = async () => {
        setLoading(true)
        try {
            const response = await organizationService.getCurrentOrganization()
            if (response.success && response.data) {
                setOrganization(response.data)
                // Parse attendance rules if exist
                if (response.data.attendanceRules) {
                    try {
                        const parsedRules = JSON.parse(response.data.attendanceRules)
                        setRules({
                            lateThreshold: parsedRules.lateThreshold || 15,
                            penaltyType: parsedRules.penaltyType || "warning",
                            isEnabled: parsedRules.isEnabled ?? false
                        })
                    } catch (e) {
                        console.error("Error parsing rules:", e)
                    }
                }
            }
        } catch (error) {
            toast.error("Failed to load rules")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrganization()
    }, [])

    const handleSave = async () => {
        if (!organization) return
        setSaving(true)
        try {
            const response = await organizationService.updateOrganization(organization.id, {
                attendanceRules: JSON.stringify(rules)
            })
            if (response.success) {
                toast.success("Rules updated successfully")
            } else {
                toast.error(response.error || "Failed to update rules")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
        )
    }
    const sectionHeaderClasses = "text-[13px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4 mb-8 flex items-center gap-3"

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                        <Layers className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rule Category</p>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Organization Rules</h3>
                    </div>
                </div>
                <div className="w-full md:w-[350px]">
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-12 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 focus:ring-2 focus:ring-indigo-600/20">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 dark:border-gray-800 shadow-2xl">
                            <SelectItem value="attendance" className="text-[10px] font-black uppercase tracking-widest py-3">Student Attendance</SelectItem>
                            <SelectItem value="fees" className="text-[10px] font-black uppercase tracking-widest py-3">Fee Collection</SelectItem>
                            <SelectItem value="library" className="text-[10px] font-black uppercase tracking-widest py-3">Library Management</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-indigo-600 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                        <CardContent className="p-10 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                                <Clock className="h-24 w-24 text-white" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="h-14 w-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                        {category === 'attendance' ? 'Attendance Rules' : category === 'fees' ? 'Fee Rules' : 'Library Rules'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-relaxed">Active Rule</p>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] w-fit px-4 py-2 rounded-full border transition-colors",
                                    rules.isEnabled ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/10 border-white/20"
                                )}>
                                    <CheckCircle2 className="h-3 w-3" /> {rules.isEnabled ? "Enabled" : "Disabled"}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden p-8 border border-gray-50 dark:border-gray-800 space-y-4">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Rule Status</h5>
                        {[
                            { name: "Late Entry Rule", status: rules.isEnabled ? "Active" : "Disabled", color: rules.isEnabled ? "emerald" : "gray" },
                            { name: "Half-Day Rule", status: "Pending", color: "amber" },
                            { name: "Holiday Rule", status: "Configured", color: "indigo" }
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">{rule.name}</span>
                                <Badge className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                    rule.color === 'emerald' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
                                    rule.color === 'amber' && "bg-amber-50 text-amber-600 dark:bg-amber-950/30",
                                    rule.color === 'indigo' && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30",
                                    rule.color === 'gray' && "bg-gray-100 text-gray-400 dark:bg-gray-800"
                                )}>
                                    {rule.status}
                                </Badge>
                            </div>
                        ))}
                    </Card>
                </div>

                <div className="lg:col-span-8 space-y-10">
                    {category === 'attendance' ? (
                        <Card className="border-none shadow-xl shadow-gray-50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-50 dark:border-gray-800">
                            <CardHeader className="p-10 border-b border-gray-50 dark:border-gray-800 flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldCheck className="h-4 w-4 text-indigo-600" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Rule Details</p>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Late Coming Rule</CardTitle>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <Checkbox 
                                        id="enableRule" 
                                        className="h-5 w-5 border-gray-300 rounded-lg text-indigo-600" 
                                        checked={rules.isEnabled}
                                        onCheckedChange={(checked) => setRules({ ...rules, isEnabled: !!checked })}
                                    />
                                    <Label htmlFor="enableRule" className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest cursor-pointer">Rule Enabled</Label>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Late Threshold (Minutes)</Label>
                                        </div>
                                        <Input 
                                            type="number"
                                            value={rules.lateThreshold}
                                            onChange={(e) => setRules({ ...rules, lateThreshold: parseInt(e.target.value) || 0 })}
                                            className="h-14 bg-gray-50/50 dark:bg-gray-800 border-none rounded-2xl text-sm font-black focus:ring-2 focus:ring-indigo-600/20" 
                                        />
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed ml-1 italic">Time after which student is marked late.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-indigo-600" />
                                            <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Penalty Type</Label>
                                        </div>
                                        <Select value={rules.penaltyType} onValueChange={(val) => setRules({ ...rules, penaltyType: val })}>
                                            <SelectTrigger className="h-14 bg-gray-50/50 dark:bg-gray-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gray-100 dark:border-gray-800 shadow-2xl">
                                                <SelectItem value="warning" className="text-[10px] font-black uppercase tracking-widest py-3 italic">Warning</SelectItem>
                                                <SelectItem value="fine" className="text-[10px] font-black uppercase tracking-widest py-3 italic">Fine</SelectItem>
                                                <SelectItem value="absent" className="text-[10px] font-black uppercase tracking-widest py-3 italic">Mark Absent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed ml-1 italic">Action taken when rule is triggered.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none text-[10px] font-black uppercase tracking-widest group"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save Rules <Save className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" /></>}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-4">
                            <Info className="h-12 w-12 text-gray-300" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration for {category} rules is coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
