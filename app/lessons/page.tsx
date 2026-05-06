import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight, BookOpen, TrendingUp, Sparkles, Target, Search, Play, Star, Award } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function LessonsPage() {
  const lessons = await prisma.article.findMany({
    where: {
      category: 'lessons',
      status: 'published'
    },
    orderBy: { createdAt: 'desc' }
  });

  // Популярные уроки (по просмотрам)
  const popularLessons = [...lessons].sort((a, b) => b.views - a.views).slice(0, 3);
  
  // Уровни сложности
  const difficultyLevels = [
    { name: 'Начинающий', icon: '🌱', color: 'from-green-500 to-green-600', count: lessons.filter(l => l.subcategory?.toLowerCase().includes('начал') || l.difficulty === 'easy').length },
    { name: 'Средний', icon: '📘', color: 'from-blue-500 to-blue-600', count: lessons.filter(l => l.subcategory?.toLowerCase().includes('средн') || l.difficulty === 'medium').length },
    { name: 'Продвинутый', icon: '🔥', color: 'from-red-500 to-red-600', count: lessons.filter(l => l.subcategory?.toLowerCase().includes('продвин') || l.difficulty === 'hard').length }
  ];

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
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Пошаговое обучение</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Уроки игры на гитаре
            </span>
            <br />
            <span className="text-gradient">от новичка до профи</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Пошаговые уроки с подробными объяснениями, упражнениями и практическими заданиями.
            Начни играть уже сегодня!
          </p>
          
          {/* Поиск */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Поиск уроков..." 
                className="input pl-10 py-3"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </section>

      {lessons.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-400 mb-4">Пока нет уроков. Добавьте первый урок в админ-панели.</p>
            <Link href="/admin/articles/new" className="btn-primary">
              + Добавить урок
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Уровни сложности */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Выбери свой уровень
                </h2>
                <p className="text-gray-500 text-sm">Начни с подходящего уровня и постепенно прокачивай навыки</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {difficultyLevels.map((level, idx) => (
                  <div key={idx} className="group relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl p-6 border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className={`text-4xl mb-3 bg-gradient-to-br ${level.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                        {level.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{level.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{level.count} уроков</p>
                      <Link 
                        href={`/lessons?level=${level.name.toLowerCase()}`} 
                        className="inline-flex items-center gap-1 text-primary text-sm group/link hover:gap-2 transition-all"
                      >
                        Начать обучение <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Популярные уроки */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Популярные уроки
                  </h2>
                  <p className="text-gray-500 text-sm">Самые просматриваемые уроки</p>
                </div>
                <Link href="/lessons/all" className="text-primary hover:text-primary-dark text-sm flex items-center gap-1 transition-colors">
                  Все уроки <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {popularLessons.map((lesson, idx) => (
                  <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group">
                    <div className="relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={lesson.image} 
                          alt={lesson.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="badge text-xs">
                            #{idx + 1} по популярности
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                            <Play className="w-3 h-3 text-primary" />
                            {lesson.views}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                            {lesson.subcategory}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {lesson.excerpt.substring(0, 80)}...
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lesson.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.readingTime} мин
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Все уроки */}
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    Все уроки
                  </h2>
                  <p className="text-gray-500 text-sm">{lessons.length} уроков в нашей библиотеке</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group">
                    <div className="relative bg-gradient-to-br from-gray-dark/50 to-dark/50 rounded-xl overflow-hidden border border-gray-800 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={lesson.image} 
                          alt={lesson.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
                        <div className="absolute top-3 left-3">
                          <span className="badge">
                            {lesson.subcategory}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {lesson.excerpt.substring(0, 80)}...
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lesson.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.readingTime} мин
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {lesson.views}
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