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
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(songs);
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
    const { title, artist, bpm, difficulty, duration, effect, notes, backingTrack, startOffset } = body;
    
    const song = await prisma.song.create({
      data: {
        id: `song_${Date.now()}`,
        title,
        artist,
        bpm: parseInt(bpm),
        difficulty,
        duration: parseInt(duration),
        effect: effect || 'clean',
        backingTrack: backingTrack || null,
        tabData: notes || [],
        startOffset: startOffset || 0
      }
    });
    
    return NextResponse.json(song);
  } catch (error) {
    console.error('Ошибка создания:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, title, artist, bpm, difficulty, duration, effect, notes, backingTrack, startOffset } = body;
    
    const song = await prisma.song.update({
      where: { id },
      data: {
        title,
        artist,
        bpm: parseInt(bpm),
        difficulty,
        duration: parseInt(duration),
        effect: effect || 'clean',
        backingTrack: backingTrack || null,
        tabData: notes || [],
        startOffset: startOffset || 0
      }
    });
    
    return NextResponse.json(song);
  } catch (error) {
    console.error('Ошибка обновления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID не указан' }, { status: 400 });
    }
    
    await prisma.song.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}