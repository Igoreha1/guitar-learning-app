export interface TabNote {
  id: string;
  string: number;      // 0-5 (6-я струна = 0)
  fret: number;        // лад (0 = открытая струна)
  finger?: number;     // палец (1-4) — теперь только optional, без null
  time: number;        // время в секундах
  duration: number;    // длительность
  chord?: string;      // если это аккорд
}

export interface TabSong {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  tabs: TabNote[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration?: number;
}

// Табулатура для Arctic Monkeys - R U Mine? (вступление)
export const ruMineTabs: TabSong = {
  id: "ru_mine_intro",
  title: "R U Mine?",
  artist: "Arctic Monkeys",
  bpm: 140,
  difficulty: "medium",
  tabs: [
    // Рифф на 5-й и 6-й струнах — убираем null, просто не указываем finger
    { id: "t1", string: 5, fret: 0, time: 0.0, duration: 0.5 },
    { id: "t2", string: 5, fret: 2, finger: 2, time: 0.5, duration: 0.5 },
    { id: "t3", string: 5, fret: 0, time: 1.0, duration: 0.5 },
    { id: "t4", string: 5, fret: 2, finger: 2, time: 1.5, duration: 0.5 },
    { id: "t5", string: 5, fret: 0, time: 2.0, duration: 0.5 },
    { id: "t6", string: 5, fret: 3, finger: 3, time: 2.5, duration: 0.5 },
    { id: "t7", string: 5, fret: 2, finger: 2, time: 3.0, duration: 0.5 },
    { id: "t8", string: 5, fret: 0, time: 3.5, duration: 0.5 },
    
    { id: "t9", string: 4, fret: 0, time: 4.0, duration: 0.5 },
    { id: "t10", string: 4, fret: 2, finger: 2, time: 4.5, duration: 0.5 },
    { id: "t11", string: 4, fret: 0, time: 5.0, duration: 0.5 },
    { id: "t12", string: 4, fret: 2, finger: 2, time: 5.5, duration: 0.5 },
    { id: "t13", string: 4, fret: 0, time: 6.0, duration: 0.5 },
    { id: "t14", string: 4, fret: 3, finger: 3, time: 6.5, duration: 0.5 },
    { id: "t15", string: 4, fret: 2, finger: 2, time: 7.0, duration: 0.5 },
    { id: "t16", string: 4, fret: 0, time: 7.5, duration: 0.5 },
    
    // Аккордовая часть (F#5)
    { id: "t17", string: 5, fret: 0, time: 8.5, duration: 1, chord: "F#5" },
    { id: "t18", string: 4, fret: 0, time: 8.5, duration: 1, chord: "F#5" },
    { id: "t19", string: 3, fret: 2, finger: 2, time: 8.5, duration: 1, chord: "F#5" },
    
    // Аккорд E5
    { id: "t20", string: 5, fret: 0, time: 10.0, duration: 1, chord: "E5" },
    { id: "t21", string: 4, fret: 0, time: 10.0, duration: 1, chord: "E5" },
    { id: "t22", string: 3, fret: 1, finger: 1, time: 10.0, duration: 1, chord: "E5" },
  ]
};

// Функция для получения уникальных аккордов из табулатуры
export function getUniqueChordsFromTabs(tabs: TabNote[]): string[] {
  const chords = new Set<string>();
  tabs.forEach(tab => {
    if (tab.chord) {
      chords.add(tab.chord);
    }
  });
  return Array.from(chords);
}