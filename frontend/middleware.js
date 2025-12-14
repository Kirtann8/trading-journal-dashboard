import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  const { pathname } = request.nextUrl
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/trades', '/profile', '/reports']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Public routes
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Redirect root to dashboard if authenticated, login if not
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If accessing login/register with token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}