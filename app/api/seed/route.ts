import { NextResponse } from 'next/server';
import seed from '@/prisma/seed';

export async function POST() {
  try {
    await seed();
    return NextResponse.json({ success: true, message: 'Seed completed' });
  } catch (e) {
    console.error('Seed failed', e);
    return NextResponse.json({ success: false, message: 'Seed failed', error: String(e) }, { status: 500 });
  }
}

export const GET = () => NextResponse.json({ message: 'Use POST to run seed' });
