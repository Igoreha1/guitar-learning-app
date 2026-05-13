import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const verifyToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch {
    return null;
  }
};

// GET - получить сохранённые статьи пользователя
export async function GET(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const saved = await prisma.savedArticle.findMany({
      where: { userId: user.id },
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

    return NextResponse.json({ saved });
  } catch (error) {
    console.error('Ошибка получения сохранённых статей:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - сохранить статью
export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json({ error: 'ID статьи не указан' }, { status: 400 });
    }

    // Проверяем, не сохранена ли уже
    const existing = await prisma.savedArticle.findFirst({
      where: {
        userId: user.id,
        articleId: articleId
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Статья уже сохранена' }, { status: 400 });
    }

    const saved = await prisma.savedArticle.create({
      data: {
        userId: user.id,
        articleId: articleId
      }
    });

    return NextResponse.json({ saved, isSaved: true });
  } catch (error) {
    console.error('Ошибка сохранения статьи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - удалить из сохранённых
export async function DELETE(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json({ error: 'ID статьи не указан' }, { status: 400 });
    }

    await prisma.savedArticle.deleteMany({
      where: {
        userId: user.id,
        articleId: articleId
      }
    });

    return NextResponse.json({ success: true, isSaved: false });
  } catch (error) {
    console.error('Ошибка удаления статьи:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}