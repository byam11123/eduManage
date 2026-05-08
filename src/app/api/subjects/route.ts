import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { name, description, courseId } = body

        if (!name || !courseId) {
            return NextResponse.json({ success: false, error: 'Name and courseId are required' }, { status: 400 })
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        // Check if course belongs to org
        const course = await db.course.findFirst({
            where: { id: courseId, organizationId: auth.organizationId }
        })

        if (!course) {
            return NextResponse.json({ success: false, error: 'Course not found or access denied' }, { status: 404 })
        }

        // Create subject
        const subject = await db.subject.create({
            data: {
                name,
                description,
                courseId
            }
        })

        return NextResponse.json({ success: true, subject })

    } catch (error) {
        console.error('Error creating subject:', error)
        return NextResponse.json({ success: false, error: 'Failed to create subject' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'Subject ID is required' }, { status: 400 })
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const subject = await db.subject.findUnique({
            where: { id },
            include: {
                course: true
            }
        })

        if (!subject || subject.course.organizationId !== auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Subject not found or access denied' }, { status: 403 })
        }

        await db.subject.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting subject:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete subject' }, { status: 500 })
    }
}
