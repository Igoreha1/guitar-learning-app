import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// GET /api/user/scores - получить рекорды
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const scores = await prisma.score.findMany({
      where: { userId: decoded.userId },
      include: { song: true },
      orderBy: { value: 'desc' },
      take: 50
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Ошибка получения рекордов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/user/scores - сохранить рекорд
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { songId, value, accuracy, maxCombo } = body;

    const score = await prisma.score.create({
      data: {
        id: `score_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: decoded.userId,
        songId,
        value,
        accuracy,
        maxCombo
      }
    });

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('Ошибка сохранения рекорда:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}