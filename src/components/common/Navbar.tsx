import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { Logo } from './Logo';
import { Menu, X, ExternalLink, ShieldCheck, Terminal, Gamepad2 } from 'lucide-react';

interface NavbarProps {
  studioName?: string;
  foundedYear?: number;
}

export function Navbar({ studioName = 'Black Cloud', foundedYear = 2021 }: NavbarProps) {
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Games', href: '/games' },
    { label: 'News', href: '/news' },
    { label: 'Tools', href: '/tools' },
    { label: 'CTF', href: '/ctf' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090d]/90 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/80'
          : 'bg-[#08090d]/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Studio Brand */}
          <Link to="/" className="group flex items-center transition-transform hover:opacity-95">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links ONLY (NO public authentication buttons whatsoever) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel (NO login/register/sign-in options) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c13] border-b border-white/10 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/5 text-xs font-mono text-slate-500 text-center">
            Black Cloud Studio • Established 2021
          </div>
        </div>
      )}
    </header>
  );
}
