import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // === АДМИН-ПАНЕЛЬ ===
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLoginPath = pathname === '/admin/login';
  
  if (isAdminPath && !isAdminLoginPath) {
    const adminAuth = request.cookies.get('adminAuth');
    if (!adminAuth || adminAuth.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  // === API МАРШРУТЫ ===
  if (pathname.startsWith('/api')) {
    const publicApis = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/send-verification',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/game/songs',
      '/api/subscribe/status',
      '/api/admin/login',
      '/api/admin/set-cookie',
      '/api/admin/logout',
      '/api/upload',
      '/api/upload-audio',
      '/api/test'
    ];
    
    // Проверяем, является ли API публичным
    const isPublicApi = publicApis.some(api => pathname === api || pathname.startsWith(api));
    
    if (isPublicApi) {
      return NextResponse.next();
    }
    
    const authHeader = request.headers.get('authorization');
    let token: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    if (!token) {
      const cookieToken = request.cookies.get('token');
      token = cookieToken?.value || null;
    }
    
    if (!token || token.length <= 20) {
      console.log(`🔒 Middleware: Доступ запрещён к ${pathname}`);
      return NextResponse.json(
        { error: 'Не авторизован. Пожалуйста, войдите в аккаунт.' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};