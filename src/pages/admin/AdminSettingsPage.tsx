import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { StudioSettings } from '../../types';
import { api } from '../../api';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  KeyRound,
  Lock,
  Terminal,
  Globe,
  Share2,
} from 'lucide-react';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [sett, sys] = await Promise.all([api.getAdminSettings(), api.getSystemStatus()]);
        setSettings(sett);
        setSystemStatus(sys);
      } catch (err) {
        console.error('Failed fetching settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setStatusMsg(null);
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setStatusMsg({ type: 'success', text: 'Studio settings updated and persisted.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <AdminLayout title="Studio Configuration" subtitle="Loading current settings...">
        <div className="p-12 text-center text-xs font-mono text-slate-500">
          Loading studio settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Studio Configuration & Security" subtitle="Adjust studio profile, public contacts, and deployment parameters">
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Production Admin Security Instructions Box (Section 5) */}
        <div className="rounded-3xl bg-[#0c0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Administrator Security & Deployment Secret</h3>
              <p className="text-xs font-mono text-slate-400">
                Authorized Identity: <span className="text-cyan-400 font-bold">DevAdam</span> • Zero Public Registration
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
              <span className="text-slate-500 block">ADMIN_PASSWORD Deployment Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    systemStatus?.isEnvAdminPasswordConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span
                  className={
                    systemStatus?.isEnvAdminPasswordConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                  }
                >
                  {systemStatus?.isEnvAdminPasswordConfigured
                    ? 'Configured Via Deployment Secret'
                    : 'Dev Preview Mode (Default Fallback Active)'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
              <span className="text-slate-500 block">Session Protection</span>
              <span className="text-slate-200">HttpOnly + SameSite Cookie + Rate Limiter Active</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121624] border border-white/5 text-xs font-mono text-slate-300 space-y-2">
            <span className="text-cyan-300 font-bold block">How to configure in production:</span>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Supply the environment variable <code className="text-cyan-300 font-mono">ADMIN_PASSWORD=&quot;your-secret-password&quot;</code> in your Cloud Run, Docker, or server environment. Black Cloud authenticates DevAdam against this secret using high-performance scrypt hashing and constant-time verification.
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/40 border-red-500/30 text-red-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Studio Identity & Narrative
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Studio Name</label>
                <input
                  type="text"
                  required
                  value={settings.studioName}
                  onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Founding Year</label>
                <input
                  type="number"
                  required
                  value={settings.foundedYear}
                  onChange={(e) => setSettings({ ...settings, foundedYear: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Studio Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Full Studio Description</label>
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Contact & Inboxes */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Public Inboxes & Security Disclosures
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">General Public Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Responsible Disclosure Security Email</label>
                <input
                  type="email"
                  value={settings.securityEmail}
                  onChange={(e) => setSettings({ ...settings, securityEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" /> Community & Social Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">GitHub Organization</label>
                <input
                  type="text"
                  value={settings.socialLinks?.github || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, github: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Twitter / X</label>
                <input
                  type="text"
                  value={settings.socialLinks?.twitter || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Discord Community</label>
                <input
                  type="text"
                  value={settings.socialLinks?.discord || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, discord: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Itch.io Studio Profile</label>
                <input
                  type="text"
                  value={settings.socialLinks?.itch || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, itch: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Footer Copyright Notice
            </h3>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Studio Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
