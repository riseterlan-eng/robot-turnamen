'use client';

import React, { useEffect, useState } from 'react';

export default function OperatorPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  // Settings Form State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [numGroups, setNumGroups] = useState<number>(9);
  const [teamsPerGroup, setTeamsPerGroup] = useState<number>(3);
  const [editableTeams, setEditableTeams] = useState<any[]>([]);
  const [runningTextInput, setRunningTextInput] = useState('');

  // Custom Time per Match
  const [customTimeInputs, setCustomTimeInputs] = useState<{ [matchId: string]: { minutes: string; seconds: string } }>({});

  const fetchMatches = async (isBackground = false) => {
    try {
      const res = await fetch('/api/feat-bracket-engine');
      const data = await res.json();
      if (data.matches) setMatches(data.matches);
      
      if (data.teams && !showConfigModal && !isBackground && editableTeams.length === 0) {
        setEditableTeams(data.teams);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(true), 2000);
    return () => clearInterval(interval);
  }, [showConfigModal]);

  const openConfigModal = async () => {
    try {
      const res = await fetch('/api/feat-bracket-engine');
      const data = await res.json();
      if (data.teams) {
        setEditableTeams(JSON.parse(JSON.stringify(data.teams)));
      }
    } catch (e) {
      console.error(e);
    }
    setShowConfigModal(true);
  };

  const sendUpdate = async (payload: any) => {
    await fetch('/api/feat-bracket-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    fetchMatches(true);
  };

  const handleGenerateGrid = () => {
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const newTeams: any[] = [];
    let count = 1;

    for (let g = 0; g < numGroups; g++) {
      const gLetter = groupLetters[g] || `G${g + 1}`;
      for (let t = 0; t < teamsPerGroup; t++) {
        newTeams.push({
          id: `T${count}`,
          group: `Grup ${gLetter}`,
          schoolName: `SMA NEGERI ${count}`,
          teamName: `ROBOT TEAM ${count}`,
          logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=School${count}`,
        });
        count++;
      }
    }
    setEditableTeams(newTeams);
  };

  const handleSaveTeamsConfig = () => {
    sendUpdate({ action: 'updateTeamsDetailed', teamsList: editableTeams });
    setShowConfigModal(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetCustomTime = (matchId: string) => {
    const matchInput = customTimeInputs[matchId] || { minutes: '0', seconds: '0' };
    const mins = parseInt(matchInput.minutes) || 0;
    const secs = parseInt(matchInput.seconds) || 0;
    const totalSecs = mins * 60 + secs;

    sendUpdate({ id: matchId, action: 'setTimerSeconds', customSeconds: totalSecs });
  };

  const filteredMatches = matches.filter((m) => m.day === selectedDay);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Control */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              ⬅️ Beranda
            </button>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wide">Operator Control Center</h1>
              <p className="text-xs text-slate-400">Timer Flexible, Custom Caption, Logo Auto-Fit & Kontrol Proyektor</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              onClick={openConfigModal}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shadow"
            >
              ⚙️ Pengaturan Tim & Logo Sekolah
            </button>
            
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-4 py-1 rounded-md text-xs font-semibold transition ${
                    selectedDay === d ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hari {d}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* MODAL KONFIGURASI TIM & SEKOLAH */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl p-6 rounded-2xl space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Konfigurasi Grup, Tim & Logo Sekolah</h3>
                <button onClick={() => setShowConfigModal(false)} className="text-xs text-slate-400 hover:text-white font-bold">✕ Tutup</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">Jumlah Grup:</label>
                  <input
                    type="number" min={1} max={12}
                    value={numGroups}
                    onChange={(e) => setNumGroups(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs font-bold text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-semibold">Tim per Grup:</label>
                  <input
                    type="number" min={2} max={6}
                    value={teamsPerGroup}
                    onChange={(e) => setTeamsPerGroup(parseInt(e.target.value) || 2)}
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs font-bold text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={handleGenerateGrid} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 p-2 rounded text-xs font-bold transition">
                    Generate Grid ({numGroups * teamsPerGroup} Tim)
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {editableTeams.map((t, idx) => (
                  <div key={t.id || idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2 items-center text-xs">
                    <div className="font-mono font-bold text-blue-400 text-[11px]">{t.group} ({t.id})</div>
                    <input
                      type="text" placeholder="Nama Sekolah"
                      value={t.schoolName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditableTeams((prev) => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], schoolName: val };
                          return updated;
                        });
                      }}
                      className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:border-blue-600"
                    />
                    <input
                      type="text" placeholder="Nama Tim / Robot"
                      value={t.teamName || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditableTeams((prev) => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], teamName: val };
                          return updated;
                        });
                      }}
                      className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:border-blue-600 font-bold"
                    />
                    <input
                      type="text" placeholder="URL Logo Sekolah"
                      value={t.logoUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditableTeams((prev) => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], logoUrl: val };
                          return updated;
                        });
                      }}
                      className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-400 focus:border-blue-600 font-mono text-[10px]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button onClick={() => setShowConfigModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs font-bold">Batal</button>
                <button onClick={handleSaveTeamsConfig} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold shadow">
                  Simpan & Re-Generate Turnamen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Running Text */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <span className="text-xs text-slate-300 font-bold whitespace-nowrap">📢 Text Berjalan Proyektor:</span>
          <input
            type="text"
            placeholder="Ketik teks pengumuman / sponsor di sini..."
            value={runningTextInput}
            onChange={(e) => setRunningTextInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => sendUpdate({ action: 'setRunningText', runningText: runningTextInput })}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow"
          >
            Update Banner Teks
          </button>
        </div>

        {/* Daftar Match Control */}
        {loading ? (
          <p className="text-slate-400 text-sm">Memuat data pertandingan...</p>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((m) => (
              <div 
                key={m.id} 
                className={`bg-slate-900 border p-5 rounded-xl shadow-lg space-y-4 transition ${
                  m.isHighlighted ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-800'
                }`}
              >
                {/* Header Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded font-bold">
                      {m.id}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{m.group} (Hari {m.day})</span>
                    
                    <button
                      onClick={() => sendUpdate({ id: m.id, action: 'toggleHighlight' })}
                      className={`text-xs px-3 py-1 rounded font-semibold transition ${
                        m.isHighlighted ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.isHighlighted ? '🖥️ Proyektor: ON (Klik untuk Matikan)' : 'Proyektor: OFF (Tampilkan)'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-400 mr-1">Status:</span>
                    {['UPCOMING', 'LIVE', 'SELESAI'].map((st) => (
                      <button
                        key={st}
                        onClick={() => sendUpdate({ id: m.id, action: 'updateStatus', value: st })}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          m.status === st
                            ? st === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : st === 'SELESAI' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CONTROL TIMER */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-semibold">Mode Timer:</span>
                      <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded text-xs font-bold">
                        <button
                          onClick={() => sendUpdate({ id: m.id, action: 'setTimerMode', timerMode: 'UP' })}
                          className={`px-2.5 py-1 rounded transition ${m.timerMode === 'UP' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        >
                          ▲ Hitung Maju
                        </button>
                        <button
                          onClick={() => sendUpdate({ id: m.id, action: 'setTimerMode', timerMode: 'DOWN' })}
                          className={`px-2.5 py-1 rounded transition ${m.timerMode === 'DOWN' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        >
                          ▼ Hitung Mundur
                        </button>
                      </div>

                      <span className="font-mono text-2xl font-black text-amber-400">{formatTime(m.timerSeconds)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => sendUpdate({ id: m.id, action: 'toggleTimer' })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                          m.isTimerRunning ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                      >
                        {m.isTimerRunning ? '⏸ Pause' : '▶ Start Timer'}
                      </button>
                      <button
                        onClick={() => sendUpdate({ id: m.id, action: 'resetTimer' })}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700"
                      >
                        🔄 Reset
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM CAPTION & BEBAS ATUR WAKTU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold whitespace-nowrap">Custom Caption:</span>
                      <input
                        type="text"
                        placeholder="Contoh: Babak 1, Half Time, Extra Time..."
                        value={m.timerCaption || ''}
                        onChange={(e) => sendUpdate({ id: m.id, action: 'setTimerCaption', caption: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-xs text-amber-400 font-bold focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-400 font-semibold whitespace-nowrap">Set Waktu Bebas:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number" min={0} placeholder="Menit"
                          value={customTimeInputs[m.id]?.minutes ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomTimeInputs((prev) => ({
                              ...prev,
                              [m.id]: { minutes: val, seconds: prev[m.id]?.seconds ?? '0' }
                            }));
                          }}
                          className="w-16 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-600"
                        />
                        <span className="text-slate-400 font-bold">m</span>

                        <input
                          type="number" min={0} max={59} placeholder="Detik"
                          value={customTimeInputs[m.id]?.seconds ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomTimeInputs((prev) => ({
                              ...prev,
                              [m.id]: { minutes: prev[m.id]?.minutes ?? '0', seconds: val }
                            }));
                          }}
                          className="w-14 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-600"
                        />
                        <span className="text-slate-400 font-bold">s</span>

                        <button
                          onClick={() => handleSetCustomTime(m.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition shadow ml-1"
                        >
                          Terapkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score & Corner Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* Tim A */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/95 p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {m.logoA ? (
                            <img 
                              src={m.logoA} 
                              alt="Logo" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${m.schoolA}`;
                              }}
                            />
                          ) : (
                            <span className="text-[8px] font-bold text-slate-400">LOGO</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">{m.schoolA}</span>
                          <span className="text-xs font-extrabold text-slate-100">{m.teamA}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button onClick={() => sendUpdate({ id: m.id, action: 'toggleCornerColor', team: 'A' })} className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.colorA === 'RED' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {m.colorA === 'RED' ? 'MERAH' : 'BIRU'}
                        </button>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateScore', team: 'A', delta: -1 })} className="bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded text-xs font-bold text-slate-300">-</button>
                        <span className="text-lg font-black text-white w-6 text-center">{m.scoreA}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateScore', team: 'A', delta: 1 })} className="bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded text-xs font-bold text-slate-300">+</button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-xs">
                      <span className="text-slate-400">Kartu:</span>
                      <div className="flex gap-2">
                        <span className="text-amber-400 font-semibold">Y: {m.yellowCardsA || 0}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateCards', team: 'A', cardType: 'yellow', delta: 1 })} className="bg-slate-800 px-1.5 rounded text-[10px]">+</button>
                        <span className="text-red-400 font-semibold ml-2">R: {m.redCardsA || 0}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateCards', team: 'A', cardType: 'red', delta: 1 })} className="bg-slate-800 px-1.5 rounded text-[10px]">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Tim B */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/95 p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {m.logoB ? (
                            <img 
                              src={m.logoB} 
                              alt="Logo" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${m.schoolB}`;
                              }}
                            />
                          ) : (
                            <span className="text-[8px] font-bold text-slate-400">LOGO</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">{m.schoolB}</span>
                          <span className="text-xs font-extrabold text-slate-100">{m.teamB}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button onClick={() => sendUpdate({ id: m.id, action: 'toggleCornerColor', team: 'B' })} className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.colorB === 'RED' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {m.colorB === 'RED' ? 'MERAH' : 'BIRU'}
                        </button>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateScore', team: 'B', delta: -1 })} className="bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded text-xs font-bold text-slate-300">-</button>
                        <span className="text-lg font-black text-white w-6 text-center">{m.scoreB}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateScore', team: 'B', delta: 1 })} className="bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded text-xs font-bold text-slate-300">+</button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-xs">
                      <span className="text-slate-400">Kartu:</span>
                      <div className="flex gap-2">
                        <span className="text-amber-400 font-semibold">Y: {m.yellowCardsB || 0}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateCards', team: 'B', cardType: 'yellow', delta: 1 })} className="bg-slate-800 px-1.5 rounded text-[10px]">+</button>
                        <span className="text-red-400 font-semibold ml-2">R: {m.redCardsB || 0}</span>
                        <button onClick={() => sendUpdate({ id: m.id, action: 'updateCards', team: 'B', cardType: 'red', delta: 1 })} className="bg-slate-800 px-1.5 rounded text-[10px]">+</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}