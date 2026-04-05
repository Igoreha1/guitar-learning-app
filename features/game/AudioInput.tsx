"use client";

import { useState, useEffect, useRef } from 'react';
import { PitchDetector } from './PitchDetector';

interface AudioInputProps {
  onNoteDetected: (note: string, string: number, fret?: number, pitch?: number) => void;
  onMicStatusChange?: (isConnected: boolean) => void;
}

export default function AudioInput({ onNoteDetected, onMicStatusChange }: AudioInputProps) {
  const [isMicConnected, setIsMicConnected] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentFret, setCurrentFret] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringVolume, setMonitoringVolume] = useState(0.7);
  const [currentEffect, setCurrentEffect] = useState('clean');
  const [debugInfo, setDebugInfo] = useState('Ожидание...');
  const detectorRef = useRef<PitchDetector | null>(null);
  const lastNoteTimeRef = useRef<number>(0);
  
  // Буфер для стабилизации частоты
  const pitchBufferRef = useRef<number[]>([]);
  const BUFFER_SIZE = 5;

  useEffect(() => {
    const initMic = async () => {
      setDebugInfo('Запрос доступа к микрофону...');
      
      const detector = new PitchDetector();
      const success = await detector.init();
      
      if (success) {
        detectorRef.current = detector;
        setIsMicConnected(true);
        onMicStatusChange?.(true);
        setDebugInfo('✅ Микрофон подключен!');
      } else {
        setIsMicConnected(false);
        onMicStatusChange?.(false);
        setDebugInfo('❌ Не удалось получить доступ к микрофону');
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
    if (!detectorRef.current || !isMicConnected) {
      setDebugInfo('❌ Микрофон не готов');
      return;
    }
    
    setIsListening(true);
    setDebugInfo('🎤 Слушаю гитару... Играйте!');
    
    detectorRef.current.startDetection((pitch, noteName) => {
      if (pitch > 0) {
        setCurrentPitch(pitch);
        setCurrentNote(noteName);
        
        if (!noteName) {
          setDebugInfo(`🎵 Частота: ${pitch.toFixed(1)} Гц | Нота не распознана`);
          return;
        }
        
        const stringNum = detectorRef.current?.getStringFromNote(noteName);
        const fret = stringNum !== undefined && stringNum !== null 
          ? detectorRef.current?.getFretFromNote(noteName, stringNum) 
          : undefined;
        
        setCurrentFret(fret ?? null);
        
        // Стабилизация частоты через буфер
        pitchBufferRef.current.push(pitch);
        if (pitchBufferRef.current.length > BUFFER_SIZE) {
          pitchBufferRef.current.shift();
        }
        const avgPitch = pitchBufferRef.current.reduce((a, b) => a + b, 0) / pitchBufferRef.current.length;
        
        const stringDisplay = stringNum !== undefined && stringNum !== null ? stringNum + 1 : '?';
        setDebugInfo(`🎵 Частота: ${avgPitch.toFixed(1)} Гц | Нота: ${noteName} | Струна: ${stringDisplay} | Лад: ${fret ?? '?'}`);
        
        if (stringNum !== undefined && stringNum !== null) {
          const now = Date.now();
          if (now - lastNoteTimeRef.current < 200) return;
          lastNoteTimeRef.current = now;
          
          // Передаём и частоту для проверки в GameEngine
          onNoteDetected(noteName, stringNum, fret, avgPitch);
        }
      } else {
        setDebugInfo('🎸 Играйте громче...');
        pitchBufferRef.current = [];
      }
    });
  };

  const stopListening = () => {
    if (!detectorRef.current) return;
    
    setIsListening(false);
    detectorRef.current.stopDetection();
    setCurrentNote('');
    setCurrentPitch(0);
    setCurrentFret(null);
    pitchBufferRef.current = [];
    setDebugInfo('⏸ Остановлено');
  };

  const toggleMonitoring = () => {
    if (!detectorRef.current) return;
    
    if (isMonitoring) {
      detectorRef.current.disableMonitoring();
      setIsMonitoring(false);
      setDebugInfo('🔇 Мониторинг гитары выключен');
    } else {
      detectorRef.current.enableMonitoring(monitoringVolume);
      setIsMonitoring(true);
      setDebugInfo('🎸 Мониторинг гитары включен (звук идёт на колонки)');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setMonitoringVolume(newVolume);
    if (detectorRef.current && isMonitoring) {
      detectorRef.current.setMonitoringVolume(newVolume);
      setDebugInfo(`🎸 Громкость мониторинга: ${Math.round(newVolume * 100)}%`);
    }
  };

  const changeEffect = (effect: string) => {
    if (!detectorRef.current) return;
    detectorRef.current.applyEffect(effect);
    setCurrentEffect(effect);
    setDebugInfo(`🎸 Эффект изменён: ${effect === 'distortion' ? 'Дисторшн' : effect === 'reverb' ? 'Реверберация' : 'Чистый звук'}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold mb-1">🎸 Подключение гитары</h3>
          <p className="text-xs text-gray-400">
            {isMicConnected 
              ? "✅ Микрофон/звуковая карта подключены" 
              : "❌ Нет доступа к микрофону"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {isMicConnected && (
            <button
              onClick={toggleMonitoring}
              className={`px-3 py-2 rounded-lg font-bold transition text-sm ${
                isMonitoring 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white`}
              title={isMonitoring ? "Выключить вывод звука" : "Включить вывод звука на колонки"}
            >
              {isMonitoring ? "🔊 МОНИТОРИНГ" : "🔇 МОНИТОРИНГ"}
            </button>
          )}
          
          {isMicConnected && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                isListening 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {isListening ? "⏸ Остановить" : "🎤 Начать распознавание"}
            </button>
          )}
        </div>
      </div>
      
      {/* Ползунок громкости для мониторинга */}
      {isMicConnected && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>🎸 Громкость мониторинга</span>
            <span>{Math.round(monitoringVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={monitoringVolume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #9b59b6 0%, #9b59b6 ${monitoringVolume * 100}%, #374151 ${monitoringVolume * 100}%, #374151 100%)`
            }}
          />
        </div>
      )}
      
      {/* Выбор эффектов */}
      {isMicConnected && (
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-2">🎸 Эффекты гитары</div>
          <div className="flex gap-2">
            <button
              onClick={() => changeEffect('clean')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                currentEffect === 'clean' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎸 Clean
            </button>
            <button
              onClick={() => changeEffect('distortion')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                currentEffect === 'distortion' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔥 Дисторшн
            </button>
            <button
              onClick={() => changeEffect('reverb')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                currentEffect === 'reverb' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌊 Реверберация
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-lg p-3 mb-3">
        <div className="text-xs text-gray-400 mb-1">🔊 ДЕТЕКТОР ЗВУКА</div>
        <div className="text-sm text-green-400 font-mono">{debugInfo}</div>
      </div>
      
      {isListening && (
        <div className="text-center py-3 bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">СЫГРАННАЯ НОТА</div>
          <div className="text-3xl font-bold text-green-500">
            {currentNote || "—"}
          </div>
          {currentFret !== null && currentFret >= 0 && (
            <div className="text-sm text-yellow-400 mt-1">
              Лад: {currentFret === 0 ? 'открытая' : currentFret}
            </div>
          )}
          {currentPitch > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              {currentPitch.toFixed(1)} Гц
            </div>
          )}
        </div>
      )}
      
      {isListening && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Уровень сигнала</span>
            <span>{currentPitch > 0 ? '🎸 Играет' : '🔇 Тишина'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-100"
              style={{ width: `${Math.min(100, currentPitch / 10)}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 border-t border-gray-700 pt-3">
        💡 <span className="text-yellow-500">Советы:</span><br/>
        • Включите мониторинг, чтобы слышать гитару<br/>
        • Выбирайте эффект под стиль песни<br/>
        • Регулируйте громкость, чтобы избежать обратной связи
      </div>
    </div>
  );
}