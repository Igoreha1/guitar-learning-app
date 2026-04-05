export interface ChordShape {
  name: string;
  strings: (number | null)[];
  fingers: (number | null)[];
  description?: string;
}

// Базовые аппликатуры для аккордов
export const chordShapes: { [key: string]: ChordShape } = {
  // ========== МАЖОРНЫЕ (Major) ==========
  'C_major': {
    name: 'C',
    strings: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    description: 'Базовый мажорный аккорд'
  },
  'C#_major': {
    name: 'C#',
    strings: [4, 4, 6, 6, 6, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 4-м ладу'
  },
  'D_major': {
    name: 'D',
    strings: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 2, 3, 1],
    description: 'Мажорный аккорд с открытой 4-й струной'
  },
  'D#_major': {
    name: 'D#',
    strings: [6, 6, 8, 8, 8, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 6-м ладу'
  },
  'E_major': {
    name: 'E',
    strings: [0, 2, 2, 1, 0, 0],
    fingers: [null, 3, 4, 2, null, null],
    description: 'Мажорный аккорд с открытыми басами'
  },
  'F_major': {
    name: 'F',
    strings: [1, 1, 2, 3, 3, 1],
    fingers: [1, 1, 2, 3, 4, 1],
    description: 'Аккорд с баррэ на первом ладу'
  },
  'F#_major': {
    name: 'F#',
    strings: [2, 2, 4, 4, 4, 2],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 2-м ладу'
  },
  'G_major': {
    name: 'G',
    strings: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    description: 'Полный и звонкий мажорный аккорд'
  },
  'G#_major': {
    name: 'G#',
    strings: [4, 4, 6, 6, 6, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 4-м ладу'
  },
  'A_major': {
    name: 'A',
    strings: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 2, 3, 4, null],
    description: 'Мажорный аккорд с открытой 5-й струной'
  },
  'A#_major': {
    name: 'A#',
    strings: [6, 6, 8, 8, 8, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 6-м ладу'
  },
  'B_major': {
    name: 'B',
    strings: [2, 4, 4, 4, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    description: 'Аккорд с баррэ на втором ладу'
  },

  // ========== МИНОРНЫЕ (m) ==========
  'Cm_minor': {
    name: 'Cm',
    strings: [3, 3, 5, 5, 4, 3],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 3-м ладу'
  },
  'C#m_minor': {
    name: 'C#m',
    strings: [4, 4, 6, 6, 5, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 4-м ладу'
  },
  'Dm_minor': {
    name: 'Dm',
    strings: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    description: 'Минорный аккорд с открытой 4-й струной'
  },
  'D#m_minor': {
    name: 'D#m',
    strings: [6, 6, 8, 8, 7, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 6-м ладу'
  },
  'Em_minor': {
    name: 'Em',
    strings: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    description: 'Самый простой минорный аккорд'
  },
  'Fm_minor': {
    name: 'Fm',
    strings: [1, 1, 3, 3, 1, 1],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на первом ладу'
  },
  'F#m_minor': {
    name: 'F#m',
    strings: [2, 2, 4, 4, 2, 2],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 2-м ладу'
  },
  'Gm_minor': {
    name: 'Gm',
    strings: [3, 3, 3, 5, 5, 3],
    fingers: [1, 1, 1, 3, 4, 1],
    description: 'Минорный аккорд с баррэ на третьем ладу'
  },
  'G#m_minor': {
    name: 'G#m',
    strings: [4, 4, 6, 6, 4, 4],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 4-м ладу'
  },
  'Am_minor': {
    name: 'Am',
    strings: [null, 1, 2, 2, 0, 0],
    fingers: [null, 1, 3, 2, null, null],
    description: 'Один из самых популярных минорных аккордов'
  },
  'A#m_minor': {
    name: 'A#m',
    strings: [6, 6, 8, 8, 6, 6],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 6-м ладу'
  },
  'Bm_minor': {
    name: 'Bm',
    strings: [2, 2, 4, 4, 3, 2],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 2-м ладу'
  },

  // ========== УМЕНЬШЕННЫЕ (dim) ==========
  'C_dim': {
    name: 'Cdim',
    strings: [null, 3, 4, 3, 4, 0],
    fingers: [null, 2, 4, 1, 3, null],
    description: 'Уменьшенный аккорд'
  },
  'D_dim': {
    name: 'Ddim',
    strings: [null, null, 0, 1, 2, 1],
    fingers: [null, null, null, 1, 3, 2],
    description: 'Уменьшенный аккорд'
  },
  'E_dim': {
    name: 'Edim',
    strings: [0, 1, 2, 0, 0, 0],
    fingers: [null, 1, 3, null, null, null],
    description: 'Уменьшенный аккорд'
  },
  'G_dim': {
    name: 'Gdim',
    strings: [3, 4, 3, 4, 0, 0],
    fingers: [2, 4, 1, 3, null, null],
    description: 'Уменьшенный аккорд'
  },
  'A_dim': {
    name: 'Adim',
    strings: [null, 1, 2, 1, 2, 0],
    fingers: [null, 1, 3, 2, 4, null],
    description: 'Уменьшенный аккорд'
  },

  // ========== УВЕЛИЧЕННЫЕ (aug) ==========
  'C_aug': {
    name: 'Caug',
    strings: [null, 3, 2, 1, 1, 0],
    fingers: [null, 3, 2, 1, 1, null],
    description: 'Увеличенный аккорд'
  },
  'E_aug': {
    name: 'Eaug',
    strings: [0, 3, 2, 1, 0, 0],
    fingers: [null, 3, 2, 1, null, null],
    description: 'Увеличенный аккорд'
  },
  'G_aug': {
    name: 'Gaug',
    strings: [3, 2, 1, 0, 0, 3],
    fingers: [2, 1, 3, null, null, 4],
    description: 'Увеличенный аккорд'
  },

  // ========== SUS2 ==========
  'C_sus2': {
    name: 'Csus2',
    strings: [null, 3, 2, 0, 3, 0],
    fingers: [null, 3, 2, null, 4, null],
    description: 'Подвешенный аккорд'
  },
  'D_sus2': {
    name: 'Dsus2',
    strings: [null, null, 0, 2, 3, 0],
    fingers: [null, null, null, 2, 3, null],
    description: 'Подвешенный аккорд'
  },
  'E_sus2': {
    name: 'Esus2',
    strings: [0, 2, 2, 4, 0, 0],
    fingers: [null, 2, 3, 4, null, null],
    description: 'Подвешенный аккорд'
  },
  'G_sus2': {
    name: 'Gsus2',
    strings: [3, 2, 0, 0, 3, 3],
    fingers: [2, 1, null, null, 3, 4],
    description: 'Подвешенный аккорд'
  },
  'A_sus2': {
    name: 'Asus2',
    strings: [null, 0, 2, 2, 0, 0],
    fingers: [null, null, 2, 3, null, null],
    description: 'Подвешенный аккорд'
  },

  // ========== SUS4 ==========
  'C_sus4': {
    name: 'Csus4',
    strings: [null, 3, 3, 0, 1, 0],
    fingers: [null, 3, 4, null, 1, null],
    description: 'Подвешенный аккорд'
  },
  'D_sus4': {
    name: 'Dsus4',
    strings: [null, null, 0, 2, 3, 3],
    fingers: [null, null, null, 1, 3, 4],
    description: 'Подвешенный аккорд'
  },
  'E_sus4': {
    name: 'Esus4',
    strings: [0, 2, 2, 2, 0, 0],
    fingers: [null, 2, 3, 4, null, null],
    description: 'Подвешенный аккорд'
  },
  'G_sus4': {
    name: 'Gsus4',
    strings: [3, 3, 0, 0, 1, 3],
    fingers: [2, 3, null, null, 1, 4],
    description: 'Подвешенный аккорд'
  },
  'A_sus4': {
    name: 'Asus4',
    strings: [null, 0, 2, 2, 3, 0],
    fingers: [null, null, 2, 3, 4, null],
    description: 'Подвешенный аккорд'
  },

  // ========== СЕПТАККОРДЫ (7) ==========
  'A7_seventh': {
    name: 'A7',
    strings: [null, 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    description: 'Доминантсептаккорд'
  },
  'C7_seventh': {
    name: 'C7',
    strings: [null, 3, 2, 3, 1, 0],
    fingers: [null, 3, 2, 4, 1, null],
    description: 'Доминантсептаккорд от до'
  },
  'D7_seventh': {
    name: 'D7',
    strings: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Доминантсептаккорд'
  },
  'E7_seventh': {
    name: 'E7',
    strings: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    description: 'Простейший септаккорд'
  },
  'G7_seventh': {
    name: 'G7',
    strings: [3, 2, 0, 0, 0, 1],
    fingers: [2, 1, null, null, null, 3],
    description: 'Доминантсептаккорд от соль'
  },

  // ========== МИНОРНЫЕ СЕПТАККОРДЫ (m7) ==========
  'Am7_minor7': {
    name: 'Am7',
    strings: [null, 1, 2, 0, 0, 0],
    fingers: [null, 1, 2, null, null, null],
    description: 'Минорный септаккорд'
  },
  'Dm7_minor7': {
    name: 'Dm7',
    strings: [null, null, 0, 2, 1, 1],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Минорный септаккорд'
  },
  'Em7_minor7': {
    name: 'Em7',
    strings: [0, 2, 0, 0, 0, 0],
    fingers: [null, 2, null, null, null, null],
    description: 'Минорный септаккорд'
  },

  // ========== МАЖОРНЫЕ СЕПТАККОРДЫ (maj7) ==========
  'Cmaj7_major7': {
    name: 'Cmaj7',
    strings: [null, 3, 2, 0, 0, 0],
    fingers: [null, 3, 2, null, null, null],
    description: 'Мажорный септаккорд'
  },
  'Fmaj7_major7': {
    name: 'Fmaj7',
    strings: [1, 1, 2, 2, 1, 0],
    fingers: [1, 1, 3, 4, 2, null],
    description: 'Мажорный септаккорд'
  },
  'Gmaj7_major7': {
    name: 'Gmaj7',
    strings: [3, 2, 0, 0, 0, 2],
    fingers: [2, 1, null, null, null, 4],
    description: 'Мажорный септаккорд'
  },

  // ========== НОН-АККОРДЫ (9) ==========
  'C9_ninth': {
    name: 'C9',
    strings: [null, 3, 2, 3, 3, 0],
    fingers: [null, 2, 1, 3, 4, null],
    description: 'Нонаккорд'
  },
  'D9_ninth': {
    name: 'D9',
    strings: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Нонаккорд'
  },
  'G9_ninth': {
    name: 'G9',
    strings: [3, 2, 0, 2, 0, 1],
    fingers: [2, 1, null, 3, null, 4],
    description: 'Нонаккорд'
  },

  // ========== ADD9 ==========
  'C_add9': {
    name: 'Cadd9',
    strings: [null, 3, 2, 0, 3, 0],
    fingers: [null, 2, 1, null, 3, null],
    description: 'Добавленная нона'
  },
  'D_add9': {
    name: 'Dadd9',
    strings: [null, null, 0, 2, 4, 2],
    fingers: [null, null, null, 1, 3, 2],
    description: 'Добавленная нона'
  },
  'E_add9': {
    name: 'Eadd9',
    strings: [0, 2, 4, 1, 0, 0],
    fingers: [null, 2, 4, 1, null, null],
    description: 'Добавленная нона'
  },
  'G_add9': {
    name: 'Gadd9',
    strings: [3, 2, 0, 0, 3, 0],
    fingers: [2, 1, null, null, 3, null],
    description: 'Добавленная нона'
  },
  'A_add9': {
    name: 'Aadd9',
    strings: [null, 0, 2, 4, 2, 0],
    fingers: [null, null, 1, 3, 2, null],
    description: 'Добавленная нона'
  },
};

// Ноты для выбора
export const notes = [
  { name: 'C', alt: 'C' },
  { name: 'C#', alt: 'Db' },
  { name: 'D', alt: 'D' },
  { name: 'D#', alt: 'Eb' },
  { name: 'E', alt: 'E' },
  { name: 'F', alt: 'F' },
  { name: 'F#', alt: 'Gb' },
  { name: 'G', alt: 'G' },
  { name: 'G#', alt: 'Ab' },
  { name: 'A', alt: 'A' },
  { name: 'A#', alt: 'Bb' },
  { name: 'B', alt: 'B' }
];

// Типы аккордов
export const chordTypes = [
  { name: 'Major', suffix: '', symbol: '', getKey: (note: string) => `${note}_major` },
  { name: 'm', suffix: 'm', symbol: 'm', getKey: (note: string) => `${note}_minor` },
  { name: 'dim', suffix: 'dim', symbol: '°', getKey: (note: string) => `${note}_dim` },
  { name: 'aug', suffix: 'aug', symbol: '+', getKey: (note: string) => `${note}_aug` },
  { name: 'sus2', suffix: 'sus2', symbol: 'sus2', getKey: (note: string) => `${note}_sus2` },
  { name: 'sus4', suffix: 'sus4', symbol: 'sus4', getKey: (note: string) => `${note}_sus4` },
  { name: '7', suffix: '7', symbol: '7', getKey: (note: string) => `${note}_seventh` },
  { name: 'm7', suffix: 'm7', symbol: 'm7', getKey: (note: string) => `${note}_minor7` },
  { name: 'maj7', suffix: 'maj7', symbol: 'Δ7', getKey: (note: string) => `${note}_major7` },
  { name: '9', suffix: '9', symbol: '9', getKey: (note: string) => `${note}_ninth` },
  { name: 'm9', suffix: 'm9', symbol: 'm9', getKey: (note: string) => `${note}_minor9` },
  { name: 'add9', suffix: 'add9', symbol: 'add9', getKey: (note: string) => `${note}_add9` }
];

// Функция для получения аккорда по ноте и типу
export function getChordByNoteAndType(note: string, typeName: string): ChordShape {
  const type = chordTypes.find(t => t.name === typeName);
  if (!type) return chordShapes['C_major'];
  
  const key = type.getKey(note);
  
  // Пробуем найти точное совпадение
  if (chordShapes[key]) {
    return chordShapes[key];
  }
  
  // Пробуем альтернативные варианты
  const altKey = `${note}_${type.name.toLowerCase()}`;
  if (chordShapes[altKey]) {
    return chordShapes[altKey];
  }
  
  // Для минорных аккордов
  if (typeName === 'm') {
    const minorKey = `${note}_minor`;
    if (chordShapes[minorKey]) return chordShapes[minorKey];
  }
  
  // Возвращаем мажорный аккорд как fallback
  const majorKey = `${note}_major`;
  return chordShapes[majorKey] || chordShapes['C_major'];
}