"use client";

import { useEffect, useState } from "react";
import * as Tone from "tone";
import { Song } from "@/types/song";

export default function Player({ song }: { song: Song }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Tone.Transport.seconds);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const currentChord = song.chords.find((c, i) => {
    return (
      currentTime >= c.time &&
      (!song.chords[i + 1] || currentTime < song.chords[i + 1].time)
    );
  });

  const start = async () => {
    await Tone.start();
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stop = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const reset = () => {
    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    setIsPlaying(false);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">{song.title} (BPM: {song.bpm})</h2>
      
      <div className="text-4xl font-bold mb-4">
        Current chord: {currentChord?.chord || "-"}
      </div>

      <div className="flex gap-4">
        <button
          onClick={start}
          disabled={isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={stop}
          disabled={!isPlaying}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-bold mb-2">Chord timeline:</h3>
        <div className="flex gap-2 flex-wrap">
          {song.chords.map((chord, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded ${
                currentChord === chord
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {chord.chord} @ {chord.time}s
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}