import React, { useState } from 'react';
import { StudioSettings } from '../../types';
import { api } from '../../api';
import {
  Mail,
  Send,
  MessageSquare,
  Shield,
  CheckCircle2,
  AlertCircle,
  Github,
  Twitter,
  Terminal,
  Clock,
} from 'lucide-react';

interface ContactPageProps {
  settings: StudioSettings | null;
}

export function ContactPage({ settings }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General',
    message: '',
    honeypot: '', // anti-bot field
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const contactEmail = settings?.contactEmail || 'contact@blackcloud.dev';
  const securityEmail = settings?.securityEmail || 'security@blackcloud.dev';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitContact(formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Your inquiry has been transmitted directly to the Black Cloud team.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'General',
          message: '',
          honeypot: '',
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-md">
          <Mail className="w-4 h-4" />
          <span>Direct Studio Channel</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Connect With Black Cloud
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Whether you want to submit playtest telemetry, report game bugs, collaborate on low-level research, or make a responsible security vulnerability disclosure, our team is directly accessible. No user account required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0c0e17] border border-white/10 p-6 sm:p-10 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" /> Transmit Inquiries
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              All messages are encrypted in transit and routed to the development team.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot hidden input for spam bots */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Your Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commander Ghost"
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@domain.com"
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Category <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50 font-mono text-xs"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Playtest">Playtest Feedback & Bug Report</option>
                  <option value="Security Disclosure">Security Vulnerability Disclosure</option>
                  <option value="Partnership">Collaboration & Press</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Subject Line <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your inquiry"
                  className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                Message Content <span className="text-cyan-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your bug report, hardware specifications, research inquiry, or feedback..."
                className="w-full px-3.5 py-2.5 bg-[#121624] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Transmitting Inquiries...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Direct channels */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> Direct Inboxes
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
                <span className="text-slate-500 block">General Inquiries</span>
                <a href={`mailto:${contactEmail}`} className="text-cyan-400 hover:underline font-bold">
                  {contactEmail}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#07080d] border border-white/5 space-y-1">
                <span className="text-slate-500 block">Responsible Security Disclosures</span>
                <a href={`mailto:${securityEmail}`} className="text-purple-400 hover:underline font-bold">
                  {securityEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Security policy box */}
          <div className="rounded-3xl bg-purple-950/20 border border-purple-500/20 p-6 space-y-3 text-xs font-mono">
            <h4 className="font-bold text-purple-300 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Coordinated Disclosure
            </h4>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              If you have identified a vulnerability in our multiplayer protocols, public websites, or tooling repositories, please contact <code className="text-purple-300 font-mono">security@blackcloud.dev</code>. We acknowledge receipt within 48 hours and coordinate responsible disclosure timelines.
            </p>
          </div>

          {/* Social links */}
          <div className="rounded-3xl bg-[#0c0e17] border border-white/10 p-6 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
              Community Hubs
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {settings?.socialLinks?.github && (
                <a
                  href={settings.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Studio
                  </span>
                  <span className="text-slate-500">&rarr;</span>
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" /> Twitter / X
                  </span>
                  <span className="text-slate-500">&rarr;</span>
                </a>
              )}
              {settings?.socialLinks?.discord && (
                <a
                  href={settings.socialLinks.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Discord Server
                  </span>
                  <span className="text-slate-500">&rarr;</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
