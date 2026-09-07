import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

/**
 * Single Lead API
 * PATCH  /api/leads/[id]  — update lead fields or stage
 * DELETE /api/leads/[id]  — remove lead
 */

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body   = await request.json()

        // Verify lead belongs to org
        const existing = await db.lead.findUnique({ where: { id } })
        if (!existing || existing.organizationId !== auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 })
        }

        const { firstName, lastName, email, phone, source, stage, company, value, notes, assignedTo } = body

        const lead = await db.lead.update({
            where: { id },
            data: {
                ...(firstName    !== undefined && { firstName }),
                ...(lastName     !== undefined && { lastName }),
                ...(email        !== undefined && { email }),
                ...(phone        !== undefined && { phone }),
                ...(source       !== undefined && { source }),
                ...(stage        !== undefined && { stage }),
                ...(company      !== undefined && { company }),
                ...(value        !== undefined && { value: parseFloat(value) }),
                ...(notes        !== undefined && { notes }),
                ...(assignedTo   !== undefined && { assignedTo }),
            }
        })

        return NextResponse.json({ success: true, lead })
    } catch (error) {
        console.error('[API /leads/:id PATCH] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify lead belongs to org
        const existing = await db.lead.findUnique({ where: { id } })
        if (!existing || existing.organizationId !== auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 })
        }

        await db.lead.delete({ where: { id } })

        return NextResponse.json({ success: true, message: 'Lead deleted successfully' })
    } catch (error) {
        console.error('[API /leads/:id DELETE] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
