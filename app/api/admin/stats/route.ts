import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const verifyAdmin = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  console.log('🔍 stats - token:', token ? 'есть' : 'нет');
  
  if (!token) return false;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔍 stats - decoded:', decoded);
    
    // Пробуем получить роль из разных полей
    const role = decoded.role || decoded.userRole;
    console.log('🔍 stats - role:', role);
    
    return role === 'admin';
  } catch (error) {
    console.error('❌ stats - ошибка верификации:', error);
    return false;
  }
};

export async function GET(request: Request) {
  try {
    console.log('🔍 GET /api/admin/stats - проверка авторизации...');
    
    if (!verifyAdmin(request)) {
      console.log('❌ Не авторизован');
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    
    console.log('✅ Авторизован, загружаем статистику...');
    
    const [songsCount, usersCount, scoresCount, chordsCount, articlesCount] = await Promise.all([
      prisma.song.count(),
      prisma.user.count(),
      prisma.score.count(),
      prisma.chord.count(),
      prisma.article.count(),
    ]);

    // Получаем общее количество просмотров
    const articles = await prisma.article.findMany({
      select: { views: true }
    });
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
    
    // Получаем средний счёт
    const scores = await prisma.score.findMany({
      select: { value: true }
    });
    const avgScore = scores.length > 0 
      ? Math.floor(scores.reduce((sum, s) => sum + s.value, 0) / scores.length)
      : 0;

    return NextResponse.json({
      songs: songsCount,
      users: usersCount,
      scores: scoresCount,
      chords: chordsCount,
      articles: articlesCount,
      views: totalViews,
      avgScore: avgScore
    });
  } catch (error) {
    console.error('❌ Ошибка загрузки статистики:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}