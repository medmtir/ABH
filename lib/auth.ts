// ============================================================
// ABH Company — JWT Authentication Utilities
// ============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abh-fallback-secret-change-in-production';
const TOKEN_EXPIRY = '24h';
const SALT_ROUNDS = 12;
const COOKIE_NAME = 'admin_token';

// ----- Password Utilities -----

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ----- JWT Token Utilities -----

export interface TokenPayload {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
  name: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

// ----- Cookie Helpers -----

export function getTokenFromCookies(
  cookies: { get: (name: string) => { value: string } | undefined }
): string | null {
  const cookie = cookies.get(COOKIE_NAME);
  return cookie?.value ?? null;
}

// ----- Session Validation -----

export interface SessionResult {
  valid: boolean;
  admin: TokenPayload | null;
  error?: string;
}

export async function validateAdminSession(
  request: Request
): Promise<SessionResult> {
  try {
    // Extract token from cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const token = cookies[COOKIE_NAME];

    if (!token) {
      return { valid: false, admin: null, error: 'No authentication token found' };
    }

    const payload = verifyToken(token);

    if (!payload) {
      return { valid: false, admin: null, error: 'Invalid or expired token' };
    }

    return { valid: true, admin: payload };
  } catch {
    return { valid: false, admin: null, error: 'Session validation failed' };
  }
}

// ----- Internal Helpers -----

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const [rawName, ...rawValue] = cookie.split('=');
    const name = rawName?.trim();
    const value = rawValue.join('=').trim();
    if (name) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}
