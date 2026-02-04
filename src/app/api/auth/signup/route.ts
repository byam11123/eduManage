import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, validatePassword, isValidEmail } from '@/lib/auth-utils'
import { sendWelcomeEmail } from '@/lib/send-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, otp } = body

    console.log('=== SIGNUP REQUEST ====')
    console.log('Full Name:', fullName)
    console.log('Email:', email)
    console.log('OTP:', otp)
    console.log('Password length:', password?.length)

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
      console.log('Password validation failed')
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)',
        },
        { status: 400 }
      )
    }

    if (!otp || otp.length !== 6) {
      console.log('OTP validation failed - length:', otp?.length)
      return NextResponse.json(
        { success: false, error: 'OTP is required and must be 6 digits' },
        { status: 400 }
      )
    }

    console.log('All validations passed, checking OTP in database...')

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

    console.log('OTP Record found:', otpRecord ? 'Yes' : 'No')
    if (otpRecord) {
      console.log('OTP details:', {
        id: otpRecord.id,
        email: otpRecord.email,
        code: otpRecord.code,
        verified: otpRecord.verified,
        expiresAt: otpRecord.expiresAt,
        currentTime: new Date().toISOString(),
        isExpired: new Date() > otpRecord.expiresAt,
      })
    }

    if (!otpRecord) {
      console.log('OTP verification failed: No valid OTP found')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please request a new OTP.' },
        { status: 400 }
      )
    }

    console.log('OTP verified successfully, checking if user exists...')

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      console.log('User already exists:', existingUser.email)
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    console.log('Creating new user...')

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
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

    console.log('User created:', user.id)

    // Delete used OTP
    await db.otp.deleteMany({
      where: { email },
    })

    console.log('OTP deleted for email:', email)

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName)

    console.log('Welcome email sent')

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
