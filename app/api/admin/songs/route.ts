import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - получить все песни
export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}

// POST - добавить песню
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artist, bpm, difficulty, duration, effect } = body;

    const song = await prisma.song.create({
      data: {
        id: `song_${Date.now()}`,
        title,
        artist,
        bpm: parseInt(bpm),
        difficulty,
        duration: parseInt(duration),
        effect: effect || 'clean'
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error('Ошибка создания:', error);
    return NextResponse.json({ error: 'Ошибка создания' }, { status: 500 });
  }
}

// PUT - обновить песню
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, artist, bpm, difficulty, duration, effect } = body;

    const song = await prisma.song.update({
      where: { id },
      data: { title, artist, bpm, difficulty, duration, effect }
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}

// DELETE - удалить песню
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID не указан' }, { status: 400 });
    }

    await prisma.song.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 });
  }
}