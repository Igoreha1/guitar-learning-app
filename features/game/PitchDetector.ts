export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  
  private distortionNode: WaveShaperNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private preFilterNode: BiquadFilterNode | null = null; // Дополнительный фильтр
  
  private isRunning: boolean = false;
  private isMonitoring: boolean = false;
  private currentEffect: string = 'clean';
  private onPitchDetectedCallback: (pitch: number, noteName: string) => void = () => {};

  private noteFrequencies: { [key: string]: number } = {
    'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'A2': 110.00, 'A#2': 116.54, 'B2': 123.47, 'C3': 130.81, 'C#3': 138.59,
    'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
    'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  };

  private stringNotes: { [key: number]: string } = {
    0: 'E2', 1: 'A2', 2: 'D3', 3: 'G3', 4: 'B3', 5: 'E4'
  };

  async init() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      this.audioContext = new AudioContext();
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0;
      
      // Жёсткий дисторшн
      this.distortionNode = this.audioContext.createWaveShaper();
      this.setDistortionCurve(30); // Увеличиваем интенсивность с 30 до 50
      
      // Предварительный фильтр для более плотного звука
      this.preFilterNode = this.audioContext.createBiquadFilter();
      this.preFilterNode.type = 'highpass';
      this.preFilterNode.frequency.value = 100;
      this.preFilterNode.Q.value = 3;
      
      // Основной фильтр
      this.filterNode = this.audioContext.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 3500;
      this.filterNode.Q.value = 4;
      
      this.reverbNode = this.audioContext.createConvolver();
      
      if (this.sourceNode && this.analyserNode && this.gainNode) {
        this.sourceNode.connect(this.analyserNode);
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
      }
      
      await this.audioContext.resume();
      
      console.log("✅ Микрофон подключен!");
      return true;
    } catch (error) {
      console.error("❌ Ошибка доступа к микрофону:", error);
      return false;
    }
  }

  private setDistortionCurve(amount: number) {
    if (!this.distortionNode) return;
    
    const k = amount;
    const samples = 44100;
    const curve = new Float32Array(samples);
    
    // Более агрессивная кривая для жёсткого дисторшна
    for (let i = 0; i < samples; ++i) {
      const x = i * 2 / samples - 1;
      // Жёсткая клиппинг-кривая
      if (Math.abs(x) < 0.3) {
        curve[i] = x * 3;
      } else if (Math.abs(x) < 0.6) {
        curve[i] = Math.sign(x) * (0.9 + (Math.abs(x) - 0.3) * 0.5);
      } else {
        curve[i] = Math.sign(x) * 1.0;
      }
    }
    
    this.distortionNode.curve = curve;
    this.distortionNode.oversample = '4x';
  }

  private buildCleanChain() {
    if (!this.sourceNode || !this.gainNode || !this.analyserNode || !this.audioContext) return;
    
    try {
      this.sourceNode.disconnect();
      this.sourceNode.connect(this.analyserNode);
      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn("Ошибка при построении чистой цепочки:", e);
    }
  }

  private buildDistortionChain() {
    if (!this.sourceNode || !this.gainNode || !this.analyserNode || !this.distortionNode || !this.filterNode || !this.preFilterNode || !this.audioContext) return;
    
    try {
      this.sourceNode.disconnect();
      this.sourceNode.connect(this.analyserNode);
      // Цепочка: предфильтр -> дисторшн -> фильтр -> усиление
      this.sourceNode.connect(this.preFilterNode);
      this.preFilterNode.connect(this.distortionNode);
      this.distortionNode.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn("Ошибка при построении цепочки дисторшна:", e);
    }
  }

  private buildReverbChain() {
    if (!this.sourceNode || !this.gainNode || !this.analyserNode || !this.reverbNode || !this.audioContext) return;
    
    try {
      this.sourceNode.disconnect();
      
      const rate = this.audioContext.sampleRate;
      const length = rate * 2;
      const impulse = this.audioContext.createBuffer(2, length, rate);
      
      for (let channel = 0; channel < 2; channel++) {
        const impulseChannel = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          impulseChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
      }
      
      this.reverbNode.buffer = impulse;
      
      this.sourceNode.connect(this.analyserNode);
      this.sourceNode.connect(this.reverbNode);
      this.reverbNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn("Ошибка при построении цепочки реверберации:", e);
    }
  }

  applyEffect(effect: string) {
    this.currentEffect = effect;
    
    switch (effect) {
      case 'distortion':
        this.buildDistortionChain();
        break;
      case 'reverb':
        this.buildReverbChain();
        break;
      case 'clean':
      default:
        this.buildCleanChain();
        break;
    }
    
    console.log(`🎸 Эффект применён: ${effect}`);
  }

  enableMonitoring(volume: number = 0.7) {
    if (!this.gainNode) return;
    this.isMonitoring = true;
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }

  disableMonitoring() {
    if (!this.gainNode) return;
    this.isMonitoring = false;
    this.gainNode.gain.value = 0;
  }

  setMonitoringVolume(volume: number) {
    if (!this.gainNode) return;
    if (this.isMonitoring) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getCurrentEffect(): string {
    return this.currentEffect;
  }

  startDetection(callback: (pitch: number, noteName: string) => void) {
    this.onPitchDetectedCallback = callback;
    this.isRunning = true;
    this.detectPitch();
  }

  stopDetection() {
    this.isRunning = false;
  }

  private detectPitch() {
    if (!this.isRunning || !this.analyserNode) return;

    const bufferLength = this.analyserNode.fftSize;
    const buffer = new Float32Array(bufferLength);
    this.analyserNode.getFloatTimeDomainData(buffer);

    const pitch = this.autoCorrelate(buffer, this.audioContext!.sampleRate);
    
    if (pitch > 0) {
      const noteName = this.getNoteName(pitch);
      this.onPitchDetectedCallback(pitch, noteName);
    }

    requestAnimationFrame(() => this.detectPitch());
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const size = buffer.length;
    let maxSamples = Math.floor(size / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);
    
    if (rms < 0.01) return -1;

    for (let offset = 20; offset < maxSamples; offset++) {
      let correlation = 0;
      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }
      correlation = 1 - correlation / maxSamples;
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    }
    
    if (bestCorrelation > 0.3) {
      return sampleRate / bestOffset;
    }
    
    return -1;
  }

  private getNoteName(frequency: number): string {
    let closestNote = '';
    let minDiff = Infinity;
    
    for (const [note, freq] of Object.entries(this.noteFrequencies)) {
      const diff = Math.abs(frequency - freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    }
    
    const tolerance = this.noteFrequencies[closestNote] * 0.03;
    if (minDiff <= tolerance) {
      return closestNote;
    }
    
    return '';
  }

  getStringFromNote(noteName: string): number | null {
    for (const [stringNum, note] of Object.entries(this.stringNotes)) {
      if (note === noteName) {
        return parseInt(stringNum);
      }
    }
    return null;
  }

  getNoteFromString(stringNum: number): string {
    return this.stringNotes[stringNum];
  }

  getFretFromNote(noteName: string, stringNum: number): number | undefined {
    const openStringNote = this.stringNotes[stringNum];
    const openFreq = this.noteFrequencies[openStringNote];
    const playedFreq = this.noteFrequencies[noteName];
    
    if (!openFreq || !playedFreq) return undefined;
    
    const semitones = Math.round(12 * Math.log2(playedFreq / openFreq));
    
    if (semitones >= 0 && semitones <= 24) {
      return semitones;
    }
    
    return undefined;
  }

  cleanup() {
    this.isRunning = false;
    this.isMonitoring = false;
    try {
      if (this.sourceNode) this.sourceNode.disconnect();
      if (this.analyserNode) this.analyserNode.disconnect();
      if (this.gainNode) this.gainNode.disconnect();
      if (this.distortionNode) this.distortionNode.disconnect();
      if (this.filterNode) this.filterNode.disconnect();
      if (this.preFilterNode) this.preFilterNode.disconnect();
      if (this.reverbNode) this.reverbNode.disconnect();
      if (this.audioContext) this.audioContext.close();
      if (this.mediaStream) this.mediaStream.getTracks().forEach(track => track.stop());
    } catch (e) {
      console.warn("Ошибка при очистке:", e);
    }
  }
}