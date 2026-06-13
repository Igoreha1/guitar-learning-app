import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateVerificationCode, sendVerificationEmail, sendPasswordResetEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email, name, type } = await request.json();

    // Валидация email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Введите корректный email' },
        { status: 400 }
      );
    }

    // ========== РЕГИСТРАЦИЯ ==========
    if (type === 'register') {
      if (!name || name.length < 2) {
        return NextResponse.json(
          { error: 'Имя должно содержать минимум 2 символа' },
          { status: 400 }
        );
      }

      // Проверка существования пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }

      // Генерация кода
      const code = generateVerificationCode();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 минут

      if (!global.verificationCodes) {
        global.verificationCodes = new Map();
      }
      global.verificationCodes.set(email, { code, expiresAt });

      // Отправка email
      const emailSent = await sendVerificationEmail(email, code, name);

      if (!emailSent) {
        return NextResponse.json(
          { error: 'Не удалось отправить код. Попробуйте позже.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Код подтверждения отправлен на ваш email'
      });
    }

    // ========== ВОССТАНОВЛЕНИЕ ПАРОЛЯ ==========
    if (type === 'reset') {
      // Проверка существования пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'Пользователь с таким email не найден' },
          { status: 404 }
        );
      }

      // Генерация кода
      const code = generateVerificationCode();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 минут

      if (!global.resetCodes) {
        global.resetCodes = new Map();
      }
      global.resetCodes.set(email, { code, expiresAt });

      // Отправка email для сброса пароля
      const emailSent = await sendPasswordResetEmail(email, code, existingUser.name || 'Пользователь');

      if (!emailSent) {
        return NextResponse.json(
          { error: 'Не удалось отправить код. Попробуйте позже.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Код для сброса пароля отправлен на ваш email'
      });
    }

    return NextResponse.json(
      { error: 'Неверный тип запроса' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// TypeScript декларация для global
declare global {
  var verificationCodes: Map<string, { code: string; expiresAt: number }>;
  var resetCodes: Map<string, { code: string; expiresAt: number }>;
}

// Инициализация
if (!global.verificationCodes) {
  global.verificationCodes = new Map();
}
if (!global.resetCodes) {
  global.resetCodes = new Map();
}

// Очистка просроченных кодов каждые 5 минут
setInterval(() => {
  const now = Date.now();
  if (global.verificationCodes) {
    for (const [email, data] of global.verificationCodes.entries()) {
      if (data.expiresAt < now) {
        global.verificationCodes.delete(email);
      }
    }
  }
  if (global.resetCodes) {
    for (const [email, data] of global.resetCodes.entries()) {
      if (data.expiresAt < now) {
        global.resetCodes.delete(email);
      }
    }
  }
}, 5 * 60 * 1000);