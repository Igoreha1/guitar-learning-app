import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, User, ArrowLeft, Play, BookOpen, Share2, Bookmark, ChevronRight, Target, CheckCircle, Award, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const article = await prisma.article.findFirst({
    where: {
      slug: slug,
      category: 'lessons',
      status: 'published'
    }
  });
  
  if (!article) {
    notFound();
  }

  const tags: string[] = Array.isArray(article.tags) ? article.tags as string[] : [];

  // Следующий/предыдущий урок
  const [prevLesson, nextLesson] = await Promise.all([
    prisma.article.findFirst({
      where: { category: 'lessons', status: 'published', createdAt: { lt: article.createdAt } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.article.findFirst({
      where: { category: 'lessons', status: 'published', createdAt: { gt: article.createdAt } },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero секция урока */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Навигация */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/lessons" className="hover:text-primary transition-colors">Уроки</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300">{article.title}</span>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="badge">{article.subcategory}</span>
              {tags.map((tag: string, index: number) => (
                <span key={index} className="badge bg-gray-800 text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
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
          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-800">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full object-cover max-h-[500px]"
            />
          </div>

          {/* Прогресс урока (заглушка) */}
          <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-4 mb-8 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Ваш прогресс</span>
              <span className="text-sm text-primary">0%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-primary rounded-full transition-all duration-500" />
            </div>
          </div>

          {/* Контент */}
          <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-2xl p-6 md:p-8 border border-gray-800">
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                prose-blockquote:border-l-primary prose-blockquote:text-gray-400
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-primary transition-colors">
                <Bookmark className="w-4 h-4" />
                Сохранить
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-400 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
            </div>
            <div className="flex gap-3">
              <Link href="/lessons" className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Все уроки
              </Link>
              <Link href="/game" className="flex items-center gap-2 px-6 py-3 btn-primary">
                <Play className="w-4 h-4" />
                Практика в игре
              </Link>
            </div>
          </div>

          {/* Навигация между уроками */}
          {(prevLesson || nextLesson) && (
            <div className="flex justify-between gap-4 mt-8 pt-8 border-t border-gray-800">
              {prevLesson && (
                <Link href={`/lessons/${prevLesson.slug}`} className="flex-1 group">
                  <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 border border-gray-800">
                    <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <ChevronLeft className="w-3 h-3" /> Предыдущий урок
                    </span>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {prevLesson.title}
                    </p>
                  </div>
                </Link>
              )}
              {nextLesson && (
                <Link href={`/lessons/${nextLesson.slug}`} className="flex-1 group text-right">
                  <div className="bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 border border-gray-800">
                    <span className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-end">
                      Следующий урок <ChevronRightIcon className="w-3 h-3" />
                    </span>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {nextLesson.title}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA секция - попробовать тренажёр */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
            <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Закрепи знания на практике</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Попробуй наши упражнения
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              В интерактивном тренажёре ты можешь отработать материал урока и получить мгновенную обратную связь
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/game" className="btn-primary inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                Открыть тренажёр
              </Link>
              <Link href="/lessons" className="btn-outline inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}