"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Save, Clock } from 'lucide-react';
import TabEditor from '@/components/TabEditor';
import { type TabNote, toGameNote } from '@/utils/noteConverter';
import { GameNote } from '@/types/note';

export default function NewSongPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    title: '',
    artist: '',
    bpm: '120',
    difficulty: 'easy',
    duration: '180',
    effect: 'distortion',
    startOffset: '0'
  });
  
  const [notes, setNotes] = useState<TabNote[]>([]);
  const [backingTrackUrl, setBackingTrackUrl] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload-audio', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setBackingTrackUrl(data.url);
        const audio = new Audio(data.url);
        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration);
        };
      } else {
        alert(data.error || 'Ошибка загрузки');
      }
    } catch (error) {
      alert('Ошибка при загрузке');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const gameNotes: GameNote[] = notes.map(toGameNote);
      
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          notes: gameNotes,
          backingTrack: backingTrackUrl,
          startOffset: parseFloat(form.startOffset)
        })
      });

      if (res.ok) {
        router.push('/admin/songs');
      } else {
        const errorText = await res.text();
        alert(`Ошибка при создании: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Ошибка при создании');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/songs" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Новая песня</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Основная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Название песни</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Исполнитель</label>
              <input
                type="text"
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">BPM</label>
              <input
                type="number"
                value={form.bpm}
                onChange={(e) => setForm({ ...form, bpm: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Длительность (сек)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Стартовое смещение (сек)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                value={form.startOffset}
                onChange={(e) => setForm({ ...form, startOffset: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                С какого момента начинается песня в минусовке (если есть тишина в начале)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Минусовка</h2>
          
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-700/50 transition flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {uploading ? 'Загрузка...' : 'Выбрать минусовку'}
              </button>
            </div>
          </div>
          
          {backingTrackUrl && (
            <div className="mt-4">
              <audio src={backingTrackUrl} controls className="w-full" />
              <p className="text-xs text-gray-500 mt-2">
                Длительность: {audioDuration.toFixed(1)} сек | 
                Стартовое смещение: {form.startOffset} сек
                {parseFloat(form.startOffset) > 0 && (
                  <span className="text-yellow-400 ml-2">
                    ⚠️ Песня начнётся с {form.startOffset} секунды
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Редактор табов</h2>
          <p className="text-sm text-gray-400 mb-4">
            🎸 Клик на поле — добавить ноту | Выберите ноту для редактирования | Цвет = струна
          </p>
          <TabEditor
            notes={notes}
            onChange={setNotes}
            bpm={parseInt(form.bpm)}
            height={500}
            audioUrl={backingTrackUrl}
            title={`${form.title || 'Новая песня'} - ${form.artist || 'Без исполнителя'}`}
            startOffset={parseFloat(form.startOffset)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {loading ? 'Сохранение...' : 'Сохранить песню'}
          </button>
          <Link
            href="/admin/songs"
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}