import Link from 'next/link';
import Metronome from '@/features/metronome/Metronome';

// Данные для статей
const featuredPosts = [
  {
    id: 1,
    title: 'Как научиться играть на гитаре с нуля. Подробное руководство',
    excerpt: 'Вы только что купили гитару и не знаете, с чего начать? В этой статье я помогу вам разобраться...',
    image: '/images/posts/guitar-beginner.jpg',
    category: 'Для начинающих',
    date: '07.10.2024',
    url: '/lessons/guitar-beginner'
  },
  {
    id: 2,
    title: 'Бой с перебором на гитаре. Схемы для начинающих',
    excerpt: 'Бой перебор на гитаре — сложный исполнительский прием. Чтобы освоить такие схемы боя требуется...',
    image: '/images/posts/strumming-pattern.jpg',
    category: 'Для продвинутых',
    date: '03.10.2024',
    url: '/lessons/strumming-pattern'
  },
  {
    id: 3,
    title: 'Бой Галоп на гитаре. Схемы для начинающих',
    excerpt: 'Разберём один из популярных и динамичных приемов игры — Бой Галоп на гитаре...',
    image: '/images/posts/gallop-strum.jpg',
    category: 'Для начинающих',
    date: '14.12.2023',
    url: '/lessons/gallop-strum'
  },
  {
    id: 4,
    title: 'Metallica — Master of puppets табы для акустической гитары',
    excerpt: 'Оригинальные Master of Puppets табы для гитары в родной тональности...',
    image: '/images/posts/metallica-master.jpg',
    category: 'Популярные',
    date: '20.03.2025',
    url: '/songs/master-of-puppets'
  }
];

const popularPosts = [
  { title: 'Гамма Ми-бемоль мажор на гитаре', date: '08.02.2025', url: '/lessons/eb-major-scale' },
  { title: 'Гамма До-минор на гитаре', date: '21.01.2025', url: '/lessons/c-minor-scale' },
  { title: 'МакSим — Знаешь ли ты табы мелодии', date: '14.12.2024', url: '/songs/maksim-znayesh' },
  { title: 'Агата Кристи — Как на войне табы', date: '14.12.2024', url: '/songs/agata-kak-na-voyne' },
  { title: 'Король и Шут — Танец злобного гения', date: '14.12.2024', url: '/songs/kish-tanets' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Основной контент - 2 колонки */}
        <div className="lg:col-span-2">
          {/* Интерактивные инструменты */}
          <div className="interactive-block mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎵</span> Аккордовая библиотека
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Изучайте аккорды с визуальными схемами и подсказками для пальцев
                </p>
                <Link href="/chords" className="btn">
                  Перейти к аккордам →
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⏱️</span> Метроном онлайн
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Тренируйте чувство ритма с нашим метрономом
                </p>
                <Metronome />
              </div>
            </div>
          </div>

          {/* Закрепленная статья */}
          <div className="post-card post-card-large mb-8">
            <div className="post-image">
              <img src={featuredPosts[0].image} alt={featuredPosts[0].title} />
            </div>
            <div className="post-content">
              <div className="post-meta">
                <span>{featuredPosts[0].date}</span> / <Link href="#" className="text-red-600">{featuredPosts[0].category}</Link>
              </div>
              <h2 className="post-title">
                <Link href={featuredPosts[0].url}>{featuredPosts[0].title}</Link>
              </h2>
              <p className="post-excerpt">{featuredPosts[0].excerpt}</p>
              <Link href={featuredPosts[0].url} className="btn inline-block mt-3">Читать далее →</Link>
            </div>
          </div>

          {/* Сетка статей */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {featuredPosts.slice(1, 3).map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span>{post.date}</span> / <Link href="#" className="text-red-600">{post.category}</Link>
                  </div>
                  <h2 className="post-title">
                    <Link href={post.url}>{post.title}</Link>
                  </h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Еще одна большая статья */}
          <div className="post-card post-card-large mb-8">
            <div className="post-image">
              <img src={featuredPosts[3].image} alt={featuredPosts[3].title} />
            </div>
            <div className="post-content">
              <div className="post-meta">
                <span>{featuredPosts[3].date}</span> / <Link href="#" className="text-red-600">{featuredPosts[3].category}</Link>
              </div>
              <h2 className="post-title">
                <Link href={featuredPosts[3].url}>{featuredPosts[3].title}</Link>
              </h2>
              <p className="post-excerpt">{featuredPosts[3].excerpt}</p>
              <Link href={featuredPosts[3].url} className="btn inline-block mt-3">Читать далее →</Link>
            </div>
          </div>

          {/* Пагинация */}
          <div className="text-center">
            <Link href="#" className="btn bg-gray-700 hover:bg-gray-800">← Предыдущие записи</Link>
          </div>
        </div>

        {/* Сайдбар */}
        <div className="lg:col-span-1">
          {/* Поиск */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Поиск</h3>
            <input 
              type="text" 
              placeholder="Поиск по сайту..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 mt-3"
            />
          </div>

          {/* Популярные статьи */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Популярные статьи</h3>
            <ul className="space-y-3 mt-3">
              {popularPosts.map((post, index) => (
                <li key={index} className="pb-3 border-b border-gray-100">
                  <Link href={post.url} className="text-gray-800 hover:text-red-600 font-medium">
                    {post.title}
                  </Link>
                  <div className="text-xs text-gray-500 mt-1">{post.date}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Рубрики */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Рубрики</h3>
            <ul className="space-y-2 mt-3">
              <li><Link href="#" className="text-gray-600 hover:text-red-600">Для начинающих</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-red-600">Разборы песен</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-red-600">Виды боя</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-red-600">Аккорды</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-red-600">Теория музыки</Link></li>
            </ul>
          </div>

          {/* Telegram */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Мы в Telegram</h3>
            <Link href="#" className="btn bg-gray-700 hover:bg-gray-800 block text-center mt-3">
              Подписаться →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}