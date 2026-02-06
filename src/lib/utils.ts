import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get user initials from full name
 * @param name - Full name of the user
 * @returns Initials (max 2 characters)
 */
export function getUserInitials(name: string): string {
  if (!name) return 'U'

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Format a date string or object to a human-readable string
 * @param date - Date string or object
 * @returns Formatted date string (e.g. "12 Oct, 2023")
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return '-'

  try {
    const d = new Date(date)
    // Check if valid date
    if (isNaN(d.getTime())) return '-'

    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d)
  } catch (error) {
    return '-'
  }
}

/**
 * Format a number as currency (INR)
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  const val = Number(amount || 0)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val)
}
