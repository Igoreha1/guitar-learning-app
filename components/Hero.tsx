"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Play, Music, Sparkles, ArrowRight } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Hero() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState<Array<{ id: number; x: number; delay: number; duration: number; symbol: string }>>([]);
  const [isDark, setIsDark] = useState(true);

  // Следим за изменением темы
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    const notesList = ['♪', '♫', '♩', '🎸', '🎵', '🎶', '✨'];
    const notes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      symbol: notesList[Math.floor(Math.random() * notesList.length)]
    }));
    setFloatingNotes(notes);
  }, []);

  const handleStartLearning = () => {
    if (isLoggedIn) {
      router.push('/lessons');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    router.push('/lessons');
  };

  return (
    <>
      <section className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden ${isDark ? '' : 'bg-white'}`}>
        {/* Полупрозрачный фон, чтобы был виден шахматный узор */}
        <div className={`absolute inset-0 z-0 ${
          isDark 
            ? 'bg-dark/60' 
            : 'bg-gray-50/60'
        }`} />
        
        {/* Анимированные лучи */}
        <div className="absolute inset-0 opacity-30 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Плавающие ноты */}
        {floatingNotes.map((note) => (
          <div
            key={note.id}
            className="absolute text-primary/20 text-2xl pointer-events-none animate-float z-0"
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

        {/* Содержимое */}
        <div className="relative z-10 container mx-auto px-4 text-center py-12">
          {/* Бейджик */}
          <div className={`inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Бесплатное обучение — навсегда</span>
          </div>

          {/* Заголовок */}
          <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              Играй на гитаре
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
              как профессионал
            </span>
          </h1>

          {/* Подзаголовок */}
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            Более 1000 разборов песен, аккордовые схемы, интерактивные уроки
            и удобный метроном — всё для начинающих гитаристов
          </p>

          {/* Кнопки */}
          <div className={`flex flex-col sm:flex-row gap-5 justify-center mb-20 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <button 
              onClick={handleStartLearning}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Play className="w-5 h-5" />
              Начать учиться
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            
            <Link 
              href="/songs" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary/50 text-primary rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Music className="w-5 h-5" />
              Выбрать песню
            </Link>
          </div>

          {/* Статистика */}
          <div className={`flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-300/30'} transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: "500+", label: "Разборов песен", icon: "🎵" },
              { number: "50+", label: "Уроков", icon: "📚" },
              { number: "10k+", label: "Активных учеников", icon: "👥" },
              { number: "98%", label: "Довольных студентов", icon: "⭐" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                  <span>{stat.icon}</span>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}