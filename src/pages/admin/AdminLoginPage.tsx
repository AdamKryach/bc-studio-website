import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { Logo } from '../../components/common/Logo';
import { Shield, Lock, User, AlertCircle, ArrowRight, KeyRound, Terminal, CheckCircle2 } from 'lucide-react';
import { api } from '../../api';

export function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  const [username, setUsername] = useState('DevAdam');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    api.getSystemStatus().then(setSystemStatus).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please provide both administrative username and secret key.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle cyber background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Studio Brand */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo size="lg" showSubtitle={false} />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <Shield className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase font-semibold">Private Team Portal</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-8 shadow-2xl shadow-black space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Team Authentication</h2>
            <p className="text-xs font-mono text-slate-400">
              Restricted to authorized studio engineers and operators.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Admin Identity</span>
                <span className="text-[10px] text-cyan-400 font-normal">Initial: DevAdam</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Secret Password</span>
                <span className="text-[10px] text-slate-500 font-mono">ADMIN_PASSWORD secret</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{submitting ? 'Verifying Session...' : 'Authenticate to Portal'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-white/5 space-y-2 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero Public Registration Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Server-side Rate Limiting Active</span>
            </div>
          </div>
        </div>

        {/* Security configuration badge */}
        <div className="p-3 rounded-xl bg-[#0c0e17]/60 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Env Secret ADMIN_PASSWORD:</span>
          <span
            className={
              systemStatus?.isEnvAdminPasswordConfigured ? 'text-emerald-400' : 'text-amber-400'
            }
          >
            {systemStatus?.isEnvAdminPasswordConfigured ? 'Configured (Env Secret)' : 'Dev Preview Default'}
          </span>
        </div>
      </div>
    </div>
  );
}
