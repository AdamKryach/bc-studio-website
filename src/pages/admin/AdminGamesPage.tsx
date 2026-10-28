import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Game, AvailabilityMode, PublicationStatus } from '../../types';
import { api } from '../../api';
import {
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  FileArchive,
  Image as ImageIcon,
  Monitor,
  Search,
} from 'lucide-react';

export function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    thumbnailUrl: '',
    coverImageUrl: '',
    screenshots: [] as string[],
    genre: '',
    platforms: ['Windows'] as string[],
    version: '1.0.0',
    releaseDate: new Date().toISOString().split('T')[0],
    systemRequirements: { minimum: '', recommended: '' },
    publicationStatus: 'published' as PublicationStatus,
    availabilityMode: 'download' as AvailabilityMode,
    testInstructions: '',
    testInviteRequired: false,
    featured: false,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // File Upload State
  const [uploadingRelease, setUploadingRelease] = useState(false);
  const [uploadingTest, setUploadingTest] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminGames();
      setGames(res);
    } catch (err) {
      console.error('Failed fetching admin games', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const openCreateModal = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      ],
      genre: 'Tactical Action',
      platforms: ['Windows', 'Linux'],
      version: '1.0.0',
      releaseDate: new Date().toISOString().split('T')[0],
      systemRequirements: {
        minimum: 'OS: Windows 10 / Ubuntu 22.04 | 8GB RAM | 4GB GPU',
        recommended: 'OS: Windows 11 / Linux | 16GB RAM | 8GB GPU',
      },
      publicationStatus: 'published',
      availabilityMode: 'download',
      testInstructions: 'Download build and launch executable. Send telemetry to playtest@blackcloud.dev',
      testInviteRequired: false,
      featured: false,
    });
    setFormError(null);
    setFormSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      slug: game.slug,
      shortDescription: game.shortDescription,
      fullDescription: game.fullDescription,
      thumbnailUrl: game.thumbnailUrl,
      coverImageUrl: game.coverImageUrl,
      screenshots: game.screenshots || [],
      genre: game.genre,
      platforms: game.platforms || ['Windows'],
      version: game.version,
      releaseDate: game.releaseDate,
      systemRequirements: game.systemRequirements || { minimum: '', recommended: '' },
      publicationStatus: game.publicationStatus,
      availabilityMode: game.availabilityMode,
      testInstructions: game.testInstructions || '',
      testInviteRequired: game.testInviteRequired || false,
      featured: game.featured || false,
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
      slug: editingGame ? prev.slug : slug,
    }));
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.title.trim() || !formData.slug.trim()) {
      setFormError('Game Title and URL Slug are required.');
      return;
    }

    try {
      setSaving(true);
      if (editingGame) {
        const updated = await api.updateGame(editingGame.id, formData);
        setEditingGame(updated);
        setFormSuccess('Game record updated successfully.');
      } else {
        const created = await api.createGame(formData);
        setEditingGame(created);
        setFormSuccess('Game created successfully. You can now upload release/test builds below.');
      }
      fetchGames();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save game');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      await api.deleteGame(id);
      setDeleteConfirmId(null);
      fetchGames();
      if (modalOpen && editingGame?.id === id) {
        setModalOpen(false);
      }
    } catch (err: any) {
      alert(`Failed to delete game: ${err.message}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnailUrl' | 'coverImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, [field]: res.url }));
      setUploadStatus(`Image uploaded: ${res.filename}`);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBuildUpload = async (e: React.ChangeEvent<HTMLInputElement>, buildType: 'release' | 'test') => {
    if (!editingGame) {
      setFormError('Please save the game record first before uploading binary packages.');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (buildType === 'release') setUploadingRelease(true);
      else setUploadingTest(true);
      setUploadStatus(`Uploading ${buildType} binary build (${Math.round(file.size / 1024 / 1024)}MB)...`);

      const updatedGame = await api.uploadGameBuild(editingGame.id, file, buildType);
      setEditingGame(updatedGame);
      setUploadStatus(`${buildType === 'release' ? 'Release' : 'Test'} build archive uploaded successfully!`);
      fetchGames();
    } catch (err: any) {
      setFormError(err.message || 'Build upload failed');
    } finally {
      setUploadingRelease(false);
      setUploadingTest(false);
    }
  };

  const togglePlatform = (p: string) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(p);
      const updated = exists ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p];
      return { ...prev, platforms: updated.length > 0 ? updated : ['Windows'] };
    });
  };

  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Games & Build Deployment" subtitle="Manage game releases, availability modes, and private builds">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter studio games..."
              className="w-full pl-9 pr-4 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Game</span>
          </button>
        </div>

        {/* Games Table / List */}
        <div className="rounded-2xl bg-[#0c0e17] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#08090f] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Game</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Availability Mode</th>
                  <th className="p-4">Release Build</th>
                  <th className="p-4">Test Build</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.thumbnailUrl || game.coverImageUrl}
                          alt={game.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{game.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            /{game.slug} • v{game.version} • {game.genre}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          game.publicationStatus === 'published'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {game.publicationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-semibold">
                        {game.availabilityMode === 'download'
                          ? 'Download Only'
                          : game.availabilityMode === 'test_only'
                          ? 'Test Only'
                          : 'Download + Test'}
                      </span>
                    </td>

                    <td className="p-4">
                      {game.releaseBuildStoragePath ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{game.releaseBuildFilename || 'Build Active'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">None Attached</span>
                      )}
                    </td>

                    <td className="p-4">
                      {game.testBuildStoragePath ? (
                        <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{game.testBuildFilename || 'Test Active'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">None Attached</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/games/${game.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                          title="Preview public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(game)}
                          className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40"
                          title="Edit game & builds"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(game.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40"
                          title="Delete game"
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
                <h3 className="text-lg font-bold text-white">Confirm Game Deletion</h3>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Are you sure you want to delete this game record? All attached release and test build references will be removed from the catalog.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteGame(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Game Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0c0e17] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0c0e17] z-10">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingGame ? `Edit Game: ${editingGame.title}` : 'Add New Game'}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Configure publication mode, release build, and test requirements
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSaveGame} className="p-6 space-y-6 flex-1">
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

                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Game Title <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Shadow Protocol"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50"
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
                      placeholder="shadow-protocol"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Genre</label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="Tactical Stealth"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      placeholder="1.0.0"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Release Date</label>
                    <input
                      type="text"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                {/* Three Availability Modes (Section 4.B) */}
                <div className="p-4 rounded-xl bg-[#08090f] border border-cyan-500/30 space-y-3">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                    Publication Availability Mode <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availabilityMode: 'download' })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.availabilityMode === 'download'
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#121624] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs">Download Only</span>
                      </div>
                      <p className="text-[10px] font-normal text-slate-400 mt-1">
                        Shows public Download button for release build.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availabilityMode: 'test_only' })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.availabilityMode === 'test_only'
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold'
                          : 'bg-[#121624] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs">Test Only</span>
                      </div>
                      <p className="text-[10px] font-normal text-slate-400 mt-1">
                        Shows Test Game button. Never exposes release build.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, availabilityMode: 'download_and_test' })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.availabilityMode === 'download_and_test'
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#121624] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs">Download + Test</span>
                      </div>
                      <p className="text-[10px] font-normal text-slate-400 mt-1">
                        Displays both Download and Join Playtest buttons.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Publication Status & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Catalog Visibility</label>
                    <select
                      value={formData.publicationStatus}
                      onChange={(e) => setFormData({ ...formData, publicationStatus: e.target.value as PublicationStatus })}
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono"
                    >
                      <option value="published">Published (Visible on Public Website)</option>
                      <option value="draft">Draft (Private to Team Only)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded bg-[#121624] border-white/20 text-cyan-500 focus:ring-0"
                      />
                      <span>Pin to Home Page Featured Games</span>
                    </label>
                  </div>
                </div>

                {/* Platforms multi-selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 block">Supported Platforms</label>
                  <div className="flex gap-3">
                    {['Windows', 'Linux', 'macOS'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                          formData.platforms.includes(p)
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                            : 'bg-white/5 text-slate-400 border-white/5'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Short Summary</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview for cards"
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Full Description (Markdown)</label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed game synopsis, features, lore, and updates..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono leading-relaxed"
                  />
                </div>

                {/* Testing Guidelines */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Playtest Instructions</label>
                  <textarea
                    rows={2}
                    value={formData.testInstructions}
                    onChange={(e) => setFormData({ ...formData, testInstructions: e.target.value })}
                    placeholder="Specific test instructions or launch parameters for alpha testers..."
                    className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono leading-relaxed"
                  />
                </div>

                {/* System Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Minimum System Requirements</label>
                    <input
                      type="text"
                      value={formData.systemRequirements.minimum}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          systemRequirements: { ...formData.systemRequirements, minimum: e.target.value },
                        })
                      }
                      placeholder="OS, CPU, RAM, GPU..."
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Recommended Requirements</label>
                    <input
                      type="text"
                      value={formData.systemRequirements.recommended}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          systemRequirements: { ...formData.systemRequirements, recommended: e.target.value },
                        })
                      }
                      placeholder="OS, CPU, RAM, GPU..."
                      className="w-full px-3.5 py-2 bg-[#121624] border border-white/10 rounded-xl text-xs text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="p-4 rounded-xl bg-[#08090f] border border-white/5 space-y-4">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                    Game Media & Artwork
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-slate-400">Thumbnail Image URL</span>
                      <input
                        type="text"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#121624] border border-white/10 rounded-lg text-xs text-white"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'thumbnailUrl')}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-slate-400">Cover Artwork URL</span>
                      <input
                        type="text"
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-[#121624] border border-white/10 rounded-lg text-xs text-white"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'coverImageUrl')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* BINARY BUILDS MANAGEMENT SECTION */}
                {editingGame && (
                  <div className="p-4 rounded-xl bg-[#08090f] border border-cyan-500/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                        <FileArchive className="w-4 h-4 text-cyan-400" /> Private Binary Storage Packages
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">Private Server Vault</span>
                    </div>

                    {uploadStatus && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                        {uploadStatus}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Release Build */}
                      <div className="p-3.5 rounded-xl bg-[#121624] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-emerald-400" /> Release Build
                          </span>
                          {editingGame.releaseBuildStoragePath ? (
                            <span className="text-[10px] font-mono text-emerald-400">Attached</span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">Missing</span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate">
                          {editingGame.releaseBuildFilename || 'No archive uploaded'}
                        </p>
                        <label className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingRelease ? 'Uploading...' : 'Upload Release Zip'}</span>
                          <input
                            type="file"
                            className="hidden"
                            disabled={uploadingRelease}
                            onChange={(e) => handleBuildUpload(e, 'release')}
                          />
                        </label>
                      </div>

                      {/* Test Build */}
                      <div className="p-3.5 rounded-xl bg-[#121624] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Build
                          </span>
                          {editingGame.testBuildStoragePath ? (
                            <span className="text-[10px] font-mono text-amber-400">Attached</span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">Missing</span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 truncate">
                          {editingGame.testBuildFilename || 'No archive uploaded'}
                        </p>
                        <label className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-mono cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingTest ? 'Uploading...' : 'Upload Test Zip'}</span>
                          <input
                            type="file"
                            className="hidden"
                            disabled={uploadingTest}
                            onChange={(e) => handleBuildUpload(e, 'test')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <span>{saving ? 'Persisting to Database...' : 'Save Game Record'}</span>
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
