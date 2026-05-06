"use client";

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Guitar, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, name, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        onLogin(data.user);
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError(data.error || 'Ошибка');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Затемнение с blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Модальное окно */}
      <div className={`relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Декоративные элементы */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
        
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Контент */}
        <div className="relative z-10 p-8">
          {/* Логотип */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg shadow-primary/30 mb-4">
              <Guitar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Войдите в свой аккаунт' : 'Начните своё музыкальное путешествие'}
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    placeholder="Ваше имя"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Дополнительные опции для входа */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-primary transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
            )}

            {/* Ошибка */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 animate-shake">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Преимущества для регистрации */}
          {!isLogin && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Бесплатно</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Доступ ко всем песням</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Без ограничений</span>
                </div>
              </div>
            </div>
          )}

          {/* Переключение между формами */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-gray-400 hover:text-primary transition-all duration-200 flex items-center justify-center gap-1 mx-auto"
            >
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <span className="text-primary font-medium">
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </span>
            </button>
          </div>

          {/* Гостевой вход */}
          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Продолжить без регистрации
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}