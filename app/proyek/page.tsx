'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function ProjectorViewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const projectorRef = useRef<HTMLDivElement>(null);

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/feat-bracket-engine');
      const resData = await res.json();
      if (resData) setData(resData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      projectorRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const matches = data?.matches || [];
  const highlightedMatch = matches.find((m: any) => m.isHighlighted === true);

  return (
    <div ref={projectorRef} className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-6 md:p-10 font-sans select-none overflow-hidden">
      
      {/* Broadcast Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
              window.location.href = '/';
            }}
            className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            ⬅️ Beranda
          </button>
          <div className="bg-blue-600 text-white font-black px-3.5 py-1.5 rounded text-xs tracking-widest uppercase shadow">
            LIVE ARENA BROADCAST
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-white uppercase">
              HIGH SCHOOL ROBOT SOCCER CHAMPIONSHIP
            </h1>
            <p className="text-xs text-slate-400 font-medium font-mono">Official Scoreboard Display</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullScreen}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            ⛶ Full Screen
          </button>

          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold rounded">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            ON AIR
          </span>
        </div>
      </header>

      {/* SCOREBOARD BOARD */}
      {loading ? (
        <div className="text-center text-slate-400 text-lg my-auto">Menyiapkan papan skor...</div>
      ) : highlightedMatch ? (
        <div className="flex-1 flex flex-col justify-center items-center max-w-[1400px] mx-auto w-full my-6 space-y-8">
          
          <div className="bg-slate-900 border border-slate-800 px-6 py-1.5 rounded-full text-slate-300 font-mono text-xs font-bold uppercase tracking-widest shadow-sm">
            {highlightedMatch.id} &bull; {highlightedMatch.group} &bull; HARI {highlightedMatch.day}
          </div>

          <div className="w-full bg-[#111827] border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            
            {/* SISI TIM A */}
            <div className="flex-1 flex items-center justify-between w-full md:border-r border-slate-800 md:pr-6 gap-4 min-w-0">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {highlightedMatch.logoA ? (
                    <img 
                      src={highlightedMatch.logoA} 
                      alt="Logo A" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${highlightedMatch.schoolA}`;
                      }}
                    />
                  ) : (
                    <span className="text-[10px] font-black text-slate-400">LOGO</span>
                  )}
                </div>
                
                <div className="text-left min-w-0 flex-1 flex flex-col justify-center">
                  <span className="text-xs md:text-sm font-black text-blue-400 uppercase tracking-wide block leading-tight">
                    {highlightedMatch.schoolA}
                  </span>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight uppercase my-0.5 break-words">
                    {highlightedMatch.teamA}
                  </h2>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white ${highlightedMatch.colorA === 'RED' ? 'bg-red-600' : 'bg-blue-600'}`}>
                      {highlightedMatch.colorA === 'RED' ? 'SUDUT MERAH' : 'SUDUT BIRU'}
                    </span>
                  </div>
                </div>
              </div>

              <span className="font-mono text-5xl md:text-7xl font-black text-white px-2 flex-shrink-0">
                {highlightedMatch.scoreA}
              </span>
            </div>

            {/* LED TIMER BOX */}
            <div className="bg-[#090d16] border-2 border-amber-500/60 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-center min-w-[200px] md:min-w-[220px] shadow-2xl flex-shrink-0">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold block mb-1">
                {highlightedMatch.timerCaption || 'BABAK 1'}
              </span>
              <span className="font-mono text-4xl md:text-6xl font-black text-amber-400 tracking-wider block">
                {formatTime(highlightedMatch.timerSeconds)}
              </span>
            </div>

            {/* SISI TIM B */}
            <div className="flex-1 flex items-center justify-between w-full md:border-l border-slate-800 md:pl-6 gap-4 min-w-0">
              <span className="font-mono text-5xl md:text-7xl font-black text-white px-2 flex-shrink-0">
                {highlightedMatch.scoreB}
              </span>

              <div className="flex items-center gap-4 text-right min-w-0 flex-1 justify-end">
                <div className="text-right min-w-0 flex-1 flex flex-col justify-center items-end">
                  <span className="text-xs md:text-sm font-black text-blue-400 uppercase tracking-wide block leading-tight">
                    {highlightedMatch.schoolB}
                  </span>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight uppercase my-0.5 break-words">
                    {highlightedMatch.teamB}
                  </h2>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white ${highlightedMatch.colorB === 'RED' ? 'bg-red-600' : 'bg-blue-600'}`}>
                      {highlightedMatch.colorB === 'RED' ? 'SUDUT MERAH' : 'SUDUT BIRU'}
                    </span>
                  </div>
                </div>

                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {highlightedMatch.logoB ? (
                    <img 
                      src={highlightedMatch.logoB} 
                      alt="Logo B" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${highlightedMatch.schoolB}`;
                      }}
                    />
                  ) : (
                    <span className="text-[10px] font-black text-slate-400">LOGO</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="flex gap-8 text-xs font-semibold text-slate-400 bg-slate-900/60 px-6 py-2.5 rounded-xl border border-slate-800">
            <div>🟨 Kartu Kuning: {highlightedMatch.teamA} ({highlightedMatch.yellowCardsA || 0}) &bull; {highlightedMatch.teamB} ({highlightedMatch.yellowCardsB || 0})</div>
            <div>&bull;</div>
            <div>🟥 Kartu Merah: {highlightedMatch.teamA} ({highlightedMatch.redCardsA || 0}) &bull; {highlightedMatch.redCardsB || 0}</div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center my-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-3xl animate-pulse">
            🖥️
          </div>
          <h2 className="text-xl font-bold text-slate-400 tracking-wider uppercase">Papan Skor Dimatikan</h2>
          <p className="text-xs text-slate-500 font-mono">Menunggu Operator Mengaktifkan Pertandingan...</p>
        </div>
      )}

      {/* CONTINUOUS TICKER BANNER */}
      <footer className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-3.5 overflow-hidden flex items-center shadow-lg">
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-base md:text-lg font-extrabold tracking-wider text-slate-100 uppercase">
            {data?.runningText || 'SELAMAT DATANG DI TURNAMEN ROBOT SEPAK BOLA SMA/SMK 2026 • JUNJUNG TINGGI SPORTIVITAS DAN FAIRPLAY'}
          </div>
        </div>
      </footer>

    </div>
  );
}