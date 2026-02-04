'use client'

import { useState } from 'react'
import {
    Search,
    Bell,
    Moon,
    Sun,
    Settings,
    Wallet,
    LogOut,
    ChevronDown,
    Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getUserInitials } from '@/lib/utils'

interface User {
    id: string
    fullName: string
    email: string
    role: string
    image?: string
}

interface TopNavProps {
    user: User | null
    onSidebarToggle?: () => void
    handleLogout: () => void
}

export function TopNav({ user, onSidebarToggle, handleLogout }: TopNavProps) {
    const [isDarkMode, setIsDarkMode] = useState(false) // Toggle logic to be implemented with ThemeProvider if needed

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center justify-between sticky top-0 z-40">
            {/* Left Section: Mobile Toggle & Organization Info */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onSidebarToggle}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                        O
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        ORBIT COMPUTER INSTITUTE
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-indigo-600 border-indigo-200 bg-indigo-50">
                        LIVE
                    </Badge>
                </div>
            </div>

            {/* Center Section: Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search Student..."
                        className="pl-9 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full focus-visible:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2">
                {/* Mobile Search Toggle (Visible only on mobile) */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Search className="h-5 w-5 text-gray-500" />
                </Button>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 relative"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1">
                            <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-gray-700">
                                <AvatarImage src={user?.image || ''} alt={user?.fullName || 'User'} />
                                <AvatarFallback className="bg-indigo-600 text-white font-medium">
                                    {getUserInitials(user?.fullName || 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                                <p className="text-xs leading-none text-muted-foreground capitalize">
                                    {user?.role?.replace('_', ' ') || 'Admin'}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>Wallet</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
