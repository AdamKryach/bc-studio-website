import React, { useState, useEffect } from 'react';
import { SecurityTool } from '../../types';
import { api } from '../../api';
import { Link, useRouter } from '../../context/RouterContext';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Cpu,
  Target,
  ExternalLink,
  Code2,
  AlertCircle,
  FileText,
  ArrowUpRight,
} from 'lucide-react';

interface ToolDetailPageProps {
  slug: string;
}

export function ToolDetailPage({ slug }: ToolDetailPageProps) {
  const { navigate } = useRouter();
  const [tool, setTool] = useState<SecurityTool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTool() {
      try {
        const res = await api.getTool(slug);
        setTool(res);
      } catch (err) {
        console.error('Failed to load tool details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTool();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-500">Loading tool technical documentation...</p>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Tool Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested tool catalog entry does not exist or has been archived.
        </p>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tools Showcase</span>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Active: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    Beta: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    Research: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    Archived: 'text-slate-400 bg-slate-900 border-white/10',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Catalog</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-950/40 border border-purple-500/30 overflow-hidden flex items-center justify-center shrink-0">
              {tool.thumbnailUrl ? (
                <img src={tool.thumbnailUrl} alt={tool.title} className="w-full h-full object-cover" />
              ) : (
                <Shield className="w-10 h-10 text-purple-400" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded border ${statusColors[tool.status]}`}>
                  {tool.status}
                </span>
                <span className="text-xs font-mono text-slate-500">Security Research Lab</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {tool.title}
              </h1>
            </div>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-3">
            {tool.projectUrl && (
              <a
                href={tool.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
              >
                <span>Project Source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
            {tool.documentationUrl && (
              <a
                href={tool.documentationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono border border-white/10 flex items-center gap-2 transition-colors"
              >
                <span>Documentation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {tool.shortDescription}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
          {tool.purpose && (
            <div className="p-4 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold">
                <Target className="w-3.5 h-3.5" /> Primary Purpose
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{tool.purpose}</p>
            </div>
          )}
          {tool.intendedAudience && (
            <div className="p-4 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 font-semibold">
                <Shield className="w-3.5 h-3.5" /> Intended Audience
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{tool.intendedAudience}</p>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
            Implemented Technologies & Runtime
          </span>
          <div className="flex flex-wrap gap-2">
            {tool.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strict Policy Reminder */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center gap-3 text-xs font-mono text-amber-300">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span>
          Non-distribution policy: Black Cloud does not provide pre-compiled public binaries or direct executable downloads for security tooling.
        </span>
      </div>

      {/* Full Architecture & Description */}
      <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-8 space-y-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400" /> Architectural Breakdown & Capabilities
        </h3>
        <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
          {tool.fullDescription}
        </div>
      </div>
    </div>
  );
}
