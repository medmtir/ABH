import { NextRequest, NextResponse } from 'next/server';
import { loadDatabaseAsync, saveDatabaseAsync } from '@/lib/db/db';
import {
  verifyPassword,
  hashPassword,
  generateToken,
  validateAdminSession,
} from '@/lib/auth';

// Anti brute force: IP -> { count: number, lockedUntil: number }
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

// 1. POST: Login
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    const now = Date.now();

    const attempt = loginAttempts.get(ip);
    if (attempt && attempt.lockedUntil > now) {
      const remainingMinutes = Math.ceil((attempt.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          error: `Trop de tentatives infructueuses. Compte temporairement verrouillé pour ${remainingMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const db = await loadDatabaseAsync();
    const admin = (db.admins || []).find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!admin) {
      // Record failed attempt
      const count = (attempt?.count || 0) + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION : 0;
      loginAttempts.set(ip, { count, lockedUntil });

      return NextResponse.json(
        { error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, admin.password_hash);
    if (!passwordValid) {
      const count = (attempt?.count || 0) + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_DURATION : 0;
      loginAttempts.set(ip, { count, lockedUntil });

      return NextResponse.json(
        { error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // Success: clear failed attempts
    loginAttempts.delete(ip);

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Erreur interne lors de la connexion.' },
      { status: 500 }
    );
  }
}

// 2. GET: Check session
export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    admin: session.admin,
  });
}

// 3. PUT: Change password
export async function PUT(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password || new_password.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const db = await loadDatabaseAsync();
    const admin = db.admins.find((a) => a.id === session.admin!.id);

    if (!admin) {
      return NextResponse.json({ error: 'Administrateur introuvable.' }, { status: 404 });
    }

    const matches = await verifyPassword(current_password, admin.password_hash);
    if (!matches) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect.' },
        { status: 400 }
      );
    }

    admin.password_hash = await hashPassword(new_password);
    await saveDatabaseAsync(db);

    return NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe.' },
      { status: 500 }
    );
  }
}

// 4. DELETE: Logout
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Déconnexion effectuée.',
  });

  response.cookies.set({
    name: 'admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
