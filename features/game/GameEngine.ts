import * as Tone from "tone";
import { GameNote, GameSong, GameState } from "./types";
import { audioEngine } from "@/lib/audioEngine";

export class GameEngine {
  private synth: Tone.PolySynth;
  private notes: GameNote[] = [];
  private hitNotes: Set<string> = new Set();
  private missedNotes: Set<string> = new Set();
  private intervalId: NodeJS.Timeout | null = null;
  private isGameActive: boolean = false;
  private isGamePaused: boolean = false;
  private startOffset: number = 0;
  
  // Буфер для аккордов (собираем несколько частот)
  private chordFrequencyBuffer: number[] = [];
  private chordDetectionTimer: NodeJS.Timeout | null = null;
  private readonly CHORD_BUFFER_DELAY = 180; // мс для сбора аккорда
  private lastHitTime: number = 0;
  private readonly HIT_COOLDOWN = 120;
  
  public state: GameState = {
    isPlaying: false,
    currentTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    accuracy: 100,
    hitNotes: 0,
    totalNotes: 0
  };

  private onNoteHitCallback?: (note: GameNote, accuracy: number) => void;
  private onNoteMissCallback?: (note: GameNote) => void;
  private onStateUpdateCallback?: (state: GameState) => void;

  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.synth.set({ volume: -10 });
  }

  loadSong(song: GameSong) {
    this.notes = [...song.notes];
    this.state.totalNotes = song.notes.length;
    this.state.hitNotes = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.hitNotes.clear();
    this.missedNotes.clear();
    this.startOffset = song.startOffset || 0;
    audioEngine.setBPM(song.bpm);
  }

  async start() {
    await audioEngine.start();
    this.isGameActive = true;
    this.isGamePaused = false;
    this.state.isPlaying = true;
    
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.isGameActive && !this.isGamePaused && audioEngine.isPlaying()) {
        this.checkNotes();
        this.state.currentTime = audioEngine.getTime() - this.startOffset;
        this.onStateUpdateCallback?.(this.state);
      }
    }, 50);
  }

  pause() {
    if (this.isGameActive && !this.isGamePaused) {
      this.isGamePaused = true;
      this.state.isPlaying = false;
      audioEngine.pause();
      this.onStateUpdateCallback?.(this.state);
    }
  }

  resume() {
    if (this.isGameActive && this.isGamePaused) {
      this.isGamePaused = false;
      this.state.isPlaying = true;
      audioEngine.start();
      this.onStateUpdateCallback?.(this.state);
    }
  }

  stop() {
    this.isGameActive = false;
    this.isGamePaused = false;
    this.state.isPlaying = false;
    audioEngine.stop();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.state.currentTime = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.state.accuracy = 100;
    this.state.hitNotes = 0;
    this.hitNotes.clear();
    this.missedNotes.clear();
    this.chordFrequencyBuffer = [];
    if (this.chordDetectionTimer) {
      clearTimeout(this.chordDetectionTimer);
      this.chordDetectionTimer = null;
    }
    this.onStateUpdateCallback?.(this.state);
  }

  setCurrentTime(time: number) {
    this.state.currentTime = time;
  }

  getCurrentTime(): number {
    return audioEngine.getTime() - this.startOffset;
  }

  private checkNotes() {
    if (!this.isGameActive || this.isGamePaused) return;
    
    const currentTime = this.getCurrentTime();
    const timeWindow = 0.35;
    
    this.notes.forEach(note => {
      if (this.hitNotes.has(note.id) || this.missedNotes.has(note.id)) return;
      
      if (currentTime > note.time + timeWindow) {
        this.missNote(note);
      }
    });
  }

  addPlayedNote(frequency: number) {
    if (!this.isGameActive || this.isGamePaused) return;
    
    const now = Date.now();
    if (now - this.lastHitTime < this.HIT_COOLDOWN) return;
    
    // Сначала пытаемся найти одиночную ноту
    const currentTime = this.getCurrentTime();
    const singleNoteMatch = this.findMatchingSingleNote(frequency, currentTime);
    
    if (singleNoteMatch) {
      // Если нашли одиночную ноту — сразу попадаем
      this.hitNote(singleNoteMatch.note, singleNoteMatch.accuracy);
      this.lastHitTime = now;
      return;
    }
    
    // Если не нашли одиночную ноту — возможно это аккорд, добавляем в буфер
    this.chordFrequencyBuffer.push(frequency);
    if (this.chordFrequencyBuffer.length > 10) {
      this.chordFrequencyBuffer.shift();
    }
    
    // Откладываем проверку аккорда
    if (this.chordDetectionTimer) {
      clearTimeout(this.chordDetectionTimer);
    }
    
    this.chordDetectionTimer = setTimeout(() => {
      this.checkChord();
      this.chordDetectionTimer = null;
    }, this.CHORD_BUFFER_DELAY);
  }

  private findMatchingSingleNote(frequency: number, currentTime: number): { note: GameNote; accuracy: number } | null {
    const timeWindow = 0.3;
    const tolerance = 0.025; // 2.5%
    
    let bestMatch: GameNote | null = null;
    let bestAccuracy = 0;
    
    for (const note of this.notes) {
      if (this.hitNotes.has(note.id) || this.missedNotes.has(note.id)) continue;
      if (!note.frequency) continue;
      if (note.chord) continue; // Пропускаем аккорды здесь
      
      const timeDiff = Math.abs(currentTime - note.time);
      if (timeDiff > timeWindow) continue;
      
      const freqDiff = Math.abs(frequency - note.frequency);
      const isMatch = freqDiff < note.frequency * tolerance;
      
      if (isMatch) {
        const accuracy = Math.max(0, 100 - (timeDiff / timeWindow) * 100);
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
          bestMatch = note;
        }
      }
    }
    
    if (bestMatch) {
      return { note: bestMatch, accuracy: bestAccuracy };
    }
    return null;
  }

  private checkChord() {
    if (!this.isGameActive || this.isGamePaused) return;
    if (this.chordFrequencyBuffer.length === 0) return;
    
    const currentTime = this.getCurrentTime();
    const timeWindow = 0.35;
    const tolerance = 0.025;
    
    // Ищем ожидаемые аккордовые ноты
    const expectedChordNotes = this.notes.filter(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.frequency !== undefined &&
      n.chord !== undefined &&
      Math.abs(currentTime - n.time) <= timeWindow
    );
    
    if (expectedChordNotes.length === 0) {
      this.chordFrequencyBuffer = [];
      return;
    }
    
    // Группируем по аккордам
    const chordGroups = new Map<string, GameNote[]>();
    expectedChordNotes.forEach(note => {
      if (note.chord) {
        if (!chordGroups.has(note.chord)) chordGroups.set(note.chord, []);
        chordGroups.get(note.chord)!.push(note);
      }
    });
    
    // Для каждой сыгранной частоты ищем соответствие
    const hitChordNotes: GameNote[] = [];
    const usedIds = new Set<string>();
    
    for (const playedFreq of this.chordFrequencyBuffer) {
      let bestMatch: GameNote | null = null;
      let minDiff = Infinity;
      
      for (const expected of expectedChordNotes) {
        if (usedIds.has(expected.id)) continue;
        if (!expected.frequency) continue;
        
        const diff = Math.abs(playedFreq - expected.frequency);
        const isMatch = diff < expected.frequency * tolerance;
        
        if (isMatch && diff < minDiff) {
          minDiff = diff;
          bestMatch = expected;
        }
      }
      
      if (bestMatch) {
        hitChordNotes.push(bestMatch);
        usedIds.add(bestMatch.id);
      }
    }
    
    if (hitChordNotes.length > 0) {
      // Определяем, какой аккорд сыгран
      const chordName = hitChordNotes[0].chord;
      const expectedGroup = chordGroups.get(chordName || '') || [];
      
      const isFullChord = expectedGroup.length === hitChordNotes.length;
      
      const avgAccuracy = hitChordNotes.reduce((acc, note) => {
        const timeDiff = Math.abs(currentTime - note.time);
        return acc + Math.max(0, 100 - (timeDiff / timeWindow) * 100);
      }, 0) / hitChordNotes.length;
      
      // Отмечаем все ноты аккорда как попадания
      hitChordNotes.forEach(note => {
        this.hitNote(note, isFullChord ? avgAccuracy : avgAccuracy * 0.7);
      });
    }
    
    // Очищаем буфер
    this.chordFrequencyBuffer = [];
  }

  private hitNote(note: GameNote, accuracy: number) {
    if (this.hitNotes.has(note.id)) return;
    
    this.hitNotes.add(note.id);
    this.state.hitNotes++;
    
    const pointsMultiplier = note.chord ? 1.5 : 1;
    const points = Math.floor(50 + accuracy * 0.5 + this.state.combo * 5) * pointsMultiplier;
    this.state.score += points;
    this.state.combo++;
    
    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo;
    }
    
    this.updateAccuracy();
    this.synth.triggerAttackRelease("C5", "8n");
    
    this.onNoteHitCallback?.(note, accuracy);
    this.onStateUpdateCallback?.(this.state);
  }

  private missNote(note: GameNote) {
    if (this.missedNotes.has(note.id)) return;
    
    this.missedNotes.add(note.id);
    this.state.combo = 0;
    this.updateAccuracy();
    this.onNoteMissCallback?.(note);
    this.onStateUpdateCallback?.(this.state);
  }

  private updateAccuracy() {
    const total = this.hitNotes.size + this.missedNotes.size;
    if (total > 0) {
      this.state.accuracy = (this.hitNotes.size / total) * 100;
    }
  }

  onNoteHit(callback: (note: GameNote, accuracy: number) => void) {
    this.onNoteHitCallback = callback;
  }

  onNoteMiss(callback: (note: GameNote) => void) {
    this.onNoteMissCallback = callback;
  }

  onStateUpdate(callback: (state: GameState) => void) {
    this.onStateUpdateCallback = callback;
  }

  getActiveNotes(): GameNote[] {
    const currentTime = this.getCurrentTime();
    const windowTime = 2;
    return this.notes.filter(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.time <= currentTime + windowTime
    );
  }
}