import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [songsCount, usersCount, scoresCount, chordsCount] = await Promise.all([
      prisma.song.count(),
      prisma.user.count(),
      prisma.score.count(),
      prisma.chord.count(),
    ]);

    return NextResponse.json({
      songs: songsCount,
      users: usersCount,
      scores: scoresCount,
      chords: chordsCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки статистики' }, { status: 500 });
  }
}