import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/mail';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Функция проверки сложности пароля
function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Пароль должен содержать минимум 8 символов' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну заглавную букву' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну строчную букву' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { isValid: false, message: 'Пароль должен содержать хотя бы один спецсимвол' };
  }
  return { isValid: true, message: '' };
}

export async function POST(request: Request) {
  try {
    const { email, name, password, verificationCode } = await request.json();

    // Проверка наличия кода подтверждения
    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Требуется подтверждение email. Запросите код подтверждения.' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Введите корректный email адрес' },
        { status: 400 }
      );
    }

    // Валидация имени
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    // Валидация пароля
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Проверка кода подтверждения
    const cached = global.verificationCodes?.get(email);
    if (!cached) {
      return NextResponse.json(
        { error: 'Код подтверждения не найден. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (Date.now() > cached.expiresAt) {
      global.verificationCodes.delete(email);
      return NextResponse.json(
        { error: 'Код подтверждения истёк. Запросите новый код.' },
        { status: 400 }
      );
    }

    if (cached.code !== verificationCode) {
      return NextResponse.json(
        { error: 'Неверный код подтверждения' },
        { status: 400 }
      );
    }

    // Проверка на существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        id: `user_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        isVerified: true  // email подтверждён через код
      }
    });

    // Создаём статистику пользователя (если есть модель)
    try {
      await prisma.$executeRaw`
        INSERT INTO user_statistics (user_id, total_songs_played, average_accuracy, high_score, total_notes_played, player_level)
        VALUES (${user.id}, 0, 0, 0, 0, 1)
      `;
    } catch (err) {
      // Если таблицы нет, просто игнорируем
      console.log('Statistics table not found, skipping');
    }

    // Удаляем использованный код
    global.verificationCodes.delete(email);

    // Отправляем приветственное письмо
    await sendWelcomeEmail(email, user.name || email.split('@')[0]);

    // Создаём JWT токен
    const token = jwt.sign(
      { 
        id: user.id,
        userId: user.id,
        email: user.email, 
        name: user.name,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}