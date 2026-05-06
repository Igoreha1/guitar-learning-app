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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, category, subcategory, excerpt, content, image, author, readingTime, tags, status, showOnHomepage } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID не указан' }, { status: 400 });
    }
    
    const article = await prisma.article.update({
      where: { id: id },
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
        showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : false,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Ошибка обновления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    if (!id) {
      return NextResponse.json({ error: 'ID не указан' }, { status: 400 });
    }
    
    await prisma.article.delete({ where: { id: id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}