import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(req: Request) {
    try {
        const auth = await verifyAuth(req)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Get user's organization
        const user = await db.user.findUnique({
            where: { id: auth.userId },
            include: {
                ownedOrganization: {
                    include: {
                        courses: {
                            include: {
                                subjects: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                },
                organizations: {
                    include: {
                        organization: {
                            include: {
                                courses: {
                                    include: {
                                        subjects: true
                                    },
                                    orderBy: {
                                        createdAt: 'desc'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        const organization = user.ownedOrganization || user.organizations[0]?.organization

        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            courses: organization.courses
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

        // Get organization
        const user = await db.user.findUnique({
            where: { id: auth.userId },
            include: {
                ownedOrganization: true,
                organizations: {
                    include: {
                        organization: true
                    }
                }
            }
        })

        const organization = user?.ownedOrganization || user?.organizations[0]?.organization

        if (!organization) {
            return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 })
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
                organizationId: organization.id,
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
