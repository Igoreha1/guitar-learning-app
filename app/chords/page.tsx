"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home, Guitar } from "lucide-react";
import ChordGenerator from "@/features/chords/ChordGenerator";

export default function ChordGeneratorPage() {
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Хлебные крошки */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Аккорды</span>
        </div>
      </div>

      {/* Основной контент */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <ChordGenerator />
        </div>
      </section>
    </div>
  );
}