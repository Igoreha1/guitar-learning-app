import { Song } from "@/types/song";

export const testSong: Song = {
  title: "Test Song",
  bpm: 90,
  chords: [
    { time: 0, chord: "Am" },
    { time: 2, chord: "F" },
    { time: 4, chord: "C" },
    { time: 6, chord: "G" },
  ],
};