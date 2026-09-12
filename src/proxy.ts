import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['super_admin'],
  '/branch': ['super_admin', 'branch_admin', 'user'],
  '/organization': ['super_admin', 'branch_admin', 'user'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets and internal Next.js requests
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('favicon.ico') ||
    pathname.includes('.') // likely a static file
  ) {
    return NextResponse.next();
  }

  // 2. Check if the route is protected
  const matchedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const requiredRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
    
    // Get token from cookie, header, or query param
    const cookieHeader = request.headers.get('cookie');
    let token: string | null = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith('session='));
      if (sessionCookie) {
        token = sessionCookie.substring('session='.length);
      }
    }

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      token = request.nextUrl.searchParams.get('token');
    }

    // In iframe environments (like AI Studio preview), third-party cookies are blocked by default.
    // Client components (AdminLayout / useAuthStore) manage authentication using localStorage.
    // If no token is attached to the SSR request, pass through to allow client hydration & auth verification.
    if (!token) {
      return NextResponse.next();
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Onboarding Redirects & Guards
    
    // A. If accessing /branch but has no branches assigned
    if (pathname.startsWith('/branch') && (!payload.branches || payload.branches.length === 0)) {
      const url = request.nextUrl.clone();
      url.pathname = payload.organizationId ? '/admin' : '/organization';
      return NextResponse.redirect(url);
    }

    // B. If accessing /organization but already has an organization (UX improvement)
    if (pathname.startsWith('/organization') && payload.organizationId) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    // C. If accessing /admin but has no organization
    if (pathname.startsWith('/admin') && !payload.organizationId) {
      const url = request.nextUrl.clone();
      url.pathname = '/organization';
      return NextResponse.redirect(url);
    }

    // Check role permissions
    if (!requiredRoles.includes(payload.role)) {
      // Fallback based on role
      const url = request.nextUrl.clone();
      if (payload.role === 'super_admin') {
        url.pathname = payload.organizationId ? '/admin' : '/organization';
      } else {
        url.pathname = payload.branches?.length > 0 ? '/branch' : '/organization';
      }
      return NextResponse.redirect(url);
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default proxy;