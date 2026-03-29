export type ChordEvent = {
  time: number;
  chord: string;
};

export type Song = {
  title: string;
  bpm: number;
  chords: ChordEvent[];
};