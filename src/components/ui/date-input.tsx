"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateInputProps {
    value?: string // Expects YYYY-MM-DD or empty
    onChange?: (value: string) => void // Returns YYYY-MM-DD
    id?: string
    name?: string
    placeholder?: string
    disabled?: boolean
    className?: string
}

// Convert YYYY-MM-DD to DD/MM/YYYY for display
function toDisplayFormat(isoDate: string): string {
    if (!isoDate) return ""
    const [year, month, day] = isoDate.split("-")
    if (!year || !month || !day) return ""
    return `${day}/${month}/${year}`
}

// Convert DD/MM/YYYY to YYYY-MM-DD for storage
function toISOFormat(displayDate: string): string {
    if (!displayDate) return ""
    const parts = displayDate.split("/")
    if (parts.length !== 3) return ""
    const [day, month, year] = parts
    if (!day || !month || !year || year.length !== 4) return ""
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

// Validate DD/MM/YYYY format
function isValidDisplayDate(displayDate: string): boolean {
    if (!displayDate) return true
    const regex = /^\d{2}\/\d{2}\/\d{4}$/
    if (!regex.test(displayDate)) return false
    const [day, month, year] = displayDate.split("/").map(Number)
    const date = new Date(year, month - 1, day)
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    )
}

export function DateInput({
    value = "",
    onChange,
    id,
    name,
    placeholder = "DD/MM/YYYY",
    disabled = false,
    className,
}: DateInputProps) {
    const [displayValue, setDisplayValue] = React.useState(toDisplayFormat(value))
    const [isOpen, setIsOpen] = React.useState(false)

    // Sync display value when prop changes
    React.useEffect(() => {
        setDisplayValue(toDisplayFormat(value))
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value

        // Auto-format: add slashes as user types
        const digits = input.replace(/\D/g, "")
        if (digits.length <= 2) {
            input = digits
        } else if (digits.length <= 4) {
            input = `${digits.slice(0, 2)}/${digits.slice(2)}`
        } else {
            input = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
        }

        setDisplayValue(input)

        // Only call onChange when we have a valid complete date
        if (isValidDisplayDate(input)) {
            const isoDate = toISOFormat(input)
            onChange?.(isoDate)
        } else if (input === "") {
            onChange?.("")
        }
    }

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            const isoDate = `${year}-${month}-${day}`
            setDisplayValue(toDisplayFormat(isoDate))
            onChange?.(isoDate)
        }
        setIsOpen(false)
    }

    const selectedDate = value ? new Date(value) : undefined

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn("pr-10", className)}
                    maxLength={10}
                />
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        disabled={disabled}
                    >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
