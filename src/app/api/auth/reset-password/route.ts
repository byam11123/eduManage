import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, validatePassword, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirmPassword } = body

    // Validation
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
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

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Find valid reset token
    const resetRecord = await db.passwordReset.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    })

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: resetRecord.email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    // Mark reset token as used
    await db.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    })

    // Delete all other reset tokens for this user
    await db.passwordReset.deleteMany({
      where: {
        email: resetRecord.email,
        NOT: { id: resetRecord.id },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
