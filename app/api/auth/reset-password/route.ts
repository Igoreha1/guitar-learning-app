import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, verificationCode, newPassword } = await request.json();

    if (!email || !verificationCode || !newPassword) {
      return NextResponse.json(
        { error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Проверка кода из resetCodes
    const cached = global.resetCodes?.get(email);
    if (!cached) {
      return NextResponse.json(
        { error: 'Код не найден. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (Date.now() > cached.expiresAt) {
      global.resetCodes.delete(email);
      return NextResponse.json(
        { error: 'Код истёк. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (cached.code !== verificationCode) {
      return NextResponse.json(
        { error: 'Неверный код' },
        { status: 400 }
      );
    }

    // Проверка сложности нового пароля
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { error: 'Пароль должен содержать минимум 8 символов, заглавные и строчные буквы, цифру и спецсимвол' },
        { status: 400 }
      );
    }

    // Хэширование нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновление пароля в БД
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Удаление использованного кода
    global.resetCodes.delete(email);

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменён'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// TypeScript декларация
declare global {
  var resetCodes: Map<string, { code: string; expiresAt: number }>;
}