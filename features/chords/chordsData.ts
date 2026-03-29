export interface Chord {
  name: string;
  fullName: string;
  strings: (number | null)[]; // null - открытая струна, число - лад
  fingers: (number | null)[]; // какой палец зажимает (1-указательный, 2-средний, 3-безымянный, 4-мизинец)
  description: string;
  sound?: string;
}

export const chords: Chord[] = [
  {
    name: "Am",
    fullName: "Ля минор",
    strings: [null, 1, 2, 2, 0, 0], // с 6-й по 1-ю
    fingers: [null, 1, 3, 2, null, null],
    description: "Один из самых популярных аккордов. Все открытые струны звучат."
  },
  {
    name: "C",
    fullName: "До мажор",
    strings: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    description: "Базовый мажорный аккорд."
  },
  {
    name: "Dm",
    fullName: "Ре минор",
    strings: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    description: "Минорный аккорд с открытой 4-й струной."
  },
  {
    name: "Em",
    fullName: "Ми минор",
    strings: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    description: "Самый простой минорный аккорд."
  },
  {
    name: "G",
    fullName: "Соль мажор",
    strings: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, null, null, null, 3],
    description: "Полный и звонкий мажорный аккорд."
  },
  {
    name: "F",
    fullName: "Фа мажор",
    strings: [1, 1, 2, 3, 3, 1],
    fingers: [1, 1, 2, 3, 4, 1],
    description: "Аккорд с баррэ на первом ладу."
  },
  {
    name: "A",
    fullName: "Ля мажор",
    strings: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 2, 3, 4, null],
    description: "Мажорный аккорд с открытой 5-й струной."
  },
  {
    name: "E",
    fullName: "Ми мажор",
    strings: [0, 2, 2, 1, 0, 0],
    fingers: [null, 3, 4, 2, null, null],
    description: "Мажорный аккорд с открытыми басами."
  },
  {
    name: "D",
    fullName: "Ре мажор",
    strings: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    description: "Мажорный аккорд с открытой 4-й струной."
  },
  {
    name: "H7",
    fullName: "Си септаккорд",
    strings: [2, 0, 2, 1, 2, 0],
    fingers: [2, null, 3, 1, 4, null],
    description: "Септаккорд, часто используется в блюзе."
  }
];

// Популярные категории
export const chordCategories = [
  { name: "Все", chords: chords },
  { name: "Минорные", chords: chords.filter(c => c.name.includes('m')) },
  { name: "Мажорные", chords: chords.filter(c => !c.name.includes('m') && !c.name.includes('7')) },
  { name: "Септаккорды", chords: chords.filter(c => c.name.includes('7')) },
  { name: "Для начинающих", chords: chords.slice(0, 5) }
];