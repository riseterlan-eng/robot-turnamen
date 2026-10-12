'use client';

import React, { useEffect, useState } from 'react';

export default function BracketTreePage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);

  useEffect(() => {
    fetch('/api/feat-bracket-engine')
      .then((res) => res.json())
      .then((data) => {
        if (data.matches) setMatches(data.matches);
      });
  }, []);

  const filteredMatches = matches.filter((m) => m.day === activeDay);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wide">Bagan Turnamen & Jadwal Match</h1>
            <p className="text-xs text-slate-400">Struktur Pertandingan Resmi 3 Hari</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeDay === d ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hari {d}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 font-mono">{m.id} &bull; {m.group}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  m.status === 'LIVE' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {m.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    {m.logoA && <img src={m.logoA} alt="logo" className="w-5 h-5 object-contain rounded bg-white p-0.5" />}
                    <div>
                      <span className="text-[9px] text-blue-400 font-bold block">{m.schoolA}</span>
                      <span className="text-xs font-semibold text-slate-200">{m.teamA}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">{m.scoreA}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    {m.logoB && <img src={m.logoB} alt="logo" className="w-5 h-5 object-contain rounded bg-white p-0.5" />}
                    <div>
                      <span className="text-[9px] text-blue-400 font-bold block">{m.schoolB}</span>
                      <span className="text-xs font-semibold text-slate-200">{m.teamB}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">{m.scoreB}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}