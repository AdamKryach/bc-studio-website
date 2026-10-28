import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { StudioSettings } from './types';
import { api } from './api';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { GamesPage } from './pages/public/GamesPage';
import { GameDetailPage } from './pages/public/GameDetailPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { ToolsPage } from './pages/public/ToolsPage';
import { ToolDetailPage } from './pages/public/ToolDetailPage';
import { CTFPage } from './pages/public/CTFPage';
import { CTFDetailPage } from './pages/public/CTFDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminGamesPage } from './pages/admin/AdminGamesPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminToolsPage } from './pages/admin/AdminToolsPage';
import { AdminCTFPage } from './pages/admin/AdminCTFPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';

function RouteSwitch() {
  const { path } = useRouter();
  const [settings, setSettings] = useState<StudioSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  // Admin Routes
  if (path === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (path === '/admin' || path === '/admin/') {
    return <AdminDashboardPage />;
  }

  if (path === '/admin/games') {
    return <AdminGamesPage />;
  }

  if (path === '/admin/news') {
    return <AdminNewsPage />;
  }

  if (path === '/admin/tools') {
    return <AdminToolsPage />;
  }

  if (path === '/admin/ctf') {
    return <AdminCTFPage />;
  }

  if (path === '/admin/messages') {
    return <AdminMessagesPage />;
  }

  if (path === '/admin/settings') {
    return <AdminSettingsPage />;
  }

  if (path === '/admin/audit') {
    return <AdminAuditPage />;
  }

  // Public Layout Wrapper for all non-admin routes
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Public Navbar (strictly no login buttons!) */}
      <Navbar
        studioName={settings?.studioName || 'Black Cloud'}
        foundedYear={settings?.foundedYear || 2021}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        {(() => {
          // Home
          if (path === '/' || path === '') {
            return <HomePage settings={settings} />;
          }

          // Games
          if (path === '/games') {
            return <GamesPage />;
          }

          if (path.startsWith('/games/')) {
            const slug = path.replace('/games/', '').split('/')[0].split('#')[0];
            return <GameDetailPage slug={slug} />;
          }

          // News
          if (path === '/news') {
            return <NewsPage />;
          }

          if (path.startsWith('/news/')) {
            const slug = path.replace('/news/', '').split('/')[0];
            return <NewsDetailPage slug={slug} />;
          }

          // Tools
          if (path === '/tools') {
            return <ToolsPage />;
          }

          if (path.startsWith('/tools/')) {
            const slug = path.replace('/tools/', '').split('/')[0];
            return <ToolDetailPage slug={slug} />;
          }

          // CTF
          if (path === '/ctf') {
            return <CTFPage />;
          }

          if (path.startsWith('/ctf/')) {
            const slug = path.replace('/ctf/', '').split('/')[0];
            return <CTFDetailPage slug={slug} />;
          }

          // About
          if (path === '/about') {
            return <AboutPage settings={settings} />;
          }

          // Contact
          if (path === '/contact') {
            return <ContactPage settings={settings} />;
          }

          // 404
          return (
            <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
              <div className="text-6xl font-black font-mono text-cyan-400">404</div>
              <h1 className="text-2xl font-bold text-white">Transmission Lost</h1>
              <p className="text-slate-400 text-sm font-mono">
                The requested URL coordinate was not found on Black Cloud networks.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider"
              >
                Return to Surface
              </a>
            </div>
          );
        })()}
      </main>

      {/* Public Footer */}
      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <RouteSwitch />
      </RouterProvider>
    </AuthProvider>
  );
}
