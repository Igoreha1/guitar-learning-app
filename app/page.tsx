import Link from 'next/link';
import Metronome from '@/features/metronome/Metronome';
import Player from '@/features/player/Player';
import { testSong } from '@/features/songs/mockSong';

// Данные для статей
const featuredPosts = [
  {
    id: 1,
    title: 'Как научиться играть на гитаре с нуля. Подробное руководство',
    excerpt: 'Вы только что купили гитару и не знаете, с чего начать? В этой статье я помогу вам разобраться...',
    image: '/api/placeholder/740/480',
    category: 'Для начинающих',
    date: '07.10.2024',
    url: '#'
  },
  {
    id: 2,
    title: 'Бой с перебором на гитаре. Схемы для начинающих',
    excerpt: 'Бой перебор на гитаре — сложный исполнительский прием. Чтобы освоить такие схемы боя требуется...',
    image: '/api/placeholder/460/300',
    category: 'Для продвинутых',
    date: '03.10.2024',
    url: '#'
  },
  {
    id: 3,
    title: 'Бой Галоп на гитаре. Схемы для начинающих',
    excerpt: 'Разберём один из популярных и динамичных приемов игры — Бой Галоп на гитаре...',
    image: '/api/placeholder/460/300',
    category: 'Для начинающих',
    date: '14.12.2023',
    url: '#'
  },
  {
    id: 4,
    title: 'Metallica — Master of puppets табы для акустической гитары',
    excerpt: 'Оригинальные Master of Puppets табы для гитары в родной тональности...',
    image: '/api/placeholder/740/480',
    category: 'Популярные',
    date: '20.03.2025',
    url: '#'
  }
];

const popularPosts = [
  { title: 'Гамма Ми-бемоль мажор на гитаре', date: '08.02.2025', url: '#' },
  { title: 'Гамма До-минор на гитаре', date: '21.01.2025', url: '#' },
  { title: 'МакSим — Знаешь ли ты табы мелодии', date: '14.12.2024', url: '#' },
  { title: 'Агата Кристи — Как на войне табы', date: '14.12.2024', url: '#' },
  { title: 'Король и Шут — Танец злобного гения', date: '14.12.2024', url: '#' },
];

export default function Home() {
  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', margin: '40px 0' }}>
        {/* Основной контент */}
        <div>
          {/* Интерактивные инструменты */}
          <div className="interactive-block">
            <h2 className="interactive-title">🎸 Интерактивные инструменты</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>🎵 Плеер аккордов</h3>
                <Player song={testSong} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>⏱️ Метроном онлайн</h3>
                <Metronome />
              </div>
            </div>
          </div>

          {/* Закрепленная статья */}
          <div className="post-card post-card-large">
            <div className="post-image">
              <img src={featuredPosts[0].image} alt={featuredPosts[0].title} />
            </div>
            <div className="post-content">
              <div className="post-meta">
                <span>{featuredPosts[0].date}</span> / <Link href="#" style={{ color: '#e74c3c' }}>{featuredPosts[0].category}</Link>
              </div>
              <h2 className="post-title">
                <Link href={featuredPosts[0].url}>{featuredPosts[0].title}</Link>
              </h2>
              <p className="post-excerpt">{featuredPosts[0].excerpt}</p>
              <Link href={featuredPosts[0].url} className="btn" style={{ marginTop: '15px', display: 'inline-block' }}>Читать далее →</Link>
            </div>
          </div>

          {/* Сетка статей */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {featuredPosts.slice(1, 3).map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-image">
                  <img src={post.image} alt={post.title} style={{ height: '200px' }} />
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span>{post.date}</span> / <Link href="#" style={{ color: '#e74c3c' }}>{post.category}</Link>
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
          <div className="post-card post-card-large" style={{ marginTop: '30px' }}>
            <div className="post-image">
              <img src={featuredPosts[3].image} alt={featuredPosts[3].title} />
            </div>
            <div className="post-content">
              <div className="post-meta">
                <span>{featuredPosts[3].date}</span> / <Link href="#" style={{ color: '#e74c3c' }}>{featuredPosts[3].category}</Link>
              </div>
              <h2 className="post-title">
                <Link href={featuredPosts[3].url}>{featuredPosts[3].title}</Link>
              </h2>
              <p className="post-excerpt">{featuredPosts[3].excerpt}</p>
              <Link href={featuredPosts[3].url} className="btn" style={{ marginTop: '15px', display: 'inline-block' }}>Читать далее →</Link>
            </div>
          </div>

          {/* Пагинация */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="#" className="btn" style={{ background: '#2c3e50' }}>← Предыдущие записи</Link>
          </div>
        </div>

        {/* Сайдбар */}
        <div className="sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">Поиск</h3>
            <input 
              type="text" 
              placeholder="Поиск по сайту..." 
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Популярные статьи</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {popularPosts.map((post, index) => (
                <li key={index} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <Link href={post.url} style={{ textDecoration: 'none', color: '#2c3e50', fontWeight: '500' }}>
                    {post.title}
                  </Link>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '5px' }}>{post.date}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Рубрики</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Для начинающих</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Разборы песен</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Виды боя</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Аккорды</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="#" style={{ color: '#e74c3c', textDecoration: 'none' }}>Теория музыки</Link></li>
            </ul>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Мы в Telegram</h3>
            <Link href="#" className="btn" style={{ background: '#2c3e50', display: 'block', textAlign: 'center' }}>
              Подписаться → 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}