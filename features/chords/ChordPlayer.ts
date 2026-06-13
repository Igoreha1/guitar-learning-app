// features/chords/ChordPlayer.ts

// Маппинг названий аккордов на пути к MP3 файлам
// Файлы должны лежать в папке public/sounds/chords/
const chordSoundMap: { [key: string]: string } = {
  // ========== МАЖОРНЫЕ (Major) ==========
  'C': '/sounds/chords/C-major.mp3',
  'C#': '/sounds/chords/C-sharp-major.mp3',
  'Db': '/sounds/chords/D-flat-major.mp3',
  'D': '/sounds/chords/D-major.mp3',
  'D#': '/sounds/chords/D-sharp-major.mp3',
  'Eb': '/sounds/chords/E-flat-major.mp3',
  'E': '/sounds/chords/E-major.mp3',
  'F': '/sounds/chords/F-major.mp3',
  'F#': '/sounds/chords/F-sharp-major.mp3',
  'Gb': '/sounds/chords/G-flat-major.mp3',
  'G': '/sounds/chords/G-major.mp3',
  'G#': '/sounds/chords/G-sharp-major.mp3',
  'Ab': '/sounds/chords/A-flat-major.mp3',
  'A': '/sounds/chords/A-major.mp3',
  'A#': '/sounds/chords/A-sharp-major.mp3',
  'Bb': '/sounds/chords/B-flat-major.mp3',
  'B': '/sounds/chords/B-major.mp3',
  
  // ========== МИНОРНЫЕ (Minor) ==========
  'Cm': '/sounds/chords/C-minor.mp3',
  'C#m': '/sounds/chords/C-sharp-minor.mp3',
  'Dbm': '/sounds/chords/D-flat-minor.mp3',
  'Dm': '/sounds/chords/D-minor.mp3',
  'D#m': '/sounds/chords/D-sharp-minor.mp3',
  'Ebm': '/sounds/chords/E-flat-minor.mp3',
  'Em': '/sounds/chords/E-minor.mp3',
  'Fm': '/sounds/chords/F-minor.mp3',
  'F#m': '/sounds/chords/F-sharp-minor.mp3',
  'Gbm': '/sounds/chords/G-flat-minor.mp3',
  'Gm': '/sounds/chords/G-minor.mp3',
  'G#m': '/sounds/chords/G-sharp-minor.mp3',
  'Abm': '/sounds/chords/A-flat-minor.mp3',
  'Am': '/sounds/chords/A-minor.mp3',
  'A#m': '/sounds/chords/A-sharp-minor.mp3',
  'Bbm': '/sounds/chords/B-flat-minor.mp3',
  'Bm': '/sounds/chords/B-minor.mp3',
  
  // ========== СЕПТАККОРДЫ (7) ==========
  'C7': '/sounds/chords/C7.mp3',
  'C#7': '/sounds/chords/C-sharp7.mp3',
  'Db7': '/sounds/chords/D-flat7.mp3',
  'D7': '/sounds/chords/D7.mp3',
  'D#7': '/sounds/chords/D-sharp7.mp3',
  'Eb7': '/sounds/chords/E-flat7.mp3',
  'E7': '/sounds/chords/E7.mp3',
  'F7': '/sounds/chords/F7.mp3',
  'F#7': '/sounds/chords/F-sharp7.mp3',
  'Gb7': '/sounds/chords/G-flat7.mp3',
  'G7': '/sounds/chords/G7.mp3',
  'G#7': '/sounds/chords/G-sharp7.mp3',
  'Ab7': '/sounds/chords/A-flat7.mp3',
  'A7': '/sounds/chords/A7.mp3',
  'A#7': '/sounds/chords/A-sharp7.mp3',
  'Bb7': '/sounds/chords/B-flat7.mp3',
  'B7': '/sounds/chords/B7.mp3',
  
  // ========== МАЖОРНЫЕ СЕПТАККОРДЫ (maj7) ==========
  'Cmaj7': '/sounds/chords/Cmaj7.mp3',
  'C#maj7': '/sounds/chords/C-sharp-maj7.mp3',
  'Dbmaj7': '/sounds/chords/D-flat-maj7.mp3',
  'Dmaj7': '/sounds/chords/Dmaj7.mp3',
  'D#maj7': '/sounds/chords/D-sharp-maj7.mp3',
  'Ebmaj7': '/sounds/chords/E-flat-maj7.mp3',
  'Emaj7': '/sounds/chords/Emaj7.mp3',
  'Fmaj7': '/sounds/chords/Fmaj7.mp3',
  'F#maj7': '/sounds/chords/F-sharp-maj7.mp3',
  'Gbmaj7': '/sounds/chords/G-flat-maj7.mp3',
  'Gmaj7': '/sounds/chords/Gmaj7.mp3',
  'G#maj7': '/sounds/chords/G-sharp-maj7.mp3',
  'Abmaj7': '/sounds/chords/A-flat-maj7.mp3',
  'Amaj7': '/sounds/chords/Amaj7.mp3',
  'A#maj7': '/sounds/chords/A-sharp-maj7.mp3',
  'Bbmaj7': '/sounds/chords/B-flat-maj7.mp3',
  'Bmaj7': '/sounds/chords/Bmaj7.mp3',
  
  // ========== МИНОРНЫЕ СЕПТАККОРДЫ (m7) ==========
  'Cm7': '/sounds/chords/Cm7.mp3',
  'C#m7': '/sounds/chords/C-sharp-m7.mp3',
  'Dbm7': '/sounds/chords/D-flat-m7.mp3',
  'Dm7': '/sounds/chords/Dm7.mp3',
  'D#m7': '/sounds/chords/D-sharp-m7.mp3',
  'Ebm7': '/sounds/chords/E-flat-m7.mp3',
  'Em7': '/sounds/chords/Em7.mp3',
  'Fm7': '/sounds/chords/Fm7.mp3',
  'F#m7': '/sounds/chords/F-sharp-m7.mp3',
  'Gbm7': '/sounds/chords/G-flat-m7.mp3',
  'Gm7': '/sounds/chords/Gm7.mp3',
  'G#m7': '/sounds/chords/G-sharp-m7.mp3',
  'Abm7': '/sounds/chords/A-flat-m7.mp3',
  'Am7': '/sounds/chords/Am7.mp3',
  'A#m7': '/sounds/chords/A-sharp-m7.mp3',
  'Bbm7': '/sounds/chords/B-flat-m7.mp3',
  'Bm7': '/sounds/chords/Bm7.mp3',
  
  // ========== ШЕСТЫЕ АККОРДЫ (6) ==========
  'C6': '/sounds/chords/C6.mp3',
  'C#6': '/sounds/chords/C-sharp6.mp3',
  'Db6': '/sounds/chords/D-flat6.mp3',
  'D6': '/sounds/chords/D6.mp3',
  'D#6': '/sounds/chords/D-sharp6.mp3',
  'Eb6': '/sounds/chords/E-flat6.mp3',
  'E6': '/sounds/chords/E6.mp3',
  'F6': '/sounds/chords/F6.mp3',
  'F#6': '/sounds/chords/F-sharp6.mp3',
  'Gb6': '/sounds/chords/G-flat6.mp3',
  'G6': '/sounds/chords/G6.mp3',
  'G#6': '/sounds/chords/G-sharp6.mp3',
  'Ab6': '/sounds/chords/A-flat6.mp3',
  'A6': '/sounds/chords/A6.mp3',
  'A#6': '/sounds/chords/A-sharp6.mp3',
  'Bb6': '/sounds/chords/B-flat6.mp3',
  'B6': '/sounds/chords/B6.mp3',
  
  // ========== МИНОРНЫЕ ШЕСТЫЕ (m6) ==========
  'Cm6': '/sounds/chords/Cm6.mp3',
  'C#m6': '/sounds/chords/C-sharp-m6.mp3',
  'Dbm6': '/sounds/chords/D-flat-m6.mp3',
  'Dm6': '/sounds/chords/Dm6.mp3',
  'D#m6': '/sounds/chords/D-sharp-m6.mp3',
  'Ebm6': '/sounds/chords/E-flat-m6.mp3',
  'Em6': '/sounds/chords/Em6.mp3',
  'Fm6': '/sounds/chords/Fm6.mp3',
  'F#m6': '/sounds/chords/F-sharp-m6.mp3',
  'Gbm6': '/sounds/chords/G-flat-m6.mp3',
  'Gm6': '/sounds/chords/Gm6.mp3',
  'G#m6': '/sounds/chords/G-sharp-m6.mp3',
  'Abm6': '/sounds/chords/A-flat-m6.mp3',
  'Am6': '/sounds/chords/Am6.mp3',
  'A#m6': '/sounds/chords/A-sharp-m6.mp3',
  'Bbm6': '/sounds/chords/B-flat-m6.mp3',
  'Bm6': '/sounds/chords/Bm6.mp3',
  
  // ========== НОНАККОРДЫ (9) ==========
  'C9': '/sounds/chords/C9.mp3',
  'C#9': '/sounds/chords/C-sharp9.mp3',
  'Db9': '/sounds/chords/D-flat9.mp3',
  'D9': '/sounds/chords/D9.mp3',
  'D#9': '/sounds/chords/D-sharp9.mp3',
  'Eb9': '/sounds/chords/E-flat9.mp3',
  'E9': '/sounds/chords/E9.mp3',
  'F9': '/sounds/chords/F9.mp3',
  'F#9': '/sounds/chords/F-sharp9.mp3',
  'Gb9': '/sounds/chords/G-flat9.mp3',
  'G9': '/sounds/chords/G9.mp3',
  'G#9': '/sounds/chords/G-sharp9.mp3',
  'Ab9': '/sounds/chords/A-flat9.mp3',
  'A9': '/sounds/chords/A9.mp3',
  'A#9': '/sounds/chords/A-sharp9.mp3',
  'Bb9': '/sounds/chords/B-flat9.mp3',
  'B9': '/sounds/chords/B9.mp3',
  
  // ========== УМЕНЬШЕННЫЕ (dim) ==========
  'Cdim': '/sounds/chords/Cdim.mp3',
  'C#dim': '/sounds/chords/C-sharp-dim.mp3',
  'Dbdim': '/sounds/chords/D-flat-dim.mp3',
  'Ddim': '/sounds/chords/Ddim.mp3',
  'D#dim': '/sounds/chords/D-sharp-dim.mp3',
  'Ebdim': '/sounds/chords/E-flat-dim.mp3',
  'Edim': '/sounds/chords/Edim.mp3',
  'Fdim': '/sounds/chords/Fdim.mp3',
  'F#dim': '/sounds/chords/F-sharp-dim.mp3',
  'Gbdim': '/sounds/chords/G-flat-dim.mp3',
  'Gdim': '/sounds/chords/Gdim.mp3',
  'G#dim': '/sounds/chords/G-sharp-dim.mp3',
  'Abdim': '/sounds/chords/A-flat-dim.mp3',
  'Adim': '/sounds/chords/Adim.mp3',
  'A#dim': '/sounds/chords/A-sharp-dim.mp3',
  'Bbdim': '/sounds/chords/B-flat-dim.mp3',
  'Bdim': '/sounds/chords/Bdim.mp3',
  
  // ========== УВЕЛИЧЕННЫЕ (aug) ==========
  'Caug': '/sounds/chords/Caug.mp3',
  'C#aug': '/sounds/chords/C-sharp-aug.mp3',
  'Dbaug': '/sounds/chords/D-flat-aug.mp3',
  'Daug': '/sounds/chords/Daug.mp3',
  'D#aug': '/sounds/chords/D-sharp-aug.mp3',
  'Ebaug': '/sounds/chords/E-flat-aug.mp3',
  'Eaug': '/sounds/chords/Eaug.mp3',
  'Faug': '/sounds/chords/Faug.mp3',
  'F#aug': '/sounds/chords/F-sharp-aug.mp3',
  'Gbaug': '/sounds/chords/G-flat-aug.mp3',
  'Gaug': '/sounds/chords/Gaug.mp3',
  'G#aug': '/sounds/chords/G-sharp-aug.mp3',
  'Abaug': '/sounds/chords/A-flat-aug.mp3',
  'Aaug': '/sounds/chords/Aaug.mp3',
  'A#aug': '/sounds/chords/A-sharp-aug.mp3',
  'Bbaug': '/sounds/chords/B-flat-aug.mp3',
  'Baug': '/sounds/chords/Baug.mp3',
  
  // ========== SUS2 ==========
  'Csus2': '/sounds/chords/Csus2.mp3',
  'C#sus2': '/sounds/chords/C-sharp-sus2.mp3',
  'Dbsus2': '/sounds/chords/D-flat-sus2.mp3',
  'Dsus2': '/sounds/chords/Dsus2.mp3',
  'D#sus2': '/sounds/chords/D-sharp-sus2.mp3',
  'Ebsus2': '/sounds/chords/E-flat-sus2.mp3',
  'Esus2': '/sounds/chords/Esus2.mp3',
  'Fsus2': '/sounds/chords/Fsus2.mp3',
  'F#sus2': '/sounds/chords/F-sharp-sus2.mp3',
  'Gbsus2': '/sounds/chords/G-flat-sus2.mp3',
  'Gsus2': '/sounds/chords/Gsus2.mp3',
  'G#sus2': '/sounds/chords/G-sharp-sus2.mp3',
  'Absus2': '/sounds/chords/A-flat-sus2.mp3',
  'Asus2': '/sounds/chords/Asus2.mp3',
  'A#sus2': '/sounds/chords/A-sharp-sus2.mp3',
  'Bbsus2': '/sounds/chords/B-flat-sus2.mp3',
  'Bsus2': '/sounds/chords/Bsus2.mp3',
  
  // ========== SUS4 ==========
  'Csus4': '/sounds/chords/Csus4.mp3',
  'C#sus4': '/sounds/chords/C-sharp-sus4.mp3',
  'Dbsus4': '/sounds/chords/D-flat-sus4.mp3',
  'Dsus4': '/sounds/chords/Dsus4.mp3',
  'D#sus4': '/sounds/chords/D-sharp-sus4.mp3',
  'Ebsus4': '/sounds/chords/E-flat-sus4.mp3',
  'Esus4': '/sounds/chords/Esus4.mp3',
  'Fsus4': '/sounds/chords/Fsus4.mp3',
  'F#sus4': '/sounds/chords/F-sharp-sus4.mp3',
  'Gbsus4': '/sounds/chords/G-flat-sus4.mp3',
  'Gsus4': '/sounds/chords/Gsus4.mp3',
  'G#sus4': '/sounds/chords/G-sharp-sus4.mp3',
  'Absus4': '/sounds/chords/A-flat-sus4.mp3',
  'Asus4': '/sounds/chords/Asus4.mp3',
  'A#sus4': '/sounds/chords/A-sharp-sus4.mp3',
  'Bbsus4': '/sounds/chords/B-flat-sus4.mp3',
  'Bsus4': '/sounds/chords/Bsus4.mp3',
  
  // ========== ADD9 ==========
  'Cadd9': '/sounds/chords/Cadd9.mp3',
  'C#add9': '/sounds/chords/C-sharp-add9.mp3',
  'Dbadd9': '/sounds/chords/D-flat-add9.mp3',
  'Dadd9': '/sounds/chords/Dadd9.mp3',
  'D#add9': '/sounds/chords/D-sharp-add9.mp3',
  'Ebadd9': '/sounds/chords/E-flat-add9.mp3',
  'Eadd9': '/sounds/chords/Eadd9.mp3',
  'Fadd9': '/sounds/chords/Fadd9.mp3',
  'F#add9': '/sounds/chords/F-sharp-add9.mp3',
  'Gbadd9': '/sounds/chords/G-flat-add9.mp3',
  'Gadd9': '/sounds/chords/Gadd9.mp3',
  'G#add9': '/sounds/chords/G-sharp-add9.mp3',
  'Abadd9': '/sounds/chords/A-flat-add9.mp3',
  'Aadd9': '/sounds/chords/Aadd9.mp3',
  'A#add9': '/sounds/chords/A-sharp-add9.mp3',
  'Badd9': '/sounds/chords/Badd9.mp3',
};

export class ChordPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private currentChord: string | null = null;
  private isPlaying: boolean = false;

  constructor() {}

  // Получить путь к MP3 файлу аккорда
  private getChordSoundUrl(chordName: string): string | null {
    return chordSoundMap[chordName] || null;
  }

  // Воспроизвести аккорд из MP3
  async playChord(chordName: string, duration: number = 3): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stopChord();
      
      const soundUrl = this.getChordSoundUrl(chordName);
      
      if (!soundUrl) {
        console.warn(`Звук для аккорда ${chordName} не найден`);
        reject(new Error(`Звук для аккорда ${chordName} не найден`));
        return;
      }
      
      const audio = new Audio(soundUrl);
      this.currentAudio = audio;
      this.currentChord = chordName;
      this.isPlaying = true;
      
      audio.volume = 0.7;
      
      audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentAudio = null;
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Ошибка загрузки звука для ${chordName}:`, e);
        this.isPlaying = false;
        this.currentAudio = null;
        reject(new Error(`Не удалось загрузить звук для аккорда ${chordName}`));
      });
      
      audio.play().catch((error) => {
        console.error('Ошибка воспроизведения:', error);
        this.isPlaying = false;
        reject(error);
      });
      
      if (duration > 0) {
        setTimeout(() => {
          if (this.isPlaying && this.currentAudio === audio) {
            this.stopChord();
            resolve();
          }
        }, duration * 1000);
      }
    });
  }

  stopChord(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentChord = null;
  }

  isChordPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentChord(): string | null {
    return this.currentChord;
  }

  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }
  
  hasSound(chordName: string): boolean {
    return !!this.getChordSoundUrl(chordName);
  }
  
  getAvailableChords(): string[] {
    return Object.keys(chordSoundMap);
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