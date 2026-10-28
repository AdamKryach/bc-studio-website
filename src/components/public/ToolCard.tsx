import React from 'react';
import { SecurityTool } from '../../types';
import { Link } from '../../context/RouterContext';
import { Shield, ExternalLink, Terminal, Cpu, Info, ArrowUpRight } from 'lucide-react';

interface ToolCardProps {
  tool: SecurityTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const statusColors: Record<string, string> = {
    Active: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    Beta: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    Research: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    Archived: 'text-slate-400 bg-slate-900 border-white/10',
  };

  const statusBadge = statusColors[tool.status] || 'text-slate-400 bg-slate-900 border-white/10';

  return (
    <div className="group rounded-2xl bg-[#0f121d]/85 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.09)] flex flex-col justify-between p-6">
      <div className="space-y-4">
        {/* Header with thumbnail/icon & status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/30 border border-purple-500/20 overflow-hidden flex items-center justify-center shrink-0">
              {tool.thumbnailUrl ? (
                <img
                  src={tool.thumbnailUrl}
                  alt={tool.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Shield className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                <Link to={`/tools/${tool.slug}`}>{tool.title}</Link>
              </h3>
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${statusBadge}`}>
                {tool.status}
              </span>
            </div>
          </div>
        </div>

        {/* Short description */}
        <p className="text-sm text-slate-300 leading-relaxed">
          {tool.shortDescription}
        </p>

        {/* Purpose summary */}
        {tool.purpose && (
          <div className="p-3 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Core Purpose
            </span>
            <p className="text-xs text-slate-300 font-mono">
              {tool.purpose}
            </p>
          </div>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tool.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono text-cyan-300/90 bg-cyan-950/30 px-2.5 py-0.5 rounded border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions (Showcase only, strictly NO download buttons) */}
      <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <Link
          to={`/tools/${tool.slug}`}
          className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Architecture & Details</span>
        </Link>

        <div className="flex items-center gap-2">
          {tool.projectUrl && (
            <a
              href={tool.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors"
              title="Official Project Repository"
            >
              <span>Repository</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {tool.documentationUrl && (
            <a
              href={tool.documentationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/5 transition-colors"
              title="Official Documentation"
            >
              <span>Docs</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
