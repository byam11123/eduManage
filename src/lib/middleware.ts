import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './auth-utils'

/**
 * Middleware utility to protect API routes
 * @param request - Next.js request object
 * @returns JWTPayload if authenticated, null otherwise
 */
export async function authenticateRequest(request: NextRequest): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')

  let token: string | null = null

  // Try to get token from Authorization header
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // Try to get token from cookie
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim())
    const sessionCookie = cookies.find(c => c.startsWith('session='))
    if (sessionCookie) {
      token = sessionCookie.substring('session='.length)
    }
  }

  // Verify token
  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * Helper function to create an unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  )
}

/**
 * Helper function to create a forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  )
}

/**
 * Higher-order function to protect API routes
 * Usage: protectRoute(handler) in API routes
 */
export function protectRoute<T = any>(
  handler: (request: NextRequest, payload: JWTPayload) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const payload = await authenticateRequest(request)

    if (!payload) {
      return unauthorizedResponse()
    }

    return handler(request, payload)
  }
}
