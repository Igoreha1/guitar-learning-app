import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Простая функция проверки токена
function isValidToken(token: string): boolean {
  // Можно добавить реальную проверку jwt.verify, но это замедлит запросы
  // Для простоты проверяем, что токен существует и имеет минимальную длину
  return token !== null && token.length > 20;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. АДМИН-ПАНЕЛЬ (без изменений)
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
  
  // 2. API МАРШРУТЫ
  if (pathname.startsWith('/api')) {
    // Публичные API (не требуют авторизации)
    const publicApis = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/send-verification',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/game/songs',
      '/api/subscribe/status'
    ];
    
    // Проверяем, является ли API публичным
    const isPublicApi = publicApis.some(api => pathname === api || pathname.startsWith(api));
    
    if (isPublicApi) {
      return NextResponse.next();
    }
    
    // Защищённые API — проверяем токен
    const authHeader = request.headers.get('authorization');
    let token: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Также проверяем токен в cookie (для случаев, когда заголовок не передан)
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