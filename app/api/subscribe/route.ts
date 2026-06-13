import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendSubscriptionConfirmation } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    // Валидация
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Введите корректный email' },
        { status: 400 }
      );
    }

    // Проверка существующей подписки
    const existing = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'Вы уже подписаны на рассылку' },
          { status: 400 }
        );
      } else {
        // Реактивируем подписку
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true, updatedAt: new Date() }
        });
        
        await sendSubscriptionConfirmation(email, name || email.split('@')[0], true);
        
        return NextResponse.json({
          success: true,
          message: 'Вы снова подписаны на рассылку!'
        });
      }
    }

    // Создаём новую подписку
    await prisma.subscriber.create({
      data: {
        id: `sub_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        isActive: true,
        createdAt: new Date()
      }
    });

    // Отправляем подтверждение
    await sendSubscriptionConfirmation(email, name || email.split('@')[0]);

    return NextResponse.json({
      success: true,
      message: 'Подписка оформлена! Проверьте ваш email.'
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Ошибка при подписке' },
      { status: 500 }
    );
  }
}