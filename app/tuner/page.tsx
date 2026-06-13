"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home, Guitar, CheckCircle, Sparkles } from "lucide-react";
import Tuner from "@/features/tuner/Tuner";

export default function TunerPage() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(true);

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

  const handleTuneComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  const handleMicPermission = (granted: boolean) => {
    setMicPermission(granted);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Хлебные крошки */}
          <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Тюнер</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Guitar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Профессиональный тюнер</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                Настрой свою гитару
              </span>
              <br />
              <span className="text-gradient">за несколько секунд</span>
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto`}>
              Используй микрофон для точной настройки. Просто играй на открытых струнах,
              и тюнер покажет отклонение от идеального звучания.
            </p>
          </div>
        </div>
      </section>

      {/* Основной тюнер */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`${isDark ? 'bg-gradient-to-br from-gray-dark/50 to-dark/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border p-6 md:p-8 backdrop-blur-sm`}>
            <Tuner 
              onTuneComplete={handleTuneComplete} 
              onMicPermission={handleMicPermission}
              isMuted={isMuted}
            />
          </div>
        </div>
      </section>

      {/* Справочная информация о струнах */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`${isDark ? 'bg-gradient-to-br from-gray-dark/30 to-dark/30 border-gray-800' : 'bg-white border-gray-200 shadow-sm'} rounded-2xl border p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 text-center`}>Стандартный строй гитары</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { note: "E", name: "Ми", string: "1-я струна", frequency: "329.63 Hz", color: "from-purple-500" },
                { note: "B", name: "Си", string: "2-я струна", frequency: "246.94 Hz", color: "from-blue-500" },
                { note: "G", name: "Соль", string: "3-я струна", frequency: "196.00 Hz", color: "from-green-500" },
                { note: "D", name: "Ре", string: "4-я струна", frequency: "146.83 Hz", color: "from-yellow-500" },
                { note: "A", name: "Ля", string: "5-я струна", frequency: "110.00 Hz", color: "from-orange-500" },
                { note: "E", name: "Ми", string: "6-я струна", frequency: "82.41 Hz", color: "from-red-500" },
              ].map((string) => (
                <div key={string.note} className={`text-center p-3 ${isDark ? 'bg-gray-dark/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-xl border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`text-2xl font-bold bg-gradient-to-br ${string.color} to-primary bg-clip-text text-transparent`}>
                    {string.note}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{string.name}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{string.string}</div>
                  <div className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'} mt-1`}>{string.frequency}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Поздравление */}
      {showCelebration && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-2xl">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Отлично! Гитара настроена! 🎸</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}