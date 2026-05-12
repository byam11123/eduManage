import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, signToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'
import { generateId } from '@/lib/utils/id-generator'

export async function GET(request: NextRequest) {
  try {
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

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get organization by owner
    const organization = await db.organization.findUnique({
      where: { ownerId: payload.userId },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({
        success: true,
        organization: null,
      })
    }

    return NextResponse.json({
      success: true,
      organization,
    })
  } catch (error) {
    console.error('[API /organization] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, industry, size, website, phone, email, address, city, state, country, zipCode, logo } = body

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Organization name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36)

    // Check if user already has an organization
    const existingOrg = await db.organization.findUnique({
      where: { ownerId: payload.userId },
    })

    if (existingOrg) {
      return NextResponse.json(
        { success: false, error: 'You already have an organization' },
        { status: 400 }
      )
    }

    // Create organization with default branch and super_admin assignment
    const organization = await db.organization.create({
      data: {
        ownerId: payload.userId,
        name,
        slug,
        description,
        logo,
        industry,
        size,
        website,
        phone,
        email,
        address,
        city,
        state,
        country,
        zipCode,
        // Auto-create Head Office branch
        branches: {
          create: {
            name: 'Head Office',
            description: 'Main branch / Head Office',
            address,
            city,
            state,
            country,
            zipCode,
            phone,
            email,
            isActive: true,
          }
        }
      },
      include: {
        branches: true
      }
    })

    // Assign the organization owner as super_admin of the Head Office branch
    const headOfficeBranch = organization.branches[0]
    if (headOfficeBranch) {
      const idData = await generateId('STAFF')
      await db.userBranch.create({
        data: {
          userId: payload.userId,
          branchId: headOfficeBranch.id,
          role: 'super_admin',
          employeeCode: idData.displayId,
          isDefault: true,
        }
      })

      // Also create organization membership for the owner
      await db.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: payload.userId,
          role: 'owner',
          status: 'active',
          joinedAt: new Date()
        }
      })

      // NEW: Grant all module permissions to the organization owner (Super Admin)
      const allModules = [
        'dashboard', 'enquiry', 'leads', 'students', 'fees', 'batches', 
        'attendance', 'courses', 'branches', 'staff', 'timetable', 
        'chat', 'notice', 'tickets', 'forms', 'expenses', 'certificate', 'settings'
      ]

      await db.modulePermission.createMany({
        data: allModules.map(m => ({
          userId: payload.userId,
          organizationId: organization.id,
          module: m,
          canAccess: true
        }))
      })
    }

    // Refresh session token with new organization and branch context
    const newToken = await signToken({
      userId: payload.userId,
      email: payload.email,
      role: 'super_admin',
      branches: [headOfficeBranch.id],
      organizationId: organization.id,
      defaultBranchId: headOfficeBranch.id
    })

    // Set updated session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Organization created successfully',
      organization,
      redirectTo: '/admin' // Redirect to admin after org creation
    })
  } catch (error) {
    console.error('[API /organization POST] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
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

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, industry, size, website, phone, email, address, city, state, country, zipCode, logo } = body

    // Check if user has an organization
    const existingOrg = await db.organization.findUnique({
      where: { ownerId: payload.userId },
    })

    if (!existingOrg) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Update organization
    const organization = await db.organization.update({
      where: { ownerId: payload.userId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(industry !== undefined && { industry }),
        ...(size !== undefined && { size }),
        ...(website !== undefined && { website }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country !== undefined && { country }),
        ...(zipCode !== undefined && { zipCode }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Organization updated successfully',
      organization,
    })
  } catch (error) {
    console.error('[API /organization PUT] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
