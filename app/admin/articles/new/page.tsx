"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Image as ImageIcon, HelpCircle } from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    category: 'lessons',
    subcategory: 'Для начинающих',
    excerpt: '',
    content: '',
    image: '/images/default.jpg',
    author: 'Администратор',
    readingTime: 5,
    tags: '',
    status: 'published',
    showOnHomepage: false
  });

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

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    setForm({ ...form, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/articles', {
        method: 'POST',
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
        alert(`Ошибка при создании: ${res.status}`);
      }
    } catch (error) {
      alert('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-gray-400 hover:text-white transition flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Новая статья / разбор песни</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Заголовок</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={generateSlug}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
                placeholder="guitar-beginner"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Уникальный идентификатор для URL</p>
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
                  {uploading ? 'Загрузка...' : 'Выбрать изображение'}
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
                placeholder="Для начинающих, Рок, Аккорды"
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

          {/* Редактор контента с подсказками по аккордам */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Содержание</label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-400 hover:text-primary transition flex items-center gap-1 text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                {showHelp ? 'Скрыть подсказки' : 'Как форматировать аккорды?'}
              </button>
            </div>
            
            {showHelp && (
              <div className="mb-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <h3 className="text-primary font-bold mb-2">📝 Как правильно вставлять аккорды:</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Аккорды в квадратных скобках: <code className="bg-gray-800 px-1 rounded">[Am]</code> → <span className="text-primary font-bold">Am</span></li>
                  <li>• Несколько аккордов подряд: <code className="bg-gray-800 px-1 rounded">[Am] [C] [G] [Em]</code></li>
                  <li>• Аккорды над текстом: <code className="bg-gray-800 px-1 rounded">[Am]Умирает капитан, и уходит в океан</code></li>
                  <li>• Заголовки секций: <code className="bg-gray-800 px-1 rounded">Куплет 1:</code> или <code className="bg-gray-800 px-1 rounded">[Припев]</code></li>
                  <li>• Пустые строки для разделения куплетов</li>
                </ul>
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-2">Пример:</p>
                  <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
{`[Em] [C] [G] [D]

[Em]        [C]        [G]        [D]
Текст песни, текст песни, текст песни

Куплет 2:
[Am]       [F]        [C]        [G]
Продолжение песни, продолжение`}
                  </pre>
                </div>
              </div>
            )}
            
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={16}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500 transition"
              placeholder={`[Em] [C] [G] [D]

[Em]        [C]        [G]        [D]
Текст песни, текст песни, текст песни

Куплет 2:
[Am]       [F]        [C]        [G]
Продолжение песни, продолжение`}
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Для разборов песен используйте <strong className="text-primary">[Аккорд]</strong> перед текстом или строкой. 
              Аккорды будут автоматически выделены!
            </p>
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
            disabled={loading || uploading}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохранение...
              </div>
            ) : (
              'Опубликовать'
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