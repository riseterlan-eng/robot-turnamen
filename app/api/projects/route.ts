import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const items = [
    {
      id: 'proj-1',
      name: 'Turnamen Robot Sepak Bola SMA/SMK 2026',
      description: 'Bagan 27 Tim - 3 Hari Acara (Fairplay & Tanpa Eliminasi Hari 1)',
      status: 'ACTIVE',
      dueAt: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return NextResponse.json({ items, total: items.length }, { status: 200 });
}