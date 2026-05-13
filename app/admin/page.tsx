"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, Users, Music, FileText, Guitar, 
  Star, Award, Calendar, Eye, Clock, ArrowUpRight,
  Sparkles, Zap, Shield, Activity, Settings
} from 'lucide-react';

interface Stats {
  songs: number;
  users: number;
  scores: number;
  chords: number;
  articles: number;
  views: number;
  avgScore: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ 
    songs: 0, users: 0, scores: 0, chords: 0, articles: 0, views: 0, avgScore: 0 
  });
  const [loading, setLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentScores, setRecentScores] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 AdminDashboard - токен:', token ? 'есть' : 'нет');
      
      if (!token) {
        console.log('❌ Нет токена, редирект на /admin/login');
        router.push('/admin/login');
        return;
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const [statsRes, articlesRes, scoresRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/articles?all=true&limit=5', { headers }),
        fetch('/api/admin/recent-scores', { headers })
      ]);
      
      // Проверяем статусы ответов
      if (statsRes.status === 401) {
        console.log('❌ Не авторизован, редирект на /admin/login');
        router.push('/admin/login');
        return;
      }
      
      const statsData = await statsRes.json();
      setStats({
        songs: statsData.songs || 0,
        users: statsData.users || 0,
        scores: statsData.scores || 0,
        chords: statsData.chords || 0,
        articles: statsData.articles || 0,
        views: statsData.views || 0,
        avgScore: statsData.avgScore || 0
      });
      
      const articlesData = await articlesRes.json();
      if (Array.isArray(articlesData)) {
        setRecentArticles(articlesData.slice(0, 5));
      }
      
      try {
        const scoresData = await scoresRes.json();
        if (Array.isArray(scoresData)) {
          setRecentScores(scoresData.slice(0, 5));
        }
      } catch (e) {
        console.error('Ошибка загрузки рекордов:', e);
        setRecentScores([]);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Песен', value: stats.songs, icon: Music, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', trend: '+12%' },
    { title: 'Пользователей', value: stats.users, icon: Users, gradient: 'from-green-500 to-green-600', bg: 'bg-green-500/10', border: 'border-green-500/20', trend: '+8%' },
    { title: 'Рекордов', value: stats.scores, icon: Award, gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', trend: '+23%' },
    { title: 'Аккордов', value: stats.chords, icon: Guitar, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', trend: '+5%' },
    { title: 'Статей', value: stats.articles, icon: FileText, gradient: 'from-red-500 to-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20', trend: '+3%' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-gray-700 border-t-primary rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Загрузка данных...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Добро пожаловать</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Панель управления</h1>
          <p className="text-gray-400 text-sm">Общая статистика и аналитика вашего проекта</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} backdrop-blur-sm rounded-xl p-4 border ${card.border} hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-green-400">{card.trend}</span>
                <TrendingUp className="w-3 h-3 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{card.value?.toLocaleString() || 0}</div>
            <div className="text-sm text-gray-400 mt-1">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Всего просмотров</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.views?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Средний счёт</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgScore?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Рейтинг платформы</span>
          </div>
          <div className="text-2xl font-bold text-white">4.9 <span className="text-sm text-gray-500">/ 5</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent articles */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
          <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Последние статьи
            </h3>
            <Link href="/admin/articles" className="text-xs text-primary hover:text-primary-dark transition flex items-center gap-1">
              Все статьи <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentArticles.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Нет статей</div>
            ) : (
              recentArticles.map((article: any) => (
                <div key={article.id} className="px-5 py-3 hover:bg-gray-700/30 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">{article.title}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views || 0}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      article.status === 'published' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent scores */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
          <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Последние рекорды
            </h3>
            <Link href="/admin/scores" className="text-xs text-primary hover:text-primary-dark transition flex items-center gap-1">
              Все рекорды <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-700">
            {recentScores.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Нет рекордов</div>
            ) : (
              recentScores.map((score: any, idx: number) => (
                <div key={idx} className="px-5 py-3 hover:bg-gray-700/30 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{idx + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{score.userName || 'Пользователь'}</div>
                        <div className="text-xs text-gray-500">{score.songTitle || 'Песня'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{score.score || 0}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(score.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Быстрые действия
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-primary/20 transition-all group"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-white">Новая статья</span>
          </Link>
          <Link
            href="/admin/songs/new"
            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-primary/20 transition-all group"
          >
            <Music className="w-5 h-5 text-primary" />
            <span className="text-sm text-white">Новая песня</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-primary/20 transition-all group"
          >
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-white">Пользователи</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-primary/20 transition-all group"
          >
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm text-white">Настройки</span>
          </Link>
        </div>
      </div>
    </div>
  );
}