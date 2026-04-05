"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface Score {
  id: string;
  value: number;
  accuracy: number;
  maxCombo: number;
  createdAt: string;
  song: {
    title: string;
    artist: string;
  };
}

interface Favorite {
  id: string;
  song: {
    title: string;
    artist: string;
    difficulty: string;
  };
}

interface Stats {
  totalScores: number;
  totalPlayTime: number;
  averageAccuracy: number;
  bestScore: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalScores: 0,
    totalPlayTime: 0,
    averageAccuracy: 0,
    bestScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scores' | 'favorites'>('scores');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    fetchUserData(token);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      // Получаем данные пользователя
      const userRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      
      if (userData.user) {
        setUser(userData.user);
      }

      // Получаем рекорды
      const scoresRes = await fetch('/api/user/scores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const scoresData = await scoresRes.json();
      if (scoresData.scores) {
        setScores(scoresData.scores);
        
        // Подсчёт статистики
        const total = scoresData.scores.length;
        const avgAcc = scoresData.scores.reduce((acc: number, s: Score) => acc + s.accuracy, 0) / total || 0;
        const best = Math.max(...scoresData.scores.map((s: Score) => s.value), 0);
        
        setStats({
          totalScores: total,
          totalPlayTime: total * 3, // примерно 3 минуты на песню
          averageAccuracy: avgAcc,
          bestScore: best
        });
      }

      // Получаем избранное
      const favRes = await fetch('/api/user/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const favData = await favRes.json();
      if (favData.favorites) {
        setFavorites(favData.favorites);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/user/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Загрузка профиля...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Заголовок профиля */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎸</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-red-100">{user.email}</p>
                <p className="text-red-200 text-sm mt-1">
                  На сайте с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">🎵</div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalScores}</div>
            <div className="text-xs text-gray-500">Сыграно песен</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-2xl font-bold text-gray-800">{Math.floor(stats.totalPlayTime / 60)} ч</div>
            <div className="text-xs text-gray-500">Времени в игре</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-gray-800">{Math.floor(stats.averageAccuracy)}%</div>
            <div className="text-xs text-gray-500">Средняя точность</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-2xl font-bold text-gray-800">{stats.bestScore}</div>
            <div className="text-xs text-gray-500">Лучший счёт</div>
          </div>
        </div>

        {/* Табы */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('scores')}
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'scores'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🏆 Рекорды
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'favorites'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ❤️ Избранное ({favorites.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'scores' && (
              <>
                {scores.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">🎮</div>
                    <p className="text-gray-500">У вас пока нет рекордов</p>
                    <Link href="/game" className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Начать играть
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scores.map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-8 text-center">
                            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{score.song.title}</h3>
                            <p className="text-sm text-gray-500">{score.song.artist}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-600">{score.value}</div>
                          <div className="text-xs text-gray-500">
                            {Math.floor(score.accuracy)}% • комбо {score.maxCombo}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'favorites' && (
              <>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">❤️</div>
                    <p className="text-gray-500">Нет избранных песен</p>
                    <Link href="/game" className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Выбрать песни
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-gray-800">{fav.song.title}</h3>
                          <p className="text-sm text-gray-500">{fav.song.artist}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600">
                            {fav.song.difficulty === 'easy' ? 'Для начинающих' : 'Средний уровень'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/game?song=${fav.song.title}`}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            Играть
                          </Link>
                          <button
                            onClick={() => removeFavorite(fav.id)}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}