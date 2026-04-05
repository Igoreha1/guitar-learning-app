import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Простая проверка админ-токена
const checkAdminAuth = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');
    
    if (slug) {
      const article = await prisma.article.findUnique({
        where: { slug }
      });
      
      if (!article) {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
      
      // Увеличиваем счётчик просмотров только для публичных статей
      if (article.status === 'published') {
        await prisma.article.update({
          where: { id: article.id },
          data: { views: { increment: 1 } }
        });
      }
      
      return NextResponse.json(article);
    }
    
    // Для админки показываем все статьи, для публики только опубликованные
    const where: any = {};
    if (!all) where.status = 'published';
    if (category && category !== 'all') where.category = category;
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Ошибка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const body = await request.json();
    const { slug, title, category, subcategory, excerpt, content, image, author, readingTime, tags, status } = body;
    
    const article = await prisma.article.create({
      data: {
        id: `article_${Date.now()}`,
        slug,
        title,
        category,
        subcategory,
        excerpt,
        content,
        image: image || '/images/default.jpg',
        author: author || 'Администратор',
        readingTime: readingTime || 5,
        tags: tags || [],
        status: status || 'published'
      }
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Ошибка создания:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}