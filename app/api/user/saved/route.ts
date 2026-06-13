import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// GET /api/user/saved - получить сохранённые статьи
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const savedArticles = await prisma.savedArticle.findMany({
      where: { userId: decoded.userId },
      include: {
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            image: true,
            category: true,
            subcategory: true,
            createdAt: true,
            views: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Найдено ${savedArticles.length} сохранённых статей для пользователя ${decoded.userId}`);
    return NextResponse.json({ saved: savedArticles });
  } catch (error) {
    console.error('Ошибка получения сохранённых статей:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/user/saved - сохранить статью
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json({ error: 'Не указан ID статьи' }, { status: 400 });
    }

    // Проверяем, не сохранена ли уже
    const existing = await prisma.savedArticle.findFirst({
      where: {
        userId: decoded.userId,
        articleId: articleId
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Статья уже сохранена' }, { status: 400 });
    }

    const saved = await prisma.savedArticle.create({
      data: {
        id: `saved_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: decoded.userId,
        articleId: articleId
      }
    });

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error('Ошибка сохранения статьи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE /api/user/saved?articleId=xxx - удалить сохранённую статью
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    if (!articleId) {
      return NextResponse.json({ error: 'Не указан ID статьи' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await prisma.savedArticle.deleteMany({
      where: {
        userId: decoded.userId,
        articleId: articleId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления сохранённой статьи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}