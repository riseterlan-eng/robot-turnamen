'use client';

import React, { useState } from 'react';

export default function GoogleDriveConverterPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!inputText.trim()) return;

    const lines = inputText.split('\n');
    const convertedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
      
      if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
      }

      return trimmed;
    });

    setOutputText(convertedLines.join('\n'));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              ⬅️ Beranda
            </button>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wide">Google Drive Link Batch Converter</h1>
              <p className="text-xs text-slate-400">Ubah puluhan link share Google Drive menjadi format direct proyektor secara instan sekaligus.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              1. Tempel Link Google Drive (Banyak Link Sekaligus):
            </label>
            <textarea
              rows={12}
              placeholder={`Contoh:\nhttps://drive.google.com/file/d/1vwXSEPGF.../view?usp=sharing\nhttps://drive.google.com/file/d/1hufgZd3tR.../view?usp=sharing`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-600 resize-none"
            />
            <button
              onClick={handleConvert}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow"
            >
              🔄 Konversi Sekaligus Sekarang
            </button>
          </div>

          {/* Kolom Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 block">
                2. Hasil Link Siap Pakai (Direct Thumbnail):
              </label>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded font-bold transition shadow"
                >
                  {copied ? '✓ Berhasil Disalin!' : '📋 Salin Semua'}
                </button>
              )}
            </div>
            <textarea
              rows={12}
              readOnly
              placeholder="Hasil link yang sudah dikonversi akan muncul di sini..."
              value={outputText}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-amber-400 font-mono focus:outline-none resize-none"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              *Pastikan file di Google Drive sudah diset &quot;Siapa saja yang memiliki link dapat melihat&quot;.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}