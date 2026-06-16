import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, User, ArrowLeft, Play, Music2, ChevronRight, Guitar } from 'lucide-react';
import prisma from '@/lib/prisma';
import SongActions from './SongActions';

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug: slug,
      category: 'songs',
      status: 'published'
    }
  });
  
  if (!article) {
    notFound();
  }

  // Приводим tags к массиву строк
  const tags: string[] = Array.isArray(article.tags) ? article.tags as string[] : [];

  // Похожие статьи (для будущего функционала)
  const relatedArticles = await prisma.article.findMany({
    where: {
      category: 'songs',
      status: 'published',
      id: { not: article.id }
    },
    take: 3,
    orderBy: { views: 'desc' }
  });

  return (
    <div className="min-h-screen">
      {/* Hero секция */}
<section className="relative overflow-hidden pt-20 pb-12">
  {/* Анимированные лучи */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
  </div>
  
  <div className="relative z-10 max-w-5xl mx-auto px-4">
    {/* Навигация */}
    <div className="flex items-center gap-2 text-sm dark:text-gray-400 text-gray-500 mb-6">
      <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/songs" className="hover:text-primary transition-colors">Разборы песен</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="dark:text-white text-gray-900">{article.title}</span>
    </div>

    <div className="max-w-3xl mx-auto text-center">
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <span className="badge">{article.subcategory}</span>
        {tags.map((tag: string, index: number) => (
          <span key={index} className="badge dark:bg-gray-800 dark:text-gray-400 bg-gray-100 text-gray-600">
            #{tag}
          </span>
        ))}
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 dark:text-white text-gray-900">
        {article.title}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm dark:text-gray-400 text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(article.createdAt).toLocaleDateString('ru-RU')}
        </span>
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          {article.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {article.readingTime} мин чтения
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {article.views} просмотров
        </span>
      </div>
    </div>
  </div>
</section>

      {/* Основное содержание */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Featured image */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-border-color">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full object-cover max-h-[500px]"
            />
          </div>

          {/* Контент */}
<div className="bg-card rounded-2xl p-6 md:p-8 border border-border-color">
  <div 
    className="prose prose-lg max-w-none
      prose-headings:text-text-primary prose-headings:font-bold
      prose-p:text-text-secondary prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-text-primary prose-strong:font-semibold
      prose-code:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border-color
      prose-blockquote:border-l-primary prose-blockquote:text-text-secondary
      prose-li:text-text-secondary
      prose-hr:border-border-color
      
      /* Принудительный переопределение стиля для текста песен */
      [&_div[style*='color: #e4e4e7']] {
        color: #1a1a2e !important;
      }
      
      [&_div[style*='color: #e4e4e7']]:dark {
        color: #e4e4e7 !important;
      }
      
      [&_div[style*='color: #e4e4e7']] .chord-cell {
        color: #ef4444 !important;
      }
      
      [&_div[style*='color: #e4e4e7']]:dark .chord-cell {
        color: #ef4444 !important;
      }
      
      /* Для текста в строках */
      [&_div.text-row] {
        color: #1a1a2e !important;
      }
      
      [&_div.text-row]:dark {
        color: #e4e4e7 !important;
      }
      
      [&_div.chord-row] {
        color: #1a1a2e !important;
      }
      
      [&_div.chord-row]:dark {
        color: #e4e4e7 !important;
      }
      
      [&_div.chord-row] .chord-cell {
        color: #ef4444 !important;
      }
      
      [&_div.chord-row]:dark .chord-cell {
        color: #ef4444 !important;
      }
      
      [&_td] {
        color: #1a1a2e !important;
      }
      
      [&_td]:dark {
        color: #e4e4e7 !important;
      }"
    dangerouslySetInnerHTML={{ __html: article.content }}
  />
</div>

          {/* Кнопки действий - используем клиентский компонент */}
          <SongActions 
            articleId={article.id} 
            articleTitle={article.title}
          />
        </div>
      </section>

      {/* Похожие разборы */}
      {relatedArticles.length > 0 && (
        <section className="py-12 border-t border-border-color">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Music2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Похожие разборы</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((song) => (
                <Link key={song.id} href={`/songs/${song.slug}`} className="group">
                  <div className="bg-card rounded-xl overflow-hidden border border-border-color hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={song.image} 
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="badge text-xs">{song.subcategory}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors text-text-primary">
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {song.views}
                        </span>
                        <span>•</span>
                        <span>{new Date(song.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA секция */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
            <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Guitar className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Начни играть сегодня</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-text-primary">
              Хочешь научиться играть эту песню?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-6">
              В нашем тренажёре ты можешь практиковаться под метроном и отслеживать свой прогресс
            </p>
            <Link href="/game" className="btn-primary inline-flex items-center gap-2">
              <Play className="w-4 h-4" />
              Открыть тренажёр
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}