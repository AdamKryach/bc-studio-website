import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { SecurityTool } from '../../types';
import { api } from '../../api';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
  Search,
  ArrowUpRight,
} from 'lucide-react';

export function AdminToolsPage() {
  const [tools, setTools] = useState<SecurityTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<SecurityTool | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    projectUrl: '',
    documentationUrl: '',
    technologies: ['C++', 'Linux'],
    techInput: '',
    purpose: '',
    intendedAudience: '',
    status: 'Active' as SecurityTool['status'],
    featured: true,
    sortOrder: 1,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminTools();
      setTools(res);
    } catch (err) {
      console.error('Failed fetching admin tools', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const openCreateModal = () => {
    setEditingTool(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      projectUrl: 'https://github.com/blackcloud-studio/',
      documentationUrl: 'https://docs.blackcloud.dev/',
      technologies: ['Rust', 'eBPF'],
      techInput: '',
      purpose: '',
      intendedAudience: '',
      status: 'Active',
      featured: true,
      sortOrder: tools.length + 1,
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (tool: SecurityTool) => {
    setEditingTool(tool);
    setFormData({
      title: tool.title,
      slug: tool.slug,
      shortDescription: tool.shortDescription,
      fullDescription: tool.fullDescription,
      thumbnailUrl: tool.thumbnailUrl,
      projectUrl: tool.projectUrl,
      documentationUrl: tool.documentationUrl,
      technologies: tool.technologies || [],
      techInput: '',
      purpose: tool.purpose || '',
      intendedAudience: tool.intendedAudience || '',
      status: tool.status,
      featured: tool.featured,
      sortOrder: tool.sortOrder,
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
      slug: editingTool ? prev.slug : slug,
    }));
  };

  const addTech = () => {
    if (formData.techInput.trim() && !formData.technologies.includes(formData.techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, prev.techInput.trim()],
        techInput: '',
      }));
    }
  };

  const removeTech = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== item),
    }));
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim() || !formData.slug.trim()) {
      setFormError('Tool Title and URL Slug are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingTool) {
        await api.updateTool(editingTool.id, formData);
        setFormSuccess('Tool catalog record updated.');
      } else {
        await api.createTool(formData);
        setFormSuccess('Tool added to public showcase catalog.');
      }
      fetchTools();
      setTimeout(() => setModalOpen(false), 800);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save tool');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      await api.deleteTool(id);
      setDeleteConfirmId(null);
      fetchTools();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, thumbnailUrl: res.url }));
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredTools = tools.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.technologies.some((tech) => tech.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="Cybersecurity Tools Showcase" subtitle="Manage non-executable technical tools catalog entries">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Compliance Reminder */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3 text-xs font-mono text-purple-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
          <span>
            Strict Security Mandate: This catalog is for technical showcasing and documentation only. Public binary distribution is disabled.
          </span>
        </div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools & tech stack..."
              className="w-full pl-9 pr-4 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tool Entry</span>
          </button>
        </div>

        {/* Tools Table */}
        <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090f] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Tool</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Technologies</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tool.thumbnailUrl}
                          alt={tool.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                        />
                        <div className="truncate max-w-sm">
                          <div className="font-bold text-white text-sm truncate">{tool.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            /{tool.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                        {tool.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {tool.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] bg-purple-950/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      {tool.featured ? (
                        <span className="text-cyan-400 text-xs">Featured</span>
                      ) : (
                        <span className="text-slate-500 text-xs">Standard</span>
                      )}
                    </td>

                    <td className="p-4 text-slate-400 font-bold">{tool.sortOrder}</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(tool)}
                          className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tool.id)}
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
                <h3 className="text-lg font-bold text-white">Delete Tool Entry</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Are you sure you want to remove this tool showcase record from the catalog?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTool(deleteConfirmId)}
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
                  {editingTool ? `Edit Tool: ${editingTool.title}` : 'Add Tool Entry'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTool} className="p-6 space-y-6 flex-1">
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
                      Tool Title <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. ByteTrace"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      URL Slug <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="bytetrace"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Development Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as SecurityTool['status'] })
                      }
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    >
                      <option value="Active">Active</option>
                      <option value="Beta">Beta</option>
                      <option value="Research">Research</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded bg-[#121624] border-white/20 text-purple-500"
                      />
                      <span>Pin to Home Page</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Short Description</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview"
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Purpose Summary</label>
                    <input
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="e.g. Dynamic binary instrumentation & analysis"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Intended Audience</label>
                    <input
                      type="text"
                      value={formData.intendedAudience}
                      onChange={(e) => setFormData({ ...formData, intendedAudience: e.target.value })}
                      placeholder="Reverse engineers, security researchers"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Project / Repository URL</label>
                    <input
                      type="text"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Documentation URL</label>
                    <input
                      type="text"
                      value={formData.documentationUrl}
                      onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                      placeholder="https://docs.blackcloud.dev/..."
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Full Architectural Description (Markdown)</label>
                  <textarea
                    rows={6}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Capabilities, technical architecture, and implementation details..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono leading-relaxed"
                  />
                </div>

                {/* Tech Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300">Technologies</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.techInput}
                      onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                      placeholder="e.g. C++20, x86_64, eBPF"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTech();
                        }
                      }}
                      className="flex-1 px-3.5 py-1.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono bg-purple-950/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 flex items-center gap-1"
                      >
                        {t}
                        <button type="button" onClick={() => removeTech(t)} className="hover:text-red-400">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
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
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : 'Save Tool Entry'}
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
