import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const verifyAdmin = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return false;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const all = searchParams.get('all');
    
    // Поиск по ID (для редактирования) — ТРЕБУЕТ АВТОРИЗАЦИЮ
    if (id) {
      if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
      }
      
      const article = await prisma.article.findUnique({
        where: { id: id }
      });
      
      if (!article) {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
      
      return NextResponse.json(article);
    }
    
    // Поиск по slug (для публичных страниц) — БЕЗ АВТОРИЗАЦИИ
    if (slug) {
      const article = await prisma.article.findFirst({
        where: { slug: slug }
      });
      
      if (!article) {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
      }
      
      if (article.status === 'published') {
        await prisma.article.update({
          where: { id: article.id },
          data: { views: { increment: 1 } }
        });
      }
      
      return NextResponse.json(article);
    }
    
    // Список всех статей (для админки)
    const where: any = {};
    
    if (all === 'true') {
      // Для админки — проверяем авторизацию
      if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
      }
    } else {
      where.status = 'published';
    }
    
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
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const body = await request.json();
    const { slug, title, category, subcategory, excerpt, content, image, author, readingTime, tags, status, showOnHomepage } = body;
    
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
        status: status || 'published',
        showOnHomepage: showOnHomepage || false
      }
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Ошибка создания:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}