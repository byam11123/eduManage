import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // board, university, college

        if (!type) {
            return NextResponse.json({ success: false, error: 'Type is required' }, { status: 400 })
        }

        let suggestions: any[] = []

        if (type === 'board') {
            suggestions = await db.educationBoard.findMany({ orderBy: { name: 'asc' } })
        } else if (type === 'university') {
            suggestions = await db.educationUniversity.findMany({ orderBy: { name: 'asc' } })
        } else if (type === 'college') {
            suggestions = await db.educationCollege.findMany({ orderBy: { name: 'asc' } })
        } else if (type === 'school') {
            suggestions = await db.educationSchool.findMany({ orderBy: { name: 'asc' } })
        } else if (type === 'degree') {
            suggestions = await db.educationDegree.findMany({ orderBy: { name: 'asc' } })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            suggestions: suggestions.map(s => s.name)
        })

    } catch (error) {
        console.error('[API Education Suggestions GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, name } = body

        if (!type || !name) {
            return NextResponse.json({ success: false, error: 'Type and name are required' }, { status: 400 })
        }

        let newSuggestion: any

        if (type === 'board') {
            newSuggestion = await db.educationBoard.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        } else if (type === 'university') {
            newSuggestion = await db.educationUniversity.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        } else if (type === 'college') {
            newSuggestion = await db.educationCollege.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        } else if (type === 'school') {
            newSuggestion = await db.educationSchool.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        } else if (type === 'degree') {
            newSuggestion = await db.educationDegree.upsert({
                where: { name },
                update: {},
                create: { name }
            })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            suggestion: newSuggestion.name
        })

    } catch (error) {
        console.error('[API Education Suggestions POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
