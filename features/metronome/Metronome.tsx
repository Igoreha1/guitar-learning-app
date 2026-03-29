"use client";

import { useState, useEffect } from "react";
import * as Tone from "tone";

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    const synth = new Tone.MembraneSynth().toDestination();

    const loop = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C2", "8n", time);
    }, "4n");

    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();
      loop.start(0);
    } else {
      Tone.Transport.stop();
      loop.stop();
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying]);

  return (
    <div className="mt-10 p-6 border rounded-xl">
      <h2 className="text-xl font-bold mb-4">Metronome</h2>

      <div className="mb-4">
        <label>BPM: {bpm}</label>
        <input
          type="range"
          min="40"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsPlaying(true)}
          disabled={isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={() => setIsPlaying(false)}
          disabled={!isPlaying}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Stop
        </button>
      </div>
    </div>
  );
}