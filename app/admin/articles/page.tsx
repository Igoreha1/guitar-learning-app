"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, Plus, Check, X } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  status: string;
  views: number;
  showOnHomepage: boolean;
  createdAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/articles?all=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`Ошибка ${res.status}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error('Ответ не массив:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowOnHomepage = async (article: Article) => {
    const token = localStorage.getItem('token');
    const newValue = !article.showOnHomepage;
    
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...article,
          showOnHomepage: newValue
        })
      });
      
      if (res.ok) {
        loadArticles();
      }
    } catch (error) {
      alert('Ошибка при обновлении');
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadArticles();
  };

  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-600 border-t-red-500 rounded-full animate-spin" />
        <div className="text-gray-400">Загрузка статей...</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Управление статьями</h1>
          <p className="text-gray-400 text-sm mt-1">Всего статей: {filteredArticles.length}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg shadow-green-500/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Новая статья
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="🔍 Поиск по заголовку или slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition"
        >
          <option value="all">Все категории</option>
          <option value="lessons">Уроки</option>
          <option value="songs">Разборы песен</option>
        </select>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Заголовок</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Категория</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">На главной</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Просмотры</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-white/5 transition group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{article.title}</div>
                    <div className="text-sm text-gray-400 font-mono">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      article.category === 'lessons' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {article.category === 'lessons' ? '📖 Урок' : '🎵 Разбор песни'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleShowOnHomepage(article)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                        article.showOnHomepage
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                      }`}
                    >
                      {article.showOnHomepage ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {article.showOnHomepage ? 'Да' : 'Нет'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/articles/${article.id}`} className="text-blue-400 hover:text-blue-300 transition p-1">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => deleteArticle(article.id)} className="text-red-400 hover:text-red-300 transition p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <Link href={`/${article.category}/${article.slug}`} target="_blank" className="text-gray-400 hover:text-gray-300 transition p-1">
                        <Eye className="w-5 h-5" />
                      </Link>
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