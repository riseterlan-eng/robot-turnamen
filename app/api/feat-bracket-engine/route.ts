import { NextResponse } from 'next/server';

export interface TeamConfig {
  id: string;
  group: string;
  schoolName: string;
  teamName: string;
  logoUrl?: string;
}

// Generate default 27 teams
const createDefaultTeams = (): TeamConfig[] => {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const teams: TeamConfig[] = [];
  let count = 1;

  groups.forEach((g) => {
    for (let i = 1; i <= 3; i++) {
      teams.push({
        id: `T${count}`,
        group: `Grup ${g}`,
        schoolName: `SMA NEGERI ${count}`,
        teamName: `ROBOT TEAM ${count}`,
        logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=School${count}`,
      });
      count++;
    }
  });
  return teams;
};

const buildMatchesFromTeams = (teamsList: TeamConfig[]) => {
  const matches: any[] = [];
  const groupMap: { [key: string]: TeamConfig[] } = {};

  teamsList.forEach((t) => {
    if (!groupMap[t.group]) groupMap[t.group] = [];
    groupMap[t.group].push(t);
  });

  // HARI 1: Penyisihan Grup (3 match per grup)
  Object.keys(groupMap).forEach((gName) => {
    const gTeams = groupMap[gName];
    if (gTeams.length >= 2) {
      matches.push({
        id: `D1-${gName.replace(/\s+/g, '')}-1`,
        day: 1,
        group: gName,
        teamA: gTeams[0].teamName,
        schoolA: gTeams[0].schoolName,
        logoA: gTeams[0].logoUrl,
        teamB: gTeams[1].teamName,
        schoolB: gTeams[1].schoolName,
        logoB: gTeams[1].logoUrl,
        scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0,
        colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING',
        timerSeconds: 0, timerMode: 'UP', timerCaption: 'BABAK 1',
        isTimerRunning: false, isHighlighted: false,
      });
    }
    if (gTeams.length >= 3) {
      matches.push(
        {
          id: `D1-${gName.replace(/\s+/g, '')}-2`,
          day: 1,
          group: gName,
          teamA: gTeams[1].teamName,
          schoolA: gTeams[1].schoolName,
          logoA: gTeams[1].logoUrl,
          teamB: gTeams[2].teamName,
          schoolB: gTeams[2].schoolName,
          logoB: gTeams[2].logoUrl,
          scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0,
          colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING',
          timerSeconds: 0, timerMode: 'UP', timerCaption: 'BABAK 1',
          isTimerRunning: false, isHighlighted: false,
        },
        {
          id: `D1-${gName.replace(/\s+/g, '')}-3`,
          day: 1,
          group: gName,
          teamA: gTeams[2].teamName,
          schoolA: gTeams[2].schoolName,
          logoA: gTeams[2].logoUrl,
          teamB: gTeams[0].teamName,
          schoolB: gTeams[0].schoolName,
          logoB: gTeams[0].logoUrl,
          scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0,
          colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING',
          timerSeconds: 0, timerMode: 'UP', timerCaption: 'BABAK 1',
          isTimerRunning: false, isHighlighted: false,
        }
      );
    }
  });

  // HARI 2: Playoff / Knockout (12 Match)
  for (let i = 1; i <= 12; i++) {
    matches.push({
      id: `D2-M${i}`,
      day: 2,
      group: i <= 8 ? 'Babak 16 Besar' : 'Perempat Final',
      teamA: `Pemenang Playoff ${i * 2 - 1}`,
      schoolA: 'SEKOLAH QUALIFIED',
      logoA: '',
      teamB: `Pemenang Playoff ${i * 2}`,
      schoolB: 'SEKOLAH QUALIFIED',
      logoB: '',
      scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0,
      colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING',
      timerSeconds: 0, timerMode: 'UP', timerCaption: 'BABAK KNOCKOUT',
      isTimerRunning: false, isHighlighted: false,
    });
  }

  // HARI 3: Final
  matches.push(
    { id: 'D3-SF1', day: 3, group: 'Semi Final 1', teamA: 'Juara QF 1', schoolA: 'SEKOLAH SF1', logoA: '', teamB: 'Juara QF 2', schoolB: 'SEKOLAH SF2', logoB: '', scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0, colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING', timerSeconds: 0, timerMode: 'UP', timerCaption: 'SEMI FINAL', isTimerRunning: false, isHighlighted: false },
    { id: 'D3-SF2', day: 3, group: 'Semi Final 2', teamA: 'Juara QF 3', schoolA: 'SEKOLAH SF3', logoA: '', teamB: 'Juara QF 4', schoolB: 'SEKOLAH SF4', logoB: '', scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0, colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING', timerSeconds: 0, timerMode: 'UP', timerCaption: 'SEMI FINAL', isTimerRunning: false, isHighlighted: false },
    { id: 'D3-F3', day: 3, group: 'Perebutan Juara 3', teamA: 'Kalah SF 1', schoolA: 'SEKOLAH F3A', logoA: '', teamB: 'Kalah SF 2', schoolB: 'SEKOLAH F3B', logoB: '', scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0, colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING', timerSeconds: 0, timerMode: 'UP', timerCaption: 'JUARA 3', isTimerRunning: false, isHighlighted: false },
    { id: 'D3-FIN', day: 3, group: 'GRAND FINAL', teamA: 'Menang SF 1', schoolA: 'FINALIS A', logoA: '', teamB: 'Menang SF 2', schoolB: 'FINALIS B', logoB: '', scoreA: 0, scoreB: 0, yellowCardsA: 0, redCardsA: 0, yellowCardsB: 0, redCardsB: 0, colorA: 'RED', colorB: 'BLUE', status: 'UPCOMING', timerSeconds: 0, timerMode: 'UP', timerCaption: 'GRAND FINAL', isTimerRunning: false, isHighlighted: false }
  );

  const standings = teamsList.map((t, i) => ({
    rank: i + 1,
    school: t.schoolName,
    team: t.teamName,
    logoUrl: t.logoUrl,
    group: t.group,
    mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, yc: 0, rc: 0
  }));

  return { matches, standings };
};

let rawTeams = createDefaultTeams();
let initialData = buildMatchesFromTeams(rawTeams);

let tournamentState = {
  teams: rawTeams,
  matches: initialData.matches,
  standings: initialData.standings,
  runningText: 'SELAMAT DATANG DI TURNAMEN ROBOT SEPAK BOLA SMA/SMK 2026 • JUNJUNG TINGGI SPORTIVITAS DAN FAIRPLAY',
  lastTickTimestamp: Date.now(),
};

// Helper tick timer count-up / count-down
const tickTimers = () => {
  const now = Date.now();
  const elapsedSecs = Math.floor((now - tournamentState.lastTickTimestamp) / 1000);
  if (elapsedSecs >= 1) {
    tournamentState.matches = tournamentState.matches.map((m) => {
      if (m.isTimerRunning) {
        if (m.timerMode === 'DOWN') {
          const nextSecs = Math.max(0, m.timerSeconds - elapsedSecs);
          return { ...m, timerSeconds: nextSecs, isTimerRunning: nextSecs > 0 };
        } else {
          return { ...m, timerSeconds: m.timerSeconds + elapsedSecs };
        }
      }
      return m;
    });
    tournamentState.lastTickTimestamp = now;
  }
};

export async function GET() {
  tickTimers();
  return NextResponse.json({ success: true, ...tournamentState }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    tickTimers();
    const body = await request.json();
    const { id, action, value, team, delta, cardType, caption, teamsList, runningText, customSeconds, timerMode } = body;

    if (action === 'updateTeamsDetailed' && Array.isArray(teamsList)) {
      tournamentState.teams = teamsList;
      const generated = buildMatchesFromTeams(teamsList);
      tournamentState.matches = generated.matches;
      tournamentState.standings = generated.standings;
      return NextResponse.json({ success: true, ...tournamentState }, { status: 200 });
    }

    if (action === 'setRunningText') {
      tournamentState.runningText = runningText || '';
      return NextResponse.json({ success: true, ...tournamentState }, { status: 200 });
    }

    if (action === 'toggleHighlight') {
      const targetMatch = tournamentState.matches.find(m => m.id === id);
      const targetNextState = targetMatch ? !targetMatch.isHighlighted : false;

      tournamentState.matches.forEach(match => {
        match.isHighlighted = false;
      });

      if (targetMatch) {
        targetMatch.isHighlighted = targetNextState;
      }

      return NextResponse.json({ success: true, ...tournamentState }, { status: 200 });
    }

    tournamentState.matches = tournamentState.matches.map((m) => {
      if (m.id === id) {
        if (action === 'updateScore') {
          return {
            ...m,
            scoreA: team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA,
            scoreB: team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB,
          };
        }
        if (action === 'updateStatus') {
          return { ...m, status: value, isHighlighted: value === 'LIVE' ? true : m.isHighlighted };
        }
        if (action === 'updateCards') {
          const isYellow = cardType === 'yellow';
          return {
            ...m,
            yellowCardsA: team === 'A' && isYellow ? Math.max(0, (m.yellowCardsA || 0) + delta) : m.yellowCardsA,
            redCardsA: team === 'A' && !isYellow ? Math.max(0, (m.redCardsA || 0) + delta) : m.redCardsA,
            yellowCardsB: team === 'B' && isYellow ? Math.max(0, (m.yellowCardsB || 0) + delta) : m.yellowCardsB,
            redCardsB: team === 'B' && !isYellow ? Math.max(0, (m.redCardsB || 0) + delta) : m.redCardsB,
          };
        }
        if (action === 'toggleCornerColor') {
          if (team === 'A') {
            return { ...m, colorA: m.colorA === 'RED' ? 'BLUE' : 'RED' };
          } else {
            return { ...m, colorB: m.colorB === 'BLUE' ? 'RED' : 'BLUE' };
          }
        }
        if (action === 'toggleTimer') {
          return { ...m, isTimerRunning: !m.isTimerRunning };
        }
        if (action === 'setTimerMode') {
          return { ...m, timerMode: timerMode || 'UP' };
        }
        if (action === 'setTimerSeconds') {
          const secs = Math.max(0, parseInt(customSeconds) || 0);
          return { ...m, timerSeconds: secs };
        }
        if (action === 'resetTimer') {
          return { ...m, timerSeconds: m.timerMode === 'DOWN' ? 1200 : 0, isTimerRunning: false };
        }
        if (action === 'setTimerCaption') {
          return { ...m, timerCaption: caption };
        }
      }
      return m;
    });

    return NextResponse.json({ success: true, ...tournamentState }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  }
}