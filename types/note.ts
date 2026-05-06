// types/note.ts
export interface GameNote {
  id: string;
  string: number;
  fret: number;
  time: number;
  duration: number;
  measure?: number;
  beat?: number;
  subBeat?: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  effect: string;
  backingTrack: string;
  notes: GameNote[];
  startOffset?: number; // ← добавить: смещение начала песни в секундах
  createdAt?: string;
  updatedAt?: string;
}