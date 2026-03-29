"use client";

import { useState, useEffect, useRef } from 'react';

// PitchDetector класс
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
}

const STRINGS = [
  { note: 'E2', name: '6-я струна', frequency: 82.41, color: '#e74c3c', isTuned: false },
  { note: 'A2', name: '5-я струна', frequency: 110.00, color: '#e67e22', isTuned: false },
  { note: 'D3', name: '4-я струна', frequency: 146.83, color: '#f39c12', isTuned: false },
  { note: 'G3', name: '3-я струна', frequency: 196.00, color: '#2ecc71', isTuned: false },
  { note: 'B3', name: '2-я струна', frequency: 246.94, color: '#3498db', isTuned: false },
  { note: 'E4', name: '1-я струна', frequency: 329.63, color: '#9b59b6', isTuned: false }
];

export default function Tuner({ onTuneComplete }: TunerProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [currentStringIndex, setCurrentStringIndex] = useState<number | null>(null);
  const [deviation, setDeviation] = useState(0);
  const [tunedStrings, setTunedStrings] = useState<boolean[]>([false, false, false, false, false, false]);
  const detectorRef = useRef<PitchDetector | null>(null);

  useEffect(() => {
    const initMic = async () => {
      const detector = new PitchDetector();
      const success = await detector.init();
      
      if (success) {
        detectorRef.current = detector;
        console.log("Микрофон готов");
      } else {
        console.log("Не удалось получить доступ к микрофону");
      }
    };
    
    initMic();
    
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stopDetection();
        detectorRef.current.cleanup();
      }
    };
  }, []);

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
        
        // Находим ближайшую струну
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
          
          if (isTuned && !tunedStrings[closestIndex]) {
            const newTuned = [...tunedStrings];
            newTuned[closestIndex] = true;
            setTunedStrings(newTuned);
            
            if (newTuned.every(v => v === true) && onTuneComplete) {
              onTuneComplete();
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
  };

  const resetTuner = () => {
    setTunedStrings([false, false, false, false, false, false]);
    setDeviation(0);
  };

  // Угол стрелки (от -45 до +45 градусов)
  const getNeedleRotation = () => {
    const maxAngle = 45;
    const clamped = Math.max(-maxAngle, Math.min(maxAngle, deviation * 3));
    return clamped;
  };

  const rotation = getNeedleRotation();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎸 Гитарный тюнер
        </h1>
        <p className="text-gray-600">
          Настройте гитару с помощью микрофона
        </p>
      </div>

      {/* Основной блок с круглым тюнером */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        {/* Кнопка включения/выключения */}
        <div className="flex justify-center mb-8">
          {!isListening ? (
            <button
              onClick={startListening}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition font-bold text-lg shadow-lg"
            >
              🎤 Включить тюнер
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition font-bold text-lg shadow-lg"
            >
              ⏸ Остановить
            </button>
          )}
        </div>

        {/* Круглый тюнер */}
        <div className="relative mb-8">
          <div className="relative w-72 h-72 mx-auto">
            {/* Фоновый круг */}
            <div className="absolute inset-0 rounded-full bg-gray-100 shadow-inner"></div>
            
            {/* Градуированная шкала */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              {/* Левая дуга (ниже) */}
              <path
                d="M 100 25 A 75 75 0 0 1 25 100"
                fill="none"
                stroke="#e74c3c"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Правая дуга (выше) */}
              <path
                d="M 100 25 A 75 75 0 0 0 175 100"
                fill="none"
                stroke="#2ecc71"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Метки */}
              <line x1="100" y1="25" x2="100" y2="40" stroke="#333" strokeWidth="2"/>
              <line x1="25" y1="100" x2="40" y2="100" stroke="#e74c3c" strokeWidth="2"/>
              <line x1="175" y1="100" x2="160" y2="100" stroke="#2ecc71" strokeWidth="2"/>
              
              {/* Цифры */}
              <text x="38" y="85" fontSize="9" fill="#e74c3c">-30</text>
              <text x="155" y="85" fontSize="9" fill="#2ecc71">+30</text>
              <text x="93" y="38" fontSize="10" fill="#333" fontWeight="bold">0</text>
            </svg>
            
            {/* Стрелка */}
            <div
              className="absolute left-1/2 bottom-1/2 w-1.5 h-28 bg-gradient-to-t from-red-600 to-red-500 origin-bottom transform -translate-x-1/2 transition-all duration-100"
              style={{
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
                boxShadow: '0 0 8px rgba(231, 76, 60, 0.8)',
                borderRadius: '4px'
              }}
            ></div>
            
            {/* Центральная точка */}
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
          </div>
          
          {/* Текущая нота */}
          <div className="text-center mt-6">
            <div className="text-sm text-gray-500 mb-1">СЫГРАННАЯ НОТА</div>
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {currentNote || '—'}
            </div>
            {currentFrequency > 0 && (
              <div className="text-sm text-gray-500">
                {currentFrequency.toFixed(1)} Гц
              </div>
            )}
          </div>
        </div>

        {/* Информация о текущей струне */}
        {currentStringIndex !== null && (
          <div className="text-center mb-6">
            <div 
              className="inline-block px-6 py-3 rounded-full font-bold text-white text-lg"
              style={{ background: STRINGS[currentStringIndex].color }}
            >
              {STRINGS[currentStringIndex].name} • {STRINGS[currentStringIndex].note}
            </div>
            
            <div className="mt-4">
              {Math.abs(deviation) < 1.5 ? (
                <div className="inline-block px-6 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                  ✓ Идеально! Струна настроена
                </div>
              ) : (
                <div className="text-gray-600 font-medium">
                  {deviation > 0 
                    ? `↑ Натяните струну выше (на ${Math.abs(deviation).toFixed(1)}%)` 
                    : `↓ Ослабьте струну ниже (на ${Math.abs(deviation).toFixed(1)}%)`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Кнопка сброса */}
        {isListening && (
          <div className="flex justify-center mt-4">
            <button
              onClick={resetTuner}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ↺ Сбросить прогресс
            </button>
          </div>
        )}
      </div>

      {/* Список струн */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Струны гитары</h3>
        <div className="space-y-3">
          {STRINGS.map((string, index) => (
            <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md"
                style={{ background: string.color }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{string.name}</span>
                  <span className="text-sm text-gray-500">{string.note}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${tunedStrings[index] ? 100 : 0}%`,
                      background: string.color
                    }}
                  ></div>
                </div>
              </div>
              {tunedStrings[index] && (
                <div className="text-green-500 text-2xl">✓</div>
              )}
              {currentStringIndex === index && isListening && (
                <div className="text-blue-500 animate-pulse">🎵</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Прогресс */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Прогресс настройки</span>
            <span className="text-sm font-semibold text-gray-700">
              {tunedStrings.filter(v => v === true).length} / 6
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 rounded-full"
              style={{ width: `${(tunedStrings.filter(v => v === true).length / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Инструкция */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <span className="text-xl">🎯</span> Как пользоваться тюнером:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
            <span>Подключите гитару</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
            <span>Нажмите "Включить тюнер"</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
            <span>Извлеките звук на струне</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
            <span>Следите за стрелкой</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">5</span>
            <span>Крутите колок в сторону стрелки</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">6</span>
            <span>Стрелка в центре — струна настроена!</span>
          </div>
        </div>
      </div>
    </div>
  );
}