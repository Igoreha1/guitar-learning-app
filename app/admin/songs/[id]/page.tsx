"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Save, Clock } from 'lucide-react';
import TabEditor from '@/components/TabEditor';
import { type TabNote, toGameNote } from '@/utils/noteConverter';
import { GameNote } from '@/types/note';

export default function EditSongPage() {
  const router = useRouter();
  const params = useParams();
  const songId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    id: '',
    title: '',
    artist: '',
    bpm: '120',
    difficulty: 'easy',
    duration: '180',
    effect: 'clean',
    backingTrack: '',
    startOffset: '0'
  });
  
  const [notes, setNotes] = useState<TabNote[]>([]);
  const [backingTrackUrl, setBackingTrackUrl] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    if (songId) {
      loadSong();
    }
  }, [songId]);

  const loadSong = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/songs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const songs = await res.json();
      const song = songs.find((s: any) => s.id === songId);
      
      if (song) {
        const tabData = song.tabData || [];
        const convertedNotes: TabNote[] = tabData.map((note: any) => ({
          id: note.id || `note_${Date.now()}_${Math.random()}`,
          string: note.string,
          fret: note.fret || 0,
          time: note.time || 0,
          beat: note.beat || 1,
          measure: note.measure || 1,
          subBeat: note.subBeat || 0,
          duration: note.duration || 0.5
        }));
        
        setForm({
          id: song.id,
          title: song.title,
          artist: song.artist,
          bpm: song.bpm.toString(),
          difficulty: song.difficulty,
          duration: song.duration.toString(),
          effect: song.effect || 'clean',
          backingTrack: song.backingTrack || '',
          startOffset: song.startOffset?.toString() || '0'
        });
        setBackingTrackUrl(song.backingTrack || '');
        setNotes(convertedNotes);
        
        if (song.backingTrack) {
          const audio = new Audio(song.backingTrack);
          audio.onloadedmetadata = () => {
            setAudioDuration(audio.duration);
          };
        }
      } else {
        alert('Песня не найдена');
        router.push('/admin/songs');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки песни');
      router.push('/admin/songs');
    } finally {
      setLoading(false);
    }
  };

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
        setForm({ ...form, backingTrack: data.url });
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
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/songs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          artist: form.artist,
          bpm: parseInt(form.bpm),
          difficulty: form.difficulty,
          duration: parseInt(form.duration),
          effect: form.effect,
          backingTrack: backingTrackUrl,
          notes: notes,
          startOffset: parseFloat(form.startOffset)
        })
      });

      if (res.ok) {
        router.push('/admin/songs');
      } else {
        const errorText = await res.text();
        alert(`Ошибка при сохранении: ${res.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin" />
          <div className="text-gray-400">Загрузка песни...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/songs" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Редактирование песни: {form.title}</h1>

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
              <label className="block text-sm font-medium text-gray-300 mb-2">Сложность</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              >
                <option value="easy">Лёгкая</option>
                <option value="medium">Средняя</option>
                <option value="hard">Сложная</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Эффект гитары</label>
              <select
                value={form.effect}
                onChange={(e) => setForm({ ...form, effect: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              >
                <option value="clean">Clean</option>
                <option value="distortion">Дисторшн</option>
                <option value="reverb">Реверберация</option>
              </select>
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
                {uploading ? 'Загрузка...' : 'Выбрать новый аудиофайл'}
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
              <button
                type="button"
                onClick={() => {
                  setBackingTrackUrl('');
                  setForm({ ...form, backingTrack: '' });
                }}
                className="text-red-400 text-sm mt-2 hover:text-red-300 transition flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Удалить минусовку
              </button>
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
            title={`${form.title} - ${form.artist}`}
            startOffset={parseFloat(form.startOffset)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохранение...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Сохранить изменения
              </div>
            )}
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