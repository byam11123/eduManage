import { NextResponse } from 'next/server'

export async function GET() {
    // Mock data for dashboard stats
    const stats = {
        totalStudents: 156,
        activeStudents: 142,
        totalRevenue: 1250000,
        pendingFees: 45000,
        totalCourses: 12,
        totalBatches: 8,
        totalEnquiries: 45,
        recentEnquiries: 12
    }

    return NextResponse.json({
        success: true,
        stats
    })
}
