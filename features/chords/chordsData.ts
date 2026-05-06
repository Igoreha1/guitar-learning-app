// features/chords/chordsData.ts

export interface ChordShape {
  name: string;
  strings: (number | null)[];
  fingers: (number | null)[];
  description?: string;
  tip?: string;
}

// Базовые аппликатуры для аккордов
export const chordShapes: { [key: string]: ChordShape } = {
  // ========== МАЖОРНЫЕ (Major) ==========
  'C_major': {
    name: 'C',
    strings: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    description: 'Базовый мажорный аккорд, основа многих песен',
    tip: 'Следите, чтобы третья струна (Ля) звучала открытой'
  },
  'C#_major': {
    name: 'C#',
    strings: [4, 4, 6, 6, 6, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 4-м ладу',
    tip: 'Используйте указательный палец для баррэ на 4-м ладу'
  },
  'D_major': {
    name: 'D',
    strings: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 2, 3, 1],
    description: 'Мажорный аккорд с открытой 4-й струной',
    tip: 'Начинайте с расположения пальцев на 1-й и 2-й струнах'
  },
  'D#_major': {
    name: 'D#',
    strings: [6, 6, 8, 8, 8, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 6-м ладу',
    tip: 'Переносите форму аккорда A с баррэ'
  },
  'E_major': {
    name: 'E',
    strings: [0, 2, 2, 1, 0, 0],
    fingers: [null, 3, 4, 2, null, null],
    description: 'Мажорный аккорд с открытыми басами',
    tip: 'Самый простой мажорный аккорд для начинающих'
  },
  'F_major': {
    name: 'F',
    strings: [1, 1, 2, 3, 3, 1],
    fingers: [1, 1, 2, 3, 4, 1],
    description: 'Первый аккорд с баррэ для многих гитаристов',
    tip: 'Тренируйте силу указательного пальца для чистого баррэ'
  },
  'F#_major': {
    name: 'F#',
    strings: [2, 2, 4, 4, 4, 2],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 2-м ладу',
    tip: 'Переносите форму аккорда F на 2 лада выше'
  },
  'G_major': {
    name: 'G',
    strings: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    description: 'Полный и звонкий мажорный аккорд',
    tip: 'Мизинец и безымянный палец ставьте на 3-й лад'
  },
  'G#_major': {
    name: 'G#',
    strings: [4, 4, 6, 6, 6, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 4-м ладу',
    tip: 'Используйте форму аккорда F'
  },
  'A_major': {
    name: 'A',
    strings: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 2, 3, 4, null],
    description: 'Мажорный аккорд с открытой 5-й струной',
    tip: 'Можно зажать тремя пальцами в ряд'
  },
  'A#_major': {
    name: 'A#',
    strings: [6, 6, 8, 8, 8, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Мажорный аккорд с баррэ на 6-м ладу',
    tip: 'Используйте форму аккорда A с баррэ'
  },
  'B_major': {
    name: 'B',
    strings: [2, 4, 4, 4, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    description: 'Аккорд с баррэ на втором ладу',
    tip: 'Указательный палец зажимает все струны на 2-м ладу'
  },

  // ========== МИНОРНЫЕ (Minor) ==========
  'Cm_minor': {
    name: 'Cm',
    strings: [3, 3, 5, 5, 4, 3],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 3-м ладу',
    tip: 'Используйте форму аккорда Am с баррэ'
  },
  'C#m_minor': {
    name: 'C#m',
    strings: [4, 4, 6, 6, 5, 4],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 4-м ладу',
    tip: 'Переносите форму аккорда Bm'
  },
  'Dm_minor': {
    name: 'Dm',
    strings: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    description: 'Минорный аккорд с открытой 4-й струной',
    tip: 'Похож на аккорд D, но с мизинцем на 1-й струне'
  },
  'D#m_minor': {
    name: 'D#m',
    strings: [6, 6, 8, 8, 7, 6],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный аккорд с баррэ на 6-м ладу',
    tip: 'Используйте форму аккорда Bm'
  },
  'Em_minor': {
    name: 'Em',
    strings: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    description: 'Самый простой минорный аккорд',
    tip: 'Начинайте обучение с этого аккорда'
  },
  'Fm_minor': {
    name: 'Fm',
    strings: [1, 1, 3, 3, 1, 1],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на первом ладу',
    tip: 'Сложный аккорд, требует практики баррэ'
  },
  'F#m_minor': {
    name: 'F#m',
    strings: [2, 2, 4, 4, 2, 2],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 2-м ладу',
    tip: 'Переносите форму аккорда Fm'
  },
  'Gm_minor': {
    name: 'Gm',
    strings: [3, 3, 3, 5, 5, 3],
    fingers: [1, 1, 1, 3, 4, 1],
    description: 'Минорный аккорд с баррэ на третьем ладу',
    tip: 'Аккорд Gm в форме Em с баррэ'
  },
  'G#m_minor': {
    name: 'G#m',
    strings: [4, 4, 6, 6, 4, 4],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 4-м ладу',
    tip: 'Используйте форму аккорда Fm'
  },
  'Am_minor': {
    name: 'Am',
    strings: [null, 1, 2, 2, 0, 0],
    fingers: [null, 1, 3, 2, null, null],
    description: 'Один из самых популярных минорных аккордов',
    tip: 'Ставьте пальцы вертикально, не глушите соседние струны'
  },
  'A#m_minor': {
    name: 'A#m',
    strings: [6, 6, 8, 8, 6, 6],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный аккорд с баррэ на 6-м ладу',
    tip: 'Переносите форму аккорда Bm'
  },
  'Bm_minor': {
    name: 'Bm',
    strings: [2, 2, 4, 4, 3, 2],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Важный минорный аккорд с баррэ',
    tip: 'Освойте этот аккорд для игры в тональности Bm'
  },

  // ========== СЕПТАККОРДЫ (7) ==========
  'C7_seventh': {
    name: 'C7',
    strings: [null, 3, 2, 3, 1, 0],
    fingers: [null, 3, 2, 4, 1, null],
    description: 'Доминантсептаккорд от до',
    tip: 'Часто используется в блюзе и рок-н-ролле'
  },
  'D7_seventh': {
    name: 'D7',
    strings: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Доминантсептаккорд от ре',
    tip: 'Звучит немного "грязновато" — так и должно быть'
  },
  'E7_seventh': {
    name: 'E7',
    strings: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    description: 'Простейший септаккорд',
    tip: 'Основа блюзового звучания'
  },
  'F7_seventh': {
    name: 'F7',
    strings: [1, 1, 2, 3, 1, 1],
    fingers: [1, 1, 2, 4, 1, 1],
    description: 'Доминантсептаккорд от фа с баррэ',
    tip: 'Используйте форму аккорда F с добавлением 7-й ступени'
  },
  'G7_seventh': {
    name: 'G7',
    strings: [3, 2, 0, 0, 0, 1],
    fingers: [2, 1, null, null, null, 3],
    description: 'Доминантсептаккорд от соль',
    tip: 'Очень популярен в джазе и блюзе'
  },
  'A7_seventh': {
    name: 'A7',
    strings: [null, 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    description: 'Доминантсептаккорд от ля',
    tip: 'Отличные переходы в аккорд D7'
  },
  'B7_seventh': {
    name: 'B7',
    strings: [2, 4, 2, 4, 2, 2],
    fingers: [1, 3, 1, 4, 1, 1],
    description: 'Доминантсептаккорд от си',
    tip: 'Используйте форму аккорда A7 с баррэ'
  },

  // ========== МАЖОРНЫЕ СЕПТАККОРДЫ (maj7) ==========
  'Cmaj7_major7': {
    name: 'Cmaj7',
    strings: [null, 3, 2, 0, 0, 0],
    fingers: [null, 3, 2, null, null, null],
    description: 'Мажорный септаккорд с мягким джазовым звучанием',
    tip: 'Звучит "сладко", часто в джазе'
  },
  'Dmaj7_major7': {
    name: 'Dmaj7',
    strings: [null, null, 0, 2, 2, 2],
    fingers: [null, null, null, 1, 2, 3],
    description: 'Мажорный септаккорд от ре',
    tip: 'Красивое, мечтательное звучание'
  },
  'Emaj7_major7': {
    name: 'Emaj7',
    strings: [0, 2, 4, 4, 4, 0],
    fingers: [null, 1, 2, 3, 4, null],
    description: 'Мажорный септаккорд от ми',
    tip: 'Используйте все пальцы для зажатия'
  },
  'Fmaj7_major7': {
    name: 'Fmaj7',
    strings: [1, 1, 2, 2, 1, 0],
    fingers: [1, 1, 3, 4, 2, null],
    description: 'Мажорный септаккорд от фа',
    tip: 'Отличная альтернатива полному баррэ F'
  },
  'Gmaj7_major7': {
    name: 'Gmaj7',
    strings: [3, 2, 0, 0, 0, 2],
    fingers: [2, 1, null, null, null, 4],
    description: 'Мажорный септаккорд от соль',
    tip: 'Похож на обычный G, но с добавлением ноты'
  },
  'Amaj7_major7': {
    name: 'Amaj7',
    strings: [null, 0, 2, 1, 2, 0],
    fingers: [null, null, 2, 1, 3, null],
    description: 'Мажорный септаккорд от ля',
    tip: 'Попробуйте зажать указательным пальцем 1-й лад на 4-й струне'
  },

  // ========== МИНОРНЫЕ СЕПТАККОРДЫ (m7) ==========
  'Cm7_minor7': {
    name: 'Cm7',
    strings: [3, 3, 5, 5, 4, 3],
    fingers: [1, 1, 3, 4, 2, 1],
    description: 'Минорный септаккорд от до',
    tip: 'Используйте форму аккорда Cm'
  },
  'Dm7_minor7': {
    name: 'Dm7',
    strings: [null, null, 0, 2, 1, 1],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Минорный септаккорд от ре',
    tip: 'Похож на Dm, но с мизинцем на 1-й струне'
  },
  'Em7_minor7': {
    name: 'Em7',
    strings: [0, 2, 0, 0, 0, 0],
    fingers: [null, 2, null, null, null, null],
    description: 'Минорный септаккорд от ми',
    tip: 'Самый лёгкий минорный септаккорд'
  },
  'Fm7_minor7': {
    name: 'Fm7',
    strings: [1, 1, 3, 3, 1, 1],
    fingers: [1, 1, 3, 4, 1, 1],
    description: 'Минорный септаккорд от фа',
    tip: 'Используйте форму аккорда Fm'
  },
  'Gm7_minor7': {
    name: 'Gm7',
    strings: [3, 3, 3, 5, 3, 3],
    fingers: [1, 1, 1, 3, 1, 1],
    description: 'Минорный септаккорд от соль',
    tip: 'Тренируйте баррэ на 3-м ладу'
  },
  'Am7_minor7': {
    name: 'Am7',
    strings: [null, 1, 2, 0, 0, 0],
    fingers: [null, 1, 2, null, null, null],
    description: 'Минорный септаккорд от ля',
    tip: 'Очень популярен в поп-музыке'
  },

  // ========== УМЕНЬШЕННЫЕ (dim) ==========
  'C_dim': {
    name: 'Cdim',
    strings: [null, 3, 4, 3, 4, 0],
    fingers: [null, 2, 4, 1, 3, null],
    description: 'Уменьшенный аккорд — создаёт напряжение',
    tip: 'Используется для переходов между аккордами'
  },
  'D_dim': {
    name: 'Ddim',
    strings: [null, null, 0, 1, 2, 1],
    fingers: [null, null, null, 1, 3, 2],
    description: 'Уменьшенный аккорд от ре',
    tip: 'Звучит тревожно и напряжённо'
  },
  'E_dim': {
    name: 'Edim',
    strings: [0, 1, 2, 0, 0, 0],
    fingers: [null, 1, 3, null, null, null],
    description: 'Уменьшенный аккорд от ми',
    tip: 'Простая форма для начинающих'
  },
  'G_dim': {
    name: 'Gdim',
    strings: [3, 4, 3, 4, 0, 0],
    fingers: [2, 4, 1, 3, null, null],
    description: 'Уменьшенный аккорд от соль',
    tip: 'Интересный переход в G'
  },
  'A_dim': {
    name: 'Adim',
    strings: [null, 1, 2, 1, 2, 0],
    fingers: [null, 1, 3, 2, 4, null],
    description: 'Уменьшенный аккорд от ля',
    tip: 'Часто используется в классической музыке'
  },

  // ========== УВЕЛИЧЕННЫЕ (aug) ==========
  'C_aug': {
    name: 'Caug',
    strings: [null, 3, 2, 1, 1, 0],
    fingers: [null, 3, 2, 1, 1, null],
    description: 'Увеличенный аккорд — загадочное звучание',
    tip: 'Создаёт ощущение движения'
  },
  'E_aug': {
    name: 'Eaug',
    strings: [0, 3, 2, 1, 0, 0],
    fingers: [null, 3, 2, 1, null, null],
    description: 'Увеличенный аккорд от ми',
    tip: 'Попробуйте в джазовых стандартах'
  },
  'G_aug': {
    name: 'Gaug',
    strings: [3, 2, 1, 0, 0, 3],
    fingers: [2, 1, 3, null, null, 4],
    description: 'Увеличенный аккорд от соль',
    tip: 'Используется в прог-роке'
  },

  // ========== SUS2 ==========
  'C_sus2': {
    name: 'Csus2',
    strings: [null, 3, 2, 0, 3, 0],
    fingers: [null, 3, 2, null, 4, null],
    description: 'Подвешенный аккорд — открытое звучание',
    tip: 'Отлично подходит для фолка'
  },
  'D_sus2': {
    name: 'Dsus2',
    strings: [null, null, 0, 2, 3, 0],
    fingers: [null, null, null, 2, 3, null],
    description: 'Подвешенный аккорд от ре',
    tip: 'Замените им обычный D для разнообразия'
  },
  'E_sus2': {
    name: 'Esus2',
    strings: [0, 2, 2, 4, 0, 0],
    fingers: [null, 2, 3, 4, null, null],
    description: 'Подвешенный аккорд от ми',
    tip: 'Красиво звучит в арпеджио'
  },
  'G_sus2': {
    name: 'Gsus2',
    strings: [3, 2, 0, 0, 3, 3],
    fingers: [2, 1, null, null, 3, 4],
    description: 'Подвешенный аккорд от соль',
    tip: 'Популярен в альтернативном роке'
  },
  'A_sus2': {
    name: 'Asus2',
    strings: [null, 0, 2, 2, 0, 0],
    fingers: [null, null, 2, 3, null, null],
    description: 'Подвешенный аккорд от ля',
    tip: 'Значительно легче обычного A'
  },

  // ========== SUS4 ==========
  'C_sus4': {
    name: 'Csus4',
    strings: [null, 3, 3, 0, 1, 0],
    fingers: [null, 3, 4, null, 1, null],
    description: 'Подвешенный аккорд на 4 ступени',
    tip: 'Отличные переходы C — Csus4 — C'
  },
  'D_sus4': {
    name: 'Dsus4',
    strings: [null, null, 0, 2, 3, 3],
    fingers: [null, null, null, 1, 3, 4],
    description: 'Подвешенный аккорд от ре',
    tip: 'Попробуйте чередовать с D'
  },
  'E_sus4': {
    name: 'Esus4',
    strings: [0, 2, 2, 2, 0, 0],
    fingers: [null, 2, 3, 4, null, null],
    description: 'Подвешенный аккорд от ми',
    tip: 'Классика рок-музыки'
  },
  'G_sus4': {
    name: 'Gsus4',
    strings: [3, 3, 0, 0, 1, 3],
    fingers: [2, 3, null, null, 1, 4],
    description: 'Подвешенный аккорд от соль',
    tip: 'Очень популярен в поп-музыке'
  },
  'A_sus4': {
    name: 'Asus4',
    strings: [null, 0, 2, 2, 3, 0],
    fingers: [null, null, 2, 3, 4, null],
    description: 'Подвешенный аккорд от ля',
    tip: 'Легко переходить из Am или A'
  },

  // ========== НОНАККОРДЫ (9) ==========
  'C9_ninth': {
    name: 'C9',
    strings: [null, 3, 2, 3, 3, 0],
    fingers: [null, 2, 1, 3, 4, null],
    description: 'Нонаккорд — джазовое звучание',
    tip: 'Освойте для игры джаза и фанка'
  },
  'D9_ninth': {
    name: 'D9',
    strings: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    description: 'Нонаккорд от ре',
    tip: 'Похож на D7 с дополнительной нотой'
  },
  'G9_ninth': {
    name: 'G9',
    strings: [3, 2, 0, 2, 0, 1],
    fingers: [2, 1, null, 3, null, 4],
    description: 'Нонаккорд от соль',
    tip: 'Используйте в блюзовых соло'
  },

  // ========== ADD9 ==========
  'C_add9': {
    name: 'Cadd9',
    strings: [null, 3, 2, 0, 3, 0],
    fingers: [null, 2, 1, null, 3, null],
    description: 'Аккорд с добавленной ноной',
    tip: 'Очень популярен в современной музыке'
  },
  'D_add9': {
    name: 'Dadd9',
    strings: [null, null, 0, 2, 4, 2],
    fingers: [null, null, null, 1, 3, 2],
    description: 'Добавленная нона от ре',
    tip: 'Красиво звучит в арпеджио'
  },
  'E_add9': {
    name: 'Eadd9',
    strings: [0, 2, 4, 1, 0, 0],
    fingers: [null, 2, 4, 1, null, null],
    description: 'Добавленная нона от ми',
    tip: 'Замените им обычный E для интереса'
  },
  'G_add9': {
    name: 'Gadd9',
    strings: [3, 2, 0, 0, 3, 0],
    fingers: [2, 1, null, null, 3, null],
    description: 'Добавленная нона от соль',
    tip: 'Современное звучание'
  },
  'A_add9': {
    name: 'Aadd9',
    strings: [null, 0, 2, 4, 2, 0],
    fingers: [null, null, 1, 3, 2, null],
    description: 'Добавленная нона от ля',
    tip: 'Отличная замена обычному A'
  },
};

// Ноты для выбора
export const notes = [
  { name: 'C', alt: 'C', accidental: '' },
  { name: 'C#', alt: 'Db', accidental: '♯' },
  { name: 'D', alt: 'D', accidental: '' },
  { name: 'D#', alt: 'Eb', accidental: '♯' },
  { name: 'E', alt: 'E', accidental: '' },
  { name: 'F', alt: 'F', accidental: '' },
  { name: 'F#', alt: 'Gb', accidental: '♯' },
  { name: 'G', alt: 'G', accidental: '' },
  { name: 'G#', alt: 'Ab', accidental: '♯' },
  { name: 'A', alt: 'A', accidental: '' },
  { name: 'A#', alt: 'Bb', accidental: '♯' },
  { name: 'B', alt: 'B', accidental: '' },
];

// Типы аккордов
export const chordTypes = [
  { name: 'Major', suffix: '', symbol: 'maj', getKey: (note: string) => `${note}_major` },
  { name: 'Minor', suffix: 'm', symbol: 'min', getKey: (note: string) => `${note}_minor` },
  { name: 'Seventh', suffix: '7', symbol: '7', getKey: (note: string) => `${note}_seventh` },
  { name: 'Major Seventh', suffix: 'maj7', symbol: 'Δ7', getKey: (note: string) => `${note}_major7` },
  { name: 'Minor Seventh', suffix: 'm7', symbol: 'm7', getKey: (note: string) => `${note}_minor7` },
  { name: 'Sixth', suffix: '6', symbol: '6', getKey: (note: string) => `${note}_sixth` },
  { name: 'Minor Sixth', suffix: 'm6', symbol: 'm6', getKey: (note: string) => `${note}_minor6'` },
  { name: 'Ninth', suffix: '9', symbol: '9', getKey: (note: string) => `${note}_ninth` },
  { name: 'Diminished', suffix: 'dim', symbol: '°', getKey: (note: string) => `${note}_dim` },
  { name: 'Augmented', suffix: 'aug', symbol: '+', getKey: (note: string) => `${note}_aug` },
  { name: 'Suspended 2', suffix: 'sus2', symbol: 'sus2', getKey: (note: string) => `${note}_sus2` },
  { name: 'Suspended 4', suffix: 'sus4', symbol: 'sus4', getKey: (note: string) => `${note}_sus4` },
  { name: 'Add 9', suffix: 'add9', symbol: 'add9', getKey: (note: string) => `${note}_add9` },
];

// Функция для получения аккорда по ноте и типу
export function getChordByNoteAndType(note: string, typeName: string): ChordShape {
  const type = chordTypes.find(t => t.name === typeName);
  if (!type) return chordShapes['C_major'];
  
  // Для минорных аккордов (m)
  if (typeName === 'Minor') {
    const key = `${note}_minor`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для мажорных аккордов (Major)
  if (typeName === 'Major') {
    const key = `${note}_major`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для септаккордов (7)
  if (typeName === 'Seventh') {
    const key = `${note}_seventh`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для мажорных септаккордов (maj7)
  if (typeName === 'Major Seventh') {
    const key = `${note}_major7`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для минорных септаккордов (m7)
  if (typeName === 'Minor Seventh') {
    const key = `${note}_minor7`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для нонаккордов (9)
  if (typeName === 'Ninth') {
    const key = `${note}_ninth`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для уменьшенных (dim)
  if (typeName === 'Diminished') {
    const key = `${note}_dim`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для увеличенных (aug)
  if (typeName === 'Augmented') {
    const key = `${note}_aug`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для sus2
  if (typeName === 'Suspended 2') {
    const key = `${note}_sus2`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для sus4
  if (typeName === 'Suspended 4') {
    const key = `${note}_sus4`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Для add9
  if (typeName === 'Add 9') {
    const key = `${note}_add9`;
    if (chordShapes[key]) return chordShapes[key];
  }
  
  // Fallback — ищем мажорный аккорд
  const majorKey = `${note}_major`;
  if (chordShapes[majorKey]) return chordShapes[majorKey];
  
  // Последний fallback
  return chordShapes['C_major'];
}

// Функция для получения всех доступных аккордов
export function getAllChords(): ChordShape[] {
  return Object.values(chordShapes);
}

// Функция для поиска аккордов по названию
export function searchChords(query: string): ChordShape[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(chordShapes).filter(chord => 
    chord.name.toLowerCase().includes(lowerQuery)
  );
}