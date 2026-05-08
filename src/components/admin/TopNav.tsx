'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Bell,
    Moon,
    Sun,
    Settings,
    Wallet,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    Command as CommandIcon,
    User,
    CheckCircle2
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
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getUserInitials } from '@/lib/utils'
import { useAuth, useUIStore } from '@/hooks'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function TopNav() {
    const { user, logout } = useAuth()
    const { toggleSidebar, isSidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
    const { theme, setTheme } = useTheme()
    const [openSearch, setOpenSearch] = useState(false)
    const router = useRouter()

    // Keyboard shortcut for search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpenSearch((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const handleLogout = async () => {
        toast.promise(logout(), {
            loading: 'Signing out...',
            success: () => {
                router.push('/login')
                return 'Signed out successfully'
            },
            error: 'Logout failed'
        })
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white/90 px-3 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90 sm:px-4 lg:px-6">
            {/* Left Section: Mobile Toggle & Organization Info */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-gray-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden h-10 w-10 shrink-0 rounded-xl text-gray-500 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 lg:inline-flex"
                    onClick={toggleSidebarCollapsed}
                    aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isSidebarCollapsed ? (
                        <PanelLeftOpen className="h-5 w-5" />
                    ) : (
                        <PanelLeftClose className="h-5 w-5" />
                    )}
                </Button>

                <div className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-2.5 py-1.5 transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/50 sm:rounded-2xl sm:px-3" onClick={() => router.push(user?.organizationId ? '/admin' : '/organization')}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110 dark:shadow-none overflow-hidden">
                        {user?.organization?.logo ? (
                            <img src={user.organization.logo} alt={user.organization.name} className="h-full w-full object-cover" />
                        ) : (
                            getUserInitials(user?.organization?.name || 'O')
                        )}
                    </div>
                    <div className="hidden min-w-0 flex-col sm:flex">
                        <span className="max-w-[11rem] truncate text-[11px] font-black leading-none tracking-tight text-gray-900 dark:text-white uppercase">
                            {user?.organization?.name || 'Create Institute'}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", user?.organizationId ? "bg-emerald-500" : "bg-amber-500")}></span>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", user?.organizationId ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                                {user?.organizationId ? 'Live System' : 'Setup Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Section: Search */}
            <div className="mx-2 hidden max-w-xl flex-1 md:block lg:mx-8">
                <div 
                    className="relative group cursor-pointer" 
                    onClick={() => setOpenSearch(true)}
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Search student or course..."
                        readOnly
                        className="pl-11 h-11 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 cursor-pointer transition-all placeholder:text-gray-400 text-sm font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[10px] font-bold text-gray-400 shadow-sm">
                        <CommandIcon className="h-2.5 w-2.5" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-gray-500 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 relative rounded-xl transition-all"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800" align="end">
                        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <h4 className="font-bold text-sm">Updates</h4>
                            <Badge className="bg-indigo-600">3 New</Badge>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer transition-colors">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">New student registered</p>
                                    <p className="text-[10px] text-gray-500 mt-1">2 minutes ago</p>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-transparent">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 shadow-sm ring-2 ring-indigo-50 dark:ring-indigo-900/30">
                                <AvatarImage src={user?.image || ''} />
                                <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                                    {getUserInitials(user?.fullName || 'U')}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800" align="end">
                        <div className="flex flex-col space-y-1 p-2">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.fullName}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-gray-50 dark:bg-gray-800" />
                        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 focus:bg-indigo-50 dark:focus:bg-indigo-900/20" onClick={() => router.push('/admin/profile')}>
                            <User className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm font-bold">My Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-900/20 rounded-xl py-2.5 mt-1 font-bold" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Global Search Dialog */}
            <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
                <CommandInput placeholder="Search everything..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => { router.push('/admin/students'); setOpenSearch(false); }}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Add New Student</span>
                        </CommandItem>
                        <CommandItem onSelect={() => { router.push('/admin/fees'); setOpenSearch(false); }}>
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>Collect Fee</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </header>
    )
}
