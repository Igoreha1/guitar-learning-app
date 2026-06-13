"use client";

import { useState, useEffect, useRef } from 'react';
import { Mic, CheckCircle, RefreshCw, Square } from 'lucide-react';

// PitchDetector класс (без изменений)
class PitchDetector {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isRunning: boolean = false;
  private onPitchDetectedCallback: (pitch: number, noteName: string) => void = () => {};

  private noteFrequencies: { [key: string]: number } = {
    'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'A2': 110.00, 'A#2': 116.54, 'B2': 123.47, 'C3': 130.81, 'C#3': 138.59,
    'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
    'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
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
      
      this.sourceNode.connect(this.analyserNode);
      await this.audioContext.resume();
      
      return true;
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
      return false;
    }
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

  cleanup() {
    this.isRunning = false;
    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.analyserNode) this.analyserNode.disconnect();
    if (this.audioContext) this.audioContext.close();
    if (this.mediaStream) this.mediaStream.getTracks().forEach(track => track.stop());
  }
}

interface TunerProps {
  onTuneComplete?: () => void;
  onMicPermission?: (granted: boolean) => void;
  isMuted?: boolean;
}

const STRINGS = [
  { note: 'E2', name: '6-я струна', shortName: 'E', frequency: 82.41, color: '#ef4444', colorLight: '#fef2f2', colorDark: 'rgba(239, 68, 68, 0.15)' },
  { note: 'A2', name: '5-я струна', shortName: 'A', frequency: 110.00, color: '#f97316', colorLight: '#fff7ed', colorDark: 'rgba(249, 115, 22, 0.15)' },
  { note: 'D3', name: '4-я струна', shortName: 'D', frequency: 146.83, color: '#eab308', colorLight: '#fefce8', colorDark: 'rgba(234, 179, 8, 0.15)' },
  { note: 'G3', name: '3-я струна', shortName: 'G', frequency: 196.00, color: '#22c55e', colorLight: '#f0fdf4', colorDark: 'rgba(34, 197, 94, 0.15)' },
  { note: 'B3', name: '2-я струна', shortName: 'B', frequency: 246.94, color: '#3b82f6', colorLight: '#eff6ff', colorDark: 'rgba(59, 130, 246, 0.15)' },
  { note: 'E4', name: '1-я струна', shortName: 'e', frequency: 329.63, color: '#a855f7', colorLight: '#faf5ff', colorDark: 'rgba(168, 85, 247, 0.15)' }
];

export default function Tuner({ onTuneComplete, onMicPermission, isMuted = false }: TunerProps) {
  const [isDark, setIsDark] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [currentStringIndex, setCurrentStringIndex] = useState<number | null>(null);
  const [deviation, setDeviation] = useState(0);
  const [tunedStrings, setTunedStrings] = useState<boolean[]>([false, false, false, false, false, false]);
  const [volume, setVolume] = useState(0);
  const detectorRef = useRef<PitchDetector | null>(null);
  const tunedRef = useRef<boolean[]>([false, false, false, false, false, false]);

  // Следим за изменением темы
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const initMic = async () => {
      const detector = new PitchDetector();
      const success = await detector.init();
      
      if (success) {
        detectorRef.current = detector;
        setIsInitialized(true);
        onMicPermission?.(true);
      } else {
        onMicPermission?.(false);
      }
    };
    
    initMic();
    
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stopDetection();
        detectorRef.current.cleanup();
      }
    };
  }, [onMicPermission]);

  useEffect(() => {
    if (isListening && isInitialized) {
      const interval = setInterval(() => {
        setVolume(prev => Math.max(0, prev - 0.05));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening, isInitialized]);

  const startListening = () => {
    if (!detectorRef.current) {
      alert("Микрофон не доступен. Проверьте разрешения.");
      return;
    }
    
    setIsListening(true);
    
    detectorRef.current.startDetection((pitch: number, noteName: string) => {
      if (pitch > 0) {
        setCurrentFrequency(pitch);
        setCurrentNote(noteName);
        
        const vol = Math.min(1, pitch / 500);
        setVolume(vol);
        
        let closestIndex = -1;
        let minDev = Infinity;
        
        STRINGS.forEach((string, idx) => {
          const diff = Math.abs(pitch - string.frequency);
          const dev = ((pitch - string.frequency) / string.frequency) * 100;
          
          if (diff < string.frequency * 0.05) {
            if (Math.abs(dev) < Math.abs(minDev)) {
              minDev = dev;
              closestIndex = idx;
            }
          }
        });
        
        if (closestIndex !== -1) {
          setCurrentStringIndex(closestIndex);
          setDeviation(minDev);
          
          const isTuned = Math.abs(minDev) < 1.5;
          
          if (isTuned && !tunedRef.current[closestIndex]) {
            tunedRef.current[closestIndex] = true;
            setTunedStrings([...tunedRef.current]);
            
            if (tunedRef.current.every(v => v === true)) {
              onTuneComplete?.();
            }
          }
        } else {
          setCurrentStringIndex(null);
        }
      }
    });
  };

  const stopListening = () => {
    if (!detectorRef.current) return;
    
    setIsListening(false);
    detectorRef.current.stopDetection();
    setCurrentNote('');
    setCurrentFrequency(0);
    setCurrentStringIndex(null);
    setVolume(0);
  };

  const resetTuner = () => {
    tunedRef.current = [false, false, false, false, false, false];
    setTunedStrings([false, false, false, false, false, false]);
    setDeviation(0);
    setCurrentStringIndex(null);
    setCurrentNote('');
    setCurrentFrequency(0);
  };

  const getNeedleRotation = () => {
    const maxAngle = 50;
    const clamped = Math.max(-maxAngle, Math.min(maxAngle, deviation * 2.5));
    return clamped;
  };

  const rotation = getNeedleRotation();
  const tunedCount = tunedStrings.filter(v => v === true).length;
  const allTuned = tunedCount === 6;

  return (
    <div>
      {/* Статус микрофона */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : isDark ? 'bg-gray-500' : 'bg-gray-400'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isListening ? 'Микрофон активен' : 'Микрофон ожидает'}
          </span>
        </div>
        {isListening && (
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-primary to-primary/60 rounded-full transition-all duration-100"
                style={{ height: `${volume * 20 * (i + 1)}px`, opacity: volume * (i + 1) + 0.3 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Кнопка включения/выключения */}
      <div className="flex justify-center mb-8">
        {!isListening ? (
          <button
            onClick={startListening}
            disabled={!isInitialized}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-5 h-5" />
            Включить тюнер
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Square className="w-5 h-5" />
            Остановить
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Круглый тюнер */}
      <div className="relative mb-10">
        <div className="relative w-80 h-80 mx-auto">
          <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-gradient-to-br from-gray-dark to-dark shadow-2xl' : 'bg-white shadow-xl border border-gray-200'}`} />
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <path d="M 100 25 A 75 75 0 0 1 25 100" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <path d="M 100 25 A 75 75 0 0 0 175 100" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <path d="M 100 28 A 72 72 0 0 1 28 100" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" opacity="0.15" />
            <path d="M 100 28 A 72 72 0 0 0 172 100" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" opacity="0.15" />
            
            {[-30, -20, -10, 0, 10, 20, 30].map((val) => {
              const angle = val * 0.9;
              const rad = (angle - 90) * Math.PI / 180;
              const r1 = 65;
              const r2 = val === 0 ? 80 : 75;
              const x1 = 100 + r1 * Math.cos(rad);
              const y1 = 100 + r1 * Math.sin(rad);
              const x2 = 100 + r2 * Math.cos(rad);
              const y2 = 100 + r2 * Math.sin(rad);
              const color = val === 0 ? '#22c55e' : (val < 0 ? '#ef4444' : '#22c55e');
              const opacity = val === 0 ? 0.8 : (Math.abs(val) === 30 ? 0.4 : 0.6);
              return <line key={val} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={val === 0 ? 3 : 1.5} opacity={opacity} />;
            })}
            
            <text x="32" y="85" fontSize="8" fill="#ef4444" opacity="0.6" textAnchor="middle">-30</text>
            <text x="42" y="70" fontSize="8" fill="#ef4444" opacity="0.5" textAnchor="middle">-20</text>
            <text x="55" y="58" fontSize="8" fill="#ef4444" opacity="0.4" textAnchor="middle">-10</text>
            <text x="168" y="85" fontSize="8" fill="#22c55e" opacity="0.6" textAnchor="middle">+30</text>
            <text x="158" y="70" fontSize="8" fill="#22c55e" opacity="0.5" textAnchor="middle">+20</text>
            <text x="145" y="58" fontSize="8" fill="#22c55e" opacity="0.4" textAnchor="middle">+10</text>
            <text x="93" y="38" fontSize="10" fill={isDark ? "#fff" : "#3b82f6"} fontWeight="bold" textAnchor="middle">0</text>
          </svg>
          
          <div
            className="absolute left-1/2 bottom-1/2 w-1.5 h-32 bg-gradient-to-t from-primary to-primary-dark origin-bottom transform -translate-x-1/2 transition-all duration-75 rounded-full shadow-lg"
            style={{
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
          
          <div className={`absolute top-1/2 left-1/2 w-5 h-5 bg-gradient-to-br from-primary to-primary-dark rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md ${!isDark ? 'border-2 border-white' : ''}`} />
          
          {isListening && volume > 0.1 && (
            <div 
              className="absolute top-1/2 left-1/2 rounded-full bg-primary/10 transform -translate-x-1/2 -translate-y-1/2 animate-ping"
              style={{ width: `${60 + volume * 80}px`, height: `${60 + volume * 80}px` }}
            />
          )}
        </div>
        
        <div className="text-center mt-6">
          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-1 tracking-wider`}>СЫГРАННАЯ НОТА</div>
          <div className={`text-6xl md:text-7xl font-bold ${isDark ? 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent' : 'text-gray-800'} mb-3`}>
            {currentNote || '—'}
          </div>
          {currentFrequency > 0 && (
            <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {currentFrequency.toFixed(1)} Гц
            </div>
          )}
        </div>
      </div>

      {/* Информация о текущей струне */}
      {currentStringIndex !== null && (
        <div className="text-center mb-8 animate-fade-in-up">
          <div 
            className="inline-flex flex-col items-center gap-2 px-8 py-4 rounded-2xl border"
            style={{ 
              background: isDark ? STRINGS[currentStringIndex].colorDark : STRINGS[currentStringIndex].colorLight,
              borderColor: `${STRINGS[currentStringIndex].color}40`
            }}
          >
            <span className="text-2xl font-bold" style={{ color: STRINGS[currentStringIndex].color }}>
              {STRINGS[currentStringIndex].name}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{STRINGS[currentStringIndex].note}</span>
          </div>
          
          <div className="mt-4">
            {Math.abs(deviation) < 1.5 ? (
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full font-semibold border border-green-300 dark:border-green-500/30">
                <CheckCircle className="w-4 h-4" />
                Струна настроена!
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {deviation > 0 ? (
                  <>↑ Натяните струну выше <span className="text-red-500">({Math.abs(deviation).toFixed(1)}%)</span></>
                ) : (
                  <>↓ Ослабьте струну ниже <span className="text-red-500">({Math.abs(deviation).toFixed(1)}%)</span></>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Кнопка сброса */}
      {isListening && (
        <div className="flex justify-center mt-4 mb-8">
          <button
            onClick={resetTuner}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          >
            <RefreshCw className="w-4 h-4" />
            Сбросить прогресс
          </button>
        </div>
      )}

      {/* Список струн */}
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-dark/50 to-dark/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border p-6`}>
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 text-center`}>Струны гитары</h3>
        <div className="space-y-3">
          {STRINGS.map((string, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                currentStringIndex === index && isListening && !tunedStrings[index] ? 'ring-2 ring-primary/40 shadow-md' : ''
              }`}
              style={{ 
                background: tunedStrings[index] 
                  ? (isDark ? string.colorDark : string.colorLight) 
                  : (isDark ? 'transparent' : '#f9fafb')
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform duration-300"
                style={{ background: tunedStrings[index] ? string.color : (isDark ? '#4a4a5a' : '#9ca3af') }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className={`font-semibold ${tunedStrings[index] ? (isDark ? 'text-white' : 'text-gray-800') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                    {string.name}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{string.note}</span>
                </div>
                <div className={`h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${tunedStrings[index] ? 100 : 0}%`,
                      background: string.color
                    }}
                  />
                </div>
              </div>
              {tunedStrings[index] && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {currentStringIndex === index && isListening && !tunedStrings[index] && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-xs text-primary">играйте</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Прогресс настройки */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Прогресс настройки</span>
            <span className="text-sm font-semibold text-primary">
              {tunedCount} / 6
            </span>
          </div>
          <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 rounded-full"
              style={{ width: `${(tunedCount / 6) * 100}%` }}
            />
          </div>
          {allTuned && (
            <div className="mt-3 text-center text-green-600 dark:text-green-400 text-sm animate-pulse font-medium">
              🎸 Все струны настроены! Отлично!
            </div>
          )}
        </div>
      </div>

      {/* Инструкция */}
      <div className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
        <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
          <span className="text-xl">🎯</span> Как пользоваться тюнером:
        </h4>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">1</span>
            <span>Нажмите "Включить тюнер"</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">2</span>
            <span>Извлеките звук на струне</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">3</span>
            <span>Следите за стрелкой</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">4</span>
            <span>Крутите колок в сторону стрелки</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">5</span>
            <span>Стрелка в центре — струна настроена!</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">6</span>
            <span>Настройте все 6 струн</span>
          </div>
        </div>
      </div>
    </div>
  );
}