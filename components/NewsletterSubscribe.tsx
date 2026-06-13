'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Подписка оформлена! Проверьте ваш email.');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Ошибка при подписке');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Ошибка соединения. Попробуйте позже.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-red-500" />
        <h4 className="font-semibold text-white">Подпишитесь на новости</h4>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Получайте уведомления о новых песнях, аккордах и статьях первыми!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Ваше имя (необязательно)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
      
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}