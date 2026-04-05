import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function LessonsPage() {
  const lessons = await prisma.article.findMany({
    where: {
      category: 'lessons',
      status: 'published'
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">🎸 Уроки игры на гитаре</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Пошаговые уроки для начинающих и опытных гитаристов
          </p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Пока нет уроков. Добавьте первый урок в админ-панели.</p>
            <Link href="/admin/articles/new" className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              + Добавить урок
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={lesson.image} 
                      alt={lesson.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                        {lesson.subcategory}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition">
                      {lesson.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">{lesson.excerpt.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>📅 {new Date(lesson.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span>📖 {lesson.readingTime} мин</span>
                      <span>👁️ {lesson.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}