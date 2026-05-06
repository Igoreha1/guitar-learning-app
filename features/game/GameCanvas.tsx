"use client";

import { useEffect, useRef, useState } from "react";
import { GameEngine } from "./GameEngine";
import { GameSong } from "./types";
import { PitchDetector } from "./PitchDetector";
import BackingTrackPlayer from "./BackingTrackPlayer";
import { Trophy, Star, RotateCcw, Home, Sparkles } from "lucide-react";
import Link from "next/link";

interface GameCanvasProps {
  song: GameSong;
  onScoreUpdate?: (score: number) => void;
  onGameComplete?: (result: GameResult) => void;
  onScoreSaved?: (isNewRecord: boolean) => void;
}

interface GameResult {
  score: number;
  maxCombo: number;
  accuracy: number;
  hitNotes: number;
  totalNotes: number;
}

interface Particle {
  x: number;
  y: number;
  life: number;
  vx: number;
  vy: number;
}

const stringColors = [
  "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6"
];

const fingerColors: { [key: number]: string } = {
  1: "#3498db", 2: "#2ecc71", 3: "#f39c12", 4: "#9b59b6"
};

type EffectType = "clean" | "distortion" | "reverb";

export default function GameCanvas({ song, onScoreUpdate, onGameComplete, onScoreSaved }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    combo: 0,
    accuracy: 100,
    isPlaying: false,
    hitNotes: 0,
    totalNotes: 0
  });
  const [lastHitFeedback, setLastHitFeedback] = useState<{ note: string; isHit: boolean; accuracy: number; fret?: number } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [backingTrackVolume, setBackingTrackVolume] = useState(0.7);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldPlayBackingTrack, setShouldPlayBackingTrack] = useState(false);
  const [savedTime, setSavedTime] = useState(0);
  const [isGameReady, setIsGameReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // Микрофон и эффекты
  const [isMicConnected, setIsMicConnected] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringVolume, setMonitoringVolume] = useState(0.7);
  const [currentEffect, setCurrentEffect] = useState<EffectType>(song.effect || 'clean');
  const [debugNote, setDebugNote] = useState('');
  const [debugInfo, setDebugInfo] = useState('Ожидание');
  const detectorRef = useRef<PitchDetector | null>(null);

  // Сохранение рекорда
  const saveScoreToServer = async (result: GameResult) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Пользователь не авторизован, рекорд не сохранён');
      return;
    }

    try {
      const res = await fetch('/api/user/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          songId: song.id,
          score: result.score,
          accuracy: result.accuracy,
          maxCombo: result.maxCombo
        })
      });

      const data = await res.json();
      if (data.isNewRecord) {
        setShowNewRecord(true);
        setTimeout(() => setShowNewRecord(false), 3000);
        onScoreSaved?.(true);
      }
    } catch (error) {
      console.error('Ошибка сохранения рекорда:', error);
    }
  };

  // Создание конфетти
  const createConfetti = () => {
    const newConfetti: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        x: Math.random() * 1000,
        y: -20 - Math.random() * 100,
        life: 1,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 3,
      });
    }
    setConfetti(newConfetti);
    
    const animateConfetti = setInterval(() => {
      setConfetti(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.01
        })).filter(p => p.life > 0);
        
        if (updated.length === 0) {
          clearInterval(animateConfetti);
        }
        return updated;
      });
    }, 16);
  };

  // Проверка завершения игры
  useEffect(() => {
    if (engineRef.current && gameState.isPlaying && isGameReady) {
      const checkCompletion = setInterval(() => {
        const currentTime = engineRef.current?.getCurrentTime() || 0;
        const totalDuration = song.duration;
        const currentHitNotes = engineRef.current?.state.hitNotes || 0;
        
        if (currentTime >= totalDuration - 0.5 || currentHitNotes >= gameState.totalNotes) {
          const result = {
            score: gameState.score,
            maxCombo: gameState.combo,
            accuracy: gameState.accuracy,
            hitNotes: gameState.hitNotes,
            totalNotes: gameState.totalNotes
          };
          setGameResult(result);
          setShowCompleteScreen(true);
          createConfetti();
          onGameComplete?.(result);
          saveScoreToServer(result);
          
          engineRef.current?.stop();
          setShouldPlayBackingTrack(false);
          setIsGameReady(false);
          setGameState(prev => ({ ...prev, isPlaying: false }));
        }
      }, 500);
      
      return () => clearInterval(checkCompletion);
    }
  }, [gameState.isPlaying, isGameReady, song.duration, gameState.score, gameState.combo, gameState.accuracy, gameState.hitNotes, gameState.totalNotes, onGameComplete, onScoreSaved]);

  // Инициализация микрофона
  useEffect(() => {
    const initMic = async () => {
      const detector = new PitchDetector();
      const success = await detector.init();
      if (success) {
        detectorRef.current = detector;
        setIsMicConnected(true);
        setDebugInfo('Микрофон готов');
        if (song.effect) {
          detector.applyEffect(song.effect);
          setCurrentEffect(song.effect as EffectType);
        }
      } else {
        setIsMicConnected(false);
        setDebugInfo('Микрофон не доступен');
      }
    };
    initMic();
    
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stopDetection();
        detectorRef.current.cleanup();
      }
    };
  }, [song.effect]);

  // Автоматическое распознавание
  useEffect(() => {
    if (!detectorRef.current || !isMicConnected) return;
    
    if (gameState.isPlaying && isGameReady) {
      detectorRef.current.startDetection((pitch, noteName) => {
        if (pitch > 0 && noteName && engineRef.current) {
          setDebugNote(`${noteName} (${pitch.toFixed(0)} Гц)`);
          engineRef.current.addPlayedNote(pitch);
        } else {
          setDebugNote('—');
        }
      });
      setDebugInfo('🎤 Слушаю гитару...');
    } else {
      detectorRef.current.stopDetection();
      setDebugNote('');
      setDebugInfo(gameState.isPlaying ? 'Ожидание старта' : 'Игра не активна');
    }
  }, [gameState.isPlaying, isGameReady, isMicConnected]);

  const startWithCountdown = () => {
    if (engineRef.current?.state.isPlaying) {
      engineRef.current?.stop();
    }
    
    setShowCompleteScreen(false);
    setGameResult(null);
    setConfetti([]);
    setIsStarting(true);
    setCountdown(3);
    setIsCountdownActive(true);
    setIsPaused(false);
    setShouldPlayBackingTrack(false);
    setIsGameReady(false);
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          setIsCountdownActive(false);
          setCountdown(null);
          
          if (savedTime > 0) {
            engineRef.current?.setCurrentTime(savedTime);
          }
          
          engineRef.current?.start();
          setShouldPlayBackingTrack(true);
          setIsGameReady(true);
          setIsStarting(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resumeFromPause = () => {
    if (isPaused) {
      startWithCountdown();
    }
  };

  const pauseGame = () => {
    if (engineRef.current?.state.isPlaying) {
      const currentTime = engineRef.current.getCurrentTime();
      setSavedTime(currentTime);
      engineRef.current?.pause();
      setIsPaused(true);
      setShouldPlayBackingTrack(false);
      setIsGameReady(false);
    }
  };

  const resetGame = () => {
    engineRef.current?.reset();
    setCountdown(null);
    setIsCountdownActive(false);
    setIsPaused(false);
    setShouldPlayBackingTrack(false);
    setIsGameReady(false);
    setIsStarting(false);
    setSavedTime(0);
    setShowCompleteScreen(false);
    setGameResult(null);
    setConfetti([]);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  const toggleMonitoring = () => {
    if (!detectorRef.current) return;
    
    if (isMonitoring) {
      detectorRef.current.disableMonitoring();
      setIsMonitoring(false);
    } else {
      detectorRef.current.enableMonitoring(monitoringVolume);
      setIsMonitoring(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setMonitoringVolume(newVolume);
    if (detectorRef.current && isMonitoring) {
      detectorRef.current.setMonitoringVolume(newVolume);
    }
  };

  const changeEffect = (effect: EffectType) => {
    if (!detectorRef.current) return;
    detectorRef.current.applyEffect(effect);
    setCurrentEffect(effect);
  };

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const engine = new GameEngine();
    engine.loadSong(song);
    
    engine.onStateUpdate((state) => {
      setGameState({
        score: state.score,
        combo: state.combo,
        accuracy: state.accuracy,
        isPlaying: state.isPlaying,
        hitNotes: state.hitNotes,
        totalNotes: state.totalNotes
      });
      onScoreUpdate?.(state.score);
    });
    
    engine.onNoteHit((note, accuracy) => {
      setLastHitFeedback({ 
        note: note.chord || `Струна ${note.string + 1}`, 
        isHit: true,
        accuracy: accuracy,
        fret: note.fret
      });
      setTimeout(() => setLastHitFeedback(null), 500);
      
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          x: Math.random() * 1000,
          y: 470 + Math.random() * 40,
          life: 1,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.life > 0.5));
      }, 500);
    });
    
    engine.onNoteMiss((note) => {
      setLastHitFeedback({ 
        note: note.chord || `Струна ${note.string + 1}`, 
        isHit: false,
        accuracy: 0
      });
      setTimeout(() => setLastHitFeedback(null), 300);
    });
    
    engineRef.current = engine;
    
    return () => {
      engine.stop();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [song, onScoreUpdate]);

  // Анимация частиц
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animateParticles = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02
      })).filter(p => p.life > 0));
    }, 50);
    
    return () => clearInterval(animateParticles);
  }, [particles]);

  // Отрисовка канваса
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!canvas || !ctx || !engineRef.current) return;
    
    const draw = () => {
      const engine = engineRef.current;
      if (!engine) return;
      
      const width = canvas.width;
      const height = canvas.height;
      const currentTimeVal = engine.getCurrentTime();
      const activeNotes = engine.getActiveNotes();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0a0a2e");
      gradient.addColorStop(0.3, "#1a0a2e");
      gradient.addColorStop(0.6, "#0a0a2e");
      gradient.addColorStop(1, "#050510");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      for (let i = 0; i < 30; i++) {
        const time = Date.now() / 1000;
        const x = (i * 137) % width;
        const y = (time * 20 + i * 43) % height;
        ctx.fillStyle = `rgba(231, 76, 60, ${0.03 + Math.sin(time + i) * 0.02})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const glowGradient = ctx.createLinearGradient(0, 0, width, 0);
      glowGradient.addColorStop(0, "rgba(231, 76, 60, 0.05)");
      glowGradient.addColorStop(0.5, "rgba(231, 76, 60, 0)");
      glowGradient.addColorStop(1, "rgba(231, 76, 60, 0.05)");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
      
      const stringWidth = width / 6;
      for (let i = 0; i < 6; i++) {
        const x = i * stringWidth + stringWidth / 2;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = stringColors[i];
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = stringColors[i];
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Orbitron', monospace";
        ctx.fillText(["E", "A", "D", "G", "B", "E"][i], x - 8, 35);
        ctx.fillStyle = "#666";
        ctx.font = "10px monospace";
        ctx.fillText(`${i + 1}`, x - 4, 55);
        
        const keys = ["A", "S", "D", "F", "J", "K"];
        ctx.fillStyle = "#444";
        ctx.font = "bold 12px monospace";
        ctx.fillText(keys[i], x - 6, height - 25);
      }
      
      if (!isCountdownActive && !isPaused && isGameReady && !showCompleteScreen) {
        activeNotes.forEach(note => {
          const timeToHit = note.time - currentTimeVal;
          const y = height - 80 - (timeToHit * 350);
          const x = note.string * stringWidth + stringWidth / 2;
          const radius = 24;
          
          if (y < -radius || y > height + radius) return;
          
          const gradientNote = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
          if (note.chord) {
            gradientNote.addColorStop(0, "#ff00aa");
            gradientNote.addColorStop(1, "#aa00ff");
          } else {
            gradientNote.addColorStop(0, stringColors[note.string]);
            gradientNote.addColorStop(1, `${stringColors[note.string]}cc`);
          }
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = gradientNote;
          ctx.fill();
          
          ctx.shadowBlur = 15;
          ctx.shadowColor = stringColors[note.string];
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
          
          ctx.fillStyle = "#fff";
          ctx.font = "bold 20px monospace";
          
          if (note.chord) {
            ctx.fillText(note.chord, x - 12, y + 8);
          } else if (note.fret !== undefined && note.fret !== null) {
            if (note.fret === 0) {
              ctx.fillText("○", x - 6, y + 8);
            } else {
              ctx.fillText(note.fret.toString(), x - 8, y + 8);
            }
            if (note.finger && note.fret > 0) {
              ctx.fillStyle = fingerColors[note.finger];
              ctx.font = "bold 12px monospace";
              ctx.fillText(note.finger.toString(), x + 12, y - 8);
              ctx.beginPath();
              ctx.arc(x + 16, y - 12, 8, 0, Math.PI * 2);
              ctx.fillStyle = `${fingerColors[note.finger]}40`;
              ctx.fill();
            }
          } else {
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px monospace";
            ctx.fillText("●", x - 4, y + 8);
          }
        });
      }
      
      const hitY = height - 80;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(0, hitY);
      ctx.lineTo(width, hitY);
      ctx.strokeStyle = "#e74c3c";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "rgba(231, 76, 60, 0.2)";
      ctx.fillRect(0, hitY - 25, width, 50);
      ctx.shadowBlur = 0;
      
      if (isCountdownActive && countdown !== null) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 120px 'Orbitron', monospace";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#e74c3c";
        const text = countdown.toString();
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, width / 2 - textWidth / 2, height / 2 + 40);
        ctx.font = "bold 28px 'Orbitron', monospace";
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("GET READY!", width / 2 - 100, height / 2 - 60);
        ctx.shadowBlur = 0;
      }
      
      if (isPaused && !isCountdownActive) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 48px 'Orbitron', monospace";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#e74c3c";
        ctx.fillText("⏸ ПАУЗА", width / 2 - 100, height / 2);
        ctx.font = "bold 20px 'Orbitron', monospace";
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("Нажмите ПРОДОЛЖИТЬ", width / 2 - 140, height / 2 + 80);
        ctx.shadowBlur = 0;
      }
      
      if (lastHitFeedback && !isCountdownActive && !isPaused && isGameReady && !showCompleteScreen) {
        if (lastHitFeedback.isHit) {
          ctx.fillStyle = "#2ecc71";
          ctx.font = "bold 32px 'Orbitron', monospace";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#2ecc71";
          ctx.fillText(
            lastHitFeedback.accuracy > 95 ? "PERFECT!" : "HIT!",
            width / 2 - 70,
            height / 2 - 50
          );
          ctx.fillStyle = "#f1c40f";
          ctx.font = "bold 24px monospace";
          const points = Math.floor(100 + lastHitFeedback.accuracy + gameState.combo * 10);
          ctx.fillText(`+${points}`, width / 2 - 40, height / 2);
        } else {
          ctx.fillStyle = "#e74c3c";
          ctx.font = "bold 32px 'Orbitron', monospace";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#e74c3c";
          ctx.fillText("MISS!", width / 2 - 50, height / 2 - 50);
        }
        ctx.shadowBlur = 0;
      }
      
      particles.forEach(p => {
        ctx.fillStyle = `rgba(231, 76, 60, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      confetti.forEach(c => {
        ctx.fillStyle = `rgba(255, 200, 100, ${c.life})`;
        ctx.beginPath();
        ctx.rect(c.x, c.y, 6, 6);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [lastHitFeedback, gameState.isPlaying, particles, isCountdownActive, countdown, isPaused, isGameReady, showCompleteScreen, confetti, gameState.combo]);

  const getRating = (accuracy: number) => {
    if (accuracy >= 95) return { name: "PERFECT!", icon: "🏆", color: "text-yellow-400" };
    if (accuracy >= 80) return { name: "GREAT!", icon: "⭐", color: "text-blue-400" };
    if (accuracy >= 70) return { name: "GOOD!", icon: "👍", color: "text-green-400" };
    return { name: "NICE TRY!", icon: "🎸", color: "text-gray-400" };
  };

  if (showCompleteScreen && gameResult) {
    const rating = getRating(gameResult.accuracy);
    const starsCount = Math.floor(gameResult.accuracy / 20);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in-up">
        <div className="relative max-w-2xl w-full mx-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-yellow-500 to-primary animate-gradient" />
            
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mb-4">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Поздравляем!</h2>
                <p className="text-gray-400">Вы успешно завершили песню</p>
              </div>
              
              <div className="mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <h3 className="text-xl font-bold text-white">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
              
              <div className="mb-6">
                <div className={`text-4xl font-bold ${rating.color} mb-2`}>
                  {rating.icon} {rating.name}
                </div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < starsCount ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">🎵</div>
                  <div className="text-xl font-bold text-white">{gameResult.score}</div>
                  <div className="text-xs text-gray-500">ОЧКИ</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-xl font-bold text-white">{gameResult.maxCombo}</div>
                  <div className="text-xs text-gray-500">МАКС. КОМБО</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xl font-bold text-white">{Math.floor(gameResult.accuracy)}%</div>
                  <div className="text-xs text-gray-500">ТОЧНОСТЬ</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">🎸</div>
                  <div className="text-xl font-bold text-white">{gameResult.hitNotes}/{gameResult.totalNotes}</div>
                  <div className="text-xs text-gray-500">ПОПАДАНИЯ</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    resetGame();
                    startWithCountdown();
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  ИГРАТЬ СНОВА
                </button>
                <Link
                  href="/game"
                  onClick={() => resetGame()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  <Home className="w-4 h-4" />
                  ВЫБОР ПЕСЕН
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fingerLegend = [
    { finger: 1, color: "#3498db", name: "указательный" },
    { finger: 2, color: "#2ecc71", name: "средний" },
    { finger: 3, color: "#f39c12", name: "безымянный" },
    { finger: 4, color: "#9b59b6", name: "мизинец" }
  ];

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-red-500/30">
      {/* Уведомление о новом рекорде */}
      {showNewRecord && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-full shadow-2xl">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Новый рекорд! 🏆</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} width={1000} height={550} className="w-full" style={{ background: "#0a0a2e" }} />
      
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 p-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-xs text-gray-500 tracking-wider">СЧЁТ</div>
            <div className="text-3xl font-bold text-red-500 font-mono">{gameState.score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 tracking-wider">КОМБО</div>
            <div className={`text-3xl font-bold font-mono ${gameState.combo > 0 ? 'text-yellow-500 animate-pulse' : 'text-gray-500'}`}>
              {gameState.combo > 0 ? gameState.combo : 'x'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 tracking-wider">ТОЧНОСТЬ</div>
            <div className="text-3xl font-bold text-green-500 font-mono">{Math.floor(gameState.accuracy)}%</div>
          </div>
          <div className="text-center hidden md:block">
            <div className="text-xs text-gray-500 tracking-wider">ПРОГРЕСС</div>
            <div className="text-lg font-bold text-white">
              {gameState.hitNotes}/{gameState.totalNotes}
            </div>
          </div>
        </div>
        
        <div className="hidden md:block w-64">
          <div className="text-xs text-gray-500 mb-1">ТОЧНОСТЬ</div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300" style={{ width: `${gameState.accuracy}%` }}></div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {!gameState.isPlaying && !isPaused && !isCountdownActive && !isStarting && !showCompleteScreen && (
            <button onClick={startWithCountdown} className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg">
              ▶ СТАРТ
            </button>
          )}
          {gameState.isPlaying && !showCompleteScreen && (
            <button onClick={pauseGame} className="px-5 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg font-bold hover:from-yellow-700 hover:to-yellow-800 transition shadow-lg">
              ⏸ ПАУЗА
            </button>
          )}
          {isPaused && (
            <button onClick={resumeFromPause} className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg">
              ▶ ПРОДОЛЖИТЬ
            </button>
          )}
          <button onClick={resetGame} className="px-5 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition">
            ↺ СБРОС
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900/90 p-3 flex justify-center gap-6 border-t border-red-500/20">
        {fingerLegend.map(f => (
          <div key={f.finger} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full" style={{ background: f.color }}></div>
            <span className="text-xs text-gray-400">{f.finger} — {f.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-400">○ — открытая струна</span>
        </div>
      </div>
      
      {/* Мониторинг и эффекты */}
      <div className="p-3 bg-gray-800/50 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">🎸 МОНИТОРИНГ И ЭФФЕКТЫ</span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMonitoring}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                isMonitoring ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              {isMonitoring ? "🔊 ВКЛ" : "🔇 ВЫКЛ"}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Громкость</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={monitoringVolume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeEffect('clean')}
            className={`px-3 py-1 rounded-lg text-xs transition ${
              currentEffect === 'clean' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            🎸 Clean
          </button>
          <button
            onClick={() => changeEffect('distortion')}
            className={`px-3 py-1 rounded-lg text-xs transition ${
              currentEffect === 'distortion' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            🔥 Дисторшн
          </button>
          <button
            onClick={() => changeEffect('reverb')}
            className={`px-3 py-1 rounded-lg text-xs transition ${
              currentEffect === 'reverb' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            🌊 Реверберация
          </button>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            🎵 Распознаётся: <span className="text-green-400">{debugNote || '—'}</span>
          </div>
          <div className="text-xs text-gray-500">
            {debugInfo}
          </div>
        </div>
      </div>
      
      {song.backingTrack && (
        <div className="p-3 bg-gray-800/50 border-t border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">🎵 МИНУСОВКА</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Громкость</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={backingTrackVolume}
                onChange={(e) => setBackingTrackVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          <BackingTrackPlayer 
            url={song.backingTrack} 
            isPlaying={shouldPlayBackingTrack} 
            volume={backingTrackVolume}
            startTime={song.startOffset || 0}
          />
        </div>
      )}
      
      <div className="bg-gray-950 p-3 text-center text-xs text-gray-500 border-t border-red-500/20">
        {isMicConnected ? "🎸 МИКРОФОН ГОТОВ • ИГРАЙТЕ НА ГИТАРЕ" : "⚠️ ПОДКЛЮЧИТЕ МИКРОФОН ДЛЯ РАСПОЗНАВАНИЯ ЗВУКА"}
      </div>
    </div>
  );
}