import { GameSong } from "../types";
import { kinoSpokoynayaNoch } from "./kinoSpokoynayaNoch";
import { ruMine } from "./ruMine";

// Вторая песня для примера
const demoSecondSong: GameSong = {
  id: "demo_song_2",
  title: "Пачка сигарет",
  artist: "Кино",
  bpm: 115,
  difficulty: "easy",
  duration: 30,
  notes: [
    { id: "d1", string: 2, time: 0.5, duration: 1, chord: "Am", fret: 0 },
    { id: "d2", string: 3, time: 0.5, duration: 1, chord: "Am", fret: 0 },
    { id: "d3", string: 4, time: 0.5, duration: 1, chord: "Am", fret: 0 },
    { id: "d4", string: 2, time: 2.0, duration: 1, chord: "C", fret: 0 },
    { id: "d5", string: 3, time: 2.0, duration: 1, chord: "C", fret: 0 },
    { id: "d6", string: 4, time: 2.0, duration: 1, chord: "C", fret: 0 },
  ]
};

// Третья песня
const demothirdSong: GameSong = {
  id: "demo_song_3",
  title: "Звезда по имени Солнце",
  artist: "Кино",
  bpm: 130,
  difficulty: "medium",
  duration: 35,
  notes: [
    { id: "e1", string: 2, time: 0.5, duration: 1, chord: "Em", fret: 0 },
    { id: "e2", string: 3, time: 0.5, duration: 1, chord: "Em", fret: 0 },
    { id: "e3", string: 4, time: 0.5, duration: 1, chord: "Em", fret: 0 },
    { id: "e4", string: 2, time: 2.0, duration: 1, chord: "G", fret: 0 },
    { id: "e5", string: 3, time: 2.0, duration: 1, chord: "G", fret: 0 },
    { id: "e6", string: 4, time: 2.0, duration: 1, chord: "G", fret: 0 },
  ]
};

export const gameSongs: GameSong[] = [
  ruMine,                    // Arctic Monkeys - R U Mine? (главная)
  kinoSpokoynayaNoch,        // Кино - Спокойная ночь
  demoSecondSong,            // Кино - Пачка сигарет
  demothirdSong,             // Кино - Звезда по имени Солнце
];

export { kinoSpokoynayaNoch } from "./kinoSpokoynayaNoch";
export { ruMine } from "./ruMine";