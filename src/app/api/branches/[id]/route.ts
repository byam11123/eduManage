import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

// Helper for auth
async function verifySuperAdminOrOwner(request: NextRequest, branchId: string) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.userId) {
        return { authorized: false, error: 'Unauthorized', status: 401 }
    }

    // 1. Check if Organization Owner
    const org = await db.organization.findUnique({
        where: { ownerId: auth.userId }
    })

    if (org) {
        // Confirm branch belongs to this org
        const branch = await db.branch.findFirst({
            where: { id: branchId, organizationId: org.id }
        })
        if (!branch) return { authorized: false, error: 'Branch not found or access denied', status: 404 }
        return { authorized: true, role: 'owner', branch }
    }

    // 2. Check if Super Admin (via User role directly if applicable, but currently rely on userBranch table for roles)
    // Actually, usually Super Admin is global. Let's see how auth-utils defines it.
    // If payload.role === 'super_admin'

    // For deleting/editing a branch, usually only the Organization Owner should do it.
    // Branch Admins shouldn't delete the branch itself.

    return { authorized: false, error: 'Access denied. Only organization owners can manage branches.', status: 403 }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const branch = await db.branch.findUnique({
            where: { id }
        })

        if (!branch) {
            return NextResponse.json(
                { success: false, error: 'Branch not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            branch
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const verification = await verifySuperAdminOrOwner(request, id)
        if (!verification.authorized) {
            return NextResponse.json(
                { success: false, error: verification.error },
                { status: verification.status || 500 }
            )
        }

        const body = await request.json()
        const { name, address, city, state, zipCode, phone, email, description, isActive } = body

        // Check name uniqueness if changed
        if (name && name !== verification.branch?.name) {
            const existing = await db.branch.findFirst({
                where: {
                    organizationId: verification.branch?.organizationId,
                    name: name,
                    id: { not: id }
                }
            })
            if (existing) {
                return NextResponse.json(
                    { success: false, error: 'Branch name already exists' },
                    { status: 400 }
                )
            }
        }

        const updatedBranch = await db.branch.update({
            where: { id },
            data: {
                name, address, city, state, zipCode, phone, email, description, isActive
            }
        })

        return NextResponse.json({
            success: true,
            branch: updatedBranch
        })

    } catch (error) {
        console.error('Update Branch Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const verification = await verifySuperAdminOrOwner(request, id)
        if (!verification.authorized) {
            return NextResponse.json(
                { success: false, error: verification.error },
                { status: verification.status || 500 }
            )
        }

        // Check for dependencies
        const studentCount = await db.student.count({ where: { branchId: id } })
        if (studentCount > 0) {
            return NextResponse.json(
                { success: false, error: `Cannot delete branch. It has ${studentCount} students.` },
                { status: 400 }
            )
        }

        await db.branch.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Branch deleted successfully'
        })

    } catch (error) {
        console.error('Delete Branch Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
