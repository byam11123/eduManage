import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, isValidEmail, signToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, remember } = body

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
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

    // Find organizationId
    let organizationId: string | undefined

    // 1. Check if user is an owner
    const ownedOrg = await db.organization.findUnique({
      where: { ownerId: user.id },
      select: { id: true }
    })

    if (ownedOrg) {
      organizationId = ownedOrg.id
    } else if (userBranches.length > 0) {
      // 2. Get from branch association
      organizationId = userBranches[0].branch.organizationId
    } else {
      // 3. Check membership
      const membership = await db.organizationMember.findFirst({
        where: { userId: user.id },
        select: { organizationId: true }
      })
      if (membership) {
        organizationId = membership.organizationId
      }
    }

    // Generate JWT token with role and branches
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: userRole,
      branches: userBranches.map(ub => ub.branchId),
      organizationId,
      defaultBranchId
    })

    // Set session cookie with JWT token
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days if remember, else 7 days (matches JWT expiry)
      path: '/',
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    // Fetch permissions
    const permissions = await db.modulePermission.findMany({
      where: {
        userId: user.id,
        canAccess: true
      },
      select: { module: true }
    })

    // Determine redirect path
    let redirectTo = '/organization' // Default fallback
    if (!organizationId) {
      redirectTo = '/organization'
    } else if (userRole === 'super_admin') {
      redirectTo = '/admin'
    } else if (userBranches.length > 0) {
      redirectTo = '/branch'
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        role: userRole,
        branches: userBranches.map(ub => ub.branchId),
        organizationId,
        permissions: permissions.map(p => p.module),
        defaultBranchId
      },
      hasOrganization: !!organizationId,
      redirectTo
    })
  } catch (error) {
    console.error('[API /auth/login] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
