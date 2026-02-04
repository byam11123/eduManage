import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    console.log('Verifying OTP:', { email, otp, timestamp: new Date().toISOString() })

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Find the most recent valid OTP (not yet verified and not expired) - case-insensitive email
    const otpRecord = await db.otp.findFirst({
      where: {
        email: {
          equals: email,  // Case-insensitive comparison
          mode: 'insensitive',
        },
        code: otp,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent one
      },
    })

    console.log('OTP Record found:', otpRecord ? 'Yes' : 'No')

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    })

    console.log('OTP marked as verified:', otpRecord.code)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
