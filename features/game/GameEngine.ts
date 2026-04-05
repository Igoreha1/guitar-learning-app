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
        this.state.currentTime = audioEngine.getTime();
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
    this.onStateUpdateCallback?.(this.state);
  }

  setCurrentTime(time: number) {
    this.state.currentTime = time;
  }

  getCurrentTime(): number {
    return audioEngine.getTime();
  }

  private checkNotes() {
    if (!this.isGameActive || this.isGamePaused) return;
    
    const currentTime = audioEngine.getTime();
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

    this.pitchBuffer.push(frequency);
    if (this.pitchBuffer.length > this.BUFFER_SIZE) {
      this.pitchBuffer.shift();
    }
    
    const avgFrequency = this.pitchBuffer.reduce((a, b) => a + b, 0) / this.pitchBuffer.length;
    this.checkPlayedNoteByFrequency(avgFrequency);
  }

  private checkPlayedNoteByFrequency(detectedFrequency: number) {
    const currentTime = audioEngine.getTime();
    const timeWindow = 0.3;
    const tolerance = 0.02;
    
    const expectedNote = this.notes.find(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.frequency !== undefined &&
      Math.abs(currentTime - n.time) <= timeWindow
    );

    if (expectedNote && expectedNote.frequency) {
      const diff = Math.abs(detectedFrequency - expectedNote.frequency);
      const isMatch = diff < expectedNote.frequency * tolerance;
      
      if (isMatch) {
        const timeDiff = Math.abs(currentTime - expectedNote.time);
        const accuracy = Math.max(0, 100 - (timeDiff / timeWindow) * 100);
        this.hitNote(expectedNote, accuracy);
      } else if (this.state.combo > 0) {
        this.state.combo = 0;
        this.onStateUpdateCallback?.(this.state);
      }
    } else if (this.state.combo > 0) {
      this.state.combo = 0;
      this.onStateUpdateCallback?.(this.state);
    }
  }

  private hitNote(note: GameNote, accuracy: number) {
    if (this.hitNotes.has(note.id)) return;
    
    this.hitNotes.add(note.id);
    this.state.hitNotes++;
    
    const points = Math.floor(100 + accuracy + this.state.combo * 10);
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
    const currentTime = audioEngine.getTime();
    const windowTime = 2;
    return this.notes.filter(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.time <= currentTime + windowTime
    );
  }
}