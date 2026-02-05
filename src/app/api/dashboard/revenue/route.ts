import { NextResponse } from 'next/server'

export async function GET() {
    // Mock data for revenue chart
    const data = [
        { name: 'Jan', revenue: 45000 },
        { name: 'Feb', revenue: 52000 },
        { name: 'Mar', revenue: 48000 },
        { name: 'Apr', revenue: 61000 },
        { name: 'May', revenue: 55000 },
        { name: 'Jun', revenue: 67000 },
        { name: 'Jul', revenue: 72000 },
        { name: 'Aug', revenue: 84000 },
        { name: 'Sep', revenue: 78000 },
        { name: 'Oct', revenue: 91000 },
        { name: 'Nov', revenue: 88000 },
        { name: 'Dec', revenue: 95000 }
    ]

    return NextResponse.json({
        success: true,
        data
    })
}
