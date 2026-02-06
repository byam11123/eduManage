'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, MapPin, Mail, Phone } from "lucide-react"
import { useAuth } from "@/hooks"
import { getUserInitials } from "@/lib/utils"

export function OrganizationInfoTab() {
    const { user } = useAuth()

    // Mock organization data for now - in real app, fetch from API
    const orgDetails = {
        name: "ORBIT COMPUTER INSTITUTE",
        phone: "+919977853230",
        email: "vishu.gravity01@gmail.com",
        location: "Raipur",
        id: "OCI-011153"
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-none shadow-sm drop-shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="h-32 w-32 rounded-lg bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 uppercase mb-2">
                            {user?.fullName ? getUserInitials(user.fullName) : 'A'}
                        </div>

                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {user?.fullName || 'User Name'}
                            </h3>
                            <Badge variant="secondary" className="bg-red-50 text-red-500 hover:bg-red-50 uppercase text-xs px-2 py-0.5 rounded-sm">
                                {user?.role || 'ADMIN'}
                            </Badge>
                        </div>

                        <div className="text-center space-y-1 w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>User name:</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{user?.fullName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Email:</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 pt-2">
                                <span>Status:</span>
                                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] px-2 h-5">
                                    ACTIVE
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Organization Details Card */}
                <Card className="md:col-span-2 border-none shadow-sm drop-shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                                O
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Organization Details</div>
                                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {orgDetails.name}
                                </CardTitle>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100">
                            Edit <Pencil className="ml-2 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                {orgDetails.phone}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[200px]">{orgDetails.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                {orgDetails.location}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Organizations Table Section */}
            <Card className="border-none shadow-sm drop-shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <Button className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 uppercase text-xs font-semibold px-6 border border-indigo-100">
                        Switch Organization
                    </Button>
                    <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200 uppercase text-xs font-semibold px-6 border border-gray-200">
                        Create New Organization
                    </Button>
                    <div className="flex-1" />
                    <Input
                        placeholder="Search..."
                        className="w-[250px] h-9 text-xs"
                    />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b [&_tr]:border-gray-100 dark:[&_tr]:border-gray-800">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-10 px-4 text-xs font-medium text-gray-500 uppercase w-[50px]">Select</th>
                                    <th className="h-10 px-4 text-xs font-medium text-gray-500 uppercase">Organization ID</th>
                                    <th className="h-10 px-4 text-xs font-medium text-gray-500 uppercase">Organization Name</th>
                                    <th className="h-10 px-4 text-xs font-medium text-gray-500 uppercase">Email ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50 dark:border-gray-800 transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked onChange={() => { }} />
                                    </td>
                                    <td className="p-4 align-middle font-medium uppercase text-xs">{orgDetails.id}</td>
                                    <td className="p-4 align-middle font-medium uppercase text-xs">{orgDetails.name}</td>
                                    <td className="p-4 align-middle text-gray-500 text-xs">{orgDetails.email}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex items-center justify-end space-x-2 py-4 px-4 text-xs text-gray-500">
                            <div>Rows per page: 5</div>
                            <div>1-1 of 1</div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6" disabled><span className="sr-only">Previous</span>&lt;</Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" disabled><span className="sr-only">Next</span>&gt;</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
