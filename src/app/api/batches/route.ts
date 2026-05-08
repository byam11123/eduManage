import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

// GET: List all batches
export async function GET(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const batches = await db.batch.findMany({
            where: {
                course: {
                    organizationId: auth.organizationId
                }
            },
            include: {
                course: {
                    select: { name: true }
                },
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, batches })
    } catch (error) {
        console.error('Error fetching batches:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch batches' },
            { status: 500 }
        )
    }
}

// POST: Create a new batch
export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            name,
            description,
            courseId,
            startDate,
            endDate,
            startTime,
            endTime
        } = body

        if (!name || !courseId || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Verify course belongs to the organization
        const course = await db.course.findFirst({
            where: { id: courseId, organizationId: auth.organizationId }
        })

        if (!course) {
            return NextResponse.json({ success: false, error: 'Course not found or access denied' }, { status: 404 })
        }

        const batch = await db.batch.create({
            data: {
                name,
                description,
                courseId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                startTime,
                endTime,
                status: 'active'
            }
        })

        return NextResponse.json({ success: true, batch })
    } catch (error) {
        console.error('Error creating batch:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create batch' },
            { status: 500 }
        )
    }
}
