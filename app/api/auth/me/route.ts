import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    console.log('🔍 /api/auth/me - Token получен:', token ? 'да' : 'нет');

    if (!token) {
      console.log('❌ Токен отсутствует');
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('🔍 Полный decoded:', JSON.stringify(decoded, null, 2));
      
      // Ищем id в разных полях
      const userId = decoded.id || decoded.userId || decoded.sub;
      console.log('✅ Найденный userId:', userId);
      
      if (!userId) {
        console.log('❌ В токене нет id');
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
      }
      
      // Сохраняем userId в decoded для дальнейшего использования
      decoded = { ...decoded, userId: userId };
    } catch (err) {
      console.log('❌ Ошибка верификации токена:', err);
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
      console.log('❌ Пользователь не найден');
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    console.log('✅ Пользователь найден, роль:', user.role);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('❌ Ошибка проверки токена:', error);
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
}