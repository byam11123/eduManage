import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify user access to this course (via organization)
        const user = await db.user.findUnique({
            where: { id: auth.userId },
            include: {
                ownedOrganization: true,
                organizations: {
                    include: {
                        organization: true
                    }
                }
            }
        })

        const organization = user?.ownedOrganization || user?.organizations[0]?.organization

        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        const course = await db.course.findUnique({
            where: {
                id,
                organizationId: organization.id
            },
            include: {
                subjects: true,
                students: {
                    include: {
                        branch: true
                    },
                    orderBy: {
                        enrollmentDate: 'desc'
                    }
                }
            }
        })

        if (!course) {
            return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, course })
    } catch (error) {
        console.error('Error fetching course:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 })
    }
}

// PATCH: Update a course
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { name, description, fee, feeDescription, durationYears, durationMonths, maxInstallments, status } = body

        // Verify user access
        const user = await db.user.findUnique({
            where: { id: auth.userId },
            include: {
                ownedOrganization: true,
                organizations: { include: { organization: true } }
            }
        })

        const organization = user?.ownedOrganization || user?.organizations[0]?.organization
        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        // Verify course belongs to organization
        const existingCourse = await db.course.findFirst({
            where: { id, organizationId: organization.id }
        })

        if (!existingCourse) {
            return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
        }

        const updatedCourse = await db.course.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(fee !== undefined && { fee: parseFloat(fee) }),
                ...(feeDescription !== undefined && { feeDescription }),
                ...(durationYears !== undefined && { durationYears: parseInt(durationYears) }),
                ...(durationMonths !== undefined && { durationMonths: parseInt(durationMonths) }),
                ...(maxInstallments !== undefined && { maxInstallments: parseInt(maxInstallments) }),
                ...(status && { status })
            }
        })

        return NextResponse.json({ success: true, course: updatedCourse })
    } catch (error) {
        console.error('Error updating course:', error)
        return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 })
    }
}

// DELETE: Delete a course
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify user access
        const user = await db.user.findUnique({
            where: { id: auth.userId },
            include: {
                ownedOrganization: true,
                organizations: { include: { organization: true } }
            }
        })

        const organization = user?.ownedOrganization || user?.organizations[0]?.organization
        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        // Verify course belongs to organization
        const existingCourse = await db.course.findFirst({
            where: { id, organizationId: organization.id }
        })

        if (!existingCourse) {
            return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
        }

        await db.course.delete({ where: { id } })

        return NextResponse.json({ success: true, message: 'Course deleted successfully' })
    } catch (error) {
        console.error('Error deleting course:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 })
    }
}
