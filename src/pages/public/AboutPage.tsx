import React from 'react';
import { StudioSettings } from '../../types';
import { Link } from '../../context/RouterContext';
import {
  Gamepad2,
  Shield,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface AboutPageProps {
  settings: StudioSettings | null;
}

export function AboutPage({ settings }: AboutPageProps) {
  const foundedYear = settings?.foundedYear || 2021;
  const studioName = settings?.studioName || 'Black Cloud';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-md">
          <Terminal className="w-4 h-4" />
          <span>About {studioName}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Pioneering Games & Pushing Cybersecurity Frontiers Since {foundedYear}
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          {settings?.description ||
            'Black Cloud is an independent development studio established in 2021. We operate at the intersection of video game craftsmanship, low-level systems engineering, and offensive cybersecurity research.'}
        </p>
      </div>

      {/* Origin Story */}
      <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          Our Origin & Engineering Philosophy
        </h2>
        <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
          <p>
            Established in {foundedYear}, Black Cloud began as an independent engineering initiative focused on deterministic real-time game simulation. Early on, our technical experiments highlighted that high-fidelity gaming infrastructure shares vital characteristics with hardened network security: sub-millisecond serialization, memory compactness, low-jitter scheduling, and resilience against adversarial input manipulation.
          </p>
          <p>
            Rather than separating game design from cybersecurity, we structured Black Cloud to cultivate both disciplines under one roof. Our games benefit from hardened anti-tamper netcode and deterministic physics simulations; simultaneously, our cybersecurity researchers leverage real-time rendering, telemetry visualization, and simulation math to analyze vulnerabilities and construct dynamic analysis tooling.
          </p>
        </div>
      </div>

      {/* The Four Core Pillars */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
          Studio Operational Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Video Game Development</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We design and publish independent tactical stealth, action roguelike, and deterministic physics simulation games. We support community downloads and interactive alpha playtesting with direct visitor access.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Cybersecurity Tooling & Research</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our research team explores binary analysis, runtime instrumentation, stateful protocol fuzzing, and eBPF observability. We publish non-weaponized architectural breakdowns and tooling documentation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Competitive CTF Squad</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We regularly compete in top international Capture The Flag cybersecurity tournaments (such as DEF CON Qualifiers and Google CTF), testing our skills in heap exploitation, cryptanalysis, and reverse engineering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Open Knowledge & Disclosures</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We believe in transparent engineering: technical devlogs, peer-reviewed post-mortems, and responsible vulnerability disclosures that help make the developer ecosystem safer and more capable.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline from 2021 */}
      <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-8 sm:p-12 space-y-8">
        <h2 className="text-2xl font-bold text-white">Studio Timeline</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-white/10">
          <div className="relative pl-8 sm:pl-10 space-y-1">
            <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-cyan-400 -translate-x-1/2 ring-4 ring-cyan-950" />
            <span className="text-xs font-mono font-semibold text-cyan-400">2021</span>
            <h3 className="text-base font-bold text-white">Foundation of Black Cloud</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Studio founded with an initial focus on lightweight custom C++ game engine architecture and experimental physics mechanics.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-10 space-y-1">
            <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-purple-400 -translate-x-1/2 ring-4 ring-purple-950" />
            <span className="text-xs font-mono font-semibold text-purple-400">2022</span>
            <h3 className="text-base font-bold text-white">Release of Null Sector: Breach & ByteTrace</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Launched our first commercial release along with open architecture publication of the ByteTrace dynamic execution tracer.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-10 space-y-1">
            <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-amber-400 -translate-x-1/2 ring-4 ring-amber-950" />
            <span className="text-xs font-mono font-semibold text-amber-400">2023 - 2024</span>
            <h3 className="text-base font-bold text-white">Shadow Protocol Launch & International CTF Placements</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Released *Shadow Protocol: Echoes* tactical espionage simulation; secured Top 4% international finish in DEF CON 32 CTF Qualifiers.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-10 space-y-1">
            <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full bg-emerald-400 -translate-x-1/2 ring-4 ring-emerald-950" />
            <span className="text-xs font-mono font-semibold text-emerald-400">2025 - 2026</span>
            <h3 className="text-base font-bold text-white">Vortex Engine Playground & Next-Gen Production</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Advancing deterministic physics demonstrator tests and expanding our collaborative research in multiplayer netcode safety.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
        >
          <span>Get In Touch With The Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
