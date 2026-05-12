'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, UserPlus, Phone, Mail, BadgeCheck, Eraser, Search as SearchIcon } from "lucide-react"
import { useReferrals } from "@/hooks"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'

interface AddReferrerDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    initialData?: any
}

export function AddReferrerDialog({ isOpen, onClose, onSuccess, initialData }: AddReferrerDialogProps) {
    const { createReferrer, updateReferrer } = useReferrals()
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'agent' as const,
        defaultCommissionType: 'fixed' as const,
        defaultCommissionAmount: 1000
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                type: (initialData.type as any) || 'agent',
                defaultCommissionType: (initialData.defaultCommissionType as any) || 'fixed',
                defaultCommissionAmount: initialData.defaultCommissionAmount || 0
            })
        } else {
            handleClear()
        }
    }, [initialData])

    // Handle outside click to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (query: string) => {
        setFormData(prev => ({ ...prev, name: query }))
        if (formData.type !== 'student' && formData.type !== 'staff') return
        if (query.length < 2) {
            setSearchResults([])
            setShowSuggestions(false)
            return
        }

        setSearchLoading(true)
        try {
            const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
            const result = await response.json()
            if (result.success) {
                const results = formData.type === 'student' ? result.results.students : result.results.staff
                setSearchResults(results)
                setShowSuggestions(results.length > 0)
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setSearchLoading(false)
        }
    }

    const selectPerson = (person: any) => {
        setFormData(prev => ({
            ...prev,
            name: person.title,
            email: person.email || '',
            phone: person.phone || '',
        }))
        setShowSuggestions(false)
    }

    const handleClear = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            type: 'agent',
            defaultCommissionType: 'fixed',
            defaultCommissionAmount: 1000
        })
        setSearchResults([])
        setShowSuggestions(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return toast.error("Name is required")
        
        setLoading(true)
        try {
            const success = initialData 
                ? await updateReferrer(initialData.id, formData)
                : await createReferrer(formData)
                
            if (success) {
                toast.success(initialData ? "Referrer updated successfully" : "Referrer added successfully")
                onSuccess?.()
                onClose()
                if (!initialData) handleClear()
            } else {
                toast.error(initialData ? "Failed to update referrer" : "Failed to add referrer")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-900">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-10 bg-indigo-600 border-b border-indigo-500/20">
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                                    <UserPlus className="h-6 w-6 text-white" />
                                </div>
                                {initialData ? 'Update Partner' : 'Add New Partner'}
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={handleClear}
                                className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
                            >
                                <Eraser className="h-3.5 w-3.5" /> Clear All
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-10 space-y-8">
                        {/* Partner Type First */}
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] ml-1">
                                1. Select Partner Type
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['agent', 'student', 'staff', 'other'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as any })}
                                        className={cn(
                                            "h-14 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                                            formData.type === type 
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                                                : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 relative" ref={searchRef}>
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        Full Name <span className="text-rose-500 font-black">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Input 
                                            value={formData.name}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            onFocus={() => (formData.type === 'student' || formData.type === 'staff') && formData.name.length >= 2 && setShowSuggestions(true)}
                                            placeholder={formData.type === 'student' ? "Search student name..." : formData.type === 'staff' ? "Search staff name..." : "e.g. John Doe"}
                                            className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold pl-12 group-focus-within:bg-white dark:group-focus-within:bg-gray-700 shadow-sm transition-all"
                                            required
                                        />
                                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        {searchLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-indigo-600" />}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && (
                                        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {searchResults.map((person) => (
                                                <button
                                                    key={person.id}
                                                    type="button"
                                                    onClick={() => selectPerson(person)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-none text-left"
                                                >
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{person.title}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">{person.subtitle}</p>
                                                    </div>
                                                    <Badge className="bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest border-none">SELECT</Badge>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        <Phone className="h-3 w-3" /> Phone Number
                                    </Label>
                                    <Input 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                    <Mail className="h-3 w-3" /> Email Address
                                </Label>
                                <Input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="partner@example.com"
                                    className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold shadow-sm"
                                />
                            </div>

                            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-900/30 space-y-6">
                                <h5 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <BadgeCheck className="h-5 w-5" /> Commission Strategy
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</Label>
                                        <Select value={formData.defaultCommissionType} onValueChange={(val: any) => setFormData({ ...formData, defaultCommissionType: val })}>
                                            <SelectTrigger className="h-14 bg-white dark:bg-gray-900 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-2xl">
                                                <SelectItem value="fixed" className="text-[10px] font-black uppercase tracking-widest py-3 italic">Fixed Reward (₹)</SelectItem>
                                                <SelectItem value="percentage" className="text-[10px] font-black uppercase tracking-widest py-3 italic">Percentage Split (%)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount</Label>
                                        <Input 
                                            type="number"
                                            value={formData.defaultCommissionAmount}
                                            onChange={(e) => setFormData({ ...formData, defaultCommissionAmount: parseFloat(e.target.value) || 0 })}
                                            className="h-14 bg-white dark:bg-gray-900 border-none rounded-2xl text-xs font-bold shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-10 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none text-[11px] font-black uppercase tracking-[0.2em] group"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{initialData ? 'Update Record' : 'Register Partner'} <UserPlus className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" /></>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
