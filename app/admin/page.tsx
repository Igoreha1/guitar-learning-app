"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Stats {
  songs: number;
  users: number;
  scores: number;
  chords: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: string;
  duration: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ songs: 0, users: 0, scores: 0, chords: 0 });
  const [songs, setSongs] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'songs' | 'users'>('dashboard');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, songsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/songs')
      ]);

      const statsData = await statsRes.json();
      const songsData = await songsRes.json();

      setStats(statsData);
      setSongs(songsData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const deleteSong = async (id: string) => {
    if (confirm('Удалить песню?')) {
      await fetch(`/api/admin/songs?id=${id}`, { method: 'DELETE' });
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔧</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Админ-панель</h1>
                <p className="text-xs text-gray-500">Управление контентом</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 px-2 font-medium transition border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Дашборд
            </button>
            <button
              onClick={() => setActiveTab('songs')}
              className={`py-3 px-2 font-medium transition border-b-2 ${
                activeTab === 'songs'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🎵 Песни
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-2 font-medium transition border-b-2 ${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 Пользователи
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">🎵</div>
                <div className="text-2xl font-bold text-gray-800">{stats.songs}</div>
                <div className="text-sm text-gray-500">Песен</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold text-gray-800">{stats.users}</div>
                <div className="text-sm text-gray-500">Пользователей</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-gray-800">{stats.scores}</div>
                <div className="text-sm text-gray-500">Рекордов</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-2">🎸</div>
                <div className="text-2xl font-bold text-gray-800">{stats.chords}</div>
                <div className="text-sm text-gray-500">Аккордов</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'songs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Список песен</h2>
              <Link
                href="/admin/songs/new"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                + Добавить песню
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Исполнитель</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BPM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сложность</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {songs.map((song) => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{song.title}</td>
                      <td className="px-6 py-4 text-gray-600">{song.artist}</td>
                      <td className="px-6 py-4 text-gray-600">{song.bpm}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          song.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          song.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {song.difficulty === 'easy' ? 'Лёгкая' : song.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/songs/${song.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => deleteSong(song.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Пользователи</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата регистрации</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Здесь будут пользователи из БД */}
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Скоро здесь появится список пользователей
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}