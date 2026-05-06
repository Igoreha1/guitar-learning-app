import Link from 'next/link';
import { Search, BookOpen, Music2, Target, ChevronRight, Clock, Eye, TrendingUp, Star, Users, Guitar, Play, Award, Zap, Calendar, Heart, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import Hero from '@/components/Hero';

export default async function Home() {
  const featuredArticles = await prisma.article.findMany({
    where: { status: 'published', showOnHomepage: true },
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  const articles = featuredArticles.length > 0 
    ? featuredArticles 
    : await prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 6
      });

  const popularPosts = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { views: 'desc' },
    take: 5
  });

  const mainArticle = articles[0];
  const restArticles = articles.slice(1);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Преимущества */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Почему мы лучшие</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Почему выбирают
              </span>{' '}
              <span className="text-gradient">GuitarSync</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Мы создали идеальную платформу для обучения игре на гитаре
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Понятные уроки",
                desc: "От простых аккордов до сложных соло — каждый найдёт материал по своему уровню",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Music2,
                title: "Популярные песни",
                desc: "Разборы любимых хитов с аккордами, табами и видео-примерами",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Target,
                title: "Интерактивность",
                desc: "Игра-тренажёр, метроном, тюнер и другие полезные инструменты",
                color: "from-purple-500 to-purple-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl p-8 border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Главная статья */}
      {mainArticle && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="group relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden h-80 lg:h-auto">
                  <img 
                    src={mainArticle.image} 
                    alt={mainArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="badge">
                      {mainArticle.subcategory}
                    </span>
                    <span className="text-gray-600 text-sm">•</span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Calendar className="w-3 h-3" /> 
                      {new Date(mainArticle.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Eye className="w-3 h-3" /> {mainArticle.views}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    <Link href={`/${mainArticle.category}/${mainArticle.slug}`} className="hover:text-primary transition-colors">
                      {mainArticle.title}
                    </Link>
                  </h2>
                  <p className="text-gray-400 text-base mb-6 leading-relaxed line-clamp-3">
                    {mainArticle.excerpt}
                  </p>
                  <Link 
                    href={`/${mainArticle.category}/${mainArticle.slug}`} 
                    className="inline-flex items-center gap-2 text-primary font-semibold group/link hover:gap-3 transition-all"
                  >
                    Читать статью 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Свежие статьи + Сайдбар */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Левая колонка - статьи */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Свежие статьи</h2>
                  <p className="text-gray-500 text-sm">Новые уроки и разборы каждую неделю</p>
                </div>
                <Link href="/lessons" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1 transition-colors">
                  Все статьи <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {restArticles.map((article, idx) => (
                  <div key={article.id} className="group bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge">
                          {article.subcategory}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 
                          {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {article.views}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/${article.category}/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {article.excerpt.substring(0, 100)}...
                      </p>
                      <Link 
                        href={`/${article.category}/${article.slug}`} 
                        className="inline-flex items-center gap-1 text-primary text-sm mt-3 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Читать <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка - сайдбар */}
            <div className="space-y-6">
              {/* Поиск */}
              <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> 
                  Поиск
                </h3>
                <form action="/search" method="get">
                  <div className="relative">
                    <input 
                      type="text" 
                      name="q"
                      placeholder="Название песни или урока..." 
                      className="input pr-10"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Search className="w-4 h-4 text-gray-500 hover:text-primary transition-colors" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Популярное */}
              <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> 
                  Популярное
                </h3>
                <div className="space-y-4">
                  {popularPosts.map((post, idx) => (
                    <div key={post.id} className="group">
                      <Link href={`/${post.category}/${post.slug}`} className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary">#{idx + 1}</span>
                            <span className="text-xs text-gray-600">{new Date(post.createdAt).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <div className="font-medium text-sm text-gray-300 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Eye className="w-3 h-3" />
                            <span>{post.views} просмотров</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Рубрики */}
              <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Рубрики</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Уроки", icon: "🎸", href: "/lessons" },
                    { name: "Разборы", icon: "🎵", href: "/songs" },
                    { name: "Аккорды", icon: "🎼", href: "/chords" },
                    { name: "Игра", icon: "🎮", href: "/game" },
                    { name: "Тюнер", icon: "🎛️", href: "/tuner" },
                    { name: "Метроном", icon: "⏱️", href: "/metronome" }
                  ].map((cat) => (
                    <Link 
                      key={cat.name}
                      href={cat.href} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-xs hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center border border-primary/20">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-semibold mb-2">Telegram-канал</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ежедневные уроки, аккорды и полезные советы
                </p>
                <Link href="https://t.me/igorehababy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                  Подписаться <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Начни сейчас бесплатно</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Готов начать свой путь в музыке?
              </h2>
              
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-base">
                Присоединяйся к тысячам гитаристов, которые уже учатся с нами.
                Первые уроки — совершенно бесплатно!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/lessons" className="btn-primary">
                  Начать учиться
                </Link>
                <Link href="/songs" className="btn-outline">
                  Выбрать песню
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-10 pt-6 border-t border-gray-800/50">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Более 10,000 учеников</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Рейтинг 4.9 / 5</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4 text-primary" />
                  <span>500+ разборов песен</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}