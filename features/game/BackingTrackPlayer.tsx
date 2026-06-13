"use client";

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface BackingTrackPlayerProps {
  url: string;
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  volume?: number;
  startTime?: number;
}

export default function BackingTrackPlayer({ 
  url, 
  isPlaying, 
  onTimeUpdate, 
  volume = 0.7,
  startTime = 0
}: BackingTrackPlayerProps) {
  const playerRef = useRef<Tone.Player | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Правильные референсы для синхронизации
  const playbackPositionRef = useRef<number>(startTime);
  const playbackStartedAtRef = useRef<number>(0);
  const isStartedRef = useRef<boolean>(false);

  // Загрузка плеера
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const player = new Tone.Player({
      url: url,
      autostart: false,
      loop: false,
      onload: () => {
        console.log("✅ Минусовка загружена:", url);
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      },
      onerror: (err) => {
        console.error("❌ Ошибка загрузки минусовки:", err);
        setError("Не удалось загрузить минусовку");
        setIsLoaded(false);
        setIsLoading(false);
      }
    }).toDestination();
    
    playerRef.current = player;
    
    return () => {
      if (playerRef.current) {
        try {
          if (playerRef.current.state === 'started') {
            playerRef.current.stop();
          }
        } catch (e) {}
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [url]);

  // Обновляем позицию при изменении startTime (для паузы/перемотки)
  useEffect(() => {
    playbackPositionRef.current = startTime;
    
    if (playerRef.current && playerRef.current.state === 'started') {
      try {
        playerRef.current.stop();
      } catch {}
      isStartedRef.current = false;
    }
  }, [startTime]);

  // Управление воспроизведением
  useEffect(() => {
    if (!playerRef.current || !isLoaded) return;
    
    const player = playerRef.current;
    
    if (isPlaying) {
      if (!player.buffer || !player.buffer.loaded) {
        console.warn("Буфер ещё не загружен");
        return;
      }
      
      Tone.start().then(() => {
        try {
          // Запоминаем момент старта
          playbackStartedAtRef.current = Tone.now();
          
          console.log(`🎵 Старт минусовки с ${playbackPositionRef.current.toFixed(2)} сек`);
          
          player.start(undefined, playbackPositionRef.current);
          isStartedRef.current = true;
        } catch (err) {
          console.error("❌ Ошибка запуска минусовки:", err);
          setError("Ошибка воспроизведения минусовки");
        }
      }).catch((err) => {
        console.error("❌ Ошибка запуска Tone.js:", err);
      });
    } else {
      if (isStartedRef.current && player.state === 'started') {
        try {
          // Вычисляем, сколько реально прошло времени
          const elapsed = Tone.now() - playbackStartedAtRef.current;
          playbackPositionRef.current += elapsed;
          
          console.log(`⏸ Пауза на ${playbackPositionRef.current.toFixed(2)} сек`);
          
          player.stop();
        } catch (err) {
          console.error("Ошибка при остановке:", err);
        }
        isStartedRef.current = false;
      }
    }
  }, [isPlaying, isLoaded]);

  // Громкость
  useEffect(() => {
    if (playerRef.current) {
      try {
        playerRef.current.volume.value = Tone.gainToDb(volume);
      } catch (err) {
        console.warn("Ошибка установки громкости:", err);
      }
    }
  }, [volume]);

  if (error) {
    return (
      <div className="bg-yellow-900/50 p-2 rounded text-center text-xs text-yellow-400">
        ⚠️ {error}<br/>
        <span className="text-gray-500">Играйте без минусовки</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-2 rounded text-center">
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-green-400">🎵</span>
        <span className="text-gray-400">
          {isLoading ? 'Загрузка минусовки...' : isLoaded ? 'Минусовка готова' : 'Ошибка загрузки'}
        </span>
        {isPlaying && isLoaded && (
          <span className="text-green-400 animate-pulse">▶ ИГРАЕТ</span>
        )}
        {playbackPositionRef.current > 0 && !isPlaying && (
          <span className="text-yellow-400 text-[10px]">
            ⏸ на {playbackPositionRef.current.toFixed(1)}с
          </span>
        )}
      </div>
    </div>
  );
}