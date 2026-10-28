import React, { useState, useEffect } from 'react';
import { Game } from '../../types';
import { api } from '../../api';
import { GameCard } from '../../components/public/GameCard';
import { PlaytestModal } from '../../components/public/PlaytestModal';
import { Gamepad2, Search, Filter, Sparkles, Download, Layers } from 'lucide-react';

export function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'download' | 'test_only' | 'download_and_test'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedPlaytestGame, setSelectedPlaytestGame] = useState<Game | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await api.getGames();
        setGames(res);
      } catch (err) {
        console.error('Failed to load games', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      g.genre.toLowerCase().includes(search.toLowerCase());

    const matchesMode = modeFilter === 'all' || g.availabilityMode === modeFilter;

    const matchesPlatform =
      platformFilter === 'all' ||
      g.platforms.some((p) => p.toLowerCase().includes(platformFilter.toLowerCase()));

    return matchesSearch && matchesMode && matchesPlatform;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <PlaytestModal game={selectedPlaytestGame} onClose={() => setSelectedPlaytestGame(null)} />

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-md">
          <Gamepad2 className="w-4 h-4" />
          <span>Black Cloud Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Games & Interactive Experiences
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Explore released titles and active playtest projects crafted by Black Cloud since 2021.
          Community downloads are available directly with no visitor account or registration required.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c0e17] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, genres, or keywords..."
            className="w-full pl-10 pr-4 py-2 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 hidden sm:inline">Mode:</span>
          <button
            onClick={() => setModeFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              modeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            All Modes
          </button>
          <button
            onClick={() => setModeFilter('download')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              modeFilter === 'download'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            Download Only
          </button>
          <button
            onClick={() => setModeFilter('test_only')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              modeFilter === 'test_only'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            Playtest Only
          </button>
          <button
            onClick={() => setModeFilter('download_and_test')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              modeFilter === 'download_and_test'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            Download + Test
          </button>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-[#121624] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
            <option value="macos">macOS</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpenPlaytest={(g) => setSelectedPlaytestGame(g)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
          <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No games match your criteria</h3>
          <p className="text-xs font-mono text-slate-400">
            Try adjusting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setModeFilter('all');
              setPlatformFilter('all');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline pt-2"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
