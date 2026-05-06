import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const STRING_BASE_FREQ = [
  82.41, 110.0, 146.83, 196.0, 246.94, 329.63
];

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
      const tabData = song.tabData as any[] || [];
      const notes = tabData.map((note: any) => ({
        id: note.id || `note_${Date.now()}_${Math.random()}`,
        string: note.string,
        fret: note.fret || 0,
        time: note.time || 0,
        duration: note.duration || 0.5,
        chord: note.chord,      // ← сохраняем название аккорда
        finger: note.finger,
        measure: note.measure,
        beat: note.beat,
        subBeat: note.subBeat,
        frequency: getFrequency(note.string, note.fret || 0)
      }));
      
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