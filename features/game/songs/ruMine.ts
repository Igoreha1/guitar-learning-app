import { GameSong } from "../types";

export const ruMine: GameSong = {
  id: "arctic_monkeys_r_u_mine",
  title: "R U Mine?",
  artist: "Arctic Monkeys",
  bpm: 140,
  difficulty: "medium",
  duration: 35,
  effect: "distortion",
  backingTrack: "/songs/ru_mine_backing.mp3",
  notes: [
    { id: "i1", string: 0, time: 0.0, duration: 0.4, fret: 0 },
    { id: "i2", string: 0, time: 0.5, duration: 0.4, fret: 3, finger: 3 },
    { id: "i3", string: 0, time: 1.0, duration: 0.4, fret: 0 },
    { id: "i4", string: 0, time: 1.5, duration: 0.4, fret: 3, finger: 3 },
    { id: "i5", string: 0, time: 2.0, duration: 0.4, fret: 0 },
    { id: "i6", string: 0, time: 2.5, duration: 0.4, fret: 5, finger: 4 },
    { id: "i7", string: 0, time: 3.0, duration: 0.4, fret: 3, finger: 3 },
    { id: "i8", string: 0, time: 3.5, duration: 0.4, fret: 0 },
    
    { id: "i9", string: 1, time: 4.0, duration: 0.4, fret: 0 },
    { id: "i10", string: 1, time: 4.5, duration: 0.4, fret: 3, finger: 3 },
    { id: "i11", string: 1, time: 5.0, duration: 0.4, fret: 0 },
    { id: "i12", string: 1, time: 5.5, duration: 0.4, fret: 3, finger: 3 },
    { id: "i13", string: 1, time: 6.0, duration: 0.4, fret: 0 },
    { id: "i14", string: 1, time: 6.5, duration: 0.4, fret: 5, finger: 4 },
    { id: "i15", string: 1, time: 7.0, duration: 0.4, fret: 3, finger: 3 },
    { id: "i16", string: 1, time: 7.5, duration: 0.4, fret: 0 },
    
    { id: "c1", string: 0, time: 9.0, duration: 1.0, fret: 4, finger: 4, chord: "F#5" },
    { id: "c2", string: 1, time: 9.0, duration: 1.0, fret: 4, finger: 4, chord: "F#5" },
    { id: "c3", string: 1, time: 10.5, duration: 1.0, fret: 2, finger: 2, chord: "E5" },
    { id: "c4", string: 0, time: 10.5, duration: 1.0, fret: 0, chord: "E5" },
    { id: "c5", string: 0, time: 12.0, duration: 1.0, fret: 0, chord: "D5" },
    { id: "c6", string: 1, time: 12.0, duration: 1.0, fret: 0, chord: "D5" },
    { id: "c7", string: 0, time: 13.5, duration: 1.0, fret: 4, finger: 4, chord: "C#5" },
    { id: "c8", string: 1, time: 13.5, duration: 1.0, fret: 4, finger: 4, chord: "C#5" },
  ]
};