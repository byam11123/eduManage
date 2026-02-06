'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Clock, Info, AlertTriangle } from "lucide-react"

export function OrganizationRulesTab() {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <div className="w-[300px]">
                    <div className="text-[10px] text-gray-500 mb-1 ml-1">Select Category</div>
                    <Select defaultValue="attendance">
                        <SelectTrigger className="h-10 bg-indigo-50/50 border-indigo-100 text-indigo-900">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="attendance">Student Attendance</SelectItem>
                            <SelectItem value="fees">Fee Collection</SelectItem>
                            <SelectItem value="library">Library</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-none shadow-sm drop-shadow-sm bg-indigo-50/50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Student Attendance Rules</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-6 ml-8">Configure and manage attendance policies for your organization</p>

                    <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 w-fit min-w-[300px]">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Late Coming</div>
                                <div className="text-xs text-gray-500">Not enabled</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="border-t-2 border-indigo-500 w-[150px] mt-8 mb-4 flex items-center gap-2 pt-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-600 uppercase">LATE COMING RULE</span>
            </div>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-none">
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">Late Coming Rule</h3>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </div>
                    <p className="text-xs text-gray-500 -mt-4 mb-4">Define penalties for students arriving late</p>

                    <div className="bg-indigo-50/30 p-4 rounded-md flex items-center gap-2 mb-6">
                        <Checkbox id="enableRule" className="border-gray-300" />
                        <Label htmlFor="enableRule" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Enable Late Coming Rule</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" /> Late Threshold (minutes)
                            </Label>
                            <Input placeholder="15" className="h-10" />
                            <p className="text-[10px] text-gray-500">Students arriving more than 15 minutes late will face penalties</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" /> Penalty Type
                            </Label>
                            <Select defaultValue="warning">
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="fine">Fine</SelectItem>
                                    <SelectItem value="absent">Mark Absent</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-gray-500">Current penalty: Warning</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold text-xs px-6 py-2">
                    Save All Rules
                </Button>
            </div>
        </div>
    )
}
