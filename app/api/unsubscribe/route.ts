import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email обязателен' },
        { status: 400 }
      );
    }

    await prisma.subscriber.update({
      where: { email },
      data: { isActive: false, updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'Вы отписались от рассылки'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Ошибка при отписке' },
      { status: 500 }
    );
  }
}