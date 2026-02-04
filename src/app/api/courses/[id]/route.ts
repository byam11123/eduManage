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
