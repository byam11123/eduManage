import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const organization = await db.organization.findUnique({
            where: { id: params.id }
        })

        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        // Verify user has access to this organization
        if (organization.id !== auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        return NextResponse.json({ success: true, data: organization })
    } catch (error) {
        console.error('[API Organization GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        
        // Verify user has access to this organization
        if (params.id !== auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        const updated = await db.organization.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('[API Organization PATCH] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
