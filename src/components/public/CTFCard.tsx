import React from 'react';
import { CTFEntry } from '../../types';
import { Link } from '../../context/RouterContext';
import { Trophy, Calendar, Award, CheckCircle2, ChevronRight, Terminal, User } from 'lucide-react';

interface CTFCardProps {
  entry: CTFEntry;
}

export function CTFCard({ entry }: CTFCardProps) {
  const challengeCategoryBadge: Record<string, string> = {
    'Pwn/Binary': 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    Crypto: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    Reverse: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    Web: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    Forensics: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    Misc: 'text-slate-400 bg-slate-900 border-white/10',
  };

  return (
    <div className="group rounded-2xl bg-[#0f121d]/85 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase block">
            {entry.organizer || 'Official CTF Event'}
          </span>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            <Link to={`/ctf/${entry.slug}`}>{entry.competitionName}</Link>
          </h3>
        </div>

        {/* Verified Placement Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>{entry.verifiedPlacement}</span>
          </div>
          {entry.score && (
            <div className="px-2.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs">
              {entry.score}
            </div>
          )}
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-slate-200">
          {entry.title}
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {entry.eventDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <User className="w-3.5 h-3.5" />
            Team: {entry.teamLabel || 'Black Cloud'}
          </span>
        </div>
      </div>

      {/* Challenges Solved */}
      {entry.challenges && entry.challenges.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Key Challenges Broken & Exploited
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {entry.challenges.map((c, idx) => {
              const catClass = challengeCategoryBadge[c.category] || 'text-slate-400 bg-slate-900 border-white/10';
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#07080d] border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-200 truncate">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${catClass}`}>
                      {c.category}
                    </span>
                    <span className="text-slate-500">+{c.points}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="pt-2 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500">Responsible Disclosure Certified</span>
        <Link
          to={`/ctf/${entry.slug}`}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors font-medium"
        >
          <span>Read Technical Write-Up</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
