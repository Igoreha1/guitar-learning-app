"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, User, Eye, EyeOff, Guitar, Sparkles, ChevronRight, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

// Функция проверки сложности пароля
const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  return score;
};

const getStrengthInfo = (score: number) => {
  const levels = [
    { text: 'Очень слабый', color: 'bg-red-500', textColor: 'text-red-400' },
    { text: 'Слабый', color: 'bg-orange-500', textColor: 'text-orange-400' },
    { text: 'Средний', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { text: 'Хороший', color: 'bg-blue-500', textColor: 'text-blue-400' },
    { text: 'Отличный', color: 'bg-green-500', textColor: 'text-green-400' },
    { text: 'Идеальный', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  ];
  return levels[Math.min(score, 5)];
};

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'resetCode' | 'resetPassword'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const newPasswordStrength = getPasswordStrength(newPassword);
  const newStrengthInfo = getStrengthInfo(newPasswordStrength);

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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMode('login');
      setVerificationCode('');
      setError('');
      setSuccessMessage('');
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setMode('login');
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setVerificationCode('');
      setError('');
      setSuccessMessage('');
      setResendTimer(0);
    }, 300);
  };

  const handleGuestContinue = () => {
    handleClose();
    router.push('/lessons');
  };

  // Отправка кода (для регистрации)
  const sendVerificationCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, type: 'register' }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Код подтверждения отправлен на ваш email');
        setMode('resetCode');
        setResendTimer(60);
      } else {
        setError(data.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Отправка кода для восстановления пароля
  const sendResetCode = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: '', type: 'reset' }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Код для сброса пароля отправлен на ваш email');
        setMode('resetCode');
        setResendTimer(60);
      } else {
        setError(data.error || 'Ошибка отправки кода');
      }
    } catch (err) {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Проверка кода и переход к смене пароля
  const verifyCode = () => {
    if (verificationCode.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }
    setMode('resetPassword');
    setError('');
  };

  // Сброс пароля
  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPasswordStrength < 3) {
      setError('Пароль недостаточно сложный. Используйте заглавные и строчные буквы, цифры и спецсимволы.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Пароль успешно изменён! Теперь вы можете войти.');
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setVerificationCode('');
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.error || 'Ошибка сброса пароля');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  // Регистрация (после подтверждения кода)
  const verifyAndRegister = async () => {
    if (verificationCode.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, verificationCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Регистрация успешна! Вход...');
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        onLogin(data.user);
        onClose();
        router.push('/lessons');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  // Вход в аккаунт
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        onLogin(data.user);
        onClose();
        router.push('/lessons');
      } else {
        setError(data.error || 'Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  // Регистрация (первый шаг - отправка кода)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    if (!name || name.length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordStrength < 3) {
      setError('Пароль недостаточно сложный. Используйте заглавные и строчные буквы, цифры и спецсимволы.');
      return;
    }

    await sendVerificationCode();
  };

  // Забыли пароль - отправка кода
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetCode();
  };

  // Стили в зависимости от темы
  const styles = {
    modalBg: isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    inputBg: isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900',
    inputPlaceholder: isDark ? 'placeholder-gray-500' : 'placeholder-gray-400',
    closeBtn: isDark ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200',
    divider: isDark ? 'border-gray-700' : 'border-gray-200',
  };

  if (!isOpen) return null;

  // ========== ЭКРАН РЕГИСТРАЦИИ ==========
  if (mode === 'register') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={handleClose} className={`absolute top-4 right-4 z-20 p-1.5 rounded-full ${styles.closeBtn} transition-all duration-200`} type="button">
            <X size={18} />
          </button>
          <div className="relative z-10 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
                <Guitar className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-1`}>Создать аккаунт</h2>
              <p className={`${styles.textSecondary} text-sm`}>Начните своё музыкальное путешествие</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="Ваше имя" required />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-10 pr-12 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="Придумайте пароль" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={styles.textMuted}>Сложность пароля:</span>
                      <span className={getStrengthInfo(passwordStrength).textColor}>{getStrengthInfo(passwordStrength).text}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getStrengthInfo(passwordStrength).color} transition-all duration-300`} style={{ width: `${(passwordStrength / 6) * 100}%` }} />
                    </div>
                    <ul className={`text-xs ${styles.textMuted} mt-2 space-y-1`}>
                      <li className={password.length >= 8 ? 'text-green-400' : ''}>{password.length >= 8 ? '✓' : '○'} Минимум 8 символов</li>
                      <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>{/[A-Z]/.test(password) ? '✓' : '○'} Заглавная буква (A-Z)</li>
                      <li className={/[a-z]/.test(password) ? 'text-green-400' : ''}>{/[a-z]/.test(password) ? '✓' : '○'} Строчная буква (a-z)</li>
                      <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>{/[0-9]/.test(password) ? '✓' : '○'} Цифра (0-9)</li>
                      <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? 'text-green-400' : ''}>{/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '✓' : '○'} Спецсимвол</li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Подтверждение пароля</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full pl-10 pr-12 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="Повторите пароль" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Продолжить'}</button>
              <div className="text-center">
                <button type="button" onClick={() => setMode('login')} className={`text-sm ${styles.textMuted} hover:text-red-500`}>Уже есть аккаунт? Войти</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== ЭКРАН ВХОДА ==========
  if (mode === 'login') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={handleClose} className={`absolute top-4 right-4 z-20 p-1.5 rounded-full ${styles.closeBtn} transition-all duration-200`} type="button">
            <X size={18} />
          </button>
          <div className="relative z-10 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
                <Guitar className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-1`}>Добро пожаловать</h2>
              <p className={`${styles.textSecondary} text-sm`}>Войдите в свой аккаунт</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-10 pr-12 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-500" /><span className={`text-xs ${styles.textMuted}`}>Запомнить меня</span></label>
                <button type="button" onClick={() => { setMode('forgot'); setEmail(''); setError(''); }} className={`text-xs ${styles.textMuted} hover:text-red-500 transition-colors`}>Забыли пароль?</button>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Войти'}</button>
              <div className="text-center space-y-2">
                <button type="button" onClick={() => setMode('register')} className={`text-sm ${styles.textMuted} hover:text-red-500`}>Нет аккаунта? Зарегистрироваться</button>
                <div><button onClick={handleGuestContinue} className={`text-xs ${styles.textMuted} hover:text-gray-400`}>Продолжить без регистрации</button></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== ЗАБЫЛИ ПАРОЛЬ (ВВОД EMAIL) ==========
  if (mode === 'forgot') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={handleClose} className={`absolute top-4 right-4 z-20 p-1.5 rounded-full ${styles.closeBtn} transition-all duration-200`} type="button">
            <X size={18} />
          </button>
          <div className="relative z-10 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-1`}>Восстановление пароля</h2>
              <p className={`${styles.textSecondary} text-sm`}>Введите email для сброса пароля</p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="your@email.com" required />
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
              {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3"><p className="text-green-400 text-sm text-center">{successMessage}</p></div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Отправить код'}</button>
              <button type="button" onClick={() => setMode('login')} className={`w-full py-2 text-sm ${styles.textMuted} hover:text-white transition-colors flex items-center justify-center gap-1`}><ArrowLeft className="w-4 h-4" />Вернуться ко входу</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ========== ВВОД КОДА (для регистрации И для восстановления) ==========
  if (mode === 'resetCode') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={handleClose} className={`absolute top-4 right-4 z-20 p-1.5 rounded-full ${styles.closeBtn} transition-all duration-200`} type="button">
            <X size={18} />
          </button>
          <div className="relative z-10 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-1`}>Подтверждение</h2>
              <p className={`${styles.textSecondary} text-sm`}>Введите код, отправленный на {email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full px-4 py-3 ${styles.inputBg} rounded-xl text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-red-500`}
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
              {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3"><p className="text-green-400 text-sm text-center">{successMessage}</p></div>}
              <button onClick={verifyCode} disabled={verificationCode.length !== 6} className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold disabled:opacity-50">Продолжить</button>
              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className={`${styles.textMuted} text-sm`}>Повторная отправка через {resendTimer} сек</span>
                ) : (
                  <button onClick={sendResetCode} className="text-red-500 text-sm hover:text-red-400">Отправить код повторно</button>
                )}
              </div>
              <button onClick={() => setMode('login')} className={`w-full py-2 ${isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} rounded-xl text-sm`}>← Вернуться назад</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== УСТАНОВКА НОВОГО ПАРОЛЯ ==========
  if (mode === 'resetPassword') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <button onClick={handleClose} className={`absolute top-4 right-4 z-20 p-1.5 rounded-full ${styles.closeBtn} transition-all duration-200`} type="button">
            <X size={18} />
          </button>
          <div className="relative z-10 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30 mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-1`}>Новый пароль</h2>
              <p className={`${styles.textSecondary} text-sm`}>Придумайте новый пароль для аккаунта</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Новый пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full pl-10 pr-12 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="Новый пароль" required />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={styles.textMuted}>Сложность пароля:</span>
                      <span className={newStrengthInfo.textColor}>{newStrengthInfo.text}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${newStrengthInfo.color} transition-all duration-300`} style={{ width: `${(newPasswordStrength / 6) * 100}%` }} />
                    </div>
                    <ul className={`text-xs ${styles.textMuted} mt-2 space-y-1`}>
                      <li className={newPassword.length >= 8 ? 'text-green-400' : ''}>{newPassword.length >= 8 ? '✓' : '○'} Минимум 8 символов</li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-400' : ''}>{/[A-Z]/.test(newPassword) ? '✓' : '○'} Заглавная буква (A-Z)</li>
                      <li className={/[a-z]/.test(newPassword) ? 'text-green-400' : ''}>{/[a-z]/.test(newPassword) ? '✓' : '○'} Строчная буква (a-z)</li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-green-400' : ''}>{/[0-9]/.test(newPassword) ? '✓' : '○'} Цифра (0-9)</li>
                      <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? 'text-green-400' : ''}>{/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? '✓' : '○'} Спецсимвол</li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-1.5`}>Подтверждение пароля</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showConfirmNewPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={`w-full pl-10 pr-12 py-2.5 ${styles.inputBg} rounded-xl ${styles.inputPlaceholder} focus:outline-none focus:border-red-500`} placeholder="Подтвердите пароль" required />
                  <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-red-400 text-xs mt-1">Пароли не совпадают</p>
                )}
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"><p className="text-red-400 text-sm text-center">{error}</p></div>}
              {successMessage && <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3"><p className="text-green-400 text-sm text-center">{successMessage}</p></div>}
              <button onClick={resetPassword} disabled={loading} className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Сменить пароль'}</button>
              <button onClick={() => setMode('login')} className={`w-full py-2 text-sm ${styles.textMuted} hover:text-white transition-colors flex items-center justify-center gap-1`}><ArrowLeft className="w-4 h-4" />Вернуться ко входу</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}