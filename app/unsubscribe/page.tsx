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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="bg-gray-800/50 rounded-2xl p-8 text-center max-w-md">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Обработка...</h2>
            <p className="text-gray-400">Пожалуйста, подождите</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Отписка успешна</h2>
            <p className="text-gray-400">{message}</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">Ошибка</h2>
            <p className="text-gray-400">{message}</p>
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
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}