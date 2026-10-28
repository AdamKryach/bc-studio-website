import React, { useState, useEffect } from 'react';
import { CTFEntry } from '../../types';
import { api } from '../../api';
import { CTFCard } from '../../components/public/CTFCard';
import { Trophy, ShieldCheck, Terminal, Award, CheckCircle2 } from 'lucide-react';

export function CTFPage() {
  const [entries, setEntries] = useState<CTFEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCTF() {
      try {
        const res = await api.getCTF();
        setEntries(res);
      } catch (err) {
        console.error('Failed to load CTF entries', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCTF();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/30 border border-amber-500/20 px-3 py-1 rounded-md">
          <Trophy className="w-4 h-4" />
          <span>Capture The Flag & Security R&D</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          CTF Competitions & Vulnerability Write-Ups
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          The Black Cloud security squad participates in elite international cybersecurity Capture The Flag competitions. Here we document verified tournament standings, challenge solutions, heap exploitation primitives, and cryptographic lessons learned.
        </p>
      </div>

      {/* Verified Notice Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-3.5 text-xs font-mono text-cyan-300">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-semibold block">Responsible Disclosure & Integrity Commitment</span>
          <span className="text-slate-400 font-sans">
            All write-ups are published exclusively after tournament conclusion with verified organizer consent. No private challenge files or restricted competition flags are retained or disclosed.
          </span>
        </div>
      </div>

      {/* CTF Entries List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entries.map((entry) => (
            <CTFCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No competition records published yet</h3>
          <p className="text-xs font-mono text-slate-400">
            Check back soon as tournament results and write-ups are reviewed.
          </p>
        </div>
      )}
    </div>
  );
}
