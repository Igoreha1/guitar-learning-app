import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Токен не предоставлен' }, { status: 401 });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Проверяем существование пользователя в БД
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('adminAuth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 часа
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 401 });
  }
}