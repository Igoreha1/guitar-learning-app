import { GameSong } from "../types";

export const kinoSpokoynayaNoch: GameSong = {
  id: "kino_spokoynaya_noch_intro",
  title: "Спокойная ночь (интро Юрия Каспаряна)",
  artist: "Кино",
  bpm: 122,
  difficulty: "easy",
  duration: 16,
  notes: [
    // ========== ИНТРО (партия Юрия Каспаряна) ==========
    // Первая фраза
    { id: "n1", string: 1, time: 0.00, duration: 0.4 },
    { id: "n2", string: 1, time: 0.50, duration: 0.4 },
    { id: "n3", string: 1, time: 1.00, duration: 0.4 },
    { id: "n4", string: 2, time: 1.50, duration: 0.4 },
    { id: "n5", string: 2, time: 2.00, duration: 0.4 },
    { id: "n6", string: 1, time: 2.50, duration: 0.4 },
    { id: "n7", string: 1, time: 3.00, duration: 0.8 },
    
    // Вторая фраза
    { id: "n8", string: 1, time: 4.00, duration: 0.4 },
    { id: "n9", string: 1, time: 4.50, duration: 0.4 },
    { id: "n10", string: 1, time: 5.00, duration: 0.4 },
    { id: "n11", string: 2, time: 5.50, duration: 0.4 },
    { id: "n12", string: 2, time: 6.00, duration: 0.4 },
    { id: "n13", string: 3, time: 6.50, duration: 0.4 },
    { id: "n14", string: 3, time: 7.00, duration: 0.8 },
    
    // Третья фраза
    { id: "n15", string: 2, time: 8.00, duration: 0.4 },
    { id: "n16", string: 1, time: 8.50, duration: 0.4 },
    { id: "n17", string: 2, time: 9.00, duration: 0.4 },
    { id: "n18", string: 3, time: 9.50, duration: 0.4 },
    { id: "n19", string: 3, time: 10.00, duration: 0.4 },
    { id: "n20", string: 2, time: 10.50, duration: 0.4 },
    { id: "n21", string: 1, time: 11.00, duration: 0.8 },
    
    // Завершение
    { id: "n22", string: 1, time: 12.00, duration: 0.4 },
    { id: "n23", string: 2, time: 12.50, duration: 0.4 },
    { id: "n24", string: 3, time: 13.00, duration: 0.4 },
    { id: "n25", string: 3, time: 13.50, duration: 0.4 },
    { id: "n26", string: 2, time: 14.00, duration: 0.4 },
    { id: "n27", string: 1, time: 14.50, duration: 1.0 },
  ]
};

// Убираем экспорт gameSongs отсюда! Он будет только в index.ts