import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    console.log('[API /auth/me] Request received')

    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')

    console.log('[API /auth/me] Auth header:', authHeader)
    console.log('[API /auth/me] Cookie header:', cookieHeader)

    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
      console.log('[API /auth/me] Using token from auth header')
    } else if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const sessionCookie = cookies.find(c => c.startsWith('session='))
      if (sessionCookie) {
        token = sessionCookie.substring('session='.length)
        console.log('[API /auth/me] Using token from cookie')
      }
    }

    console.log('[API /auth/me] Token:', token ? `${token.substring(0, 10)}...` : 'NOT FOUND')

    if (!token) {
      console.log('[API /auth/me] No token found - returning 401')
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    console.log('[API /auth/me] Token payload:', payload)

    if (!payload) {
      console.log('[API /auth/me] Invalid token - returning 401')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        isVerified: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    console.log('[API /auth/me] User found:', !!user)

    if (!user) {
      console.log('[API /auth/me] User not found - returning 404')
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's branches and role
    const userBranches = await db.userBranch.findMany({
      where: { userId: payload.userId },
      include: {
        branch: true
      }
    });

    // Determine user role based on their assignments
    let userRole = 'user'; // default role
    let defaultBranchId: string | undefined;

    for (const userBranch of userBranches) {
      if (userBranch.role === 'super_admin') {
        userRole = 'super_admin';
        break; // super_admin has highest priority
      } else if (userBranch.role === 'branch_admin' && userRole !== 'super_admin') {
        userRole = 'branch_admin';
      }

      if (userBranch.isDefault) {
        defaultBranchId = userBranch.branchId;
      }
    }

    // If no default branch is set, use the first available branch
    if (!defaultBranchId && userBranches.length > 0) {
      defaultBranchId = userBranches[0].branchId;
    }

    console.log('[API /auth/me] Returning user data with branches')
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        role: userRole,
        branches: userBranches.map(ub => ub.branchId),
        defaultBranchId
      },
    })
  } catch (error) {
    console.error('[API /auth/me] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
