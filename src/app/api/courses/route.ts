import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        const courses = await db.course.findMany({
            where: { organizationId: auth.organizationId },
            include: { subjects: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            courses
        })
    } catch (error) {
        console.error('Error fetching courses:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            name,
            description,
            courseType,
            mode,
            fee,
            feeDescription,
            registrationFee,
            discountAllowed,
            discountPercentage,
            durationYears,
            durationMonths,
            maxInstallments,
            installmentAmounts,
            eligibility,
            status,
            subjects
        } = body

        if (!name || fee === undefined) {
            return NextResponse.json({ success: false, error: 'Name and fee are required' }, { status: 400 })
        }

        if (!auth.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        // Create course with subjects
        const course = await db.course.create({
            data: {
                name,
                description,
                courseType: courseType || null,
                mode: mode || 'offline',
                fee: parseFloat(fee),
                feeDescription,
                registrationFee: parseFloat(registrationFee || '0'),
                discountAllowed: discountAllowed || false,
                discountPercentage: parseFloat(discountPercentage || '0'),
                durationYears: parseInt(durationYears || '0'),
                durationMonths: parseInt(durationMonths || '0'),
                maxInstallments: parseInt(maxInstallments || '1'),
                installmentAmounts: installmentAmounts ? JSON.stringify(installmentAmounts) : null,
                eligibility: eligibility || null,
                status: status || 'active',
                organizationId: auth.organizationId,
                subjects: {
                    create: subjects?.filter((s: any) => s && (typeof s === 'string' ? s.trim() : s.name?.trim())).map((s: any) => ({
                        name: typeof s === 'string' ? s : s.name,
                        description: typeof s === 'string' ? '' : (s.description || '')
                    })) || []
                }
            },
            include: {
                subjects: true
            }
        })

        return NextResponse.json({
            success: true,
            course
        })

    } catch (error) {
        console.error('Error creating course:', error)
        return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 })
    }
}
