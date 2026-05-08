import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, validatePassword, isValidEmail } from '@/lib/auth-utils'
import { sendWelcomeEmail } from '@/lib/send-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, otp } = body

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!password || !validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)',
        },
        { status: 400 }
      )
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'OTP is required and must be 6 digits' },
        { status: 400 }
      )
    }


    // Check if OTP is verified
    const otpRecord = await db.otp.findFirst({
      where: {
        email: email.toLowerCase(),
        code: otp,
        verified: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    // Create user
    let user
    try {
      user = await db.user.create({
        data: {
          fullName: fullName.trim(),
          email: email.toLowerCase(),
          password: hashedPassword,
          isVerified: true,
          emailVerified: new Date(),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          isVerified: true,
          createdAt: true,
        },
      })
    } catch (dbError) {
      console.error('DB User Create Error:', dbError)
      throw dbError
    }

    // Delete used OTP
    await db.otp.deleteMany({
      where: { email },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullName)
    } catch (emailError) {
      console.error('Email sending failed (non-blocking):', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user,
    })
  } catch (error: any) {
    console.error('Signup error (Detailed):', {
      message: error.message,
      stack: error.stack,
      details: error
    })
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message || 'Unknown'}` },
      { status: 500 }
    )
  }
}
