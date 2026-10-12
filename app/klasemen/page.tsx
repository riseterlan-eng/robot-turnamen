'use client';

import React, { useEffect, useState } from 'react';

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<'table' | 'status'>('table');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/feat-bracket-engine')
      .then((res) => res.json())
      .then((resData) => setData(resData));
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wide">Klasemen Turnamen Robot</h1>
            <p className="text-xs text-slate-400">Poin & Peringkat Kedisiplinan Tim</p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-semibold">
            <button onClick={() => setActiveTab('table')} className={`px-4 py-1.5 rounded-md transition ${activeTab === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Standings</button>
            <button onClick={() => setActiveTab('status')} className={`px-4 py-1.5 rounded-md transition ${activeTab === 'status' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Kedisiplinan</button>
          </div>
        </div>

        {activeTab === 'table' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Pos</th>
                    <th className="p-3.5">Sekolah & Tim</th>
                    <th className="p-3.5 text-center">Grup</th>
                    <th className="p-3.5 text-center">MP</th>
                    <th className="p-3.5 text-center">W</th>
                    <th className="p-3.5 text-center">D</th>
                    <th className="p-3.5 text-center">L</th>
                    <th className="p-3.5 text-center font-bold text-white">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data?.standings?.map((row: any) => (
                    <tr key={row.rank} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-400">{row.rank}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          {row.logoUrl && <img src={row.logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded bg-white p-0.5" />}
                          <div>
                            <span className="text-[10px] text-blue-400 font-bold block">{row.school}</span>
                            <span className="font-extrabold text-slate-200">{row.team}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-400">{row.group}</td>
                      <td className="p-3.5 text-center font-mono">{row.mp}</td>
                      <td className="p-3.5 text-center font-mono">{row.w}</td>
                      <td className="p-3.5 text-center font-mono">{row.d}</td>
                      <td className="p-3.5 text-center font-mono">{row.l}</td>
                      <td className="p-3.5 text-center font-mono font-black text-white text-sm">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rekap Kartu Kuning</h3>
              {data?.standings?.map((t: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg text-xs border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    {t.logoUrl && <img src={t.logoUrl} alt="Logo" className="w-5 h-5 object-contain rounded bg-white p-0.5" />}
                    <span className="font-medium text-slate-200">{t.school} - {t.team}</span>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded font-mono font-bold border border-amber-500/20">{t.yc || 0}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rekap Kartu Merah</h3>
              {data?.standings?.map((t: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg text-xs border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    {t.logoUrl && <img src={t.logoUrl} alt="Logo" className="w-5 h-5 object-contain rounded bg-white p-0.5" />}
                    <span className="font-medium text-slate-200">{t.school} - {t.team}</span>
                  </div>
                  <span className="bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded font-mono font-bold border border-red-500/20">{t.rc || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}