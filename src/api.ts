import {
  Game,
  NewsArticle,
  SecurityTool,
  CTFEntry,
  StudioSettings,
  ContactMessage,
  AuditLogEntry,
  DashboardStats,
} from './types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'same-origin',
  });

  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data.message || data.error) {
        errMsg = data.message || data.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new ApiError(errMsg, res.status);
  }

  return res.json();
}

export const api = {
  // Public
  getSettings: () => request<{ settings: StudioSettings }>('/api/settings').then((r) => r.settings),
  getGames: () => request<{ games: Game[] }>('/api/games').then((r) => r.games),
  getGame: (slug: string) => request<{ game: Game }>(`/api/games/${slug}`).then((r) => r.game),
  getGameDownloadUrl: (slug: string) =>
    request<{ token: string; downloadUrl: string; filename: string; sizeBytes: number; expiresAt: number }>(
      `/api/games/${slug}/download-url`
    ),
  getGameTestDownloadUrl: (slug: string) =>
    request<{ token: string; downloadUrl: string; filename: string; sizeBytes: number; expiresAt: number }>(
      `/api/games/${slug}/test-download-url`
    ),
  getNews: (category?: string) =>
    request<{ articles: NewsArticle[] }>(`/api/news${category ? `?category=${encodeURIComponent(category)}` : ''}`).then(
      (r) => r.articles
    ),
  getArticle: (slug: string) => request<{ article: NewsArticle }>(`/api/news/${slug}`).then((r) => r.article),
  getTools: () => request<{ tools: SecurityTool[] }>('/api/tools').then((r) => r.tools),
  getTool: (slug: string) => request<{ tool: SecurityTool }>(`/api/tools/${slug}`).then((r) => r.tool),
  getCTF: () => request<{ entries: CTFEntry[] }>('/api/ctf').then((r) => r.entries),
  getCTFEntry: (slug: string) => request<{ entry: CTFEntry }>(`/api/ctf/${slug}`).then((r) => r.entry),
  submitContact: (data: { name: string; email: string; subject: string; category: string; message: string; honeypot?: string }) =>
    request<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin Auth
  login: (username: string, password: string) =>
    request<{ success: boolean; user: { username: string; role: string }; token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ success: boolean }>('/api/admin/logout', { method: 'POST' }),
  checkAuth: () => request<{ authenticated: boolean; user?: { username: string; role: string } }>('/api/admin/me'),
  getSystemStatus: () =>
    request<{
      isEnvAdminPasswordConfigured: boolean;
      adminUsername: string;
      serverTime: string;
      uptimeSeconds: number;
      nodeVersion: string;
      databaseStatus: string;
    }>('/api/admin/system-status'),

  // Admin Data
  getStats: () => request<DashboardStats>('/api/admin/stats'),
  getAdminGames: () => request<{ games: Game[] }>('/api/admin/games').then((r) => r.games),
  createGame: (data: Partial<Game>) =>
    request<{ success: boolean; game: Game }>('/api/admin/games', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.game),
  updateGame: (id: string, data: Partial<Game>) =>
    request<{ success: boolean; game: Game }>(`/api/admin/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.game),
  deleteGame: (id: string) => request<{ success: boolean }>(`/api/admin/games/${id}`, { method: 'DELETE' }),

  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Image upload failed');
    }
    return res.json();
  },

  uploadGameBuild: async (gameId: string, file: File, buildType: 'release' | 'test'): Promise<Game> => {
    const formData = new FormData();
    formData.append('buildFile', file);
    formData.append('buildType', buildType);
    const res = await fetch(`/api/admin/games/${gameId}/upload-build`, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Game build upload failed');
    }
    const data = await res.json();
    return data.game;
  },

  // Admin News
  getAdminNews: () => request<{ articles: NewsArticle[] }>('/api/admin/news').then((r) => r.articles),
  createNews: (data: Partial<NewsArticle>) =>
    request<{ success: boolean; article: NewsArticle }>('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.article),
  updateNews: (id: string, data: Partial<NewsArticle>) =>
    request<{ success: boolean; article: NewsArticle }>(`/api/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.article),
  deleteNews: (id: string) => request<{ success: boolean }>(`/api/admin/news/${id}`, { method: 'DELETE' }),

  // Admin Tools
  getAdminTools: () => request<{ tools: SecurityTool[] }>('/api/admin/tools').then((r) => r.tools),
  createTool: (data: Partial<SecurityTool>) =>
    request<{ success: boolean; tool: SecurityTool }>('/api/admin/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.tool),
  updateTool: (id: string, data: Partial<SecurityTool>) =>
    request<{ success: boolean; tool: SecurityTool }>(`/api/admin/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.tool),
  deleteTool: (id: string) => request<{ success: boolean }>(`/api/admin/tools/${id}`, { method: 'DELETE' }),

  // Admin CTF
  getAdminCTF: () => request<{ entries: CTFEntry[] }>('/api/admin/ctf').then((r) => r.entries),
  createCTF: (data: Partial<CTFEntry>) =>
    request<{ success: boolean; entry: CTFEntry }>('/api/admin/ctf', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((r) => r.entry),
  updateCTF: (id: string, data: Partial<CTFEntry>) =>
    request<{ success: boolean; entry: CTFEntry }>(`/api/admin/ctf/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.entry),
  deleteCTF: (id: string) => request<{ success: boolean }>(`/api/admin/ctf/${id}`, { method: 'DELETE' }),

  // Admin Settings
  getAdminSettings: () => request<{ settings: StudioSettings }>('/api/admin/settings').then((r) => r.settings),
  updateSettings: (data: Partial<StudioSettings>) =>
    request<{ success: boolean; settings: StudioSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then((r) => r.settings),

  // Admin Messages
  getAdminMessages: () => request<{ messages: ContactMessage[] }>('/api/admin/messages').then((r) => r.messages),
  markMessageRead: (id: string, read: boolean) =>
    request<{ success: boolean }>(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    }),
  deleteMessage: (id: string) => request<{ success: boolean }>(`/api/admin/messages/${id}`, { method: 'DELETE' }),

  // Admin Audit
  getAuditLogs: () => request<{ logs: AuditLogEntry[] }>('/api/admin/audit-logs').then((r) => r.logs),
};
