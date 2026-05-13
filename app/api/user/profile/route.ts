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

export async function PUT(request: Request) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, location, phone, social } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
        bio: bio,
        location: location,
        phone: phone,
        social: social
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        location: true,
        phone: true,
        social: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}