import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, isValidEmail, signToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('[API /auth/login] ========== LOGIN ATTEMPT START ==========')
    const body = await request.json()
    const { email, password, remember } = body

    console.log('[API /auth/login] Request body:', { email, password: `***** (${password.length} chars)`, remember })

    // Validation
    if (!email || !isValidEmail(email)) {
      console.log('[API /auth/login] ❌ Invalid email format')
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!password) {
      console.log('[API /auth/login] ❌ Password missing')
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    console.log('[API /auth/login] Database query:', { email: email.toLowerCase() })
    console.log('[API /auth/login] User found:', !!user)
    
    if (!user) {
      console.log('[API /auth/login] ❌ User not found in database')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('[API /auth/login] User email in DB:', user.email)
    console.log('[API /auth/login] User email from request:', email)
    console.log('[API /auth/login] Emails match:', user.email.toLowerCase() === email.toLowerCase())

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    console.log('[API /auth/login] Password verification result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('[API /auth/login] ❌ Password verification failed')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Fetch user's branches and determine role
    const userBranches = await db.userBranch.findMany({
      where: { userId: user.id },
      include: { branch: true }
    })

    console.log('[API /auth/login] User branches found:', userBranches.length)

    // Determine user role based on their assignments
    let userRole = 'user' // default role
    let defaultBranchId: string | undefined

    for (const userBranch of userBranches) {
      if (userBranch.role === 'super_admin') {
        userRole = 'super_admin'
        break // super_admin has highest priority
      } else if (userBranch.role === 'branch_admin' && userRole !== 'super_admin') {
        userRole = 'branch_admin'
      }

      if (userBranch.isDefault) {
        defaultBranchId = userBranch.branchId
      }
    }

    // If no default branch is set, use the first available branch
    if (!defaultBranchId && userBranches.length > 0) {
      defaultBranchId = userBranches[0].branchId
    }

    console.log('[API /auth/login] Determined role:', userRole)
    console.log('[API /auth/login] Branches:', userBranches.map(ub => ub.branchId))
    console.log('[API /auth/login] Default branch:', defaultBranchId)

    // Generate JWT token with role and branches
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: userRole,
      branches: userBranches.map(ub => ub.branchId),
      defaultBranchId
    })

    console.log('[API /auth/login] Token generated (first 10 chars):', token.substring(0, 10))

    // Set session cookie with JWT token
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days if remember, else 7 days (matches JWT expiry)
      path: '/',
    })

    console.log('[API /auth/login] Session cookie set')

    // Check if user has an organization
    const organization = await db.organization.findUnique({
      where: { ownerId: user.id }
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    console.log('[API /auth/login] Returning success response')
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        role: userRole,
        branches: userBranches.map(ub => ub.branchId),
        defaultBranchId
      },
      hasOrganization: !!organization,
      redirectTo: !organization ? '/organization' : (userRole === 'super_admin' ? '/admin' : '/branch')
    })
  } catch (error) {
    console.error('[API /auth/login] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
