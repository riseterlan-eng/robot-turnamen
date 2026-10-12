import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const items = [
      {
        id: 'match-1',
        name: 'Match 1 - Grup A (Hari 1)',
        status: 'LIVE',
        teamA: 'SMA 1 Robotik',
        teamB: 'SMK 2 Teknik',
        scoreA: 2,
        scoreB: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'match-2',
        name: 'Match 2 - Grup B (Hari 1)',
        status: 'UPCOMING',
        teamA: 'SMA 3 Electro',
        teamB: 'SMK 1 Mechatronics',
        scoreA: 0,
        scoreB: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ items, total: items.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const item = {
      id: `match-${Date.now()}`,
      name,
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
  }
}