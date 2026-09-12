import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, extractToken, verifyToken } from '@/lib/auth-utils'

/**
 * NextAuth compatible session endpoint
 * Returns user session if token is valid, or null/empty if unauthenticated.
 */
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request)
    if (!token) {
      return NextResponse.json(null, { status: 200 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(null, { status: 200 })
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
      },
    })

    if (!user) {
      return NextResponse.json(null, { status: 200 })
    }

    // Determine role
    const userBranches = await db.userBranch.findMany({
      where: { userId: payload.userId },
    })

    let userRole = payload.role || 'user'
    for (const ub of userBranches) {
      if (ub.role === 'super_admin') {
        userRole = 'super_admin'
        break
      } else if (ub.role === 'branch_admin' && userRole !== 'super_admin') {
        userRole = 'branch_admin'
      }
    }

    const expiresAt = payload.exp
      ? new Date(payload.exp * 1000).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          image: user.image,
          role: userRole,
          organizationId: payload.organizationId,
          branches: payload.branches,
        },
        expires: expiresAt,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API /auth/session] Error:', error)
    return NextResponse.json(null, { status: 200 })
  }
}
