import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

const verifyAdmin = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) return false;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат. Используйте MP3, WAV или OGG' }, { status: 400 });
    }

    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой. Максимум 30MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = path.extname(file.name);
    const filename = `${timestamp}_${random}${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'songs');
    const filePath = path.join(uploadDir, filename);
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    
    const audioUrl = `/songs/${filename}`;
    
    return NextResponse.json({ success: true, url: audioUrl });
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return NextResponse.json({ error: 'Ошибка при загрузке файла' }, { status: 500 });
  }
}