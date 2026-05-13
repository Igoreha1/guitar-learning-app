"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Bookmark, Share2, CheckCircle } from 'lucide-react';

interface LessonActionsProps {
  articleId: string;
  articleTitle: string;
  prevLesson: any;
  nextLesson: any;
}

export default function LessonActions({ articleId, articleTitle, prevLesson, nextLesson }: LessonActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      checkIfSaved();
    }
  }, [articleId]);

  const checkIfSaved = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/user/saved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.saved) {
        const isArticleSaved = data.saved.some((s: any) => s.articleId === articleId);
        setIsSaved(isArticleSaved);
      }
    } catch (error) {
      console.error('Ошибка проверки сохранения:', error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setToastMessage('Войдите в аккаунт, чтобы сохранять статьи');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        const res = await fetch(`/api/user/saved?articleId=${articleId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setIsSaved(false);
          setToastMessage('Статья удалена из сохранённых');
        }
      } else {
        const res = await fetch('/api/user/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ articleId })
        });
        const data = await res.json();
        
        if (data.saved) {
          setIsSaved(true);
          setToastMessage('Статья сохранена');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setToastMessage('Произошла ошибка');
    } finally {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `Посмотри урок: ${articleTitle}`,
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
          <div className="bg-gray-800 border border-primary/30 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
            {isSaved && toastMessage.includes('сохранена') ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : !isSaved && toastMessage.includes('удалена') ? (
              <CheckCircle className="w-5 h-5 text-yellow-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-primary" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-primary/20 text-primary border border-primary/50' 
                : 'bg-gray-800 text-gray-400 hover:text-primary hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary' : ''}`} />
            {isSaved ? 'Сохранено' : 'Сохранить'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
        <div className="flex gap-3">
          <Link href="/lessons" className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Все уроки
          </Link>
          <Link href="/game" className="flex items-center gap-2 px-6 py-3 btn-primary">
            <Play className="w-4 h-4" />
            Практика в игре
          </Link>
        </div>
      </div>
    </>
  );
}