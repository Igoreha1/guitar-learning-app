"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Music } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  difficulty: string;
  duration: number;
  effect: string;
  createdAt: string;
}

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/songs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSongs(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: string) => {
    if (!confirm('Удалить песню? Все табы будут потеряны.')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/songs?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadSongs();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin" />
        <div className="text-gray-400">Загрузка песен...</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Управление песнями</h1>
          <p className="text-gray-400 text-sm mt-1">Всего песен: {songs.length}</p>
        </div>
        <Link
          href="/admin/songs/new"
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg shadow-green-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Добавить песню
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Исполнитель</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">BPM</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Сложность</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {songs.map((song) => (
                <tr key={song.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-white">{song.title}</div>
                        <div className="text-sm text-gray-400 font-mono">{song.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{song.artist}</td>
                  <td className="px-6 py-4 text-gray-400">{song.bpm}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      song.difficulty === 'easy' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : song.difficulty === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {song.difficulty === 'easy' ? 'Лёгкая' : song.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/songs/${song.id}`} className="text-blue-400 hover:text-blue-300 transition p-1">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => deleteSong(song.id)} className="text-red-400 hover:text-red-300 transition p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}