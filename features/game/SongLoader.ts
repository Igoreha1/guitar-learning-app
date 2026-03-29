import { GameNote, GameSong } from "./types";

// Пример песни для теста
export const demoGameSong: GameSong = {
  id: "1",
  title: "Simple Rock",
  artist: "Demo",
  bpm: 120,
  duration: 30,
  notes: [
    { id: "1", string: 2, time: 0.5, duration: 0.5 },
    { id: "2", string: 2, time: 1.0, duration: 0.5 },
    { id: "3", string: 3, time: 1.5, duration: 0.5 },
    { id: "4", string: 3, time: 2.0, duration: 0.5 },
    { id: "5", string: 4, time: 2.5, duration: 0.5 },
    { id: "6", string: 4, time: 3.0, duration: 0.5 },
    { id: "7", string: 5, time: 3.5, duration: 0.5 },
    { id: "8", string: 5, time: 4.0, duration: 0.5 },
    // Аккорд
    { id: "9", string: 2, time: 5.0, duration: 1, chord: "Am" },
    { id: "10", string: 3, time: 5.0, duration: 1, chord: "Am" },
    { id: "11", string: 4, time: 5.0, duration: 1, chord: "Am" },
    // Повтор
    { id: "12", string: 2, time: 6.5, duration: 0.5 },
    { id: "13", string: 2, time: 7.0, duration: 0.5 },
    { id: "14", string: 3, time: 7.5, duration: 0.5 },
    { id: "15", string: 3, time: 8.0, duration: 0.5 },
  ]
};

// Функция для создания песен из обычных аккордов
export function createGameSongFromChords(
  title: string,
  bpm: number,
  chords: Array<{ time: number; chord: string }>
): GameSong {
  const notes: GameNote[] = [];
  let id = 0;
  
  chords.forEach(chord => {
    // Для простоты пока используем 3-5 струны для аккорда
    const strings = [2, 3, 4];
    strings.forEach(string => {
      notes.push({
        id: String(id++),
        string,
        time: chord.time,
        duration: 1,
        chord: chord.chord
      });
    });
  });
  
  return {
    id: String(Date.now()),
    title,
    artist: "User",
    bpm,
    duration: chords[chords.length - 1]?.time + 2 || 10,
    notes
  };
}