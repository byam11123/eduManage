import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    
    console.log('[DEBUG COOKIES] Cookie header:', cookieHeader)
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const sessionCookie = cookies.find(c => c.startsWith('session='))
      
      console.log('[DEBUG COOKIES] All cookies:', cookies)
      console.log('[DEBUG COOKIES] Session cookie found:', !!sessionCookie)
      if (sessionCookie) {
        const token = sessionCookie.substring('session='.length)
        console.log('[DEBUG COOKIES] Session token:', token.substring(0, 20) + '...')
      } else {
        console.log('[DEBUG COOKIES] No session cookie found')
      }
    } else {
      console.log('[DEBUG COOKIES] No cookie header at all')
    }
    
    return NextResponse.json({
      hasSessionCookie: !!sessionCookie,
      cookieHeader: cookieHeader || 'MISSING',
      allCookies: cookieHeader ? cookieHeader.split(';').map(c => c.trim()) : []
    })
  } catch (error) {
    console.error('[DEBUG COOKIES] Error:', error)
    return NextResponse.json({
      hasSessionCookie: false,
      error: 'Internal server error'
    })
  }
}
