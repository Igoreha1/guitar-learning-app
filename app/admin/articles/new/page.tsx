"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    category: 'lessons',
    subcategory: 'Для начинающих',
    excerpt: '',
    content: '',
    image: '/images/posts/default.jpg',
    author: 'Администратор',
    readingTime: 5,
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim())
        })
      });

      if (res.ok) {
        router.push('/admin/articles');
      } else {
        alert('Ошибка при создании');
      }
    } catch (error) {
      alert('Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/admin/articles" className="text-gray-600 hover:text-gray-800">
          ← Назад
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Новая статья</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            required
            placeholder="guitar-beginner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Заголовок</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Категория</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="lessons">Урок</option>
              <option value="songs">Разбор песни</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Подкатегория</label>
            <input
              type="text"
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Краткое описание</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Содержание (HTML)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={15}
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Автор</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Время чтения (мин)</label>
            <input
              type="number"
              value={form.readingTime}
              onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Теги (через запятую)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
            placeholder="гитара, урок, аккорды"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}