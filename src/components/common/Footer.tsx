import React from 'react';
import { Link } from '../../context/RouterContext';
import { Logo } from './Logo';
import { StudioSettings } from '../../types';
import { Github, Twitter, MessageSquare, Terminal, Shield, Gamepad2, Mail } from 'lucide-react';

interface FooterProps {
  settings?: StudioSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const foundedYear = settings?.foundedYear || 2021;
  const contactEmail = settings?.contactEmail || 'contact@blackcloud.dev';
  const securityEmail = settings?.securityEmail || 'security@blackcloud.dev';

  return (
    <footer className="bg-[#050609] border-t border-white/5 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/5">
          {/* Brand and Description */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings?.description ||
                'Independent game development studio and offensive cybersecurity research laboratory established in 2021. Building immersive games, engineering resilient protocols, and advancing cybersecurity research.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 bg-cyan-950/20 border border-cyan-500/20 px-3 py-1.5 rounded-md w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Studio Established {foundedYear}</span>
            </div>
          </div>

          {/* Public Navigation Links */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Studio
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-cyan-400 transition-colors">
                  Games Catalog
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-cyan-400 transition-colors">
                  News & Devlogs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  About Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Tools Links */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Security Lab
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tools" className="hover:text-purple-400 transition-colors">
                  Tools Showcase
                </Link>
              </li>
              <li>
                <Link to="/ctf" className="hover:text-purple-400 transition-colors">
                  CTF & Write-Ups
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${securityEmail}`}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
                >
                  <Mail className="w-3 h-3" /> Security Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Connectivity */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Connect
            </h3>
            <ul className="space-y-2.5 text-sm">
              {settings?.socialLinks?.github && (
                <li>
                  <a
                    href={settings.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Github className="w-4 h-4 text-slate-400" /> GitHub
                  </a>
                </li>
              )}
              {settings?.socialLinks?.twitter && (
                <li>
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4 text-slate-400" /> Twitter / X
                  </a>
                </li>
              )}
              {settings?.socialLinks?.discord && (
                <li>
                  <a
                    href={settings.socialLinks.discord}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" /> Discord
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            {settings?.footerText || `© 2021-${currentYear} Black Cloud Development Studio. All rights reserved.`}
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Non-Commercial Security R&D</span>
            <span>•</span>
            <span>Public Access Free & Open</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
