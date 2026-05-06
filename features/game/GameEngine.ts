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
  private pitchBuffer: number[] = [];
  private readonly BUFFER_SIZE = 5;
  private startOffset: number = 0;
  private detectedFrequencies: number[] = []; // Буфер для частот аккорда
  private chordDetectionTimer: NodeJS.Timeout | null = null;
  
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
    this.pitchBuffer = [];
    this.detectedFrequencies = [];
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
    const timeWindow = 0.3;
    
    this.notes.forEach(note => {
      if (this.hitNotes.has(note.id) || this.missedNotes.has(note.id)) return;
      
      if (currentTime > note.time + timeWindow) {
        this.missNote(note);
      }
    });
  }

  addPlayedNote(frequency: number) {
    if (!this.isGameActive || this.isGamePaused) return;

    // Добавляем частоту в буфер для аккордов
    this.detectedFrequencies.push(frequency);
    if (this.detectedFrequencies.length > 10) {
      this.detectedFrequencies.shift();
    }
    
    // Откладываем проверку на 150мс, чтобы собрать все ноты аккорда
    if (this.chordDetectionTimer) {
      clearTimeout(this.chordDetectionTimer);
    }
    
    this.chordDetectionTimer = setTimeout(() => {
      this.checkPlayedChord();
      this.chordDetectionTimer = null;
    }, 150);
  }

  private checkPlayedChord() {
    if (!this.isGameActive || this.isGamePaused) return;
    if (this.detectedFrequencies.length === 0) return;
    
    const currentTime = this.getCurrentTime();
    const timeWindow = 0.35;
    
    // Ищем все ожидаемые ноты на этом временном отрезке
    const expectedNotes = this.notes.filter(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.frequency !== undefined &&
      Math.abs(currentTime - n.time) <= timeWindow
    );
    
    if (expectedNotes.length === 0) {
      // Нет ожидаемых нот — сбрасываем комбо
      if (this.state.combo > 0 && this.detectedFrequencies.length > 0) {
        this.state.combo = 0;
        this.onStateUpdateCallback?.(this.state);
      }
      this.detectedFrequencies = [];
      return;
    }
    
    // Для каждой сыгранной частоты пытаемся найти соответствие
    const hitNotes: GameNote[] = [];
    const usedIds = new Set<string>();
    const tolerance = 0.02; // 2% допуск
    
    for (const playedFreq of this.detectedFrequencies) {
      let bestMatch: GameNote | null = null;
      let minDiff = Infinity;
      
      for (const expected of expectedNotes) {
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
        hitNotes.push(bestMatch);
        usedIds.add(bestMatch.id);
      }
    }
    
    // Проверяем, совпало ли количество сыгранных нот с ожидаемыми
    const allNotesHit = expectedNotes.length === hitNotes.length && hitNotes.length > 0;
    const someNotesHit = hitNotes.length > 0 && !allNotesHit;
    
    if (allNotesHit) {
      // Все ноты аккорда сыграны правильно
      const avgAccuracy = hitNotes.reduce((acc, note) => {
        const timeDiff = Math.abs(currentTime - note.time);
        return acc + Math.max(0, 100 - (timeDiff / timeWindow) * 100);
      }, 0) / hitNotes.length;
      
      // Отмечаем все ноты как попадания
      hitNotes.forEach(note => {
        this.hitNote(note, avgAccuracy);
      });
    } else if (someNotesHit) {
      // Часть нот аккорда сыграна — считаем частичным попаданием
      const avgAccuracy = hitNotes.reduce((acc, note) => {
        const timeDiff = Math.abs(currentTime - note.time);
        return acc + Math.max(0, 100 - (timeDiff / timeWindow) * 100);
      }, 0) / hitNotes.length;
      
      hitNotes.forEach(note => {
        this.hitNote(note, avgAccuracy * 0.7); // Штраф за неполный аккорд
      });
      
      // Пропускаем остальные ноты
      expectedNotes.forEach(note => {
        if (!usedIds.has(note.id)) {
          this.missNote(note);
        }
      });
    } else if (expectedNotes.length > 0 && this.detectedFrequencies.length > 0) {
      // Совпадений нет — сбрасываем комбо
      if (this.state.combo > 0) {
        this.state.combo = 0;
        this.onStateUpdateCallback?.(this.state);
      }
    }
    
    // Очищаем буфер
    this.detectedFrequencies = [];
  }

  private hitNote(note: GameNote, accuracy: number) {
    if (this.hitNotes.has(note.id)) return;
    
    this.hitNotes.add(note.id);
    this.state.hitNotes++;
    
    // Очки зависят от того, аккорд это или одиночная нота
    const pointsMultiplier = this.isChord(note) ? 1.5 : 1;
    const points = Math.floor(100 + accuracy + this.state.combo * 10) * pointsMultiplier;
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

  private isChord(note: GameNote): boolean {
    // Проверяем, есть ли другие ноты в тот же момент времени
    const timeWindow = 0.1;
    const sameTimeNotes = this.notes.filter(n => 
      n.id !== note.id &&
      Math.abs(n.time - note.time) < timeWindow &&
      n.chord === note.chord
    );
    return sameTimeNotes.length > 0;
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