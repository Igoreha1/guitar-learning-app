import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '3377026722e9756799a30b3f0becada09ba47d9825ca18d15f3f67e76b1e1a85';

const checkAdminAuth = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
};

export async function POST(request: Request) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат. Используйте JPEG, PNG, WEBP или GIF' }, { status: 400 });
    }

    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой. Максимум 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = path.extname(file.name);
    const filename = `${timestamp}_${random}${ext}`;
    
    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);
    
    // Создаём директорию если её нет
    await mkdir(uploadDir, { recursive: true });
    
    // Сохраняем файл
    await writeFile(filePath, buffer);
    
    // Возвращаем URL изображения
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return NextResponse.json({ error: 'Ошибка при загрузке файла' }, { status: 500 });
  }
}