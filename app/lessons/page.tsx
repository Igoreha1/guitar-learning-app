import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight, BookOpen, TrendingUp, Target, Search, Play, Star, Award, ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';

interface LessonsPageProps {
  searchParams?: Promise<{ level?: string }> | { level?: string };
}

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  // Получаем параметр level из URL
  const params = await searchParams;
  const levelFilter = params?.level || 'all';
  
  // Загружаем все уроки (учитываем поле difficulty)
  const allLessons = await prisma.article.findMany({
    where: {
      category: 'lessons',
      status: 'published'
    },
    orderBy: { createdAt: 'desc' }
  });

  // Функция для определения уровня урока (используем поле difficulty из БД)
  const getLessonLevel = (lesson: any): 'beginner' | 'intermediate' | 'advanced' => {
    // Используем поле difficulty, которое сохраняется в админке
    if (lesson.difficulty === 'beginner') return 'beginner';
    if (lesson.difficulty === 'intermediate') return 'intermediate';
    if (lesson.difficulty === 'advanced') return 'advanced';
    
    // Если поле не заполнено — определяем по тексту (запасной вариант)
    const text = (lesson.subcategory + ' ' + lesson.title).toLowerCase();
    if (text.includes('начинающ') || text.includes('нович') || text.includes('beginner')) {
      return 'beginner';
    }
    if (text.includes('средн') || text.includes('intermediate') || text.includes('продолжающ')) {
      return 'intermediate';
    }
    if (text.includes('продвин') || text.includes('advanced') || text.includes('сложн')) {
      return 'advanced';
    }
    return 'beginner';
  };

  // Добавляем уровень к каждому уроку
  const lessonsWithLevel = allLessons.map(lesson => ({
    ...lesson,
    level: getLessonLevel(lesson)
  }));

  // Фильтруем уроки по выбранному уровню
  const lessons = levelFilter === 'all' 
    ? lessonsWithLevel 
    : lessonsWithLevel.filter(l => l.level === levelFilter);

  // Считаем уроки по уровням
  const beginnerCount = lessonsWithLevel.filter(l => l.level === 'beginner').length;
  const intermediateCount = lessonsWithLevel.filter(l => l.level === 'intermediate').length;
  const advancedCount = lessonsWithLevel.filter(l => l.level === 'advanced').length;

  // Популярные уроки (по просмотрам)
  const popularLessons = [...lessonsWithLevel].sort((a, b) => b.views - a.views).slice(0, 3);
  
  const difficultyLevels = [
    { 
      name: 'Начинающий', 
      icon: '🌱', 
      color: 'from-green-500 to-green-600', 
      bg: 'bg-green-500/10',
      count: beginnerCount,
      level: 'beginner'
    },
    { 
      name: 'Средний', 
      icon: '📘', 
      color: 'from-blue-500 to-blue-600', 
      bg: 'bg-blue-500/10',
      count: intermediateCount,
      level: 'intermediate'
    },
    { 
      name: 'Продвинутый', 
      icon: '🔥', 
      color: 'from-red-500 to-red-600', 
      bg: 'bg-red-500/10',
      count: advancedCount,
      level: 'advanced'
    }
  ];

  // Получаем название текущего фильтра
  const getFilterName = () => {
    switch (levelFilter) {
      case 'beginner': return 'Начинающий';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return 'Все уроки';
    }
  };

  const getFilterIcon = () => {
    switch (levelFilter) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📘';
      case 'advanced': return '🔥';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero секция — адаптирована под светлую тему */}
      <section className="relative overflow-hidden pt-20 pb-12 bg-gradient-to-br from-gray-dark/30 via-gray-dark/20 to-dark/30">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          {levelFilter !== 'all' && (
            <Link 
              href="/lessons" 
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад ко всем урокам
            </Link>
          )}

          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Пошаговое обучение</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-text-primary">
              {levelFilter === 'all' ? 'Уроки игры на гитаре' : `Уроки для ${getFilterName()}`}
            </span>
            <br />
            <span className="text-gradient">
              {levelFilter === 'all' ? 'от новичка до профи' : `${getFilterIcon()} ${getFilterName()} уровень`}
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {levelFilter === 'all' 
              ? 'Пошаговые уроки с подробными объяснениями, упражнениями и практическими заданиями. Начни играть уже сегодня!'
              : `${lessons.length} уроков для ${getFilterName()} уровня. Выбери подходящий и начни обучение!`
            }
          </p>
          
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Поиск уроков..." 
                className="input pl-10 py-3"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>
          </div>
        </div>
      </section>

      {allLessons.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-text-secondary mb-4">Пока нет уроков. Добавьте первый урок в админ-панели.</p>
            <Link href="/admin/articles/new" className="btn-primary">
              + Добавить урок
            </Link>
          </div>
        </div>
      ) : (
        <>
          {levelFilter === 'all' && (
            <section className="py-12">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    <span className="text-text-primary">Выбери свой уровень</span>
                  </h2>
                  <p className="text-text-secondary text-sm">Начни с подходящего уровня и постепенно прокачивай навыки</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {difficultyLevels.map((level, idx) => (
                    <Link 
                      key={idx} 
                      href={`/lessons?level=${level.level}`}
                      className="group block"
                    >
                      <div className="relative card p-6 transition-all duration-300 hover:border-primary/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative z-10">
                          <div className={`text-4xl mb-3 bg-gradient-to-br ${level.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                            {level.icon}
                          </div>
                          <h3 className="text-xl font-semibold mb-1 text-text-primary">{level.name}</h3>
                          <p className="text-text-secondary text-sm mb-3">{level.count} уроков</p>
                          {level.count > 0 ? (
                            <span className="inline-flex items-center gap-1 text-primary text-sm group-hover:gap-2 transition-all">
                              Начать обучение <ChevronRight className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-text-secondary text-sm">
                              Скоро <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              {levelFilter !== 'all' && (
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                    <span className="text-2xl">{getFilterIcon()}</span>
                    <span className="text-primary font-medium">{getFilterName()} уровень</span>
                    <span className="text-text-secondary">• {lessons.length} уроков</span>
                  </div>
                </div>
              )}

              {levelFilter === 'all' && (
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      <span className="text-text-primary">Популярные уроки</span>
                    </h2>
                    <p className="text-text-secondary text-sm">Самые просматриваемые уроки</p>
                  </div>
                </div>
              )}

              {levelFilter === 'all' && (
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {popularLessons.map((lesson, idx) => (
                    <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group">
                      <div className="relative bg-card rounded-xl overflow-hidden border border-border-color hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
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
                              {lesson.subcategory || 'Урок'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 text-text-primary">
                            {lesson.title}
                          </h3>
                          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                            {lesson.excerpt.substring(0, 80)}...
                          </p>
                          <div className="flex justify-between items-center text-xs text-text-secondary">
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
              )}

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    <span className="text-text-primary">{levelFilter === 'all' ? 'Все уроки' : `Уроки для ${getFilterName()}`}</span>
                  </h2>
                  <p className="text-text-secondary text-sm">{lessons.length} уроков</p>
                </div>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl">
                  <p className="text-text-secondary">Нет уроков для этого уровня</p>
                  <Link href="/lessons" className="text-primary hover:text-primary-dark mt-2 inline-block">
                    Посмотреть все уроки
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group">
                      <div className="relative bg-card rounded-xl overflow-hidden border border-border-color hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={lesson.image} 
                            alt={lesson.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
                          <div className="absolute top-3 left-3">
                            <span className="badge">
                              {lesson.subcategory || 'Урок'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 text-text-primary">
                            {lesson.title}
                          </h3>
                          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                            {lesson.excerpt.substring(0, 80)}...
                          </p>
                          <div className="flex justify-between items-center text-xs text-text-secondary">
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
              )}
            </div>
          </section>

          {levelFilter === 'all' && (
            <section className="py-16">
              <div className="max-w-4xl mx-auto px-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
                  <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-4">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">Начни свой музыкальный путь</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-text-primary">
                    Готов начать обучение?
                  </h2>
                  <p className="text-text-secondary max-w-2xl mx-auto mb-6">
                    Выбери свой уровень и начни играть уже сегодня. Первые уроки совершенно бесплатно!
                  </p>
                  <Link href="/lessons?level=beginner" className="btn-primary inline-flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Начать обучение
                  </Link>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}