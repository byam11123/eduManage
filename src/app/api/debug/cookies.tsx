import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    
    const cookies = cookieHeader ? cookieHeader.split(';').map(c => c.trim()) : []
    const sessionCookie = cookies.find(c => c.startsWith('session='))
    
    return NextResponse.json({
      hasSessionCookie: !!sessionCookie,
      cookieHeader: cookieHeader || 'MISSING',
      allCookies: cookies
    })
  } catch (error) {
    console.error('[DEBUG COOKIES] Error:', error)
    return NextResponse.json({
      hasSessionCookie: false,
      error: 'Internal server error'
    })
  }
}
