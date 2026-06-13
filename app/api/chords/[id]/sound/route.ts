import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chord = await prisma.chord.findUnique({
      where: { id: params.id },
      select: { soundUrl: true }
    });

    if (!chord?.soundUrl) {
      return NextResponse.json(
        { error: 'Звук для этого аккорда не найден' },
        { status: 404 }
      );
    }

    // Если soundUrl — это путь к файлу в public
    const filePath = path.join(process.cwd(), 'public', chord.soundUrl);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Файл со звуком не найден' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === '.mp3' ? 'audio/mpeg' : 'audio/wav';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching chord sound:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки звука' },
      { status: 500 }
    );
  }
}