import { notFound } from 'next/navigation';
import Link from 'next/link';
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

  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-red-600">← На главную</Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href="/lessons" className="text-gray-600 hover:text-red-600">Уроки</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-800">{article.title}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-red-600 rounded-full text-xs">{article.subcategory}</span>
                {tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-gray-600/80 rounded-full text-xs">#{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                <span>📅 {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                <span>👤 {article.author}</span>
                <span>📖 {article.readingTime} мин чтения</span>
                <span>👁️ {article.views}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-red-600 prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/lessons" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            ← Все уроки
          </Link>
          <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            🎸 На главную
          </Link>
        </div>
      </div>
    </div>
  );
}