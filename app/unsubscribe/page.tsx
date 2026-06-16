'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
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

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Email не указан');
      return;
    }

    const unsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Вы успешно отписались от рассылки');
        } else {
          setStatus('error');
          setMessage(data.error || 'Ошибка при отписке');
        }
      } catch {
        setStatus('error');
        setMessage('Ошибка соединения. Попробуйте позже.');
      }
    };

    unsubscribe();
  }, [email]);

  // Стили в зависимости от темы
  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 to-gray-100',
    cardBg: isDark ? 'bg-gray-800/50' : 'bg-white',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${styles.bgPage}`}>
      <div className={`${styles.cardBg} rounded-2xl p-8 text-center max-w-md shadow-xl`}>
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-2`}>Обработка...</h2>
            <p className={styles.textSecondary}>Пожалуйста, подождите</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-2`}>Отписка успешна</h2>
            <p className={styles.textSecondary}>{message}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Вернуться на главную
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${styles.textPrimary} mb-2`}>Ошибка</h2>
            <p className={styles.textSecondary}>{message}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Вернуться на главную
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
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

  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gradient-to-br from-gray-50 to-gray-100',
    cardBg: isDark ? 'bg-gray-800/50' : 'bg-white',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
  };

  return (
    <Suspense fallback={
      <div className={`min-h-screen flex items-center justify-center ${styles.bgPage}`}>
        <div className={`${styles.cardBg} rounded-2xl p-8 text-center shadow-xl`}>
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className={styles.textSecondary}>Загрузка...</p>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}