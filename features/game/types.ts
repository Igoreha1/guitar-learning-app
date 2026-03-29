export interface GameNote {
  id: string;
  string: number;
  time: number;
  duration: number;
  chord?: string;
  fret?: number;
  finger?: number;
}

export interface GameSong {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  notes: GameNote[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  effect?: 'clean' | 'distortion' | 'reverb';
  backingTrack?: string;
  image?: string;
}

export interface GameState {
  isPlaying: boolean;
  currentTime: number;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  hitNotes: number;
  totalNotes: number;
}