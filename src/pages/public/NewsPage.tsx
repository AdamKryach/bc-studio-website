import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { api } from '../../api';
import { NewsCard } from '../../components/public/NewsCard';
import { Terminal, Search, Filter } from 'lucide-react';

export function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Announcement',
    'Game Release',
    'Devlog',
    'CTF Report',
    'Cybersecurity Research',
    'Technical',
  ];

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await api.getNews();
        setArticles(res);
      } catch (err) {
        console.error('Failed to load news', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchesCategory = category === 'All' || a.category === category;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-md">
          <Terminal className="w-4 h-4" />
          <span>Studio Dispatches</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          News, Devlogs & Security Research
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Official development updates, game release notes, CTF competition retrospects, and deep technical engineering write-ups from the Black Cloud core team.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c0e17] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                category === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles & tags..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
          <Terminal className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No dispatches match your filter</h3>
          <p className="text-xs font-mono text-slate-400">
            Check back later for new releases or adjust your search filter.
          </p>
        </div>
      )}
    </div>
  );
}
