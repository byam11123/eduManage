'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Check, ChevronsUpDown, Plus, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'

interface CreatableSuggestionInputProps {
    type: 'board' | 'university' | 'college'
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function CreatableSuggestionInput({
    type,
    value,
    onChange,
    placeholder = "Select or type...",
    className
}: CreatableSuggestionInputProps) {
    const [open, setOpen] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const fetchSuggestions = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/education/suggestions?type=${type}`)
            const data = await res.json()
            if (data.success) {
                setSuggestions(data.suggestions)
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) {
            fetchSuggestions()
        }
    }, [open, type])

    const handleAdd = async (name: string) => {
        if (!name) return
        
        try {
            const res = await fetch('/api/education/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, name })
            })
            const data = await res.json()
            if (data.success) {
                setSuggestions(prev => Array.from(new Set([...prev, data.suggestion])))
                onChange(data.suggestion)
                setOpen(false)
            }
        } catch (error) {
            console.error('Error adding suggestion:', error)
            toast.error("Failed to add new entry")
        }
    }

    const filteredSuggestions = suggestions.filter(s => 
        s.toLowerCase().includes(searchValue.toLowerCase())
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-medium bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-xl h-11 px-4 text-sm transition-all hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-50/50 dark:hover:shadow-none",
                        !value && "text-gray-400",
                        className
                    )}
                >
                    {value || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                <Command className="dark:bg-gray-950">
                    <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput 
                            placeholder={`Search ${type}...`} 
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="h-11 border-none focus:ring-0 text-sm font-medium"
                        />
                    </div>
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty className="p-4 flex flex-col items-center justify-center gap-3">
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                            ) : (
                                <>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No results found</p>
                                    {searchValue && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleAdd(searchValue)}
                                            className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Add "{searchValue}"
                                        </Button>
                                    )}
                                </>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredSuggestions.map((item) => (
                                <CommandItem
                                    key={item}
                                    value={item}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                    className="flex items-center justify-between py-3 px-4 rounded-xl mx-2 my-1 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-sm font-medium transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Check
                                            className={cn(
                                                "h-4 w-4 text-indigo-600",
                                                value === item ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
