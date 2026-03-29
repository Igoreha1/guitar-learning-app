import * as Tone from "tone";
import { GameNote, GameSong, GameState } from "./types";

export class GameEngine {
  private transport: typeof Tone.Transport;
  private synth: Tone.PolySynth;
  private isPlaying: boolean = false;
  private notes: GameNote[] = [];
  private hitNotes: Set<string> = new Set();
  private missedNotes: Set<string> = new Set();
  private lastHitTime: number = 0;
  private lastHitNoteId: string = '';
  
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
    this.transport = Tone.Transport;
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
    this.transport.bpm.value = song.bpm;
  }

  async start() {
    await Tone.start();
    this.isPlaying = true;
    this.state.isPlaying = true;
    this.transport.start();
    this.checkNotesLoop();
  }

  stop() {
    this.isPlaying = false;
    this.state.isPlaying = false;
    this.transport.stop();
  }

  reset() {
    this.transport.stop();
    this.transport.seconds = 0;
    this.state.currentTime = 0;
    this.state.score = 0;
    this.state.combo = 0;
    this.hitNotes.clear();
    this.missedNotes.clear();
    this.lastHitNoteId = '';
    this.state.isPlaying = false;
    this.isPlaying = false;
  }

  setCurrentTime(time: number) {
    this.transport.seconds = time;
    this.state.currentTime = time;
  }

  getCurrentTime(): number {
    return this.transport.seconds;
  }

  private checkNotesLoop() {
    if (!this.isPlaying) return;

    const currentTime = this.transport.seconds;
    this.state.currentTime = currentTime;

    const timeWindow = 0.3;
    
    this.notes.forEach(note => {
      if (this.hitNotes.has(note.id) || this.missedNotes.has(note.id)) return;
      
      if (currentTime > note.time + timeWindow) {
        this.missNote(note);
      }
    });

    this.onStateUpdateCallback?.(this.state);
    requestAnimationFrame(() => this.checkNotesLoop());
  }

  checkPlayedNote(playedNote: string, playedString: number, playedFret?: number) {
    if (!this.isPlaying) return false;

    const currentTime = this.transport.seconds;
    const timeWindow = 0.3;
    
    const expectedNote = this.notes.find(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.string === playedString &&
      Math.abs(currentTime - n.time) <= timeWindow
    );

    if (expectedNote) {
      if (expectedNote.fret !== undefined && expectedNote.fret !== null) {
        if (playedFret === undefined || playedFret !== expectedNote.fret) {
          if (this.state.combo > 0) {
            this.state.combo = 0;
            this.onStateUpdateCallback?.(this.state);
          }
          return false;
        }
      }
      
      const expectedNoteName = expectedNote.chord || this.getNoteNameFromString(playedString);
      const isMatch = this.isNoteMatch(playedNote, expectedNoteName);
      
      if (isMatch) {
        const timeDiff = Math.abs(currentTime - expectedNote.time);
        const accuracy = Math.max(0, 100 - (timeDiff / timeWindow) * 100);
        this.hitNote(expectedNote, accuracy);
        return true;
      }
    }
    
    if (this.state.combo > 0) {
      this.state.combo = 0;
      this.onStateUpdateCallback?.(this.state);
    }
    
    return false;
  }

  private isNoteMatch(played: string, expected: string): boolean {
    const normalize = (note: string) => {
      return note.replace(/[0-9]/g, '').toUpperCase();
    };
    const playedNorm = normalize(played);
    const expectedNorm = normalize(expected);
    return playedNorm === expectedNorm;
  }

  private getNoteNameFromString(stringNum: number): string {
    const notes = ['E', 'A', 'D', 'G', 'B', 'E'];
    return notes[stringNum];
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
    const currentTime = this.transport.seconds;
    const windowTime = 2;
    return this.notes.filter(n => 
      !this.hitNotes.has(n.id) && 
      !this.missedNotes.has(n.id) &&
      n.time <= currentTime + windowTime
    );
  }
}