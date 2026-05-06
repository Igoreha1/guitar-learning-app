"use client";

import Link from 'next/link';
import { 
  Heart, 
  Send,
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Music,
  Guitar,
  BookOpen,
  Gamepad2,
  Mic,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-dark/80 to-dark border-t border-gray-800 mt-auto">
      {/* Анимированная верхняя граница */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        {/* Основная сетка */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* О проекте */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Guitar className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">
                  <span className="text-primary">Guitar</span>
                  <span className="text-white">Sync</span>
                </span>
                <p className="text-xs text-gray-500">играй свободно</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Бесплатный самоучитель игры на гитаре. Разборы песен, уроки для начинающих, 
              метроном и другие полезные инструменты для гитаристов любого уровня.
            </p>
          </div>

          {/* Рубрики */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Рубрики
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/songs" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Разборы песен
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Уроки для начинающих
                </Link>
              </li>
              <li>
                <Link href="/chords" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Аккорды
                </Link>
              </li>
              <li>
                <Link href="/game" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Игра-тренажёр
                </Link>
              </li>
            </ul>
          </div>

          {/* Инструменты */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Инструменты
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/metronome" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Метроном онлайн
                </Link>
              </li>
              <li>
                <Link href="/tuner" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Тюнер
                </Link>
              </li>
              <li>
                <Link href="/chords" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Аккорды для песен
                </Link>
              </li>
              <li>
                <Link href="/game" className="text-gray-400 hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Ритм-игра
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты и подписка */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Контакты
            </h4>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@guitarsync.ru</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Москва, Россия</span>
              </li>
            </ul>
            
            {/* Подписка на новости */}
            <div className="mt-4">
              <h5 className="text-xs font-semibold text-gray-500 mb-2">Подпишись на новости</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-3 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-gray-800 pt-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} GuitarSync. Все права защищены.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-primary text-xs transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-primary text-xs transition-colors">
                Пользовательское соглашение
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-primary text-xs transition-colors">
                О проекте
              </Link>
            </div>
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Сделано с <Heart className="w-3 h-3 text-red-500 animate-pulse" /> для гитаристов
            </p>
          </div>
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-primary rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 hover:scale-110 animate-fade-in-up"
          aria-label="Наверх"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </footer>
  );
}