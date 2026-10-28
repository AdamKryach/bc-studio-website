import React, { useState, useEffect } from 'react';
import { SecurityTool } from '../../types';
import { api } from '../../api';
import { ToolCard } from '../../components/public/ToolCard';
import { Shield, Info, Terminal, Search, ShieldAlert, Cpu } from 'lucide-react';

export function ToolsPage() {
  const [tools, setTools] = useState<SecurityTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await api.getTools();
        setTools(res);
      } catch (err) {
        console.error('Failed to load security tools', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      tool.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/30 border border-purple-500/20 px-3 py-1 rounded-md">
          <Shield className="w-4 h-4" />
          <span>Security Research Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Cybersecurity & Systems Tooling
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Open architecture frameworks, instrumentation tools, and reverse engineering research projects engineered by Black Cloud.
        </p>
      </div>

      {/* Strict Policy Banner: Showcase Only */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#0c0e17] border border-purple-500/30 flex items-start gap-3.5 text-xs font-mono text-slate-300">
        <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-purple-300 block">
            Information & Architecture Catalog Only
          </span>
          <p className="text-slate-400 leading-relaxed font-sans">
            In accordance with Black Cloud studio policy, this section provides technical breakdowns and academic documentation for our research projects. No executable binaries, binaries for offensive weaponization, or public download packages are distributed from this catalog.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c0e17] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Status:</span>
          {['All', 'Active', 'Beta', 'Research'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools, C++, Rust, eBPF..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#0c0e17] border border-white/5 space-y-3">
          <Shield className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No security tools found</h3>
          <p className="text-xs font-mono text-slate-400">
            Try adjusting your search criteria or filter tags.
          </p>
        </div>
      )}
    </div>
  );
}
