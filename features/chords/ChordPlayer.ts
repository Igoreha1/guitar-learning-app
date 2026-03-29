import * as Tone from "tone";

// Частоты нот (в Гц)
const noteFrequencies: { [key: string]: number } = {
  'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83,
  'A2': 110.00, 'A#2': 116.54, 'B2': 123.47, 'C3': 130.81, 'C#3': 138.59,
  'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
  'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
  'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
};

// Состав нот для каждого аккорда
const chordNotes: { [key: string]: string[] } = {
  'Am': ['A2', 'C3', 'E3'],
  'A': ['A2', 'C#3', 'E3'],
  'C': ['C3', 'E3', 'G3'],
  'Dm': ['D3', 'F3', 'A3'],
  'D': ['D3', 'F#3', 'A3'],
  'Em': ['E2', 'G3', 'B3'],
  'E': ['E2', 'G#3', 'B3'],
  'G': ['G2', 'B3', 'D4'],
  'F': ['F2', 'A3', 'C4'],
  'Fm': ['F2', 'G#3', 'C4'],
  'B': ['B2', 'D#4', 'F#4'],
  'Bm': ['B2', 'D4', 'F#4'],
  'H7': ['B2', 'D#4', 'F#4', 'A4'],
  'A7': ['A2', 'C#3', 'E3', 'G3'],
  'C7': ['C3', 'E3', 'G3', 'A#3'],
  'D7': ['D3', 'F#3', 'A3', 'C4'],
  'E7': ['E2', 'G#3', 'B3', 'D4'],
  'G7': ['G2', 'B3', 'D4', 'F4'],
};

export class ChordPlayer {
  private synth: Tone.PolySynth | null = null;
  private isInitialized: boolean = false;
  private currentChord: string | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Создаём полифонический синтезатор (может играть несколько нот одновременно)
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    // Настройка звука (теплый акустический звук)
    this.synth.set({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.6,
        release: 0.8
      }
    });
    
    this.isInitialized = true;
  }

  // Получить частоты для аккорда
  private getChordFrequencies(chordName: string): number[] {
    const notes = chordNotes[chordName];
    if (!notes) return [];
    
    return notes
      .map(note => noteFrequencies[note])
      .filter(freq => freq !== undefined);
  }

  // Воспроизвести аккорд
  async playChord(chordName: string, duration: number = 2) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (!this.synth) {
      console.error("Синтезатор не инициализирован");
      return;
    }
    
    // Запускаем аудио контекст (браузер требует взаимодействия)
    await Tone.start();
    
    const frequencies = this.getChordFrequencies(chordName);
    if (frequencies.length === 0) {
      console.warn(`Не найдены ноты для аккорда ${chordName}`);
      return;
    }
    
    this.currentChord = chordName;
    
    // Играем все ноты аккорда одновременно
    const now = Tone.now();
    frequencies.forEach(freq => {
      this.synth!.triggerAttack(freq, now);
    });
    
    // Затухание
    this.synth.triggerRelease(frequencies, now + duration);
  }

  // Остановить текущий аккорд
  stopChord() {
    if (!this.synth || !this.currentChord) return;
    
    const frequencies = this.getChordFrequencies(this.currentChord);
    if (frequencies.length > 0) {
      this.synth.triggerRelease(frequencies);
    }
    this.currentChord = null;
  }

  // Арпеджио (перебор нот аккорда по очереди)
  async playArpeggio(chordName: string, speed: number = 0.2) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (!this.synth) return;
    
    await Tone.start();
    
    const frequencies = this.getChordFrequencies(chordName);
    if (frequencies.length === 0) return;
    
    const now = Tone.now();
    frequencies.forEach((freq, index) => {
      this.synth!.triggerAttackRelease(freq, "8n", now + index * speed);
    });
  }

  // Воспроизвести ритмический паттерн
  async playRhythmPattern(chordName: string, pattern: string[] = ['down', 'up', 'down', 'up']) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (!this.synth) return;
    
    await Tone.start();
    
    const frequencies = this.getChordFrequencies(chordName);
    if (frequencies.length === 0) return;
    
    const now = Tone.now();
    const duration = 0.5; // полсекунды на удар
    
    pattern.forEach((_, index) => {
      frequencies.forEach(freq => {
        this.synth!.triggerAttackRelease(freq, "8n", now + index * duration);
      });
    });
  }
}

// Создаём и экспортируем единственный экземпляр
let chordPlayerInstance: ChordPlayer | null = null;

export function getChordPlayer(): ChordPlayer {
  if (!chordPlayerInstance) {
    chordPlayerInstance = new ChordPlayer();
  }
  return chordPlayerInstance;
}