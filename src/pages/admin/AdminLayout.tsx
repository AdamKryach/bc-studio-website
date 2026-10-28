import React, { useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from '../../context/RouterContext';
import { Logo } from '../../components/common/Logo';
import {
  LayoutDashboard,
  Gamepad2,
  Newspaper,
  Shield,
  Trophy,
  Mail,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Lock,
  User,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { path, navigate } = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Games & Builds', href: '/admin/games', icon: Gamepad2 },
    { label: 'News & Devlogs', href: '/admin/news', icon: Newspaper },
    { label: 'Tools Catalog', href: '/admin/tools', icon: Shield },
    { label: 'CTF & Research', href: '/admin/ctf', icon: Trophy },
    { label: 'Inquiries', href: '/admin/messages', icon: Mail },
    { label: 'Studio Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Trail', href: '/admin/audit', icon: History },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0c13] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-6">
          {/* Brand header */}
          <div className="space-y-1">
            <Link to="/admin" className="block">
              <Logo size="sm" showSubtitle={false} />
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
              <Lock className="w-3 h-3" />
              <span>TEAM DEV PORTAL</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = path === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    active
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 font-bold shadow-[0_0_15px_rgba(0,240,255,0.08)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User bar & Logout */}
        <div className="p-4 border-t border-white/5 bg-[#08090e] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-white font-bold leading-none">{user?.username || 'DevAdam'}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Admin Operator</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="End session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 px-6 sm:px-8 flex items-center justify-between bg-[#08090f]/80 backdrop-blur-sm">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs font-mono text-slate-400">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Authoritative
            </span>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
