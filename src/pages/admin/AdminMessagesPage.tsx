import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { ContactMessage } from '../../types';
import { api } from '../../api';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Shield,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminMessages();
      setMessages(res);
      if (res.length > 0 && !selectedMsg) {
        setSelectedMsg(res[0]);
      }
    } catch (err) {
      console.error('Failed fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      await api.markMessageRead(id, !currentRead);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
      );
      if (selectedMsg?.id === id) {
        setSelectedMsg((prev) => (prev ? { ...prev, read: !currentRead } : null));
      }
    } catch (err) {
      console.error('Failed toggling read state', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) {
        setSelectedMsg(null);
      }
    } catch (err) {
      console.error('Failed deleting message', err);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !m.read;
    return m.category === filter;
  });

  return (
    <AdminLayout title="Contact & Playtest Inquiries" subtitle="Review incoming dispatches, telemetry reports, and vulnerability disclosures">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {['All', 'Unread', 'General', 'Playtest', 'Security Disclosure', 'Partnership'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-[#121624] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Master-Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden divide-y divide-white/5 max-h-[70vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No inquiries in this category.
              </div>
            ) : (
              filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMsg(msg);
                    if (!msg.read) handleToggleRead(msg.id, false);
                  }}
                  className={`p-4 cursor-pointer transition-colors relative ${
                    selectedMsg?.id === msg.id
                      ? 'bg-cyan-950/30'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-4 right-4 animate-pulse" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-white truncate max-w-[160px]">{msg.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold truncate">{msg.subject}</div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="text-cyan-400">{msg.category}</span>
                      <span>{msg.read ? 'Reviewed' : 'New'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Content View */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0c0e17] border border-white/10 p-6 sm:p-8 space-y-6">
            {selectedMsg ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold uppercase block">
                      {selectedMsg.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedMsg.subject}</h3>
                    <div className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
                      <span>From: {selectedMsg.name}</span>
                      <span>&bull;</span>
                      <a href={`mailto:${selectedMsg.email}`} className="text-cyan-400 hover:underline">
                        {selectedMsg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMsg.id, selectedMsg.read)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
                    >
                      {selectedMsg.read ? 'Mark Unread' : 'Mark Reviewed'}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#07080d] p-6 rounded-xl border border-white/5 text-sm font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedMsg.message}
                </div>

                <div className="pt-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                  <span>Timestamp: {new Date(selectedMsg.createdAt).toLocaleString()}</span>
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Reply via Email Client</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs font-mono text-slate-500">
                Select an inquiry from the left to view contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
