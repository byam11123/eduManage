import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proofs')
        await mkdir(uploadDir, { recursive: true })

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return NextResponse.json({ 
            success: true, 
            url: `/uploads/proofs/${filename}` 
        })
    } catch (error) {
        console.error('[API Upload] Error:', error)
        return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 })
    }
}
