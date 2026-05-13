import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Базовые частоты открытых струн (в Гц)
const STRING_BASE_FREQ = [
  82.41,  // 6-я струна E2
  110.0,  // 5-я струна A2
  146.83, // 4-я струна D3
  196.0,  // 3-я струна G3
  246.94, // 2-я струна B3
  329.63  // 1-я струна E4
];

// Функция для вычисления частоты ноты
function getFrequency(string: number, fret: number): number {
  if (fret === 0) return STRING_BASE_FREQ[string];
  return STRING_BASE_FREQ[string] * Math.pow(2, fret / 12);
}

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const gameSongs = songs.map(song => {
      const tabData = (song.tabData as any[]) || [];
      const notes = tabData.map((note: any) => {
        return {
          id: note.id || `note_${Date.now()}_${Math.random()}`,
          string: note.string,
          fret: note.fret || 0,
          time: note.time || 0,
          duration: note.duration || 0.5,
          chord: note.chord || undefined,
          finger: note.finger,
          measure: note.measure,
          beat: note.beat,
          subBeat: note.subBeat,
          frequency: getFrequency(note.string, note.fret || 0)
        };
      });
      
      return {
        id: song.id,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,
        difficulty: song.difficulty,
        duration: song.duration,
        effect: song.effect || 'clean',
        backingTrack: song.backingTrack || null,
        notes: notes,
        startOffset: song.startOffset || 0
      };
    });
    
    return NextResponse.json(gameSongs);
  } catch (error) {
    console.error('Ошибка загрузки песен:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}