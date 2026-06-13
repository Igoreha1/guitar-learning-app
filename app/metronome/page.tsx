"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  ChevronRight, Home, Play, Pause, Volume2,
  Plus, Minus, Fingerprint, Music, Sparkles
} from "lucide-react";

// Типы для метронома
type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";
type PresetBPM = 60 | 90 | 120 | 140 | 180;

interface MetronomeSettings {
  bpm: number;
  timeSignature: TimeSignature;
  volume: number;
}

export default function MetronomePage() {
  // Состояния
  const [isDark, setIsDark] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>("4/4");
  const [volume, setVolume] = useState(0.7);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [isTapTempoActive, setIsTapTempoActive] = useState(false);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  
  // Refs для аудио
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const currentBeatRef = useRef(1);
  
  // Refs для Tap Tempo
  const tapTimesRef = useRef<number[]>([]);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  
  // Загрузка сохранённых настроек
  useEffect(() => {
    const saved = localStorage.getItem("metronome_settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setBpm(settings.bpm || 120);
        setTimeSignature(settings.timeSignature || "4/4");
        setVolume(settings.volume || 0.7);
      } catch (e) {}
    }
  }, []);
  
  // Сохранение настроек
  useEffect(() => {
    const settings: MetronomeSettings = { bpm, timeSignature, volume };
    localStorage.setItem("metronome_settings", JSON.stringify(settings));
  }, [bpm, timeSignature, volume]);
  
  // Мгновенное изменение громкости
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);
  
  // Анимация маятника
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now();
      const interval = 60000 / bpm;
      
      const animatePendulum = (now: number) => {
        if (!isPlayingRef.current) return;
        const elapsed = (now - startTime) % interval;
        const progress = elapsed / interval;
        const angle = Math.sin(progress * Math.PI * 2) * 25;
        setPendulumAngle(angle);
        animationRef.current = requestAnimationFrame(animatePendulum);
      };
      
      animationRef.current = requestAnimationFrame(animatePendulum);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    } else {
      setPendulumAngle(0);
    }
  }, [isPlaying, bpm]);
  
  // Инициализация аудио
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = volume;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, [volume]);
  
  // Воспроизведение удара (с акцентом на первой доле)
  const playClick = useCallback((isAccent: boolean) => {
    const ctx = initAudio();
    const gainNode = ctx.createGain();
    const oscillator = ctx.createOscillator();
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    
    const now = ctx.currentTime;
    const frequency = isAccent ? 880 : 440;
    
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    
    const clickVolume = isAccent ? Math.min(1, volume * 1.2) : volume;
    
    gainNode.gain.setValueAtTime(clickVolume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    
    oscillator.start();
    oscillator.stop(now + 0.05);
  }, [volume, initAudio]);
  
  // Получение количества долей в такте
  const getBeatsPerBar = useCallback((signature: TimeSignature): number => {
    switch (signature) {
      case "2/4": return 2;
      case "3/4": return 3;
      case "4/4": return 4;
      case "6/8": return 6;
      default: return 4;
    }
  }, []);
  
  // Запуск метронома
  const startMetronome = useCallback(() => {
    if (isPlayingRef.current) return;
    
    const ctx = initAudio();
    const intervalMs = 60000 / bpm;
    const intervalSec = intervalMs / 1000;
    const startTime = ctx.currentTime;
    
    isPlayingRef.current = true;
    setIsPlaying(true);
    currentBeatRef.current = 1;
    
    const beatsPerBar = getBeatsPerBar(timeSignature);
    let nextBeatTime = startTime;
    
    const scheduleNextBeat = () => {
      if (!isPlayingRef.current) return;
      const now = ctx.currentTime;
      
      while (nextBeatTime < now + 0.1) {
        const isAccent = currentBeatRef.current === 1;
        const delay = (nextBeatTime - now) * 1000;
        
        if (delay >= 0) {
          const timeoutId = setTimeout(() => {
            if (isPlayingRef.current) {
              playClick(isAccent);
              setCurrentBeat(currentBeatRef.current);
              currentBeatRef.current = currentBeatRef.current % beatsPerBar + 1;
            }
          }, delay);
          (timerRef as any).current = timeoutId;
        }
        nextBeatTime += intervalSec;
      }
      
      const nextSchedule = setTimeout(scheduleNextBeat, 50);
      (timerRef as any).current = nextSchedule;
    };
    
    scheduleNextBeat();
  }, [bpm, timeSignature, getBeatsPerBar, initAudio, playClick]);
  
  // Остановка метронома
  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentBeat(1);
    currentBeatRef.current = 1;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);
  
  // Переключение воспроизведения
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);
  
  // Изменение BPM
  const changeBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.min(208, Math.max(40, newBpm));
    setBpm(clampedBpm);
    
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 50);
    }
  }, [isPlaying, startMetronome, stopMetronome]);
  
  // Tap Tempo
  const tapTempo = useCallback(() => {
    const now = Date.now();
    
    if (!isTapTempoActive) {
      setIsTapTempoActive(true);
      tapTimesRef.current = [now];
      
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      tapTimeoutRef.current = setTimeout(() => {
        setIsTapTempoActive(false);
        tapTimesRef.current = [];
        tapTimeoutRef.current = null;
      }, 2000);
      return;
    }
    
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }
    
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(() => {
      setIsTapTempoActive(false);
      tapTimesRef.current = [];
      tapTimeoutRef.current = null;
    }, 2000);
    
    if (tapTimesRef.current.length >= 2) {
      const firstTap = tapTimesRef.current[0];
      const lastTap = tapTimesRef.current[tapTimesRef.current.length - 1];
      const avgInterval = (lastTap - firstTap) / (tapTimesRef.current.length - 1);
      let newBpm = Math.round(60000 / avgInterval);
      newBpm = Math.min(208, Math.max(40, newBpm));
      changeBpm(newBpm);
    }
  }, [changeBpm, isTapTempoActive]);
  
  // Пресеты BPM
  const presets: PresetBPM[] = [60, 90, 120, 140, 180];

  // Стили в зависимости от темы
  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-800',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    cardBg: isDark ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700' : 'bg-white border-gray-200 shadow-sm',
    buttonBg: isDark ? 'bg-gray-800 hover:bg-primary/20 text-white' : 'bg-gray-100 hover:bg-primary/20 text-gray-800',
    buttonActive: isDark ? 'bg-primary text-white' : 'bg-primary text-white',
    sliderBg: isDark ? 'bg-gray-700' : 'bg-gray-200',
    sliderGradientStart: '#e74c3c',
    sliderGradientEnd: isDark ? '#374151' : '#e5e7eb',
    accentCard: isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200',
  };
  
  return (
    <div className={`min-h-screen ${styles.bgPage}`}>
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-20 pb-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className={`flex items-center gap-2 text-sm ${styles.textMuted} mb-6`}>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Метроном</span>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Ритмический инструмент</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                Метроном онлайн
              </span>
              <br />
              <span className="text-gradient">с визуализацией</span>
            </h1>
            <p className={`${styles.textSecondary} text-lg max-w-2xl mx-auto`}>
              Развивайте чувство ритма. Настройте темп и размер такта.
            </p>
          </div>
        </div>
      </section>
      
      {/* Основной блок метронома */}
      <section className="py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`rounded-2xl border p-6 md:p-8 ${styles.cardBg}`}>
            
            {/* BPM и Tap Tempo */}
            <div className="text-center mb-8">
              <div className="text-6xl md:text-7xl font-bold text-primary mb-2 font-mono">
                {bpm}
              </div>
              <div className={`text-sm ${styles.textMuted}`}>BPM</div>
              
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => changeBpm(bpm - 1)}
                  className={`w-10 h-10 rounded-full ${styles.buttonBg} transition-all flex items-center justify-center`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <input
                  type="range"
                  min="40"
                  max="208"
                  value={bpm}
                  onChange={(e) => changeBpm(parseInt(e.target.value))}
                  className={`w-48 md:w-64 h-2 ${styles.sliderBg} rounded-lg appearance-none cursor-pointer`}
                  style={{
                    background: `linear-gradient(to right, ${styles.sliderGradientStart} 0%, ${styles.sliderGradientStart} ${(bpm - 40) / 168 * 100}%, ${styles.sliderGradientEnd} ${(bpm - 40) / 168 * 100}%, ${styles.sliderGradientEnd} 100%)`
                  }}
                />
                
                <button
                  onClick={() => changeBpm(bpm + 1)}
                  className={`w-10 h-10 rounded-full ${styles.buttonBg} transition-all flex items-center justify-center`}
                >
                  <Plus className="w-5 h-5" />
                </button>
                
                <button
                  onClick={tapTempo}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isTapTempoActive
                      ? styles.buttonActive
                      : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Fingerprint className="w-4 h-4" />
                  Tap Tempo
                </button>
              </div>
            </div>
            
            {/* Пресеты BPM */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => changeBpm(preset)}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                    bpm === preset
                      ? styles.buttonActive
                      : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {preset} BPM
                </button>
              ))}
            </div>
            
            {/* Анимированный маятник */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="30" r="4" fill="#e74c3c" />
                  <line
                    x1="100"
                    y1="30"
                    x2="100"
                    y2="120"
                    stroke="#e74c3c"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      transformOrigin: "100px 30px",
                      transform: `rotate(${pendulumAngle}deg)`,
                      transition: "transform 0.05s linear"
                    }}
                  />
                  <circle cx="100" cy="125" r="10" fill="#e74c3c" />
                </svg>
              </div>
            </div>
            
            {/* Счётчик тактов */}
            <div className="flex justify-center gap-3 mb-8">
              {Array.from({ length: getBeatsPerBar(timeSignature) }).map((_, idx) => {
                const beatNumber = idx + 1;
                const isCurrent = isPlaying && currentBeat === beatNumber;
                const isAccent = beatNumber === 1;
                
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                      isCurrent
                        ? isAccent
                          ? "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
                          : "bg-primary/50 text-white scale-105"
                        : isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {beatNumber}
                  </div>
                );
              })}
            </div>
            
            {/* Размер такта и громкость */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>
                  🎵 Размер такта
                </label>
                <div className="flex gap-2">
                  {(["2/4", "3/4", "4/4", "6/8"] as TimeSignature[]).map((sig) => (
                    <button
                      key={sig}
                      onClick={() => setTimeSignature(sig)}
                      className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                        timeSignature === sig
                          ? styles.buttonActive
                          : isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {sig}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${styles.textMuted} mb-2`}>
                  🔊 Громкость
                </label>
                <div className="flex items-center gap-3">
                  <Volume2 className={`w-4 h-4 ${styles.textMuted}`} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className={`flex-1 h-2 ${styles.sliderBg} rounded-lg appearance-none cursor-pointer`}
                    style={{
                      background: `linear-gradient(to right, ${styles.sliderGradientStart} 0%, ${styles.sliderGradientStart} ${volume * 100}%, ${styles.sliderGradientEnd} ${volume * 100}%, ${styles.sliderGradientEnd} 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Кнопка Старт/Стоп */}
            <button
              onClick={togglePlay}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                isPlaying
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/30"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Остановить
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Запустить метроном
                </>
              )}
            </button>
            
            {/* Информация о текущем размере */}
            <div className={`mt-6 text-center text-sm ${styles.textMuted}`}>
              {isPlaying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Играет • {timeSignature} • {bpm} BPM</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              ) : (
                <span>Нажмите «Запустить», чтобы начать</span>
              )}
            </div>
            
            {/* Советы */}
            <div className={`mt-8 p-4 ${styles.accentCard} rounded-xl border`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className={`text-sm font-semibold ${styles.textPrimary}`}>Советы по использованию:</h3>
              </div>
              <ul className={`text-xs ${styles.textMuted} space-y-1`}>
                <li>• Начните с медленного темпа (60-80 BPM), постепенно увеличивая скорость</li>
                <li>• Используйте Tap Tempo, чтобы подстроиться под ритм песни</li>
                <li>• Акцент помогает чувствовать сильную долю — не игнорируйте его</li>
                <li>• Размер 4/4 — самый популярный, 6/8 — для вальсов и баллад</li>
                <li>• Настройки автоматически сохраняются в браузере</li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}