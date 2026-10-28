import React, { useState } from 'react';
import { Game } from '../../types';
import { X, Sparkles, Download, Terminal, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../api';

interface PlaytestModalProps {
  game: Game | null;
  onClose: () => void;
}

export function PlaytestModal({ game, onClose }: PlaytestModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!game) return null;

  const handleTestDownload = async () => {
    if (!game.hasTestBuild) {
      setError('Test build binary is currently undergoing compilation. Check back shortly.');
      return;
    }

    try {
      setDownloading(true);
      setError(null);
      const res = await api.getGameTestDownloadUrl(game.slug);
      window.location.href = res.downloadUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to generate playtest download package.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0e17] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {game.title} <span className="text-xs font-mono text-amber-400 font-normal">Playtest Access</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Independent Studio Testing Protocol • No Account Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status notice */}
          <div className="p-4 rounded-xl bg-[#131722] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Target Platforms:</span>
              <span className="text-cyan-400">{game.platforms.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Playtest Branch Version:</span>
              <span className="text-amber-400">{game.version}-test</span>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" /> Testing Guidelines & Instructions
            </h4>
            <div className="bg-[#07080d] p-4 rounded-xl border border-white/10 text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-line">
              {game.testInstructions ||
                '1. Download the experimental build package.\n2. Extract into a clean directory.\n3. Run the client executable.\n4. Document reproducible anomalies, crash traces, or framerate dips.\n5. Send logs to playtest@blackcloud.dev or share in our community channels.'}
            </div>
          </div>

          {/* Test Build Download Action */}
          {game.hasTestBuild ? (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approved Test Build Available</span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {game.testBuildFilename || 'Playtest_Archive.zip'} (
                  {game.testBuildSizeBytes ? `${Math.round(game.testBuildSizeBytes / (1024 * 1024))} MB` : 'Binary'}
                  )
                </div>
              </div>

              <button
                onClick={handleTestDownload}
                disabled={downloading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Preparing Token...' : 'Download Test Build'}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3 text-slate-400 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                The development team has not yet uploaded a binary package for this playtest round. Follow the testing guidelines above or subscribe to news updates for announcements.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Confidentiality: Public Community Alpha</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
