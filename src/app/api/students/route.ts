import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

/**
 * Students API with branch-level access control
 * - Super Admin: Can see ALL students across ALL branches
 * - Branch Users: Can ONLY see students in their assigned branches
 */

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No session found' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const branchId = searchParams.get('branchId')
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        // Build the where clause based on user role
        let whereClause: Record<string, unknown> = {}

        // CRITICAL: Branch-level access control
        if (payload.role === 'super_admin') {
            // Super admin can see all students, optionally filter by branch
            if (branchId) {
                whereClause.branchId = branchId
            }
        } else {
            // Branch users can ONLY see students in their assigned branches
            if (branchId) {
                // Verify user has access to the requested branch
                if (!payload.branches.includes(branchId)) {
                    return NextResponse.json(
                        { success: false, error: 'Access denied to this branch' },
                        { status: 403 }
                    )
                }
                whereClause.branchId = branchId
            } else {
                // No specific branch requested, show students from all user's branches
                whereClause.branchId = { in: payload.branches }
            }
        }

        // Optional filters
        if (status) {
            whereClause.status = status
        }

        if (search) {
            whereClause.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
            ]
        }

        const students = await db.student.findMany({
            where: whereClause,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        console.log(`[API /students] User ${payload.email} (${payload.role}) fetched ${students.length} students`)

        return NextResponse.json({
            success: true,
            students,
            meta: {
                total: students.length,
                userRole: payload.role,
                userBranches: payload.branches
            }
        })
    } catch (error) {
        console.error('[API /students GET] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No session found' },
                { status: 401 }
            )
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            firstName, lastName, email, phone, dateOfBirth, gender,
            address, city, state, country, zipCode, branchId, notes,
            fathersName, fathersPhone, enrollmentNo,
            mothersName, category, maritalStatus,
            aadhaarNumber, alternatePhone, addressLine1, addressLine2, district,
            imageUrl
        } = body

        // Validation
        if (!firstName || !lastName) {
            return NextResponse.json(
                { success: false, error: 'First name and last name are required' },
                { status: 400 }
            )
        }

        if (!branchId) {
            return NextResponse.json(
                { success: false, error: 'Branch ID is required' },
                { status: 400 }
            )
        }

        // CRITICAL: Verify user has access to the target branch
        if (payload.role !== 'super_admin' && !payload.branches.includes(branchId)) {
            return NextResponse.json(
                { success: false, error: 'You cannot add students to this branch' },
                { status: 403 }
            )
        }

        // Verify the branch exists
        const branch = await db.branch.findUnique({ where: { id: branchId } })
        if (!branch) {
            return NextResponse.json(
                { success: false, error: 'Branch not found' },
                { status: 404 }
            )
        }

        const student = await db.student.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender,
                address,
                city,
                state,
                country,
                zipCode,
                branchId,
                imageUrl,
                notes,
                status: 'active'
            },
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        console.log(`[API /students POST] User ${payload.email} created student ${student.id} in branch ${branchId}`)

        return NextResponse.json({
            success: true,
            message: 'Student created successfully',
            student
        })
    } catch (error) {
        console.error('[API /students POST] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
