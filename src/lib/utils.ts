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

// ===========================================
// STUDENT FINANCIAL HELPERS
// ===========================================

import type { Student, InstallmentPlanItem, StudentCourse, Installment } from '@/lib/types'

/**
 * Safely parse the installment plan from a student record
 * @param plan - The installmentPlan field (string or array)
 * @returns Array of InstallmentPlanItem
 */
export function parseInstallmentPlan(plan: string | any[] | null | undefined): InstallmentPlanItem[] {
  if (!plan) return []
  try {
    const parsed = typeof plan === 'string' ? JSON.parse(plan) : plan
    // Ensure it is an array
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error("Failed to parse installment plan", e)
    return []
  }
}

/**
 * Calculate financial metrics for a student
 * @param student - The student object
 * @returns Object containing calculated metrics
 */
export function calculateStudentFinancials(student: Student) {
  // 1. Parse Installments
  const installments = parseInstallmentPlan(student.installmentPlan)

  // 2. Base Fees
  const grossFee = Number(student.totalAmount) || 0
  const discount = Number(student.discountAmount) || 0
  const netPayable = Number(student.netPayableFee) || (grossFee - discount)

  // 3. Paid & Due
  const totalPaid = installments.reduce((acc, item) => {
    // Only count as paid if status is explicitly 'paid'
    const isPaid = item.status === 'paid'
    const amount = Number(item.paidAmount) || 0
    return acc + (isPaid ? amount : 0)
  }, 0)

  const totalDue = Math.max(0, netPayable - totalPaid)

  // 4. Status
  let status: 'PAID' | 'PARTIAL' | 'DUE' | 'PENDING' = 'PENDING'
  if (totalDue === 0 && totalPaid > 0) status = 'PAID'
  else if (totalPaid > 0 && totalDue > 0) status = 'PARTIAL'
  else if (totalPaid === 0) status = 'DUE'

  return {
    grossFee,
    discount,
    netPayable,
    totalPaid,
    totalDue,
    status,
    installments
  }
}

// Multi-Course Financial Helpers
export function calculateCourseFinancials(courseEnrollment: StudentCourse) {
  if (!courseEnrollment) return null

  // 1. Base Fees
  const grossFee = Number(courseEnrollment.totalFee) || 0
  const discount = Number(courseEnrollment.discountAmount) || 0
  const netPayable = Number(courseEnrollment.netPayable) || (grossFee - discount)

  // 2. Paid & Due (from relational installments)
  const installments = courseEnrollment.installments || []

  const totalPaid = installments.reduce((acc: number, item: Installment) => {
    // Only count valid payments (status: paid or partial)
    // Or trust 'paidAmount' field
    return acc + (Number(item.paidAmount) || 0)
  }, 0)

  const totalDue = Math.max(0, netPayable - totalPaid)

  // 3. Status
  let status: 'PAID' | 'PARTIAL' | 'DUE' | 'PENDING' = 'PENDING'
  if (totalDue === 0 && totalPaid > 0) status = 'PAID'
  else if (totalPaid > 0 && totalDue > 0) status = 'PARTIAL'
  else if (totalPaid === 0) status = 'DUE' // default if enrollment exists

  return {
    grossFee,
    discount,
    netPayable,
    totalPaid,
    totalDue,
    status,
    installments
  }
}

export function calculateAggregatedFinancials(studentCourses: StudentCourse[]) {
  const totals = {
    totalCourseFee: 0,
    totalDiscount: 0,
    netPayable: 0,
    totalPaid: 0,
    totalDue: 0
  }

  if (!studentCourses || !Array.isArray(studentCourses)) return totals

  studentCourses.forEach(course => {
    const stats = calculateCourseFinancials(course)
    if (stats) {
      totals.totalCourseFee += stats.grossFee
      totals.totalDiscount += stats.discount
      totals.netPayable += stats.netPayable
      totals.totalPaid += stats.totalPaid
      totals.totalDue += stats.totalDue
    }
  })

  return totals
}
