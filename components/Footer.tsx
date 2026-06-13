"use client";

import Link from 'next/link';
import { 
  Heart, 
  Send,
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  BookOpen,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Guitar
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      setSubscribeMessage('Введите корректный email');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
      return;
    }

    setLoading(true);
    setSubscribeStatus('idle');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      const data = await res.json();

      if (res.ok) {
        setSubscribeStatus('success');
        setSubscribeMessage(data.message || 'Подписка оформлена! Проверьте ваш email.');
        setEmail('');
        setName('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Ошибка при подписке');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    }
  };

  return (
    <footer className="relative bg-footer border-t border-border-color mt-auto">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* О проекте */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Guitar className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">
                  <span className="text-primary">Гитар</span>
                  <span className="text-text-primary">Синхро</span>
                </span>
                <p className="text-xs text-text-secondary">играй свободно</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Бесплатный самоучитель игры на гитаре. Разборы песен, уроки для начинающих, 
              метроном и другие полезные инструменты для гитаристов любого уровня.
            </p>
          </div>

          {/* Рубрики */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Рубрики
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/songs" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Разборы песен
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Уроки для начинающих
                </Link>
              </li>
              <li>
                <Link href="/chords" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Аккорды
                </Link>
              </li>
              <li>
                <Link href="/game" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Игра-тренажёр
                </Link>
              </li>
            </ul>
          </div>

          {/* Инструменты */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Инструменты
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/metronome" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Метроном онлайн
                </Link>
              </li>
              <li>
                <Link href="/tuner" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Тюнер
                </Link>
              </li>
              <li>
                <Link href="/chords" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Аккорды для песен
                </Link>
              </li>
              <li>
                <Link href="/game" className="text-text-secondary hover:text-primary text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Ритм-игра
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты и подписка */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Контакты
            </h4>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>guitarsync@yandex.ru</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Санкт-Петербург, Россия</span>
              </li>
            </ul>
            
            <div className="mt-4">
              <h5 className="text-xs font-semibold text-text-secondary mb-2">Подпишись на новости</h5>
              
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Ваше имя (необязательно)" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border-color rounded-lg text-text-primary text-sm placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                />
                
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Ваш email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-card border border-border-color rounded-lg text-text-primary text-sm placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-3 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </form>

              {subscribeStatus === 'success' && (
                <div className="mt-2 flex items-center gap-2 text-green-400 text-xs bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle className="w-3 h-3" />
                  <span>{subscribeMessage}</span>
                </div>
              )}

              {subscribeStatus === 'error' && (
                <div className="mt-2 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2 rounded-lg">
                  <AlertCircle className="w-3 h-3" />
                  <span>{subscribeMessage}</span>
                </div>
              )}

              <p className="text-text-secondary text-[10px] mt-2">
                Никакого спама. Только новые песни, аккорды и статьи.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border-color pt-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-xs">
              © {currentYear} ГитарСинхро. Все права защищены.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-text-secondary hover:text-primary text-xs transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-text-secondary hover:text-primary text-xs transition-colors">
                Пользовательское соглашение
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-primary text-xs transition-colors">
                О проекте
              </Link>
            </div>
            <p className="text-text-secondary text-xs flex items-center gap-1">
              Сделано с <Heart className="w-3 h-3 text-primary animate-pulse" /> для гитаристов
            </p>
          </div>
        </div>
      </div>

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