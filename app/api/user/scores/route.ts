import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const verifyToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    console.log('❌ Токен отсутствует');
    return null;
  }
  
  try {
    // Пробуем разные варианты поля с id
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔍 Полный decoded:', JSON.stringify(decoded, null, 2));
    
    // Ищем id в разных полях
    const userId = decoded.id || decoded.userId || decoded.sub;
    console.log('🔍 Найденный userId:', userId);
    
    if (!userId) {
      console.log('❌ В токене нет id');
      return null;
    }
    
    return {
      id: userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('❌ Ошибка верификации токена:', error);
    return null;
  }
};

// GET /api/user/scores — получить рекорды текущего пользователя
export async function GET(request: Request) {
  const user = verifyToken(request);
  if (!user || !user.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  try {
    const scores = await prisma.score.findMany({
      where: { userId: user.id },
      include: {
        song: {
          select: {
            title: true,
            artist: true,
            difficulty: true
          }
        }
      },
      orderBy: { value: 'desc' }
    });

    console.log(`✅ Найдено ${scores.length} рекордов для пользователя ${user.id}`);
    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Ошибка получения рекордов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST /api/user/scores — сохранить новый рекорд
export async function POST(request: Request) {
  const user = verifyToken(request);
  if (!user || !user.id) {
    console.error('❌ Пользователь не авторизован или нет id');
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  console.log('📝 Сохранение рекорда для userId:', user.id);

  try {
    const body = await request.json();
    const { songId, score, accuracy, maxCombo } = body;

    console.log('📊 Данные рекорда:', { songId, score, accuracy, maxCombo });

    if (!songId || score === undefined) {
      return NextResponse.json({ error: 'Не все данные переданы' }, { status: 400 });
    }

    // Проверяем, существует ли уже рекорд для этой песни
    const existingScore = await prisma.score.findFirst({
      where: {
        userId: user.id,
        songId: songId
      }
    });

    console.log('🔍 Существующий рекорд:', existingScore);

    // Если рекорд существует и новый счёт выше — обновляем
    if (existingScore) {
      if (score > existingScore.value) {
        console.log('📈 Обновление рекорда (новый выше)');
        const updatedScore = await prisma.score.update({
          where: { id: existingScore.id },
          data: {
            value: Math.floor(score),
            accuracy: accuracy,
            maxCombo: maxCombo
          }
        });
        return NextResponse.json({ score: updatedScore, isNewRecord: true });
      }
      console.log('📉 Новый счёт не превышает рекорд');
      return NextResponse.json({ score: existingScore, isNewRecord: false });
    }

    // Создаём новый рекорд
    console.log('✨ Создание нового рекорда');
    const newScore = await prisma.score.create({
      data: {
        value: Math.floor(score),
        accuracy: accuracy,
        maxCombo: maxCombo,
        userId: user.id,
        songId: songId
      }
    });

    console.log('✅ Рекорд создан:', newScore);
    return NextResponse.json({ score: newScore, isNewRecord: true });
  } catch (error) {
    console.error('❌ Ошибка сохранения рекорда:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}