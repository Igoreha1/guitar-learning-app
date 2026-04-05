import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articles } from '@/lib/articles';

export default async function SongPage({ params }: { params: { slug: string } }) {
  const article = articles.find(a => a.slug === params.slug && a.category === 'songs');
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-red-600">← На главную</Link>
          <span className="text-gray-400 mx-2">/</span>
          <Link href="/songs" className="text-gray-600 hover:text-red-600">Разборы песен</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-800">{article.title}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-red-600 rounded-full text-xs">{article.subcategory}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
                <span>📅 {article.date}</span>
                <span>👤 {article.author}</span>
                <span>📖 {article.readingTime} мин чтения</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-pre:bg-gray-800 prose-pre:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <div className="mt-8 flex justify-between">
          <Link href="/songs" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            ← Все разборы
          </Link>
          <Link href="/game" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            🎸 Играть в игре
          </Link>
        </div>
      </div>
    </div>
  );
}