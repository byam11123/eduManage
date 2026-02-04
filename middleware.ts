import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['super_admin'],
  '/admin/branches': ['super_admin'],
  '/admin/users': ['super_admin'],
  '/branch': ['super_admin', 'branch_admin', 'user'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const matchedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const requiredRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
    
    // Get token from request
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

    // If no token, redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '?view=login';
      return NextResponse.redirect(url);
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '?view=login';
      return NextResponse.redirect(url);
    }

    // Check if user has required role
    if (!requiredRoles.includes(payload.role)) {
      // Redirect based on user role if they don't have access to this route
      if (payload.role === 'super_admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      } else if (['branch_admin', 'user'].includes(payload.role)) {
        const url = request.nextUrl.clone();
        url.pathname = '/branch';
        return NextResponse.redirect(url);
      } else {
        // Unauthorized access
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Specify which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};