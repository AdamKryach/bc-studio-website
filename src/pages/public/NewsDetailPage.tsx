import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { api } from '../../api';
import { Link, useRouter } from '../../context/RouterContext';
import { ArrowLeft, Calendar, User, Tag, Clock, Share2, AlertCircle } from 'lucide-react';

interface NewsDetailPageProps {
  slug: string;
}

export function NewsDetailPage({ slug }: NewsDetailPageProps) {
  const { navigate } = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await api.getArticle(slug);
        setArticle(res);
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-500">Loading dispatch...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested article does not exist or has been withdrawn by the team.
        </p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to News Feed</span>
        </Link>
      </div>
    );
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to News Feed</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded">
            {article.category}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formattedDate}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> {article.authorLabel || 'Black Cloud Core'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-lg text-slate-300 leading-relaxed font-normal border-l-2 border-cyan-400 pl-4 py-1">
          {article.excerpt}
        </p>
      </header>

      {/* Featured Banner Image */}
      {article.featuredImageUrl && (
        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] w-full bg-slate-900 shadow-2xl">
          <img
            src={article.featuredImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed space-y-6 font-sans whitespace-pre-line bg-[#0c0e17] p-8 rounded-2xl border border-white/10 shadow-xl">
        {article.content}
      </div>

      {/* Tags footer */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1 mr-2">
            <Tag className="w-3.5 h-3.5" /> Tags:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
