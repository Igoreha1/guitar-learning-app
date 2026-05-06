import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight, Music2, TrendingUp, Sparkles, Guitar } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function SongsPage() {
  const songs = await prisma.article.findMany({
    where: {
      category: 'songs',
      status: 'published'
    },
    orderBy: { createdAt: 'desc' }
  });

  // Популярные песни (по просмотрам)
  const popularSongs = [...songs].sort((a, b) => b.views - a.views).slice(0, 3);
  const subcategories = ['поп', 'рок', 'русский рок', 'метал', 'джаз', 'блюз', 'альтернатива'];

  return (
    <div className="min-h-screen">
      {/* Hero секция */}
      <section className="relative overflow-hidden pt-20 pb-12 bg-gradient-to-br from-gray-dark to-dark">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
            <Music2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Разборы песен</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Играй любимые песни
            </span>
            <br />
            <span className="text-gradient">с нуля до профи</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Аккорды, табы и подробные разборы популярных песен для гитары.
            Учись играть то, что действительно нравится!
          </p>
        </div>
      </section>

      {songs.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-gray-400 mb-4">Пока нет разборов песен.</p>
            <Link href="/admin/articles/new" className="btn-primary">
              + Добавить разбор
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Популярные песни */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Популярные разборы
                  </h2>
                  <p className="text-gray-500 text-sm">Самые просматриваемые песни</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {popularSongs.map((song, idx) => (
                  <Link key={song.id} href={`/songs/${song.slug}`} className="group">
                    <div className="relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={song.image} 
                          alt={song.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="badge text-xs">
                            #{idx + 1} по популярности
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                            {song.subcategory}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {song.excerpt.substring(0, 80)}...
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(song.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {song.views} просмотров
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Категории */}
          <section className="py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-sm text-gray-400">Жанры:</span>
                {subcategories.map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-1.5 bg-gray-800 rounded-full text-sm text-gray-400 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Все разборы */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <Guitar className="w-6 h-6 text-primary" />
                    Все разборы
                  </h2>
                  <p className="text-gray-500 text-sm">{songs.length} песен в нашей библиотеке</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Поиск песни..." 
                    className="input pl-10 w-64"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                  <Link key={song.id} href={`/songs/${song.slug}`} className="group">
                    <div className="relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={song.image} 
                          alt={song.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
                        <div className="absolute top-3 left-3">
                          <span className="badge">
                            {song.subcategory}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {song.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {song.excerpt.substring(0, 80)}...
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(song.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {song.readingTime} мин
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {song.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// Импорт Search для поля поиска
import { Search } from 'lucide-react';