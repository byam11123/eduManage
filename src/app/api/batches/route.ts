
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: List all batches
export async function GET(req: Request) {
    try {
        const batches = await db.batch.findMany({
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
