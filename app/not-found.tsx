"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, ArrowLeft, Search, Music, Guitar, Sparkles, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [floatingNotes, setFloatingNotes] = useState<Array<{ id: number; x: number; delay: number; duration: number; symbol: string }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Создаём плавающие ноты
    const notesList = ['♪', '♫', '♩', '🎸', '🎵', '🎶', '✨', '🎼'];
    const notes = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      symbol: notesList[Math.floor(Math.random() * notesList.length)]
    }));
    setFloatingNotes(notes);
  }, []);

  // Таймер для автоматического редиректа
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-gray-dark to-darker dark:from-dark dark:via-gray-dark dark:to-darker light:from-gray-50 light:via-gray-100 light:to-gray-200" />
        
        {/* Анимированные лучи */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Плавающие ноты */}
        {floatingNotes.map((note) => (
          <div
            key={note.id}
            className="absolute text-primary/20 text-2xl pointer-events-none animate-float"
            style={{
              left: `${note.x}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${note.delay}s`,
              animationDuration: `${note.duration}s`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          >
            {note.symbol}
          </div>
        ))}
      </div>

      {/* Контент */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Большая 404 цифра */}
          <div className="relative mb-8">
            <div className="text-[120px] md:text-[180px] lg:text-[220px] font-black leading-none select-none">
              <span className="bg-gradient-to-r from-primary via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                4
              </span>
              <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-primary bg-clip-text text-transparent animate-gradient delay-150">
                0
              </span>
              <span className="bg-gradient-to-r from-primary via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient delay-300">
                4
              </span>
            </div>
            
            {/* Декоративная гитара */}
            <div className="absolute -top-10 -right-10 md:-top-20 md:-right-20 opacity-20">
              <Guitar className="w-32 h-32 md:w-48 md:h-48 text-primary" />
            </div>
          </div>

          {/* Иконка */}
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Упс! Страница не найдена</span>
          </div>

          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-text-primary">
            Похоже, вы забрели не туда
          </h1>

          {/* Описание */}
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            Страница, которую вы ищете, не существует или была перемещена.
            Но не расстраивайтесь — у нас есть много интересного!
          </p>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              На главную
            </Link>
            
            <button
              onClick={handleRedirect}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/50 text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Перейти сейчас
            </button>
            
            <Link
              href="/songs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border-color text-text-secondary rounded-xl font-semibold hover:border-primary/50 hover:text-primary transition-all duration-300 group"
            >
              <Music className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Выбрать песню
            </Link>
          </div>

          {/* Таймер редиректа */}
          <div className="mt-8 pt-6 border-t border-border-color">
            <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm px-5 py-3 rounded-full border border-border-color">
              <div className="relative">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/20"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                    strokeDasharray={`${2 * Math.PI * 12}`}
                    strokeDashoffset={`${2 * Math.PI * 12 * (1 - countdown / 15)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
                  {countdown}
                </span>
              </div>
              <span className="text-text-secondary text-sm">
                Автоматический переход через <span className="text-primary font-semibold">{countdown}</span> секунд
              </span>
            </div>
          </div>

          {/* Предложения */}
          <div className="mt-8">
            <p className="text-text-secondary text-sm mb-3">Что можно сделать?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/tuner" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                🎸 Открыть тюнер
              </Link>
              <span className="text-border-color">•</span>
              <Link href="/metronome" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                🎵 Включить метроном
              </Link>
              <span className="text-border-color">•</span>
              <Link href="/chords" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                🎼 Изучить аккорды
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Стили для анимаций */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}