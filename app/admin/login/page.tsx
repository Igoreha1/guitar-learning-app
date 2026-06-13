"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, EyeOff, Lock, Mail, Home, Shield, 
  Sparkles, ChevronRight, Fingerprint, AlertCircle,
  Guitar, Star, Zap, ShieldCheck
} from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.user?.role === 'admin') {
        const cookieRes = await fetch('/api/admin/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: data.token })
        });

        if (cookieRes.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/admin');
        } else {
          setError('Ошибка установки сессии');
        }
      } else {
        setError(data.error || 'Неверный email, пароль или недостаточно прав');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Пульсирующие круги */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Плавающие ноты */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/10 text-2xl pointer-events-none animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              fontSize: `${20 + Math.random() * 30}px`
            }}
          >
            {['♪', '♫', '♩', '🎸', '🎵'][i % 5]}
          </div>
        ))}
      </div>

      {/* Основной контент */}
      <div className={`relative w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Кнопка "На главную" */}
        <Link
          href="/"
          className="absolute -top-14 left-0 flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-all duration-300 group"
        >
          <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">На главную</span>
        </Link>

        {/* Карточка входа */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          
          {/* Декоративная верхняя полоса */}
          <div className="h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient" />

          <div className="p-8">
            {/* Логотип */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mt-4 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Админ панель
              </h1>
              <p className="text-gray-500 text-sm mt-2">Войдите в панель управления</p>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Защита входа */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-gray-500">Защищённый вход</span>
                </div>
              </div>

              {/* Ошибка */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 animate-shake">
                  <div className="flex items-center gap-2 justify-center">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                </div>
              )}

              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Вход...
                    </>
                  ) : (
                    <>
                      Войти в панель
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Информация о безопасности */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Только для администраторов</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Безопасное подключение</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            © 2026 ГитарСинхро • Панель управления
          </p>
        </div>
      </div>
    </div>
  );
}