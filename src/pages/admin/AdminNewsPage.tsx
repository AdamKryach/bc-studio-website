import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { NewsArticle, PublicationStatus } from '../../types';
import { api } from '../../api';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Tag,
  Search,
} from 'lucide-react';

export function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'Announcement' as NewsArticle['category'],
    tags: ['Studio', 'Devlog'],
    tagInput: '',
    authorLabel: 'Black Cloud Core',
    publicationStatus: 'published' as PublicationStatus,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminNews();
      setArticles(res);
    } catch (err) {
      console.error('Failed fetching admin news', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      category: 'Announcement',
      tags: ['Studio'],
      tagInput: '',
      authorLabel: 'Black Cloud Core',
      publicationStatus: 'published',
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImageUrl: article.featuredImageUrl,
      category: article.category,
      tags: article.tags || [],
      tagInput: '',
      authorLabel: article.authorLabel || 'Black Cloud Core',
      publicationStatus: article.publicationStatus,
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
      slug: editingArticle ? prev.slug : slug,
    }));
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim() || !formData.slug.trim()) {
      setFormError('Article Title and URL Slug are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingArticle) {
        await api.updateNews(editingArticle.id, formData);
        setFormSuccess('Article updated successfully.');
      } else {
        await api.createNews(formData);
        setFormSuccess('Article published to database.');
      }
      fetchArticles();
      setTimeout(() => setModalOpen(false), 800);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save news article');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await api.deleteNews(id);
      setDeleteConfirmId(null);
      fetchArticles();
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
      setFormData((prev) => ({ ...prev, featuredImageUrl: res.url }));
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Studio News & Technical Devlogs" subtitle="Publish announcements, release notes, and engineering write-ups">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news & devlogs..."
              className="w-full pl-9 pr-4 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>

        {/* News Table */}
        <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090f] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                        />
                        <div className="truncate max-w-md">
                          <div className="font-bold text-white text-sm truncate">{article.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            /{article.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                        {article.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          article.publicationStatus === 'published'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {article.publicationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-slate-300">{article.authorLabel}</td>
                    <td className="p-4 text-slate-500">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {article.publicationStatus === 'published' && (
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
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
                <h3 className="text-lg font-bold text-white">Delete News Article</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete this news dispatch from the database?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteArticle(deleteConfirmId)}
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
                  {editingArticle ? `Edit Article: ${editingArticle.title}` : 'Draft New Article'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="p-6 space-y-6 flex-1">
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
                      Headline <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Title of article"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      URL Slug <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-slug"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as NewsArticle['category'] })
                      }
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Game Release">Game Release</option>
                      <option value="Devlog">Devlog</option>
                      <option value="CTF Report">CTF Report</option>
                      <option value="Cybersecurity Research">Cybersecurity Research</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Author Label</label>
                    <input
                      type="text"
                      value={formData.authorLabel}
                      onChange={(e) => setFormData({ ...formData, authorLabel: e.target.value })}
                      placeholder="DevAdam / Black Cloud"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Publication Status</label>
                    <select
                      value={formData.publicationStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, publicationStatus: e.target.value as PublicationStatus })
                      }
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    >
                      <option value="published">Published (Public)</option>
                      <option value="draft">Draft (Team Only)</option>
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Summary Excerpt</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short summary for preview cards..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Article Content (Markdown)</label>
                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article in markdown..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono leading-relaxed"
                  />
                </div>

                {/* Featured Image */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300">Featured Banner Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.featuredImageUrl}
                      onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer border border-white/10">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      placeholder="Add tag and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 px-3.5 py-1.5 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded flex items-center gap-1 text-slate-300"
                      >
                        #{t}
                        <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400">
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
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : 'Save Article'}
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
