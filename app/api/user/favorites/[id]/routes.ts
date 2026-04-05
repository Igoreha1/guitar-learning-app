import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// GET - получить избранное пользователя
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const favorites = await prisma.favorite.findMany({
      where: { userId: decoded.userId },
      include: { song: true }
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - добавить в избранное
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { songId } = await request.json();

    if (!songId) {
      return NextResponse.json({ error: 'Не указан ID песни' }, { status: 400 });
    }

    // Проверяем, не добавлена ли уже
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: decoded.userId,
        songId: songId
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Песня уже в избранном' }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        id: `fav_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: decoded.userId,
        songId: songId
      }
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - удалить из избранного
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');

    if (!songId) {
      return NextResponse.json({ error: 'Не указан ID песни' }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: decoded.userId,
        songId: songId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}