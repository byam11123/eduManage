import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Verify enquiry exists
        const enquiry = await db.enquiry.findUnique({
            where: { id }
        })

        if (!enquiry) {
            return NextResponse.json(
                { success: false, error: 'Enquiry not found' },
                { status: 404 }
            )
        }

        // Delete the enquiry
        await db.enquiry.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Enquiry deleted successfully'
        })

    } catch (error: any) {
        console.error('Delete Enquiry Error:', error)
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
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json()
        const { status } = body

        // Verify enquiry exists
        const enquiry = await db.enquiry.findUnique({
            where: { id }
        })

        if (!enquiry) {
            return NextResponse.json(
                { success: false, error: 'Enquiry not found' },
                { status: 404 }
            )
        }

        // Update enquiry status
        const updated = await db.enquiry.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({
            success: true,
            message: 'Enquiry updated successfully',
            enquiry: updated
        })

    } catch (error: any) {
        console.error('Update Enquiry Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
