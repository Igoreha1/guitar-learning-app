import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const checkAdminAuth = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, category, subcategory, excerpt, content, image, author, readingTime, tags, status } = body;
    
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        category,
        subcategory,
        excerpt,
        content,
        image,
        author,
        readingTime,
        tags: tags || [],
        status: status || 'published',
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Ошибка обновления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    await prisma.article.delete({ where: { id: params.id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}