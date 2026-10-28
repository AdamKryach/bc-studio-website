import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardStats, AuditLogEntry } from '../../types';
import { api } from '../../api';
import { Link } from '../../context/RouterContext';
import {
  Gamepad2,
  Download,
  Sparkles,
  Newspaper,
  Shield,
  Trophy,
  Mail,
  History,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  HardDrive,
  Server,
  Lock,
} from 'lucide-react';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, statusRes, logsRes] = await Promise.all([
          api.getStats(),
          api.getSystemStatus(),
          api.getAuditLogs(),
        ]);
        setStats(statsRes);
        setSystemStatus(statusRes);
        setAuditLogs(logsRes.slice(0, 8));
      } catch (err) {
        console.error('Failed loading admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <AdminLayout title="Developer Portal Overview" subtitle="Persistent Database Status & Studio Operations">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Security Alert if ADMIN_PASSWORD is not set via environment */}
        {systemStatus && !systemStatus.isEnvAdminPasswordConfigured && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">Production Security Notice: ADMIN_PASSWORD Secret</span>
                <span className="text-slate-400">
                  Currently running with local development fallback. Please set the <code className="text-amber-200">ADMIN_PASSWORD</code> deployment secret in your environment.
                </span>
              </div>
            </div>
            <Link
              to="/admin/settings"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs whitespace-nowrap hover:bg-amber-400 transition-colors"
            >
              View Settings
            </Link>
          </div>
        )}

        {/* Real Metrics Grid as specified in Section 6 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Games */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Total Games</span>
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">
              {stats?.totalGames ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 font-semibold">{stats?.publishedGames ?? 0}</span> published live
            </div>
          </div>

          {/* Downloadable Games */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Download Ready</span>
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {stats?.gamesDownloadable ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Release build attached
            </div>
          </div>

          {/* Testing Games */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Testing Active</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-mono text-amber-400">
              {stats?.gamesTesting ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              In test or dual mode
            </div>
          </div>

          {/* News Dispatches */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>News Articles</span>
              <Newspaper className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-cyan-400">
              {stats?.totalNews ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              <span className="text-slate-200">{stats?.publishedNews ?? 0}</span> live /{' '}
              <span className="text-amber-400">{stats?.draftNews ?? 0}</span> drafts
            </div>
          </div>

          {/* Tools Entries */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Tools Showcase</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black font-mono text-purple-400">
              {stats?.totalTools ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Catalog items (no binaries)
            </div>
          </div>

          {/* CTF Entries */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>CTF Reports</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-mono text-amber-400">
              {stats?.totalCTF ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Verified write-ups
            </div>
          </div>

          {/* Inquiries */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Contact Inquiries</span>
              <Mail className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-black font-mono text-rose-400">
              {stats?.totalMessages ?? '...'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold">{stats?.unreadMessages ?? 0}</span> pending review
            </div>
          </div>

          {/* System Status */}
          <div className="p-5 rounded-2xl bg-[#0c0e17] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>Server Runtime</span>
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white truncate">
              {systemStatus?.nodeVersion || 'Node.js'}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Persistent DB Active</span>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/games"
            className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-[#121624] border border-cyan-500/30 hover:border-cyan-500/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white">Manage Games</div>
                <div className="text-[11px] text-slate-400 font-mono">Builds & Modes</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>

          <Link
            to="/admin/news"
            className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-[#121624] border border-purple-500/30 hover:border-purple-500/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs font-bold text-white">Draft Devlogs</div>
                <div className="text-[11px] text-slate-400 font-mono">Publish & Edit</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </Link>

          <Link
            to="/admin/tools"
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-[#121624] border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Tools Catalog</div>
                <div className="text-[11px] text-slate-400 font-mono">Showcase Only</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>

          <Link
            to="/admin/ctf"
            className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-[#121624] border border-amber-500/30 hover:border-amber-500/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">CTF Results</div>
                <div className="text-[11px] text-slate-400 font-mono">Write-Up Editor</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </Link>
        </div>

        {/* Audit Log Stream */}
        <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" /> Recent Administrator Audit Activity
            </h3>
            <Link to="/admin/audit" className="text-xs font-mono text-cyan-400 hover:underline">
              Full Audit Trail &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#07080d] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="font-bold text-cyan-300">{log.action}</span>
                  <span className="text-slate-400 truncate">{log.details || 'System event'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] shrink-0">
                  <span>by {log.username}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
