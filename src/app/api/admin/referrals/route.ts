import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'all' // referrers, referrals, or all

        const data: any = {}

        if (type === 'all' || type === 'referrers') {
            const referrers = await db.referrer.findMany({
                where: { organizationId: auth.organizationId },
                include: {
                    _count: {
                        select: { referrals: true }
                    },
                    referrals: {
                        where: { rewardStatus: 'paid' },
                        select: { rewardAmount: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            data.referrers = referrers.map(r => ({
                ...r,
                totalEarned: r.referrals.reduce((sum, ref) => sum + (ref.rewardAmount || 0), 0)
            }))
        }

        if (type === 'all' || type === 'referrals') {
            data.referrals = await db.referral.findMany({
                where: { organizationId: auth.organizationId },
                include: {
                    referrer: {
                        select: { name: true }
                    },
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                            admissionDisplayId: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        }

        // Calculate stats for overview if requested
        if (type === 'all') {
            const stats = {
                totalReferrers: await db.referrer.count({ where: { organizationId: auth.organizationId } }),
                totalReferrals: await db.referral.count({ where: { organizationId: auth.organizationId } }),
                converted: await db.referral.count({ 
                    where: { 
                        organizationId: auth.organizationId,
                        status: 'joined'
                    } 
                }),
                paidRewards: await db.referral.aggregate({
                    where: { 
                        organizationId: auth.organizationId,
                        rewardStatus: 'paid'
                    },
                    _sum: { rewardAmount: true }
                }),
                pendingRewards: await db.referral.aggregate({
                    where: { 
                        organizationId: auth.organizationId,
                        rewardStatus: 'unpaid'
                    },
                    _sum: { rewardAmount: true }
                })
            }
            data.stats = stats
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('[API Referrals GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const auth = await verifyAuth(request)
    if (!auth.success || !auth.organizationId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { action } = body

        if (action === 'createReferrer') {
            const referrer = await db.referrer.create({
                data: {
                    ...body.data,
                    organizationId: auth.organizationId
                }
            })
            return NextResponse.json({ success: true, data: referrer })
        }

        if (action === 'updateReferrer') {
            const { id, ...updateData } = body.data
            const referrer = await db.referrer.update({
                where: { id, organizationId: auth.organizationId },
                data: updateData
            })
            return NextResponse.json({ success: true, data: referrer })
        }

        if (action === 'deleteReferrer') {
            await db.referrer.delete({
                where: { id: body.id, organizationId: auth.organizationId }
            })
            return NextResponse.json({ success: true })
        }

        if (action === 'processPayout') {
            const { id, ...payoutData } = body.data
            try {
                const referral = await db.referral.update({
                    where: { id, organizationId: auth.organizationId },
                    data: {
                        rewardStatus: 'paid',
                        rewardAmount: payoutData.rewardAmount !== undefined ? Number(payoutData.rewardAmount) : undefined,
                        paidDate: new Date(),
                        payoutMode: payoutData.mode,
                        payoutTransactionId: payoutData.transactionId,
                        payoutRemarks: payoutData.remarks
                    }
                })
                return NextResponse.json({ success: true, data: referral })
            } catch (error: any) {
                console.error("PAYOUT_ERROR:", error)
                return NextResponse.json({ success: false, error: error.message }, { status: 500 })
            }
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        console.error('[API Referrals POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
