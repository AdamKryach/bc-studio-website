import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { CTFEntry, PublicationStatus, CTFChallenge } from '../../types';
import { api } from '../../api';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Terminal,
} from 'lucide-react';

export function AdminCTFPage() {
  const [entries, setEntries] = useState<CTFEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CTFEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    competitionName: '',
    organizer: '',
    eventDate: new Date().toISOString().split('T')[0],
    teamLabel: 'Black Cloud',
    verifiedPlacement: '',
    score: '',
    challenges: [] as CTFChallenge[],
    newChallengeName: '',
    newChallengeCategory: 'Pwn/Binary' as CTFChallenge['category'],
    newChallengePoints: 300,
    writeup: '',
    lessonsLearned: '',
    disclosureNotes: 'Published responsibly following tournament conclusion.',
    references: [] as string[],
    referenceInput: '',
    publicationStatus: 'published' as PublicationStatus,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCTF();
      setEntries(res);
    } catch (err) {
      console.error('Failed fetching admin CTF', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      title: '',
      slug: '',
      competitionName: '',
      organizer: '',
      eventDate: new Date().toISOString().split('T')[0],
      teamLabel: 'Black Cloud Research',
      verifiedPlacement: 'Top 5%',
      score: '2,500 pts',
      challenges: [
        { name: 'HeapPwn-V1', category: 'Pwn/Binary', points: 400, solvedBy: 'DevAdam' },
      ],
      newChallengeName: '',
      newChallengeCategory: 'Pwn/Binary',
      newChallengePoints: 350,
      writeup: `### Challenge Walkthrough\n1. Vulnerability Analysis:\n2. Exploitation Steps:\n3. Flag Captured:`,
      lessonsLearned: 'Memory safety validation on boundaries.',
      disclosureNotes: 'Certified disclosure.',
      references: ['https://ctftime.org/'],
      referenceInput: '',
      publicationStatus: 'published',
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: CTFEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      slug: entry.slug,
      competitionName: entry.competitionName,
      organizer: entry.organizer,
      eventDate: entry.eventDate,
      teamLabel: entry.teamLabel,
      verifiedPlacement: entry.verifiedPlacement,
      score: String(entry.score),
      challenges: entry.challenges || [],
      newChallengeName: '',
      newChallengeCategory: 'Pwn/Binary',
      newChallengePoints: 300,
      writeup: entry.writeup,
      lessonsLearned: entry.lessonsLearned,
      disclosureNotes: entry.disclosureNotes,
      references: entry.references || [],
      referenceInput: '',
      publicationStatus: entry.publicationStatus,
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingEntry ? prev.slug : slug,
    }));
  };

  const addChallenge = () => {
    if (formData.newChallengeName.trim()) {
      setFormData((prev) => ({
        ...prev,
        challenges: [
          ...prev.challenges,
          {
            name: prev.newChallengeName.trim(),
            category: prev.newChallengeCategory,
            points: Number(prev.newChallengePoints) || 100,
          },
        ],
        newChallengeName: '',
      }));
    }
  };

  const removeChallenge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index),
    }));
  };

  const addReference = () => {
    if (formData.referenceInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        references: [...prev.references, prev.referenceInput.trim()],
        referenceInput: '',
      }));
    }
  };

  const removeReference = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim() || !formData.slug.trim() || !formData.competitionName.trim()) {
      setFormError('Title, URL Slug, and Competition Name are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingEntry) {
        await api.updateCTF(editingEntry.id, formData);
        setFormSuccess('CTF entry record updated.');
      } else {
        await api.createCTF(formData);
        setFormSuccess('CTF tournament record published.');
      }
      fetchEntries();
      setTimeout(() => setModalOpen(false), 800);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save CTF entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await api.deleteCTF(id);
      setDeleteConfirmId(null);
      fetchEntries();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.competitionName.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="CTF Competitions & Security Write-Ups" subtitle="Manage tournament entries, solved challenges, and research walk-throughs">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CTF events..."
              className="w-full pl-9 pr-4 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record CTF Result</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090f] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Competition</th>
                  <th className="p-4">Placement</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Challenges</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-white text-sm">{entry.competitionName}</div>
                        <div className="text-[11px] text-slate-500">{entry.title}</div>
                        <div className="text-[10px] text-cyan-400">{entry.eventDate} • {entry.organizer}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold">
                        {entry.verifiedPlacement}
                      </span>
                    </td>

                    <td className="p-4 text-purple-300 font-bold">{entry.score}</td>

                    <td className="p-4 text-slate-300">{entry.challenges?.length || 0} solved</td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          entry.publicationStatus === 'published'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {entry.publicationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {entry.publicationStatus === 'published' && (
                          <a
                            href={`/ctf/${entry.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(entry)}
                          className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0c0e17] border border-red-500/30 p-6 rounded-2xl max-w-md w-full space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">Delete CTF Entry</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Are you sure you want to remove this CTF competition write-up?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0c0e17] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0c0e17] z-10">
                <h3 className="text-lg font-bold text-white">
                  {editingEntry ? `Edit CTF: ${editingEntry.competitionName}` : 'Record CTF Event'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="p-6 space-y-6 flex-1">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Competition Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.competitionName}
                      onChange={(e) => setFormData({ ...formData, competitionName: e.target.value })}
                      placeholder="e.g. DEF CON 32 Qualifiers"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Write-Up Title <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Heap Exploitation & Zero-Day Escape"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Organizer</label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      placeholder="Nautilus Institute"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Verified Placement</label>
                    <input
                      type="text"
                      value={formData.verifiedPlacement}
                      onChange={(e) => setFormData({ ...formData, verifiedPlacement: e.target.value })}
                      placeholder="Top 4% (Rank 38 of 920)"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Score</label>
                    <input
                      type="text"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      placeholder="2,850 pts"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Challenges Roster */}
                <div className="p-4 rounded-xl bg-[#08090f] border border-white/5 space-y-3">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                    Solved Challenges Breakdown
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={formData.newChallengeName}
                      onChange={(e) => setFormData({ ...formData, newChallengeName: e.target.value })}
                      placeholder="Challenge Name (e.g. RustSandbox)"
                      className="flex-1 px-3 py-1.5 bg-[#121624] border border-white/10 rounded-lg text-xs text-white"
                    />
                    <select
                      value={formData.newChallengeCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, newChallengeCategory: e.target.value as CTFChallenge['category'] })
                      }
                      className="px-3 py-1.5 bg-[#121624] border border-white/10 rounded-lg text-xs text-white font-mono"
                    >
                      <option value="Pwn/Binary">Pwn/Binary</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Reverse">Reverse</option>
                      <option value="Web">Web</option>
                      <option value="Forensics">Forensics</option>
                      <option value="Misc">Misc</option>
                    </select>
                    <input
                      type="number"
                      value={formData.newChallengePoints}
                      onChange={(e) => setFormData({ ...formData, newChallengePoints: Number(e.target.value) })}
                      placeholder="Pts"
                      className="w-20 px-3 py-1.5 bg-[#121624] border border-white/10 rounded-lg text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={addChallenge}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
                    >
                      Add Challenge
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {formData.challenges.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#121624] text-xs font-mono"
                      >
                        <span className="text-white">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">{c.category}</span>
                          <span className="text-slate-400">+{c.points} pts</span>
                          <button
                            type="button"
                            onClick={() => removeChallenge(i)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Writeup Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Detailed Technical Write-Up (Markdown)</label>
                  <textarea
                    rows={8}
                    value={formData.writeup}
                    onChange={(e) => setFormData({ ...formData, writeup: e.target.value })}
                    placeholder="Vulnerability root cause, exploit primitive, debugging logs, captured flags..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Lessons Learned / Defensive Remediation</label>
                  <input
                    type="text"
                    value={formData.lessonsLearned}
                    onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
                    placeholder="Key defensive takeaway for systems engineers..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : 'Save CTF Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
