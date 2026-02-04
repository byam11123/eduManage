import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateOtp, isValidEmail } from '@/lib/auth-utils'
import { sendOtpEmail } from '@/lib/send-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = generateOtp(6)

    // Calculate expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any previous OTPs for this email
    await db.otp.deleteMany({
      where: { email },
    })

    // Save OTP to database
    await db.otp.create({
      data: {
        email,
        code: otp,
        expiresAt,
      },
    })

    // Send OTP email
    const emailResult = await sendOtpEmail(email, otp, fullName.trim())

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // For development only, return OTP in response (remove in production)
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
