import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './auth-utils';

/**
 * Middleware to protect routes based on user role
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ authorized: boolean; payload?: JWTPayload; response?: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');

  let token: string | null = null;

  // Try to get token from Authorization header
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Try to get token from cookie
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith('session='));
    if (sessionCookie) {
      token = sessionCookie.substring('session='.length);
    }
  }

  // Verify token
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(payload.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, payload };
}

/**
 * Middleware to check if user has access to a specific branch
 */
export async function requireBranchAccess(
  request: NextRequest,
  branchId: string
): Promise<{ authorized: boolean; payload?: JWTPayload; response?: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');

  let token: string | null = null;

  // Try to get token from Authorization header
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Try to get token from cookie
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith('session='));
    if (sessionCookie) {
      token = sessionCookie.substring('session='.length);
    }
  }

  // Verify token
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Super admins can access any branch
  if (payload.role === 'super_admin') {
    return { authorized: true, payload };
  }

  // Check if user has access to the requested branch
  if (!payload.branches.includes(branchId)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Access denied to this branch' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, payload };
}

/**
 * Middleware to check if user has access to any of the specified branches
 */
export async function requireAnyBranchAccess(
  request: NextRequest,
  branchIds: string[]
): Promise<{ authorized: boolean; payload?: JWTPayload; response?: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');

  let token: string | null = null;

  // Try to get token from Authorization header
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // Try to get token from cookie
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith('session='));
    if (sessionCookie) {
      token = sessionCookie.substring('session='.length);
    }
  }

  // Verify token
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Super admins can access any branch
  if (payload.role === 'super_admin') {
    return { authorized: true, payload };
  }

  // Check if user has access to any of the requested branches
  const hasAccess = payload.branches.some((branchId) => branchIds.includes(branchId));
  if (!hasAccess) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Access denied to requested branches' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, payload };
}