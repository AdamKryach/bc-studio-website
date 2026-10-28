import React, { useState, useEffect } from 'react';
import { Game, NewsArticle, SecurityTool, CTFEntry, StudioSettings } from '../../types';
import { api } from '../../api';
import { GameCard } from '../../components/public/GameCard';
import { NewsCard } from '../../components/public/NewsCard';
import { ToolCard } from '../../components/public/ToolCard';
import { CTFCard } from '../../components/public/CTFCard';
import { PlaytestModal } from '../../components/public/PlaytestModal';
import { Link } from '../../context/RouterContext';
import {
  Gamepad2,
  Shield,
  Terminal,
  Trophy,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  settings: StudioSettings | null;
}

export function HomePage({ settings }: HomePageProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [tools, setTools] = useState<SecurityTool[]>([]);
  const [ctf, setCtf] = useState<CTFEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaytestGame, setSelectedPlaytestGame] = useState<Game | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [gamesRes, newsRes, toolsRes, ctfRes] = await Promise.all([
          api.getGames(),
          api.getNews(),
          api.getTools(),
          api.getCTF(),
        ]);
        setGames(gamesRes);
        setNews(newsRes.slice(0, 3));
        setTools(toolsRes.filter((t) => t.featured).slice(0, 3));
        setCtf(ctfRes.slice(0, 2));
      } catch (err) {
        console.error('Failed to load studio home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredGames = games.filter((g) => g.featured).slice(0, 3);
  const displayGames = featuredGames.length > 0 ? featuredGames : games.slice(0, 3);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Playtest Modal */}
      <PlaytestModal game={selectedPlaytestGame} onClose={() => setSelectedPlaytestGame(null)} />

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Subtle digital grid & glow background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl opacity-60 rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">BLACK CLOUD</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Independent Studio Established 2021</span>
          </div>

          {/* Master Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Building Games.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Exploring Technology.
            </span>{' '}
            Securing the Future.
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            Black Cloud is an independent game development studio and offensive cybersecurity research laboratory founded in 2021.
            We craft immersive tactical experiences, engineer high-throughput game networking protocols, and publish cutting-edge CTF security research.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/games"
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore Games & Playtests</span>
            </Link>

            <Link
              to="/tools"
              className="px-6 py-3.5 rounded-xl bg-[#121624] hover:bg-[#1a2034] text-slate-200 hover:text-white border border-white/10 hover:border-purple-500/30 font-medium text-sm transition-all duration-200 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Cybersecurity Tools Showcase</span>
            </Link>

            <Link
              to="/ctf"
              className="px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-mono text-sm transition-colors flex items-center gap-1.5"
            >
              <span>CTF Write-Ups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Live Studio Metrics Bar */}
          <div className="pt-12 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c0e17]/80 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">2021</div>
              <div className="text-xs text-slate-400 font-mono mt-1">Year Founded</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0e17]/80 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
                {games.length || 3}+
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">Games & Prototypes</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0e17]/80 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                Top 4%
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">DEF CON CTF Finish</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0e17]/80 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black font-mono text-sky-400">
                {tools.length || 4}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">Security Frameworks</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED GAMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Gamepad2 className="w-4 h-4" />
              <span>Studio Game Production</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Titles & Playtests
            </h2>
          </div>
          <Link
            to="/games"
            className="text-sm font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View All Games ({games.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : displayGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onOpenPlaytest={(g) => setSelectedPlaytestGame(g)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 font-mono text-sm">
            No games currently published in catalog. Check back soon for updates.
          </div>
        )}
      </section>

      {/* DUAL PILLAR PROMISE / STUDIO PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#111422] to-[#0a0c14] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                Our Engineering Discipline
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Where Game Mechanics Meet Offensive Security Research
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                At Black Cloud, game development and cybersecurity are two faces of the same engineering coin.
                Simulating physical worlds requires understanding memory layouts, cache performance, and deterministic math;
                cybersecurity requires understanding how systems behave under adversarial edge cases.
              </p>
              <ul className="space-y-3 text-sm text-slate-300 font-mono">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Custom deterministic engine R&D (C++ / Rust / Vulkan)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Adversarial game networking & anti-tamper protocol defense</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Active Capture The Flag (CTF) security team & open research</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  <span>Learn More About Our Journey Since 2021</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Terminal Showcase */}
            <div className="rounded-2xl bg-[#06070a] border border-cyan-500/20 p-5 font-mono text-xs shadow-2xl shadow-black/80 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-slate-400 font-semibold">blackcloud@lab-node-01:~$</span>
                </div>
                <span className="text-[10px] text-cyan-400">EST. 2021</span>
              </div>
              <div className="space-y-2 text-slate-300 leading-relaxed">
                <p className="text-cyan-400">
                  <span className="text-purple-400">$</span> ./bc_telemetry --status --all
                </p>
                <p className="text-slate-400">
                  [+] Black Cloud Core Systems Initialized (Kernel 6.8.0-rt)
                  <br />
                  [+] Physics Engine: Vortex v0.8.4 [120Hz Tickrate]
                  <br />
                  [+] Shadow Protocol: Netcode Cluster [ACTIVE]
                  <br />
                  [+] CTF Squad: DEF CON 32 Quals — Rank 38 / 920 [VERIFIED]
                  <br />
                  [+] Public Downloads: High-speed CDN mirror [ONLINE]
                  <br />
                  [+] Access Control: Public Free Access • Private Team Portal
                </p>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 text-[11px]">
                  &gt; "Building Games. Exploring Technology. Securing the Future."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CYBERSECURITY TOOLS SHOWCASE SECTION (Strictly no downloads!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              <span>Security Research Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Technical Tools & Tooling
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Information and technical architecture catalog only. No executable binaries are distributed.
            </p>
          </div>
          <Link
            to="/tools"
            className="text-sm font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Explore All Tools</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* LATEST STUDIO NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>Studio Transmissions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Latest News & Devlogs
            </h2>
          </div>
          <Link
            to="/news"
            className="text-sm font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Read All News</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* CTF ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
              <Trophy className="w-4 h-4" />
              <span>Competitive Cybersecurity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Capture The Flag (CTF) & Exploitation Research
            </h2>
          </div>
          <Link
            to="/ctf"
            className="text-sm font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>All CTF Reports</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ctf.map((entry) => (
            <CTFCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/30 via-[#101422] to-purple-950/30 border border-white/10 p-12 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Have Questions, Playtest Logs, or Security Inquiries?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We welcome feedback on our game builds, suggestions from fellow game developers, and responsible security disclosures.
            No user registration or account creation is required to connect with Black Cloud.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-semibold text-sm transition-all"
            >
              Contact Studio Team
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-sm border border-white/10 transition-colors"
            >
              About Black Cloud (Est. 2021)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
