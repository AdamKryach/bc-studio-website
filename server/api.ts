import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { db, UPLOADS_DIR } from './db';
import {
  ADMIN_USERNAME,
  SESSION_COOKIE_NAME,
  getAdminPassword,
  verifyPassword,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  createSession,
  invalidateSession,
  getSession,
  requireAdminAuth,
  isEnvAdminPasswordConfigured,
} from './auth';
import { imageUpload, buildUpload, createDownloadToken, getDownloadByToken } from './storage';
import { Game } from './types';

export const apiRouter = express.Router();

// Helper to strip sensitive storage paths from public game records
function sanitizePublicGame(game: Game) {
  return {
    id: game.id,
    title: game.title,
    slug: game.slug,
    shortDescription: game.shortDescription,
    fullDescription: game.fullDescription,
    thumbnailUrl: game.thumbnailUrl,
    coverImageUrl: game.coverImageUrl,
    screenshots: game.screenshots,
    genre: game.genre,
    platforms: game.platforms,
    version: game.version,
    releaseDate: game.releaseDate,
    systemRequirements: game.systemRequirements,
    publicationStatus: game.publicationStatus,
    availabilityMode: game.availabilityMode,
    hasReleaseBuild: !!game.releaseBuildStoragePath,
    releaseBuildFilename: game.releaseBuildFilename,
    releaseBuildSizeBytes: game.releaseBuildSizeBytes,
    hasTestBuild: !!game.testBuildStoragePath,
    testBuildFilename: game.testBuildFilename,
    testBuildSizeBytes: game.testBuildSizeBytes,
    testInstructions: game.testInstructions,
    testInviteRequired: game.testInviteRequired,
    featured: game.featured,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  };
}

// ==========================================
// PUBLIC API ROUTES (No auth required)
// ==========================================

// Studio Settings
apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({ settings });
});

// Games
apiRouter.get('/games', (req: Request, res: Response) => {
  const games = db.getGames(true);
  res.json({ games: games.map(sanitizePublicGame) });
});

apiRouter.get('/games/:slug', (req: Request, res: Response) => {
  const game = db.getGameBySlug(req.params.slug, true);
  if (!game) {
    return res.status(404).json({ error: 'Game not found or not published' });
  }
  res.json({ game: sanitizePublicGame(game) });
});

// Download token generator for released build
apiRouter.get('/games/:slug/download-url', (req: Request, res: Response) => {
  const game = db.getGameBySlug(req.params.slug, true);
  if (!game) {
    return res.status(404).json({ error: 'Game not found or unpublished' });
  }

  if (game.availabilityMode === 'test_only') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This title is configured for testing only. Release downloads are not available.',
    });
  }

  if (!game.releaseBuildStoragePath) {
    return res.status(404).json({
      error: 'Build Unavailable',
      message: 'No release package has been uploaded yet by the development team.',
    });
  }

  const tokenData = createDownloadToken(game.id, 'release');
  if (!tokenData) {
    return res.status(500).json({ error: 'Failed to generate download authorization' });
  }

  res.json(tokenData);
});

// Download token generator for test build
apiRouter.get('/games/:slug/test-download-url', (req: Request, res: Response) => {
  const game = db.getGameBySlug(req.params.slug, true);
  if (!game) {
    return res.status(404).json({ error: 'Game not found or unpublished' });
  }

  if (game.availabilityMode === 'download') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This title only has a public release build. No separate playtest build is active.',
    });
  }

  if (!game.testBuildStoragePath) {
    return res.status(404).json({
      error: 'Test Build Unavailable',
      message: 'No testing build package has been uploaded yet for this title.',
    });
  }

  const tokenData = createDownloadToken(game.id, 'test');
  if (!tokenData) {
    return res.status(500).json({ error: 'Failed to generate playtest download authorization' });
  }

  res.json(tokenData);
});

// Secure time-limited token downloader
apiRouter.get('/downloads/token/:token', (req: Request, res: Response) => {
  const downloadInfo = getDownloadByToken(req.params.token);
  if (!downloadInfo) {
    return res.status(403).send('Download link is invalid or has expired. Please request a new download link.');
  }

  if (!fs.existsSync(downloadInfo.filePath)) {
    return res.status(404).send('The requested build package file was not found on storage.');
  }

  const safeFilename = encodeURIComponent(downloadInfo.filename);
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const fileStream = fs.createReadStream(downloadInfo.filePath);
  fileStream.pipe(res);
});

// News
apiRouter.get('/news', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  let articles = db.getNews(true);
  if (category) {
    articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ articles });
});

apiRouter.get('/news/:slug', (req: Request, res: Response) => {
  const article = db.getNewsBySlug(req.params.slug, true);
  if (!article) {
    return res.status(404).json({ error: 'Article not found or not published' });
  }
  res.json({ article });
});

// Tools (STRICTLY showcase only - no downloads!)
apiRouter.get('/tools', (req: Request, res: Response) => {
  const tools = db.getTools();
  res.json({ tools });
});

apiRouter.get('/tools/:slug', (req: Request, res: Response) => {
  const tool = db.getToolBySlug(req.params.slug);
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }
  res.json({ tool });
});

// CTF & Research
apiRouter.get('/ctf', (req: Request, res: Response) => {
  const entries = db.getCTF(true);
  res.json({ entries });
});

apiRouter.get('/ctf/:slug', (req: Request, res: Response) => {
  const entry = db.getCTFBySlug(req.params.slug, true);
  if (!entry) {
    return res.status(404).json({ error: 'CTF entry not found or not published' });
  }
  res.json({ entry });
});

// Contact Form submission (Rate limited, sanitized, public)
const contactLimiter = new Map<string, number>();
apiRouter.post('/contact', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const lastTime = contactLimiter.get(ip) || 0;
  if (Date.now() - lastTime < 10000) {
    // 10 sec cooldown
    return res.status(429).json({ error: 'Please wait a moment before sending another message.' });
  }

  const { name, email, subject, category, message, honeypot } = req.body;

  // Spam bot trap
  if (honeypot) {
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Invalid email address provided.' });
  }

  const cleanCategory = ['General', 'Playtest', 'Security Disclosure', 'Partnership'].includes(category)
    ? category
    : 'General';

  const newMsg = db.addMessage({
    name: String(name).slice(0, 100).trim(),
    email: String(email).slice(0, 120).trim(),
    subject: String(subject).slice(0, 200).trim(),
    category: cleanCategory,
    message: String(message).slice(0, 5000).trim(),
  });

  contactLimiter.set(ip, Date.now());
  res.json({ success: true, message: 'Your message has been securely submitted to the Black Cloud team.', id: newMsg.id });
});

// Public Media delivery
apiRouter.get('/media/:filename', (req: Request, res: Response) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Image not found');
  }

  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(filePath);
});

// ==========================================
// TEAM ADMIN AUTHENTICATION
// ==========================================

apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const { username, password } = req.body;

  // Check rate limit
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    const mins = Math.ceil((rateLimit.remainingMs || 0) / 60000);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Account locked due to consecutive failed attempts. Please retry in ${mins} minute(s).`,
    });
  }

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const validUsername = ADMIN_USERNAME;
  const configuredPassword = getAdminPassword();

  const isUserValid = username.trim() === validUsername;
  const isPassValid = isUserValid ? await verifyPassword(password, configuredPassword) : false;

  if (!isUserValid || !isPassValid) {
    recordFailedLogin(ip);
    db.logAudit('FAILED_LOGIN_ATTEMPT', username || 'Unknown', `Failed login attempt from IP: ${ip}`, ip);
    return res.status(401).json({
      error: 'Invalid Credentials',
      message: 'The username or password you entered is incorrect.',
    });
  }

  clearLoginRateLimit(ip);

  // Rotate and issue new session
  const session = createSession(validUsername, ip);
  db.logAudit('ADMIN_LOGIN', validUsername, 'Successfully authenticated to administration portal', ip);

  // Set secure cookie
  res.cookie(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: {
      username: validUsername,
      role: 'Studio Administrator',
    },
    token: session.token,
  });
});

apiRouter.post('/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (token) {
    invalidateSession(token);
  }
  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/admin/me', (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['authorization']?.replace(/^Bearer\s+/, '');
  const activeSession = getSession(token);

  if (!activeSession) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: {
      username: activeSession.username,
      role: 'Studio Administrator',
    },
  });
});

// ==========================================
// PROTECTED ADMIN API ROUTES
// ==========================================
apiRouter.use('/admin', requireAdminAuth);

// System status & statistics
apiRouter.get('/admin/stats', (req: Request, res: Response) => {
  res.json(db.getStats());
});

apiRouter.get('/admin/system-status', (req: Request, res: Response) => {
  const isEnvConfigured = isEnvAdminPasswordConfigured();
  res.json({
    isEnvAdminPasswordConfigured: isEnvConfigured,
    adminUsername: ADMIN_USERNAME,
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    databaseStatus: 'Healthy (Persistent File Store)',
  });
});

// Upload media image
apiRouter.post('/admin/upload-image', imageUpload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }
  const publicUrl = `/api/media/${req.file.filename}`;
  db.logAudit('UPLOAD_MEDIA', (req as any).adminUser.username, `Uploaded image: ${req.file.filename}`);
  res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// Upload game build
apiRouter.post('/admin/games/:id/upload-build', buildUpload.single('buildFile'), (req: Request, res: Response) => {
  const game = db.getGameById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No build archive file uploaded.' });
  }

  const buildType = (req.body.buildType as 'release' | 'test') || 'release';
  if (buildType === 'release') {
    game.releaseBuildStoragePath = req.file.filename;
    game.releaseBuildFilename = req.file.originalname;
    game.releaseBuildSizeBytes = req.file.size;
  } else {
    game.testBuildStoragePath = req.file.filename;
    game.testBuildFilename = req.file.originalname;
    game.testBuildSizeBytes = req.file.size;
  }

  db.saveGame(game);
  db.logAudit(
    'UPLOAD_GAME_BUILD',
    (req as any).adminUser.username,
    `Uploaded ${buildType} build for "${game.title}": ${req.file.originalname} (${Math.round(req.file.size / 1024 / 1024)}MB)`
  );

  res.json({
    success: true,
    message: `${buildType === 'release' ? 'Release' : 'Test'} build successfully uploaded.`,
    game,
  });
});

// Admin Games CRUD
apiRouter.get('/admin/games', (req: Request, res: Response) => {
  res.json({ games: db.getGames(false) });
});

apiRouter.post('/admin/games', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.slug) {
    return res.status(400).json({ error: 'Title and URL slug are required' });
  }

  const newGame: Game = {
    id: `game-${Date.now()}`,
    title: body.title,
    slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-'),
    shortDescription: body.shortDescription || '',
    fullDescription: body.fullDescription || '',
    thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: body.coverImageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
    genre: body.genre || 'Action',
    platforms: Array.isArray(body.platforms) ? body.platforms : ['Windows'],
    version: body.version || '1.0.0',
    releaseDate: body.releaseDate || new Date().toISOString().split('T')[0],
    systemRequirements: body.systemRequirements || { minimum: '', recommended: '' },
    publicationStatus: body.publicationStatus === 'draft' ? 'draft' : 'published',
    availabilityMode: ['download', 'test_only', 'download_and_test'].includes(body.availabilityMode)
      ? body.availabilityMode
      : 'download',
    releaseBuildStoragePath: body.releaseBuildStoragePath || null,
    releaseBuildFilename: body.releaseBuildFilename || null,
    releaseBuildSizeBytes: body.releaseBuildSizeBytes || null,
    testBuildStoragePath: body.testBuildStoragePath || null,
    testBuildFilename: body.testBuildFilename || null,
    testBuildSizeBytes: body.testBuildSizeBytes || null,
    testInstructions: body.testInstructions || '',
    testInviteRequired: !!body.testInviteRequired,
    featured: !!body.featured,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveGame(newGame);
  db.logAudit('CREATE_GAME', (req as any).adminUser.username, `Created game "${newGame.title}"`);
  res.json({ success: true, game: newGame });
});

apiRouter.put('/admin/games/:id', (req: Request, res: Response) => {
  const existing = db.getGameById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const updated: Game = {
    ...existing,
    ...req.body,
    id: existing.id, // cannot change id
    updatedAt: new Date().toISOString(),
  };

  db.saveGame(updated);
  db.logAudit('UPDATE_GAME', (req as any).adminUser.username, `Updated game "${updated.title}"`);
  res.json({ success: true, game: updated });
});

apiRouter.delete('/admin/games/:id', (req: Request, res: Response) => {
  const game = db.getGameById(req.params.id);
  const success = db.deleteGame(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Game not found' });
  }
  db.logAudit('DELETE_GAME', (req as any).adminUser.username, `Deleted game "${game?.title || req.params.id}"`);
  res.json({ success: true });
});

// Admin News CRUD
apiRouter.get('/admin/news', (req: Request, res: Response) => {
  res.json({ articles: db.getNews(false) });
});

apiRouter.post('/admin/news', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.slug) {
    return res.status(400).json({ error: 'Title and URL slug are required' });
  }

  const newArticle = {
    id: `news-${Date.now()}`,
    title: body.title,
    slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-'),
    excerpt: body.excerpt || '',
    content: body.content || '',
    featuredImageUrl: body.featuredImageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: body.category || 'Announcement',
    tags: Array.isArray(body.tags) ? body.tags : [],
    authorLabel: body.authorLabel || 'Black Cloud Core',
    publicationStatus: body.publicationStatus === 'draft' ? 'draft' : 'published',
    publishedAt: body.publicationStatus === 'published' ? new Date().toISOString() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveNews(newArticle as any);
  db.logAudit('CREATE_NEWS', (req as any).adminUser.username, `Created article "${newArticle.title}"`);
  res.json({ success: true, article: newArticle });
});

apiRouter.put('/admin/news/:id', (req: Request, res: Response) => {
  const existing = db.getNewsById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    publishedAt:
      req.body.publicationStatus === 'published' && !existing.publishedAt
        ? new Date().toISOString()
        : existing.publishedAt,
    updatedAt: new Date().toISOString(),
  };

  db.saveNews(updated);
  db.logAudit('UPDATE_NEWS', (req as any).adminUser.username, `Updated article "${updated.title}"`);
  res.json({ success: true, article: updated });
});

apiRouter.delete('/admin/news/:id', (req: Request, res: Response) => {
  const article = db.getNewsById(req.params.id);
  const success = db.deleteNews(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Article not found' });
  }
  db.logAudit('DELETE_NEWS', (req as any).adminUser.username, `Deleted article "${article?.title || req.params.id}"`);
  res.json({ success: true });
});

// Admin Security Tools CRUD (Strictly showcase catalog only)
apiRouter.get('/admin/tools', (req: Request, res: Response) => {
  res.json({ tools: db.getTools() });
});

apiRouter.post('/admin/tools', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.slug) {
    return res.status(400).json({ error: 'Title and URL slug are required' });
  }

  const newTool = {
    id: `tool-${Date.now()}`,
    title: body.title,
    slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-'),
    shortDescription: body.shortDescription || '',
    fullDescription: body.fullDescription || '',
    thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    projectUrl: body.projectUrl || '',
    documentationUrl: body.documentationUrl || '',
    technologies: Array.isArray(body.technologies) ? body.technologies : [],
    purpose: body.purpose || '',
    intendedAudience: body.intendedAudience || '',
    status: body.status || 'Active',
    featured: !!body.featured,
    sortOrder: Number(body.sortOrder) || db.getTools().length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveTool(newTool as any);
  db.logAudit('CREATE_TOOL', (req as any).adminUser.username, `Created tool catalog entry "${newTool.title}"`);
  res.json({ success: true, tool: newTool });
});

apiRouter.put('/admin/tools/:id', (req: Request, res: Response) => {
  const existing = db.getToolById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Tool not found' });
  }

  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.saveTool(updated);
  db.logAudit('UPDATE_TOOL', (req as any).adminUser.username, `Updated tool entry "${updated.title}"`);
  res.json({ success: true, tool: updated });
});

apiRouter.delete('/admin/tools/:id', (req: Request, res: Response) => {
  const tool = db.getToolById(req.params.id);
  const success = db.deleteTool(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Tool not found' });
  }
  db.logAudit('DELETE_TOOL', (req as any).adminUser.username, `Deleted tool entry "${tool?.title || req.params.id}"`);
  res.json({ success: true });
});

// Admin CTF CRUD
apiRouter.get('/admin/ctf', (req: Request, res: Response) => {
  res.json({ entries: db.getCTF(false) });
});

apiRouter.post('/admin/ctf', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.slug) {
    return res.status(400).json({ error: 'Title and URL slug are required' });
  }

  const newEntry = {
    id: `ctf-${Date.now()}`,
    title: body.title,
    slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-'),
    competitionName: body.competitionName || '',
    organizer: body.organizer || '',
    eventDate: body.eventDate || new Date().toISOString().split('T')[0],
    teamLabel: body.teamLabel || 'Black Cloud',
    verifiedPlacement: body.verifiedPlacement || '',
    score: body.score || '',
    challenges: Array.isArray(body.challenges) ? body.challenges : [],
    writeup: body.writeup || '',
    lessonsLearned: body.lessonsLearned || '',
    disclosureNotes: body.disclosureNotes || '',
    references: Array.isArray(body.references) ? body.references : [],
    featuredImageUrl: body.featuredImageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    publicationStatus: body.publicationStatus === 'draft' ? 'draft' : 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveCTF(newEntry as any);
  db.logAudit('CREATE_CTF', (req as any).adminUser.username, `Created CTF entry "${newEntry.title}"`);
  res.json({ success: true, entry: newEntry });
});

apiRouter.put('/admin/ctf/:id', (req: Request, res: Response) => {
  const existing = db.getCTFById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'CTF entry not found' });
  }

  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.saveCTF(updated);
  db.logAudit('UPDATE_CTF', (req as any).adminUser.username, `Updated CTF entry "${updated.title}"`);
  res.json({ success: true, entry: updated });
});

apiRouter.delete('/admin/ctf/:id', (req: Request, res: Response) => {
  const entry = db.getCTFById(req.params.id);
  const success = db.deleteCTF(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'CTF entry not found' });
  }
  db.logAudit('DELETE_CTF', (req as any).adminUser.username, `Deleted CTF entry "${entry?.title || req.params.id}"`);
  res.json({ success: true });
});

// Admin Settings
apiRouter.get('/admin/settings', (req: Request, res: Response) => {
  res.json({ settings: db.getSettings() });
});

apiRouter.put('/admin/settings', (req: Request, res: Response) => {
  const updated = db.saveSettings(req.body);
  db.logAudit('UPDATE_STUDIO_SETTINGS', (req as any).adminUser.username, 'Updated studio configuration');
  res.json({ success: true, settings: updated });
});

// Admin Messages
apiRouter.get('/admin/messages', (req: Request, res: Response) => {
  res.json({ messages: db.getMessages() });
});

apiRouter.patch('/admin/messages/:id/read', (req: Request, res: Response) => {
  const success = db.markMessageRead(req.params.id, !!req.body.read);
  res.json({ success });
});

apiRouter.delete('/admin/messages/:id', (req: Request, res: Response) => {
  const success = db.deleteMessage(req.params.id);
  res.json({ success });
});

// Admin Audit Logs
apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});
