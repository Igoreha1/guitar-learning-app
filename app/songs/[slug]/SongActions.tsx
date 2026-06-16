"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Share2, CheckCircle } from 'lucide-react';

interface SongActionsProps {
  articleId: string;
  articleTitle: string;
}

export default function SongActions({ articleId, articleTitle }: SongActionsProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `Посмотри разбор песни: ${articleTitle}`,
          url: url,
        });
      } catch (err) {
        console.log('Отменено');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setToastMessage('Ссылка скопирована!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
        setToastMessage('Не удалось скопировать ссылку');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }
  };

  return (
    <>
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 border border-primary/30 text-gray-800 dark:text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
        <div className="flex gap-3">
          <Link href="/songs" className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Все разборы
          </Link>
          <Link href={`/game?play=${articleId}`} className="flex items-center gap-2 px-6 py-3 btn-primary">
            <Play className="w-4 h-4" />
            Играть в тренажёре
          </Link>
        </div>
      </div>
    </>
  );
}