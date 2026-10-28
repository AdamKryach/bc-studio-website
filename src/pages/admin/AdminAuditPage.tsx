import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { AuditLogEntry } from '../../types';
import { api } from '../../api';
import { History, ShieldCheck, User, RefreshCw, Terminal } from 'lucide-react';

export function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs();
      setLogs(res);
    } catch (err) {
      console.error('Failed fetching audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout title="Security Audit Log & Action Trail" subtitle="Immutable operational history of administrative operations">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Retaining last {logs.length} privileged security records.
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-2 border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Stream</span>
          </button>
        </div>

        <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090f] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-white font-bold">{log.username}</td>
                    <td className="p-4 text-slate-300">{log.details || '—'}</td>
                    <td className="p-4 text-slate-500">{log.ip || 'Local/Internal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
