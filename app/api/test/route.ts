import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Проверяем подключение к БД
    const songs = await prisma.song.findMany()
    return NextResponse.json({ 
      success: true, 
      count: songs.length,
      songs: songs 
    })
  } catch (error) {
    console.error('Ошибка БД:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}