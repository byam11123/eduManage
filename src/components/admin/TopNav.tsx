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
    Users,
    GraduationCap,
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
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<{
        students: any[],
        courses: any[],
        enquiries: any[],
        staff: any[]
    }>({ students: [], courses: [], enquiries: [], staff: [] })
    const router = useRouter()

    // Global Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            console.log(`[TopNav] Query length: ${searchQuery.length}`)
            if (searchQuery.length < 2) {
                setSearchResults({ students: [], courses: [], enquiries: [], staff: [] })
                return
            }

            setIsSearching(true)
            try {
                console.log(`[TopNav] Fetching search for: "${searchQuery}"`)
                const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`)
                const data = await res.json()
                console.log(`[TopNav] Search results:`, data)
                if (data.success) {
                    setSearchResults(data.results)
                }
            } catch (error) {
                console.error('[TopNav] Search fetch error:', error)
            } finally {
                setIsSearching(false)
            }
        }

        const timer = setTimeout(fetchResults, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

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
            loading: 'Logging out...',
            success: () => {
                router.push('/login')
                return 'Signed out successfully'
            },
            error: 'Logout failed'
        })
    }

    return (
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-3 border-b border-gray-100/50 bg-white/70 px-4 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/70 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-2xl text-gray-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden h-11 w-11 shrink-0 rounded-2xl text-gray-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 lg:inline-flex"
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

                <div 
                    className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-2xl border border-gray-100/50 bg-gray-50/50 px-3 py-2 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 dark:border-gray-800/50 dark:bg-gray-900/50 dark:hover:bg-gray-900 sm:px-4" 
                    onClick={() => router.push(user?.organizationId ? '/admin' : '/organization')}
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-[10px] font-black text-white shadow-lg shadow-indigo-200 transition-transform duration-500 group-hover:scale-110 dark:shadow-none overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-950">
                        {user?.organization?.logo ? (
                            <img src={user.organization.logo} alt={user.organization.name} className="h-full w-full object-cover" />
                        ) : (
                            getUserInitials(user?.organization?.name || 'O')
                        )}
                    </div>
                    <div className="hidden min-w-0 flex-col sm:flex">
                        <span className="max-w-[12rem] truncate text-[11px] font-black leading-none tracking-[0.05em] text-gray-900 dark:text-white uppercase">
                            {user?.organization?.name || 'Create Institute'}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-white dark:ring-gray-900", user?.organizationId ? "bg-emerald-500" : "bg-amber-500")}></span>
                            <span className={cn("text-[9px] font-black uppercase tracking-[0.15em]", user?.organizationId ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                                {user?.organizationId ? 'Active Platform' : 'Setup Required'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Section: Advanced Search */}
            <div className="mx-4 hidden max-w-lg flex-1 md:block lg:mx-12">
                <div 
                    className="relative group cursor-pointer" 
                    onClick={() => setOpenSearch(true)}
                >
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors z-10" />
                    <Input
                        placeholder="Quick search... (Students, Fees, Courses)" 
                        readOnly
                        className="pl-12 h-12 bg-gray-100/50 dark:bg-gray-900/50 border border-transparent group-hover:border-indigo-500/30 group-hover:bg-white dark:group-hover:bg-gray-900 rounded-2xl focus-visible:ring-0 cursor-pointer transition-all duration-300 placeholder:text-gray-400 text-[13px] font-black uppercase tracking-wider"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-950 text-[10px] font-black text-gray-400 shadow-sm group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-all">
                        <CommandIcon className="h-3 w-3" />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-2xl text-gray-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-900"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Sun className="h-5.5 w-5.5" /> : <Moon className="h-5.5 w-5.5" />}
                </Button>

                {/* Notifications */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-900 relative rounded-2xl transition-all"
                        >
                            <Bell className="h-5.5 w-5.5" />
                            <span className="absolute top-3 right-3 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse"></span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0 rounded-[2.5rem] shadow-3xl border-none bg-white dark:bg-gray-950 overflow-hidden" align="end">
                        <div className="p-8 border-b border-gray-50 dark:border-gray-900 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                            <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-gray-900 dark:text-white">Recent Alerts</h4>
                            <Badge className="bg-indigo-600 text-[10px] font-black uppercase px-3 rounded-lg">3 NEW</Badge>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 border-b border-gray-50 dark:border-gray-900 last:border-0 cursor-pointer transition-all flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">Institutional Update</p>
                                        <p className="text-[11px] font-bold text-gray-400 mt-1 line-clamp-1">New student registered in Batch A-2024</p>
                                        <p className="text-[9px] font-black text-indigo-600 mt-2 uppercase tracking-widest opacity-60">2m ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full h-14 rounded-none border-t border-gray-50 dark:border-gray-900 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-indigo-600">View All Syncs</Button>
                    </PopoverContent>
                </Popover>

                {/* Profile Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-11 w-11 rounded-2xl p-0 transition-all active:scale-95 group relative">
                            <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-900 shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-950 transition-all group-hover:ring-indigo-100 dark:group-hover:ring-indigo-900">
                                <AvatarImage src={user?.image || ''} />
                                <AvatarFallback className="bg-indigo-600 text-white text-xs font-black uppercase">
                                    {getUserInitials(user?.fullName || 'U')}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 p-3 rounded-[2rem] shadow-3xl border-none bg-white dark:bg-gray-950" align="end">
                        <div className="flex flex-col space-y-1.5 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl mb-2">
                            <p className="text-[13px] font-black tracking-tight text-gray-900 dark:text-white">{user?.fullName}</p>
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-transparent h-2" />
                        <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 focus:bg-indigo-50 dark:focus:bg-indigo-950/40 group transition-all" onClick={() => router.push('/admin/profile')}>
                            <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Profile Center</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-xl py-3 px-4 focus:bg-indigo-50 dark:focus:bg-indigo-950/40 group transition-all" onClick={() => router.push('/admin/settings')}>
                            <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">Admin Tools</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50 dark:bg-gray-900 my-2" />
                        <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-white focus:bg-rose-600 rounded-xl py-3 px-4 font-black uppercase tracking-widest text-[10px] group shadow-xl shadow-rose-900/0 hover:shadow-rose-500/20 transition-all" onClick={handleLogout}>
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Exit Protocol</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CommandDialog 
                open={openSearch} 
                onOpenChange={setOpenSearch} 
                className="sm:max-w-[750px]"
                shouldFilter={searchQuery.length >= 2 ? false : true}
            >
                <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
                    <CommandIcon className="h-4 w-4 text-indigo-600 mr-3" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Search & Quick Actions</span>
                    <div className="ml-auto flex items-center gap-3">
                        {isSearching && (
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Searching...</span>
                            </div>
                        )}
                        {searchQuery && (
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Q: {searchQuery}</span>
                        )}
                    </div>
                </div>
                <CommandInput 
                    placeholder="Type to search students, courses, staff..." 
                    value={searchQuery}
                    onValueChange={(val) => {
                        console.log(`[TopNav] onValueChange: "${val}"`)
                        setSearchQuery(val)
                    }}
                    className="h-16 border-none focus:ring-0 text-base font-bold placeholder:text-gray-400" 
                />
                {/* Debug Fallback Input - Only visible in dev if needed */}
                {false && (
                    <input 
                        className="w-full p-4 border-b" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Debug Input"
                    />
                )}
                <CommandList className="max-h-[450px] p-2">
                    <CommandEmpty className="py-12 text-center">
                        <Search className="h-10 w-10 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No results found</p>
                    </CommandEmpty>
                    
                    {searchQuery.length < 2 ? (
                        <>
                            <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600/60 block mb-2">Students</span>}>
                                <CommandItem 
                                    onSelect={() => { router.push('/admin/students/add'); setOpenSearch(false); setSearchQuery(''); }}
                                    className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 transition-all group"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                        <User className="h-4 w-4 text-gray-500 group-aria-selected:text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Add New Student</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fill admission form</span>
                                    </div>
                                </CommandItem>
                                <CommandItem 
                                    onSelect={() => { router.push('/admin/students'); setOpenSearch(false); setSearchQuery(''); }}
                                    className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 transition-all group mt-1"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                        <Users className="h-4 w-4 text-gray-500 group-aria-selected:text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">View Students</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of all students</span>
                                    </div>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className="my-4 bg-gray-50 dark:bg-gray-900" />

                            <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600/60 block mb-2">Finance</span>}>
                                <CommandItem 
                                    onSelect={() => { router.push('/admin/fees'); setOpenSearch(false); setSearchQuery(''); }}
                                    className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-emerald-50 dark:aria-selected:bg-emerald-950/40 transition-all group"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                        <Wallet className="h-4 w-4 text-gray-500 group-aria-selected:text-emerald-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Collect Fee</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment collection</span>
                                    </div>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className="my-4 bg-gray-50 dark:bg-gray-900" />

                            <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-600/60 block mb-2">Academics</span>}>
                                <CommandItem 
                                    onSelect={() => { router.push('/admin/courses'); setOpenSearch(false); setSearchQuery(''); }}
                                    className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-amber-50 dark:aria-selected:bg-amber-950/40 transition-all group"
                                >
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                        <GraduationCap className="h-4 w-4 text-gray-500 group-aria-selected:text-amber-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Courses</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List of courses</span>
                                    </div>
                                </CommandItem>
                            </CommandGroup>
                        </>
                    ) : (
                        <>
                            {/* Dynamic Results */}
                            {searchResults.students.length > 0 && (
                                <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600/60 block mb-2">Students Found</span>}>
                                    {searchResults.students.map((s) => (
                                        <CommandItem 
                                            key={s.id}
                                            onSelect={() => { router.push(s.href); setOpenSearch(false); setSearchQuery(''); }}
                                            className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950/40 transition-all group"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                                <User className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{s.title}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.courses.length > 0 && (
                                <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-amber-600/60 block mt-4 mb-2">Courses Found</span>}>
                                    {searchResults.courses.map((c) => (
                                        <CommandItem 
                                            key={c.id}
                                            onSelect={() => { router.push(c.href); setOpenSearch(false); setSearchQuery(''); }}
                                            className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-amber-50 dark:aria-selected:bg-amber-950/40 transition-all group"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                                <GraduationCap className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{c.title}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.enquiries.length > 0 && (
                                <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600/60 block mt-4 mb-2">Enquiries Found</span>}>
                                    {searchResults.enquiries.map((e) => (
                                        <CommandItem 
                                            key={e.id}
                                            onSelect={() => { router.push(e.href); setOpenSearch(false); setSearchQuery(''); }}
                                            className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-emerald-50 dark:aria-selected:bg-emerald-950/40 transition-all group"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                                <Bell className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{e.title}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{e.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.staff.length > 0 && (
                                <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.25em] text-rose-600/60 block mt-4 mb-2">Staff Found</span>}>
                                    {searchResults.staff.map((s) => (
                                        <CommandItem 
                                            key={s.id}
                                            onSelect={() => { router.push(s.href); setOpenSearch(false); setSearchQuery(''); }}
                                            className="rounded-xl py-3 px-4 flex items-center gap-4 cursor-pointer aria-selected:bg-rose-50 dark:aria-selected:bg-rose-950/40 transition-all group"
                                        >
                                            <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-aria-selected:bg-white dark:group-aria-selected:bg-gray-900 shadow-sm transition-colors">
                                                <Users className="h-4 w-4 text-rose-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{s.title}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.subtitle}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.students.length === 0 && 
                             searchResults.courses.length === 0 && 
                             searchResults.enquiries.length === 0 && 
                             searchResults.staff.length === 0 && !isSearching && (
                                <div className="py-12 text-center">
                                    <Search className="h-10 w-10 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching records found</p>
                                </div>
                            )}
                        </>
                    )}
                </CommandList>
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">ESC</span>
                            <span>Close</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">↵</span>
                            <span>Select</span>
                        </div>
                    </div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] opacity-60">Search Dashboard</span>
                </div>
            </CommandDialog>
        </header>
    )
}
