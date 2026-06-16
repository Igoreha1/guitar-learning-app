"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Mail, Calendar, Trophy, Target, Clock, 
  Heart, Music, Star, TrendingUp, Award, 
  ChevronRight, Play, Trash2, LogOut, Settings,
  Sparkles, Zap, Shield, Guitar, BookOpen, Bookmark, Eye,
  Bell, BellOff
} from 'lucide-react';

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

interface SavedArticle {
  id: string;
  articleId: string;
  createdAt: string;
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    subcategory: string;
    createdAt: string;
    views: number;
  };
}

interface Stats {
  totalScores: number;
  totalPlayTime: number;
  averageAccuracy: number;
  bestScore: number;
  totalNotes: number;
}

export default function ProfilePage() {
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalScores: 0,
    totalPlayTime: 0,
    averageAccuracy: 0,
    bestScore: 0,
    totalNotes: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scores' | 'favorites' | 'saved'>('scores');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const router = useRouter();

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

  // Загрузка данных пользователя
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    fetchUserData(token);
  }, []);

  // Проверка подписки после загрузки user
  useEffect(() => {
    if (user?.email) {
      checkSubscriptionStatus(user.email);
    }
  }, [user?.email]);

  const checkSubscriptionStatus = async (email: string) => {
    setCheckingSubscription(true);
    try {
      const res = await fetch(`/api/subscribe/status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error('Ошибка проверки подписки:', error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleUnsubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?.email) return;
    
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      
      if (res.ok) {
        setIsSubscribed(false);
        alert('Вы отписались от рассылки');
      } else {
        alert('Ошибка при отписке');
      }
    } catch (error) {
      alert('Ошибка соединения');
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user?.email) return;
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.name })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSubscribed(true);
        alert(data.message || 'Вы подписались на рассылку! Проверьте почту.');
      } else {
        alert(data.error || 'Ошибка при подписке');
      }
    } catch (error) {
      alert('Ошибка соединения');
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userRes.json();
      
      if (userData.user) {
        setUser(userData.user);
      }

      const scoresRes = await fetch('/api/user/scores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const scoresData = await scoresRes.json();
      if (scoresData.scores) {
        setScores(scoresData.scores);
        
        const total = scoresData.scores.length;
        const avgAcc = scoresData.scores.reduce((acc: number, s: Score) => acc + s.accuracy, 0) / total || 0;
        const best = Math.max(...scoresData.scores.map((s: Score) => s.value), 0);
        const totalNotesPlayed = scoresData.scores.reduce((acc: number, s: Score) => acc + s.maxCombo, 0);
        
        setStats({
          totalScores: total,
          totalPlayTime: total * 2.5,
          averageAccuracy: avgAcc,
          bestScore: best,
          totalNotes: totalNotesPlayed
        });
      }

      const favRes = await fetch('/api/user/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const favData = await favRes.json();
      if (favData.favorites) {
        setFavorites(favData.favorites);
      }

      const savedRes = await fetch('/api/user/saved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const savedData = await savedRes.json();
      if (savedData.saved) {
        setSavedArticles(savedData.saved);
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

  const removeSavedArticle = async (articleId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/user/saved?articleId=${articleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSavedArticles(savedArticles.filter(s => s.articleId !== articleId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Стили в зависимости от темы
  const styles = {
    bgPage: isDark ? 'bg-gradient-to-br from-dark via-gray-dark to-darker' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    cardBg: isDark ? 'bg-gradient-to-br from-gray-dark/50 to-dark/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm',
    cardBgInner: isDark ? 'bg-gray-800/30' : 'bg-gray-50',
    cardBgHover: isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100',
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${styles.bgPage} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className={styles.textSecondary}>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getLevel = (scoresCount: number) => {
    if (scoresCount < 5) return { name: 'Новичок', icon: '🌱', color: 'text-green-400' };
    if (scoresCount < 20) return { name: 'Любитель', icon: '⭐', color: 'text-blue-400' };
    if (scoresCount < 50) return { name: 'Продвинутый', icon: '🔥', color: 'text-purple-400' };
    return { name: 'Виртуоз', icon: '🏆', color: 'text-yellow-400' };
  };

  const level = getLevel(stats.totalScores);

  return (
    <div className={`min-h-screen ${styles.bgPage}`}>
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-16 pb-12">
        {/* Анимированные лучи */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Профиль</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className={`bg-gradient-to-r ${isDark ? 'from-white to-gray-400' : 'from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
                  Мой профиль
                </span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-all border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>

          {/* Карточка профиля */}
          <div className={`${styles.cardBg} rounded-2xl border p-6 mb-8`}>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-4xl shadow-lg shadow-primary/20">
                  🎸
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-dark flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className={`text-2xl font-bold ${styles.textPrimary}`}>{user.name}</h2>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${level.color}`}>
                    {level.icon} {level.name}
                  </span>
                </div>
                <div className={`flex flex-wrap gap-4 text-sm ${styles.textSecondary}`}>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-primary" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    На сайте с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/profile/edit"
                  className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'} rounded-xl transition-all`}
                >
                  <Settings className="w-4 h-4" />
                  Редактировать
                </Link>

                {/* Кнопка управления подпиской */}
                {!checkingSubscription && (
                  <button
                    onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isSubscribed 
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <BellOff className="w-4 h-4" />
                        Отписаться
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        Подписаться
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { icon: '🎵', value: stats.totalScores, label: 'Сыграно песен' },
              { icon: '🎯', value: `${Math.floor(stats.averageAccuracy)}%`, label: 'Средняя точность' },
              { icon: '🏆', value: stats.bestScore, label: 'Лучший счёт' },
              { icon: '⚡', value: stats.totalNotes?.toLocaleString() || 0, label: 'Всего нот' },
              { icon: '⭐', value: Math.floor(stats.averageAccuracy / 20), label: 'Уровень' },
            ].map((stat, idx) => (
              <div key={idx} className={`${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 text-center border hover:border-primary/30 transition-all group`}>
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className={`text-xl font-bold ${styles.textPrimary}`}>{stat.value}</div>
                <div className={`text-xs ${styles.textMuted}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Табы */}
          <div className={`${styles.cardBg} rounded-2xl border overflow-hidden`}>
            <div className={`flex border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <button
                onClick={() => setActiveTab('scores')}
                className={`flex-1 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'scores'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Рекорды
                {scores.length > 0 && (
                  <span className={`ml-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({scores.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'favorites'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                Избранное
                {favorites.length > 0 && (
                  <span className={`ml-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({favorites.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-4 text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'saved'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Сохранённое
                {savedArticles.length > 0 && (
                  <span className={`ml-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>({savedArticles.length})</span>
                )}
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'scores' && (
                <>
                  {scores.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎮</div>
                      <p className={styles.textSecondary}>У вас пока нет рекордов</p>
                      <Link href="/game" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mt-4">
                        <Play className="w-4 h-4" />
                        Начать играть
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scores.map((score, index) => (
                        <div key={score.id} className={`flex items-center justify-between p-4 ${styles.cardBgInner} rounded-xl ${styles.cardBgHover} transition-all group`}>
                          <div className="flex items-center gap-4">
                            <div className="w-8 text-center">
                              <span className={`text-lg font-bold ${
                                index === 0 ? 'text-yellow-500' : 
                                index === 1 ? 'text-gray-400' : 
                                index === 2 ? 'text-orange-500' : 'text-gray-600'
                              }`}>
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <h3 className={`font-semibold ${styles.textPrimary}`}>{score.song.title}</h3>
                              <p className={`text-sm ${styles.textMuted}`}>{score.song.artist}</p>
                              <div className={`flex items-center gap-3 mt-1 text-xs ${styles.textMuted}`}>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(score.createdAt).toLocaleDateString('ru-RU')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Комбо {score.maxCombo}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary">{score.value}</div>
                            <div className="text-xs text-green-400">{Math.floor(score.accuracy)}% точность</div>
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
                      <div className="text-6xl mb-4">❤️</div>
                      <p className={styles.textSecondary}>Нет избранных песен</p>
                      <Link href="/game" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mt-4">
                        <Music className="w-4 h-4" />
                        Выбрать песни
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {favorites.map((fav) => (
                        <div key={fav.id} className={`flex items-center justify-between p-4 ${styles.cardBgInner} rounded-xl ${styles.cardBgHover} transition-all group`}>
                          <div>
                            <h3 className={`font-semibold ${styles.textPrimary}`}>{fav.song.title}</h3>
                            <p className={`text-sm ${styles.textMuted}`}>{fav.song.artist}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                              fav.song.difficulty === 'easy' 
                                ? 'bg-green-500/20 text-green-400' 
                                : fav.song.difficulty === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {fav.song.difficulty === 'easy' ? '🌱 Для начинающих' : 
                               fav.song.difficulty === 'medium' ? '⭐ Средний уровень' : '🔥 Высокий уровень'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/game?song=${encodeURIComponent(fav.song.title)}`}
                              className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all border border-green-500/30 text-sm flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Играть
                            </Link>
                            <button
                              onClick={() => removeFavorite(fav.id)}
                              className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all border border-red-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'saved' && (
                <>
                  {savedArticles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📖</div>
                      <p className={styles.textSecondary}>Нет сохранённых статей</p>
                      <Link href="/lessons" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all mt-4">
                        <BookOpen className="w-4 h-4" />
                        К урокам
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedArticles.map((item) => (
                        <div key={item.id} className={`flex items-start justify-between p-4 ${styles.cardBgInner} rounded-xl ${styles.cardBgHover} transition-all group`}>
                          <div className="flex-1">
                            <Link href={`/${item.article.category}/${item.article.slug}`}>
                              <h3 className={`font-semibold ${styles.textPrimary} group-hover:text-primary transition-colors`}>
                                {item.article.title}
                              </h3>
                            </Link>
                            <p className={`text-sm ${styles.textMuted} mt-1`}>{item.article.subcategory}</p>
                            <div className={`flex items-center gap-3 mt-2 text-xs ${styles.textMuted}`}>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.article.createdAt).toLocaleDateString('ru-RU')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.article.views} просмотров
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSavedArticle(item.articleId)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}