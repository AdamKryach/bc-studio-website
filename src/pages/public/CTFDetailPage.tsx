import React, { useState, useEffect } from 'react';
import { CTFEntry } from '../../types';
import { api } from '../../api';
import { Link, useRouter } from '../../context/RouterContext';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  User,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  AlertCircle,
  Award,
} from 'lucide-react';

interface CTFDetailPageProps {
  slug: string;
}

export function CTFDetailPage({ slug }: CTFDetailPageProps) {
  const { navigate } = useRouter();
  const [entry, setEntry] = useState<CTFEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCTF() {
      try {
        const res = await api.getCTFEntry(slug);
        setEntry(res);
      } catch (err) {
        console.error('Failed to load CTF entry', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCTF();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-500">Retrieving technical write-up from database...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Entry Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested CTF write-up does not exist or has not been published yet.
        </p>
        <Link
          to="/ctf"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to CTF Competitions</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/ctf"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to CTF Competitions</span>
        </Link>
      </div>

      {/* Header */}
      <header className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold block">
              {entry.organizer || 'Official Tournament'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {entry.competitionName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{entry.verifiedPlacement}</span>
            </div>
            {entry.score && (
              <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs">
                {entry.score}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date: {entry.eventDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" /> Squad: {entry.teamLabel || 'Black Cloud'}
          </span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Scorecard
          </span>
        </div>
      </header>

      {/* Challenges Broken */}
      {entry.challenges && entry.challenges.length > 0 && (
        <section className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Solved Problem Roster
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entry.challenges.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#07080d] border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-white font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">
                    {c.category}
                  </span>
                  <span className="text-slate-400">+{c.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full Technical Write-Up */}
      <section className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" /> Technical Write-Up & Exploitation Walkthrough
        </h3>
        <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-mono bg-[#07080d] p-6 rounded-xl border border-white/5">
          {entry.writeup}
        </div>
      </section>

      {/* Lessons Learned */}
      {entry.lessonsLearned && (
        <section className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Lessons Learned & Defensive Remediation
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {entry.lessonsLearned}
          </p>
        </section>
      )}

      {/* References */}
      {entry.references && entry.references.length > 0 && (
        <section className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 space-y-3 text-xs font-mono">
          <h4 className="text-slate-400 font-bold uppercase tracking-wider">Tournament References & Archives</h4>
          <ul className="space-y-1.5">
            {entry.references.map((ref, idx) => (
              <li key={idx}>
                <a
                  href={ref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> {ref}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
