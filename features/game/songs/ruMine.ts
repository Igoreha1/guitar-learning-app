import { GameSong } from "../types";

const stringBaseFreq = [
  82.41,  // 6-я струна E2
  110.0,  // 5-я струна A2
  146.83, // 4-я струна D3
  196.0,  // 3-я струна G3
  246.94, // 2-я струна B3
  329.63  // 1-я струна E4
];

function getFrequency(string: number, fret: number): number {
  return stringBaseFreq[string] * Math.pow(2, fret / 12);
}

const BPM = 98;
const beat = 60 / BPM; // ~0.612 секунды

// Функция для создания ноты
function n(string: number, fret: number, time: number, duration: number = beat) {
  return {
    id: `n_${string}_${fret}_${time.toFixed(3)}`,
    string,
    fret,
    frequency: getFrequency(string, fret),
    time,
    duration
  };
}

// Функция для создания hammer-on (две ноты подряд)
function hammer(string: number, fret1: number, fret2: number, time: number) {
  return [
    n(string, fret1, time, beat * 0.5),
    n(string, fret2, time + beat * 0.5, beat * 0.5)
  ];
}

export const ruMine: GameSong = {
  id: "song_1",
  title: "R U Mine?",
  artist: "Arctic Monkeys",
  bpm: BPM,
  difficulty: "medium",
  duration: 210,
  effect: "distortion",
  backingTrack: "/songs/ru_mine_backing.mp3",
  notes: [
    // ========== INTRO ==========
    // Первая нота с вибрато
    n(1, 9, 0.15, 0.8),  // 9 лад на 5-й струне (A)
    
    // Паттерн 1 (x3)
    ...Array(3).fill(0).flatMap((_, i) => {
      const base = 1.0 + i * 4;
      return [
        n(5, 2, base, beat * 0.8),
        n(5, 2, base + beat * 0.8, beat * 0.4),
        n(5, 2, base + beat * 1.2, beat * 0.4),
        // hammer-on 2h4
        n(5, 2, base + beat * 1.6, beat * 0.3),
        n(5, 4, base + beat * 1.9, beat * 0.3),
        n(5, 2, base + beat * 2.2, beat * 0.3),
        n(5, 4, base + beat * 2.5, beat * 0.3),
        n(5, 5, base + beat * 2.8, beat * 0.4),
        n(5, 5, base + beat * 3.2, beat * 0.4),
        n(5, 5, base + beat * 3.6, beat * 0.3),
        n(5, 4, base + beat * 3.9, beat * 0.3),
        n(5, 2, base + beat * 4.2, beat * 0.4),
        n(5, 2, base + beat * 4.6, beat * 0.4),
        n(5, 2, base + beat * 5.0, beat * 0.4),
        n(5, 0, base + beat * 5.4, beat * 0.8),
      ];
    }),
    
    // Финальный паттерн интро (x1)
    ...(() => {
      const base = 13.0;
      return [
        n(5, 2, base, beat * 0.8),
        n(5, 2, base + beat * 0.8, beat * 0.4),
        n(5, 2, base + beat * 1.2, beat * 0.4),
        n(5, 2, base + beat * 1.6, beat * 0.3),
        n(5, 4, base + beat * 1.9, beat * 0.3),
        n(5, 2, base + beat * 2.2, beat * 0.3),
        n(5, 4, base + beat * 2.5, beat * 0.3),
        n(5, 5, base + beat * 2.8, beat * 0.4),
        n(5, 5, base + beat * 3.2, beat * 0.4),
        n(5, 5, base + beat * 3.6, beat * 0.3),
        n(5, 4, base + beat * 3.9, beat * 0.3),
        n(5, 2, base + beat * 4.2, beat * 0.4),
        n(5, 2, base + beat * 4.6, beat * 0.4),
        n(5, 2, base + beat * 5.0, beat * 0.4),
        n(5, 0, base + beat * 5.4, beat * 0.8),
      ];
    })(),

    // ========== VERSE 1 (x2) ==========
    ...Array(2).fill(0).flatMap((_, i) => {
      const base = 20.0 + i * 8;
      return [
        n(5, 2, base, beat * 0.8),
        n(5, 2, base + beat * 0.8, beat * 0.4),
        n(5, 2, base + beat * 1.2, beat * 0.4),
        n(5, 2, base + beat * 1.6, beat * 0.3),
        n(5, 4, base + beat * 1.9, beat * 0.3),
        n(3, 2, base + beat * 2.2, beat * 0.8),
        n(3, 2, base + beat * 3.0, beat * 0.3),
        n(3, 4, base + beat * 3.3, beat * 0.3),
        n(3, 2, base + beat * 3.6, beat * 0.4),
        n(3, 4, base + beat * 4.0, beat * 0.4),
        n(3, 5, base + beat * 4.4, beat * 0.4),
        n(3, 5, base + beat * 4.8, beat * 0.4),
        n(3, 5, base + beat * 5.2, beat * 0.3),
        n(3, 4, base + beat * 5.5, beat * 0.3),
        n(3, 2, base + beat * 5.8, beat * 0.4),
        n(3, 2, base + beat * 6.2, beat * 0.4),
        n(3, 2, base + beat * 6.6, beat * 0.4),
        n(3, 0, base + beat * 7.0, beat * 0.8),
      ];
    }),

    // VERSE 1 продолжение (x1)
    ...(() => {
      const base = 36.0;
      return [
        n(5, 2, base, beat * 0.8),
        n(5, 2, base + beat * 0.8, beat * 0.4),
        n(5, 2, base + beat * 1.2, beat * 0.4),
        n(5, 2, base + beat * 1.6, beat * 0.3),
        n(5, 4, base + beat * 1.9, beat * 0.3),
        n(3, 2, base + beat * 2.2, beat * 0.8),
        n(3, 2, base + beat * 3.0, beat * 0.3),
        n(3, 4, base + beat * 3.3, beat * 0.3),
        n(3, 2, base + beat * 3.6, beat * 0.4),
        n(3, 4, base + beat * 4.0, beat * 0.4),
        n(3, 5, base + beat * 4.4, beat * 0.4),
        n(3, 5, base + beat * 4.8, beat * 0.4),
        n(3, 5, base + beat * 5.2, beat * 0.3),
        n(3, 4, base + beat * 5.5, beat * 0.3),
        n(3, 2, base + beat * 5.8, beat * 0.4),
        n(3, 2, base + beat * 6.2, beat * 0.4),
        n(3, 2, base + beat * 6.6, beat * 0.4),
        n(3, 0, base + beat * 7.0, beat * 0.8),
      ];
    })(),

    // ========== CHORUS 1 ==========
    ...Array(3).fill(0).flatMap((_, i) => {
      const base = 44.0 + i * 4;
      return [
        n(5, 2, base, beat * 0.8),
        n(5, 2, base + beat * 0.8, beat * 0.4),
        n(5, 2, base + beat * 1.2, beat * 0.4),
        n(5, 5, base + beat * 1.6, beat * 0.4),
        n(5, 5, base + beat * 2.0, beat * 0.4),
        n(5, 5, base + beat * 2.4, beat * 0.3),
        n(5, 4, base + beat * 2.7, beat * 0.3),
        n(5, 2, base + beat * 3.0, beat * 0.4),
        n(5, 2, base + beat * 3.4, beat * 0.4),
        n(5, 2, base + beat * 3.8, beat * 0.4),
        n(5, 0, base + beat * 4.2, beat * 0.8),
      ];
    }),

    // Финальный аккорд хоруса
    ...(() => {
      const base = 56.0;
      return [
        n(3, 4, base, beat * 0.8),
        n(3, 4, base + beat * 0.8, beat * 0.4),
        n(3, 4, base + beat * 1.2, beat * 0.4),
        n(3, 2, base + beat * 1.6, beat * 0.8),
        n(3, 0, base + beat * 2.4, beat * 0.8),
      ];
    })(),

    // ========== BREAK (проигрыш) ==========
    ...Array(4).fill(0).flatMap((_, i) => {
      const base = 60.0 + i * 4;
      return [
        n(2, 4, base, beat * 0.4),
        n(2, 4, base + beat * 0.4, beat * 0.4),
        n(2, 4, base + beat * 0.8, beat * 0.4),
        n(2, 6, base + beat * 1.2, beat * 0.8),
        n(2, 7, base + beat * 2.0, beat * 0.8),
        n(2, 7, base + beat * 2.8, beat * 0.4),
        n(2, 7, base + beat * 3.2, beat * 0.4),
        n(2, 7, base + beat * 3.6, beat * 0.4),
        n(1, 7, base + beat * 4.0, beat * 0.8),
      ];
    }),
  ]
};