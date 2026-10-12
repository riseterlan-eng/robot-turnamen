import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const exportData = {
      tournamentName: "Turnamen Robot Sepak Bola SMA/SMK 2026",
      totalTeams: 27,
      generatedAt: new Date().toISOString(),
      summary: {
        totalMatches: 41,
        status: "COMPLETED",
        winner: "SMA 1 Robotik",
        runnerUp: "SMK 2 Teknik",
      },
    };

    return NextResponse.json({ success: true, data: exportData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });
  }
}