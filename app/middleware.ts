import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to redirect test-router URLs
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Redirect test-router paths to the homepage in production
  if (pathname.includes('/test-router')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// Only run middleware on test-router paths
export const config = {
  matcher: ['/test-router/:path*'],
} 