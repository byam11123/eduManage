import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const organization = await db.organization.findUnique({
            where: { id: auth.organizationId }
        })

        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: organization })
    } catch (error) {
        console.error('[API Organization Current GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
