"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/articles?all=true');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadArticles();
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление статьями</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Новая статья
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Заголовок</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Категория</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Просмотры</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500">{article.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    article.category === 'lessons' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {article.category === 'lessons' ? 'Урок' : 'Разбор песни'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{article.views}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/articles/${article.id}`} className="text-blue-600 hover:text-blue-800">
                      ✏️
                    </Link>
                    <button onClick={() => deleteArticle(article.id)} className="text-red-600 hover:text-red-800">
                      🗑️
                    </button>
                    <Link href={`/${article.category}/${article.slug}`} target="_blank" className="text-gray-600 hover:text-gray-800">
                      👁️
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}