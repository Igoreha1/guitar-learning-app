import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email обязателен' }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { email }
  });

  return NextResponse.json({
    isSubscribed: subscriber?.isActive === true
  });
}