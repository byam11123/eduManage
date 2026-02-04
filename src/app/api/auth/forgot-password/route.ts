import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken, isValidEmail } from '@/lib/auth-utils'
import { sendPasswordResetEmail } from '@/lib/send-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent.',
      })
    }

    // Generate reset token
    const token = generateToken()

    // Calculate expiry time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any previous reset tokens for this email
    await db.passwordReset.deleteMany({
      where: { email },
    })

    // Save reset token to database
    await db.passwordReset.create({
      data: {
        email: user.email,
        token,
        expiresAt,
        userId: user.id,
      },
    })

    // Create reset link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/?view=reset-password&token=${token}`

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.fullName,
      resetLink
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Still return success to not reveal if user exists
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset link will be sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
