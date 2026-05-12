import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json({ success: false, error: 'No session found' }, { status: 401 })
        }

        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
        }

        const { students, branchId } = await request.json()

        if (!students || !Array.isArray(students)) {
            return NextResponse.json({ success: false, error: 'No student data provided' }, { status: 400 })
        }

        // We only check against the current branch for conflicts to allow multi-branch setups, 
        // unless they want global uniqueness. For now, check branch-specific or global if preferred.
        // Usually, Aadhaar and Email should be globally unique, but let's check globally to be safe.

        const emailsToCheck = students.map(s => s.email).filter(Boolean)
        const aadhaarsToCheck = students.map(s => s.aadhaarNumber?.toString()).filter(Boolean)

        let existingEmails: any[] = []
        let existingAadhaars: any[] = []

        if (emailsToCheck.length > 0) {
            existingEmails = await db.student.findMany({
                where: { email: { in: emailsToCheck } },
                select: { id: true, email: true, firstName: true, lastName: true }
            })
        }

        if (aadhaarsToCheck.length > 0) {
            existingAadhaars = await db.student.findMany({
                where: { aadhaarNumber: { in: aadhaarsToCheck } },
                select: { id: true, aadhaarNumber: true, firstName: true, lastName: true }
            })
        }

        const emailMap = new Map(existingEmails.map(s => [s.email, s]))
        const aadhaarMap = new Map(existingAadhaars.map(s => [s.aadhaarNumber, s]))

        const results = students.map((student, index) => {
            const rowErrors: string[] = []
            const rowWarnings: string[] = []

            // 1. Mandatory Fields Validation
            if (!student.firstName || student.firstName.trim() === '') {
                rowErrors.push('First Name is required')
            }
            if (!student.phone || student.phone.toString().trim() === '') {
                rowErrors.push('Phone Number is required')
            }

            // 2. Database Match Validation (Email & Aadhaar)
            if (student.email && emailMap.has(student.email)) {
                const match = emailMap.get(student.email)
                rowWarnings.push(`Email matches existing student: ${match.firstName} ${match.lastName}`)
            }
            
            if (student.aadhaarNumber && aadhaarMap.has(student.aadhaarNumber.toString())) {
                const match = aadhaarMap.get(student.aadhaarNumber.toString())
                rowWarnings.push(`Aadhaar matches existing student: ${match.firstName} ${match.lastName}`)
            }

            return {
                index,
                errors: rowErrors,
                warnings: rowWarnings,
                isValid: rowErrors.length === 0,
                hasMatches: rowWarnings.length > 0
            }
        })

        const totalErrors = results.reduce((acc, curr) => acc + curr.errors.length, 0)
        const totalWarnings = results.reduce((acc, curr) => acc + curr.warnings.length, 0)

        return NextResponse.json({
            success: true,
            results,
            summary: {
                totalRows: students.length,
                totalErrors,
                totalWarnings,
                isValid: totalErrors === 0
            }
        })

    } catch (error: any) {
        console.error('[API /students/bulk/validate POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
