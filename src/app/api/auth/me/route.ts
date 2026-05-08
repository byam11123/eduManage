import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')

    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const sessionCookie = cookies.find(c => c.startsWith('session='))
      if (sessionCookie) {
        token = sessionCookie.substring('session='.length)
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload) {
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

    if (!user) {
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

    // Fetch organization context
    let organization: any = null
    if (payload.organizationId) {
      organization = await db.organization.findUnique({
        where: { id: payload.organizationId },
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true
        }
      })
    } else {
      // Fallback: check if user owns any organization
      organization = await db.organization.findFirst({
        where: { ownerId: payload.userId },
        select: {
          id: true,
          name: true,
          logo: true,
          slug: true
        }
      })
    }

    // Fetch permissions
    const permissions = await db.modulePermission.findMany({
      where: {
        userId: payload.userId,
        canAccess: true
      },
      select: { module: true }
    })

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        role: userRole,
        organizationId: organization?.id || payload.organizationId,
        organization,
        branches: userBranches.map(ub => ({
          id: ub.branch.id,
          name: ub.branch.name,
          isDefault: ub.isDefault
        })),
        permissions: permissions.map(p => p.module),
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
