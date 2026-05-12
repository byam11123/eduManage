import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No session found' },
                { status: 401 }
            )
        }

        const payload = await verifyToken(token)
        if (!payload || !payload.organizationId) {
            return NextResponse.json(
                { success: false, error: 'Invalid token or missing organization context' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { ids } = body

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No student IDs provided for deletion' },
                { status: 400 }
            )
        }

        // Verify that all requested students belong to the user's organization
        // and user has access to their branches
        let whereClause: Record<string, any> = {
            id: { in: ids },
            branch: { organizationId: payload.organizationId }
        }

        if (payload.role !== 'super_admin') {
            whereClause.branchId = { in: payload.branches }
        }

        // Optional: First find which students are actually eligible to be deleted
        const eligibleStudents = await db.student.findMany({
            where: whereClause,
            select: { id: true }
        })

        const eligibleIds = eligibleStudents.map(s => s.id)

        if (eligibleIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No matching records found or access denied' },
                { status: 403 }
            )
        }

        // Perform bulk deletion
        const deleteResult = await db.student.deleteMany({
            where: {
                id: { in: eligibleIds }
            }
        })

        console.log(`[API /students/bulk/delete] User ${payload.email} bulk deleted ${deleteResult.count} students`)

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${deleteResult.count} record(s)`,
            deletedCount: deleteResult.count
        })

    } catch (error) {
        console.error('[API /students/bulk/delete] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to process bulk deletion' },
            { status: 500 }
        )
    }
}
