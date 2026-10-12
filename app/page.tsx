'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Title & Subtitle */}
        <div className="space-y-3">
          <div className="inline-block bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            NEXT.JS APP ROUTER SYSTEM
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            HIGH SCHOOL ROBOT SOCCER CHAMPIONSHIP
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            Sistem Manajemen Turnamen Robot Sepak Bola SMA/SMK. Kontrol Papan Skor, Timer Fleksibel, Bagan, Klasemen, dan Display Proyektor Live.
          </p>
        </div>

        {/* Navigation Grid Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          
          {/* Operator */}
          <Link 
            href="/operator" 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 transition shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🎛️
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Operator</h3>
              <p className="text-xs text-slate-400 mt-1">Kontrol Skor, Timer, Status Match, & Logo</p>
            </div>
          </Link>

          {/* Proyektor */}
          <Link 
            href="/proyek" 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 transition shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🖥️
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Proyektor</h3>
              <p className="text-xs text-slate-400 mt-1">Tampilan Scoreboard Live Broadcast Arena</p>
            </div>
          </Link>

          {/* Converter */}
          <Link 
            href="/converter" 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 transition shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🔄
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Converter Link</h3>
              <p className="text-xs text-slate-400 mt-1">Konversi Batch Link Logo Google Drive</p>
            </div>
          </Link>

          {/* Bagan & Klasemen */}
          <Link 
            href="/bagan" 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 transition shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
              🏆
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Bagan & Klasemen</h3>
              <p className="text-xs text-slate-400 mt-1">Bagan Playoff Knockout & Standings Grup</p>
            </div>
          </Link>

        </div>

        {/* Footer info */}
        <p className="text-xs text-slate-500 font-mono pt-6">
          System Control Center &bull; Turnamen Robot Sepak Bola 2026
        </p>

      </div>
    </main>
  );
}