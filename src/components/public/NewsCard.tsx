import React from 'react';
import { NewsArticle } from '../../types';
import { Link } from '../../context/RouterContext';
import { Calendar, Tag, ArrowRight, User } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  const categoryColorMap: Record<string, string> = {
    Announcement: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    'Game Release': 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    Devlog: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    'CTF Report': 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    'Cybersecurity Research': 'text-blue-400 bg-blue-950/40 border-blue-500/30',
    Technical: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
  };

  const badgeClass =
    categoryColorMap[article.category] || 'text-slate-400 bg-slate-900 border-white/10';

  return (
    <article className="group rounded-2xl bg-[#0f121d]/80 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/news/${article.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 block">
        <img
          src={article.featuredImageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border backdrop-blur-md ${badgeClass}`}>
            {article.category}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <User className="w-3.5 h-3.5" />
              {article.authorLabel || 'Black Cloud'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            <Link to={`/news/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            to={`/news/${article.slug}`}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Read Log</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
