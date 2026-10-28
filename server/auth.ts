import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';

const ADMIN_USERNAME = 'DevAdam';
const SESSION_COOKIE_NAME = 'bc_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Store active sessions in memory
interface Session {
  token: string;
  username: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
}

const activeSessions = new Map<string, Session>();

// Rate limiting for login attempts
interface RateLimitAttempt {
  count: number;
  firstAttempt: number;
}
const loginAttempts = new Map<string, RateLimitAttempt>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function isEnvAdminPasswordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length > 0;
}

export function getAdminPassword(): string {
  if (isEnvAdminPasswordConfigured()) {
    return process.env.ADMIN_PASSWORD!.trim();
  }
  // Secure fallback for local development preview before deployment secret is injected
  return 'DevAdam_Secure2021!';
}

// Scrypt password hashing and verification
export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(password: string, storedHashOrPlain: string): Promise<boolean> {
  return new Promise((resolve) => {
    // If stored as salt:hash
    if (storedHashOrPlain.includes(':')) {
      const [salt, key] = storedHashOrPlain.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const keyBuffer = Buffer.from(key, 'hex');
        try {
          resolve(crypto.timingSafeEqual(derivedKey, keyBuffer));
        } catch {
          resolve(false);
        }
      });
    } else {
      // Direct constant-time string comparison against plain admin password
      const a = Buffer.from(password);
      const b = Buffer.from(storedHashOrPlain);
      if (a.length !== b.length) {
        return resolve(false);
      }
      try {
        resolve(crypto.timingSafeEqual(a, b));
      } catch {
        resolve(false);
      }
    }
  });
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { allowed: true };

  if (now - attempt.firstAttempt > LOGIN_LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingMs = LOGIN_LOCKOUT_MS - (now - attempt.firstAttempt);
    return { allowed: false, remainingMs };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt || now - attempt.firstAttempt > LOGIN_LOCKOUT_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    attempt.count += 1;
  }
}

export function clearLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export function createSession(username: string, ip: string): Session {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: Session = {
    token,
    username,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    ip,
  };
  activeSessions.set(token, session);
  return session;
}

export function getSession(token?: string): Session | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

export function invalidateSession(token?: string) {
  if (token) {
    activeSessions.delete(token);
  }
}

// Middleware for Express
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['authorization']?.replace(/^Bearer\s+/, '');
  const session = getSession(token);

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required to access studio administration endpoints.',
    });
  }

  // Attach session user to request
  (req as any).adminUser = {
    username: session.username,
  };
  next();
}

export { ADMIN_USERNAME, SESSION_COOKIE_NAME };
