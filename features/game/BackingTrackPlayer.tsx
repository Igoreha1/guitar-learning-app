"use client";

import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface BackingTrackPlayerProps {
  url: string;
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  volume?: number;
}

export default function BackingTrackPlayer({ 
  url, 
  isPlaying, 
  onTimeUpdate, 
  volume = 0.7
}: BackingTrackPlayerProps) {
  const playerRef = useRef<Tone.Player | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedPositionRef = useRef<number>(0);
  const isStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const player = new Tone.Player({
      url: url,
      autostart: false,
      loop: false,
      onload: () => {
        console.log("✅ Минусовка загружена");
        setIsLoaded(true);
        setError(null);
      },
      onerror: (err) => {
        console.error("❌ Ошибка загрузки минусовки:", err);
        setError("Не удалось загрузить минусовку");
      }
    }).toDestination();
    
    playerRef.current = player;
    
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.stop();
        } catch (e) {}
        playerRef.current.dispose();
      }
    };
  }, [url]);

  // Запуск/остановка с сохранением позиции
  useEffect(() => {
    if (!playerRef.current || !isLoaded) return;
    
    const player = playerRef.current;
    
    if (isPlaying) {
      // Запускаем с сохранённой позиции
      Tone.start().then(() => {
        console.log(`🎵 Запуск минусовки с позиции: ${savedPositionRef.current.toFixed(2)} сек`);
        player.start(undefined, savedPositionRef.current);
        isStartedRef.current = true;
      });
    } else {
      // Останавливаем и запоминаем позицию
      if (isStartedRef.current && player.state === 'started') {
        const currentPos = player.now();
        console.log(`⏸ Остановка минусовки на позиции: ${currentPos.toFixed(2)} сек`);
        savedPositionRef.current = currentPos;
        player.stop();
        isStartedRef.current = false;
      } else if (player.state === 'started') {
        const currentPos = player.now();
        savedPositionRef.current = currentPos;
        player.stop();
        isStartedRef.current = false;
      }
    }
  }, [isPlaying, isLoaded]);

  // Громкость
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume.value = Tone.gainToDb(volume);
    }
  }, [volume]);

  // Обновление времени для внешнего использования
  useEffect(() => {
    if (!isPlaying || !onTimeUpdate) return;
    
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.state === 'started') {
        onTimeUpdate(playerRef.current.now());
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, onTimeUpdate]);

  // Сброс позиции (для кнопки сброса)
  const resetPosition = () => {
    savedPositionRef.current = 0;
    if (playerRef.current && playerRef.current.state === 'started') {
      playerRef.current.stop();
      isStartedRef.current = false;
    }
  };

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
          {isLoaded ? 'Минусовка готова' : 'Загрузка минусовки...'}
        </span>
        {isPlaying && isLoaded && (
          <span className="text-green-400 animate-pulse">▶ ИГРАЕТ</span>
        )}
      </div>
    </div>
  );
}