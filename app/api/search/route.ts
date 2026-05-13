import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    
    if (!q.trim()) {
      return NextResponse.json({ articles: [], songs: [] });
    }
    
    const searchTerm = q.trim();
    
    // Поиск по статьям (без поиска по JSON полю tags)
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: searchTerm } },
          { excerpt: { contains: searchTerm } },
          { content: { contains: searchTerm } },
          { author: { contains: searchTerm } }
        ]
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        category: true,
        subcategory: true,
        createdAt: true,
        views: true
      },
      orderBy: { views: 'desc' },
      take: 20
    });
    
    // Поиск по песням
    const songs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { artist: { contains: searchTerm } }
        ]
      },
      select: {
        id: true,
        title: true,
        artist: true,
        difficulty: true,
        bpm: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    const formattedArticles = articles.map(a => ({
      type: 'article',
      href: `/${a.category}/${a.slug}`,
      title: a.title,
      description: a.excerpt?.substring(0, 200),
      image: a.image,
      subcategory: a.subcategory,
      date: a.createdAt,
      views: a.views
    }));
    
    const formattedSongs = songs.map(s => ({
      type: 'song',
      href: `/game`,
      title: s.title,
      artist: s.artist,
      difficulty: s.difficulty,
      bpm: s.bpm,
      songId: s.id
    }));
    
    return NextResponse.json({ 
      articles: formattedArticles, 
      songs: formattedSongs 
    });
  } catch (error) {
    console.error('Ошибка поиска:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}