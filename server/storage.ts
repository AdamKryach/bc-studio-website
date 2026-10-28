import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { UPLOADS_DIR, BUILDS_DIR, db } from './db';
import { DownloadToken } from './types';

// In-memory token storage with expiration
const downloadTokens = new Map<string, DownloadToken>();

// Clean expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of downloadTokens.entries()) {
    if (now > data.expiresAt) {
      downloadTokens.delete(token);
    }
  }
}, 60 * 1000);

// Multer storage for media images (publicly accessible via /api/media/:filename)
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.png';
    const uniqueName = `img_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${safeExt}`;
    cb(null, uniqueName);
  },
});

export const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB max image size
  },
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file format. Allowed: PNG, JPEG, WEBP, GIF, SVG.'));
    }
  },
});

// Multer storage for game binary builds (kept strictly private in BUILDS_DIR)
const buildStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BUILDS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `build_${Date.now()}_${crypto.randomBytes(12).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

export const buildUpload = multer({
  storage: buildStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB max for uploaded demo builds
  },
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.zip', '.7z', '.tar', '.gz', '.tgz', '.exe', '.appimage', '.dmg', '.apk'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid build package format (${ext}). Allowed: .zip, .7z, .tar.gz, .exe, .AppImage, .dmg`));
    }
  },
});

// Generate a short-lived download token (valid for 15 minutes)
export function createDownloadToken(gameId: string, type: 'release' | 'test'): { token: string; downloadUrl: string; expiresAt: number; filename: string; sizeBytes: number } | null {
  const game = db.getGameById(gameId);
  if (!game || game.publicationStatus !== 'published') {
    return null;
  }

  // Security checks based on game availabilityMode
  if (type === 'release') {
    if (game.availabilityMode === 'test_only') {
      // Forbidden: Test Only games must NEVER expose a release build
      return null;
    }
    if (!game.releaseBuildStoragePath) {
      return null;
    }
  } else if (type === 'test') {
    if (game.availabilityMode === 'download') {
      // Game only offers release download, no test build
      return null;
    }
    if (!game.testBuildStoragePath) {
      return null;
    }
  }

  const storageFilename = type === 'release' ? game.releaseBuildStoragePath! : game.testBuildStoragePath!;
  const displayFilename = type === 'release' ? (game.releaseBuildFilename || `${game.slug}_v${game.version}.zip`) : (game.testBuildFilename || `${game.slug}_test.zip`);
  const filePath = path.join(BUILDS_DIR, storageFilename);

  // Prevent path traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(BUILDS_DIR)) {
    return null;
  }

  if (!fs.existsSync(normalizedPath)) {
    return null;
  }

  const stat = fs.statSync(normalizedPath);
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  downloadTokens.set(token, {
    token,
    gameId,
    type,
    filename: displayFilename,
    filePath: normalizedPath,
    expiresAt,
  });

  return {
    token,
    downloadUrl: `/api/downloads/token/${token}`,
    expiresAt,
    filename: displayFilename,
    sizeBytes: stat.size,
  };
}

export function getDownloadByToken(token: string): DownloadToken | null {
  const data = downloadTokens.get(token);
  if (!data) return null;

  if (Date.now() > data.expiresAt) {
    downloadTokens.delete(token);
    return null;
  }

  // Double check that game is still published
  const game = db.getGameById(data.gameId);
  if (!game || game.publicationStatus !== 'published') {
    downloadTokens.delete(token);
    return null;
  }

  return data;
}
