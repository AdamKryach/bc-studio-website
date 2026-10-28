import React, { useState } from 'react';
import { Game } from '../../types';
import { Link, useRouter } from '../../context/RouterContext';
import { Download, Play, ShieldAlert, Sparkles, Monitor, Layers, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../api';

interface GameCardProps {
  game: Game;
  onOpenPlaytest?: (game: Game) => void;
}

export function GameCard({ game, onOpenPlaytest }: GameCardProps) {
  const { navigate } = useRouter();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!game.hasReleaseBuild) {
      setDownloadError('Release build coming soon.');
      setTimeout(() => setDownloadError(null), 3000);
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);
      const res = await api.getGameDownloadUrl(game.slug);
      // Trigger download via window navigation to the secure token URL
      window.location.href = res.downloadUrl;
    } catch (err: any) {
      setDownloadError(err.message || 'Download failed. Please try again.');
      setTimeout(() => setDownloadError(null), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const handleTestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onOpenPlaytest) {
      onOpenPlaytest(game);
    } else {
      navigate(`/games/${game.slug}#playtest`);
    }
  };

  const showDownload = game.availabilityMode === 'download' || game.availabilityMode === 'download_and_test';
  const showTest = game.availabilityMode === 'test_only' || game.availabilityMode === 'download_and_test';

  return (
    <div
      onClick={() => navigate(`/games/${game.slug}`)}
      className="group cursor-pointer rounded-2xl bg-[#0f121d]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)] flex flex-col overflow-hidden relative"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={game.thumbnailUrl || game.coverImageUrl}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-transparent to-transparent opacity-90" />

        {/* Mode Badge in top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {game.availabilityMode === 'download' && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
              Public Release
            </span>
          )}
          {game.availabilityMode === 'test_only' && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
              Playtest Active
            </span>
          )}
          {game.availabilityMode === 'download_and_test' && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
              Download + Playtest
            </span>
          )}
        </div>

        {/* Genre & Version in bottom left */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20 backdrop-blur-sm">
            {game.genre}
          </span>
          <span className="text-slate-400">v{game.version}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            {game.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Platforms and release info */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-slate-400" />
            <span>{game.platforms.join(' / ')}</span>
          </div>
          <span>{game.releaseDate}</span>
        </div>

        {/* Error notification if build is unavailable */}
        {downloadError && (
          <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}

        {/* Action Buttons strictly obeying the 3 modes */}
        <div className="pt-2 flex items-center gap-2">
          {showDownload && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                game.hasReleaseBuild
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black hover:shadow-cyan-500/20 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {downloading ? 'Preparing...' : game.hasReleaseBuild ? 'Download' : 'Build Pending'}
              </span>
            </button>
          )}

          {showTest && (
            <button
              onClick={handleTestClick}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold transition-all border ${
                game.availabilityMode === 'test_only'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:bg-purple-900/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Playtest</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
