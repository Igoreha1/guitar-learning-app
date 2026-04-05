import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginPath = request.nextUrl.pathname === '/admin/login';
  
  if (isAdminPath && !isAdminLoginPath) {
    const adminAuth = request.cookies.get('adminAuth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};