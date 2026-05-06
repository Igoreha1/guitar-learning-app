// utils/noteConverter.ts
import { GameNote } from '@/types/note';

export interface TabNote {
  id: string;
  string: number;
  fret: number;
  time: number;
  beat: number;
  measure: number;
  subBeat: number;
  duration: number;
}

/**
 * Конвертирует GameNote (для API/игры) в TabNote (для редактора)
 */
export function toTabNote(note: GameNote, bpm: number, timeSignature: [number, number] = [4, 4]): TabNote {
  const { measure, beat, subBeat } = secondsToBeats(note.time, bpm, timeSignature);
  return {
    id: note.id,
    string: note.string,
    fret: note.fret,
    time: note.time,
    beat: beat,
    measure: measure,
    subBeat: subBeat,
    duration: note.duration
  };
}

/**
 * Конвертирует TabNote (из редактора) в GameNote (для API/игры)
 */
export function toGameNote(tabNote: TabNote): GameNote {
  return {
    id: tabNote.id,
    string: tabNote.string,
    fret: tabNote.fret,
    time: tabNote.time,
    duration: tabNote.duration,
    measure: tabNote.measure,
    beat: tabNote.beat,
    subBeat: tabNote.subBeat
  };
}

/**
 * Конвертирует секунды в такт/долю/суб-долю
 */
export function secondsToBeats(seconds: number, bpm: number, timeSignature: [number, number] = [4, 4]): { measure: number; beat: number; subBeat: number } {
  const beatDuration = 60 / bpm;
  const beatsPerMeasure = timeSignature[0];
  const SUB_DIVISIONS = 4;
  
  const totalBeats = seconds / beatDuration;
  const measure = Math.floor(totalBeats / beatsPerMeasure) + 1;
  const beatInMeasure = totalBeats % beatsPerMeasure;
  const beat = Math.floor(beatInMeasure) + 1;
  const subBeat = Math.floor((beatInMeasure % 1) * SUB_DIVISIONS);
  
  return { measure, beat, subBeat: Math.min(subBeat, SUB_DIVISIONS - 1) };
}

/**
 * Конвертирует такт/долю/суб-долю в секунды
 */
export function beatsToSeconds(measure: number, beat: number, subBeat: number, bpm: number, timeSignature: [number, number] = [4, 4]): number {
  const beatDuration = 60 / bpm;
  const beatsPerMeasure = timeSignature[0];
  const SUB_DIVISIONS = 4;
  
  const totalBeats = (measure - 1) * beatsPerMeasure + (beat - 1) + (subBeat / SUB_DIVISIONS);
  return totalBeats * beatDuration;
}