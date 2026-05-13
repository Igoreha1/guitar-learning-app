"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, FileText, Music, Eye, Calendar, ArrowRight, Loader2, ChevronRight, Home } from 'lucide-react';

interface SearchResult {
  type: 'article' | 'song';
  href: string;
  title: string;
  description?: string;
  image?: string;
  subcategory?: string;
  artist?: string;
  difficulty?: string;
  bpm?: number;
  date?: string;
  views?: number;
}

// Отдельный компонент для использования useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<SearchResult[]>([]);
  const [songs, setSongs] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    if (!q.trim()) {
      setArticles([]);
      setSongs([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setSongs(data.songs || []);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalResults = articles.length + songs.length;

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Поиск
          </span>
        </h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск песен, уроков, статей..."
              className="w-full pl-12 pr-28 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary rounded-xl text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Найти
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-gray-400">Поиск...</span>
          </div>
        ) : query && !loading ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Найдено <span className="text-primary font-bold">{totalResults}</span> результатов
              </p>
            </div>

            {totalResults === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-400 text-lg">Ничего не найдено</p>
                <p className="text-gray-500 text-sm mt-2">Попробуйте изменить запрос</p>
              </div>
            ) : (
              <div className="space-y-8">
                {articles.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Статьи и уроки ({articles.length})
                    </h2>
                    <div className="grid gap-4">
                      {articles.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="group bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-4 border border-gray-800 hover:border-primary/30 transition-all hover:-translate-y-0.5 flex gap-4"
                        >
                          {item.image && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="badge text-xs">{item.subcategory}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.date!).toLocaleDateString('ru-RU')}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views}
                              </span>
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {songs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Music className="w-5 h-5 text-primary" />
                      Песни ({songs.length})
                    </h2>
                    <div className="grid gap-4">
                      {songs.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="group bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-4 border border-gray-800 hover:border-primary/30 transition-all hover:-translate-y-0.5 flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-400">{item.artist}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">{item.bpm} BPM</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.difficulty === 'easy' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : item.difficulty === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {item.difficulty === 'easy' ? '🌱 Новичок' : 
                                 item.difficulty === 'medium' ? '⭐ Любитель' : '🔥 Профи'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">Введите запрос для поиска</p>
            <p className="text-gray-500 text-sm mt-2">Найдёте уроки, песни и многое другое</p>
          </div>
        )}
      </div>
    </>
  );
}

// Основной компонент с Suspense
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Главная
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300">Поиск</span>
          </div>

          <Suspense fallback={
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          }>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}