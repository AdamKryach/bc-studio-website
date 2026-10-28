import React, { useState, useEffect } from 'react';
import { Game } from '../../types';
import { api } from '../../api';
import { Link, useRouter } from '../../context/RouterContext';
import { PlaytestModal } from '../../components/public/PlaytestModal';
import {
  ArrowLeft,
  Download,
  Sparkles,
  Monitor,
  Calendar,
  Layers,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  FileText,
} from 'lucide-react';

interface GameDetailPageProps {
  slug: string;
}

export function GameDetailPage({ slug }: GameDetailPageProps) {
  const { navigate } = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [playtestModalOpen, setPlaytestModalOpen] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await api.getGame(slug);
        setGame(res);
        if (res.screenshots && res.screenshots.length > 0) {
          setActiveScreenshot(res.screenshots[0]);
        }
      } catch (err: any) {
        console.error('Failed to load game detail', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-500">Retrieving game record from secure database...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Game Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested title does not exist or has not been published to the catalog yet.
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Games Catalog</span>
        </Link>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!game.hasReleaseBuild) {
      setDownloadError('Release build package has not been uploaded yet.');
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);
      const res = await api.getGameDownloadUrl(game.slug);
      window.location.href = res.downloadUrl;
    } catch (err: any) {
      setDownloadError(err.message || 'Failed to initiate download');
    } finally {
      setDownloading(false);
    }
  };

  const showDownload = game.availabilityMode === 'download' || game.availabilityMode === 'download_and_test';
  const showTest = game.availabilityMode === 'test_only' || game.availabilityMode === 'download_and_test';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <PlaytestModal
        game={playtestModalOpen ? game : null}
        onClose={() => setPlaytestModalOpen(false)}
      />

      {/* Breadcrumb back */}
      <div>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Games Catalog</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0c0e17] border border-white/10 shadow-2xl">
        <div className="relative h-64 sm:h-96 w-full">
          <img
            src={game.coverImageUrl || game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-24 sm:-mt-32 relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                {game.genre}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900/80 text-slate-300 border border-white/10">
                v{game.version}
              </span>
              {game.availabilityMode === 'download' && (
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  Public Download
                </span>
              )}
              {game.availabilityMode === 'test_only' && (
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30">
                  Playtest Only
                </span>
              )}
              {game.availabilityMode === 'download_and_test' && (
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">
                  Download & Playtest
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {game.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {game.shortDescription}
            </p>
          </div>

          {/* Action Area */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            {showDownload && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  game.hasReleaseBuild
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20 hover:scale-[1.02]'
                    : 'bg-slate-800 text-slate-400 border border-white/5 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloading
                    ? 'Generating Token...'
                    : game.hasReleaseBuild
                    ? `Download v${game.version}`
                    : 'Build Coming Soon'}
                </span>
              </button>
            )}

            {showTest && (
              <button
                onClick={() => setPlaytestModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join Playtest</span>
              </button>
            )}
          </div>
        </div>

        {downloadError && (
          <div className="mx-6 sm:mx-10 mb-6 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{downloadError}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Full Description & Screenshots */}
        <div className="lg:col-span-2 space-y-10">
          {/* Detailed Markdown Content */}
          <div className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> About This Game
            </h3>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {game.fullDescription}
            </div>
          </div>

          {/* Screenshots Gallery */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Media Gallery
              </h3>

              {/* Main Screenshot Preview */}
              {activeScreenshot && (
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-white/10">
                  <img
                    src={activeScreenshot}
                    alt={`${game.title} screenshot`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Thumbnails row */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {game.screenshots.map((shot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScreenshot(shot)}
                    className={`aspect-[16/9] rounded-lg overflow-hidden border transition-all ${
                      activeScreenshot === shot
                        ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={shot} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Tech Specs & Requirements */}
        <div className="space-y-6">
          {/* Specification Card */}
          <div className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Technical Details
            </h3>

            <div className="space-y-3 text-xs font-mono divide-y divide-white/5">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Developer</span>
                <span className="text-white">Black Cloud Studio</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Release Date</span>
                <span className="text-white">{game.releaseDate}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Version</span>
                <span className="text-cyan-400">v{game.version}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Platforms</span>
                <span className="text-white">{game.platforms.join(', ')}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Account Requirement</span>
                <span className="text-emerald-400 font-semibold">None (Free Public Access)</span>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          {game.systemRequirements && (
            <div className="rounded-2xl bg-[#0c0e17] border border-white/10 p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" /> System Requirements
              </h3>

              <div className="space-y-4 text-xs font-mono">
                {game.systemRequirements.minimum && (
                  <div className="space-y-1">
                    <span className="text-cyan-400 font-semibold block">Minimum Specification:</span>
                    <p className="text-slate-400 leading-relaxed bg-[#07080d] p-3 rounded-lg border border-white/5">
                      {game.systemRequirements.minimum}
                    </p>
                  </div>
                )}
                {game.systemRequirements.recommended && (
                  <div className="space-y-1">
                    <span className="text-purple-400 font-semibold block">Recommended Specification:</span>
                    <p className="text-slate-400 leading-relaxed bg-[#07080d] p-3 rounded-lg border border-white/5">
                      {game.systemRequirements.recommended}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Playtest Info Box */}
          {showTest && (
            <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-6 space-y-3 text-xs font-mono">
              <h4 className="font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Active Community Playtest
              </h4>
              <p className="text-slate-400 leading-relaxed">
                We collect telemetry and feedback to refine networking, physics, and gameplay balance.
              </p>
              <button
                onClick={() => setPlaytestModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Testing Instructions</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
