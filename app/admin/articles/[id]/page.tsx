"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    id: '',
    slug: '',
    title: '',
    category: 'lessons',
    subcategory: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    readingTime: 5,
    tags: '',
    status: 'published',
    showOnHomepage: false
  });

  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const loadArticle = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/articles?id=${articleId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (data && data.id) {
      setForm({
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        subcategory: data.subcategory,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image || '/images/default.jpg',
        author: data.author,
        readingTime: data.readingTime,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        status: data.status,
        showOnHomepage: data.showOnHomepage || false
      });
    } else {
      alert('Статья не найдена');
      router.push('/admin/articles');
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    alert('Ошибка загрузки статьи');
    router.push('/admin/articles');
  } finally {
    setLoading(false);
  }
};

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.url });
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
      const res = await fetch(`/api/articles/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (res.ok) {
        router.push('/admin/articles');
      } else {
        alert(`Ошибка при сохранении: ${res.status}`);
      }
    } catch (error) {
      alert('Ошибка');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin" />
          <div className="text-gray-400">Загрузка статьи...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Редактирование статьи</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Slug нельзя изменить</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
          </div>

          {/* Загрузка изображения */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Изображение</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
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
                  {uploading ? 'Загрузка...' : 'Выбрать новое изображение'}
                </button>
              </div>
            </div>
            {form.image && form.image !== '/images/default.jpg' && (
              <div className="mt-3">
                <img src={form.image} alt="Preview" className="h-32 w-auto rounded-xl border border-white/20 object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: '/images/default.jpg' })}
                  className="text-red-400 text-sm mt-2 hover:text-red-300 transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Удалить
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Категория</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              >
                <option value="lessons">Урок</option>
                <option value="songs">Разбор песни</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Подкатегория</label>
              <input
                type="text"
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Краткое описание</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Содержание (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500 transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Можно использовать HTML теги: h2, p, ul, li, pre, strong, a</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Автор</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Время чтения (мин)</label>
              <input
                type="number"
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Теги (через запятую)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              placeholder="гитара, урок, аккорды"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Статус</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
              >
                <option value="published">Опубликовано</option>
                <option value="draft">Черновик</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showOnHomepage}
                  onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-800/50 text-red-600 focus:ring-red-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-300">Показывать на главной странице</span>
              </label>
            </div>
          </div>
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
            href="/admin/articles"
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}