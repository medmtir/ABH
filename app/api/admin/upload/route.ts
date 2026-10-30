import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { getNeonPool } from '@/lib/db/db';
import fs from 'fs';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function checkMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.subarray(0, 4).toString('hex').toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return hex.startsWith('ffd8ff');
    case '.png':
      return hex.startsWith('89504e47');
    case '.pdf':
      return hex.startsWith('25504446');
    case '.webp':
      return buffer.subarray(0, 4).toString() === 'RIFF';
    case '.svg':
      const text = buffer.subarray(0, 100).toString().toLowerCase();
      return text.includes('<svg') || text.includes('<?xml');
    default:
      return true;
  }
}

export async function POST(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop lourd (Max 15 Mo)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Format de fichier non autorisé' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic Bytes verification
    if (!checkMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { error: 'Intégrité du fichier invalide (magic bytes)' },
        { status: 400 }
      );
    }

    const sanitizedBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const fileName = `${sanitizedBase}-${Date.now()}${ext}`;

    // 1. Persist directly to Neon PostgreSQL (Reliable on Vercel Serverless)
    const pool = getNeonPool();
    if (pool) {
      try {
        const base64Data = buffer.toString('base64');
        await pool.query(
          `INSERT INTO uploaded_files (id, filename, mime_type, data_base64, size_bytes, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (id) DO UPDATE SET data_base64 = $4, size_bytes = $5;`,
          [fileName, fileName, file.type || 'application/octet-stream', base64Data, buffer.length]
        );
      } catch (dbErr) {
        console.error('Neon uploaded_files save error:', dbErr);
      }
    }

    // 2. Also try writing to local disk (for dev environment)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
    } catch (diskErr) {
      // Expected on Vercel where file system is read-only
    }

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: fileUrl, name: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erreur lors du téléversement' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await validateAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const fileMap = new Map<string, any>();

    // 1. Fetch from Neon PostgreSQL
    const pool = getNeonPool();
    if (pool) {
      try {
        const res = await pool.query(
          'SELECT filename, size_bytes, created_at FROM uploaded_files ORDER BY created_at DESC'
        );
        for (const row of res.rows) {
          fileMap.set(row.filename, {
            name: row.filename,
            url: `/uploads/${row.filename}`,
            size: `${(row.size_bytes / 1024).toFixed(1)} KB`,
            created_at: new Date(row.created_at).toISOString(),
          });
        }
      } catch (err) {
        console.error('Neon uploaded_files fetch error:', err);
      }
    }

    // 2. Merge local disk files if present
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (fs.existsSync(uploadDir)) {
        const diskFiles = fs.readdirSync(uploadDir);
        for (const name of diskFiles) {
          if (!fileMap.has(name)) {
            const stats = fs.statSync(path.join(uploadDir, name));
            fileMap.set(name, {
              name,
              url: `/uploads/${name}`,
              size: `${(stats.size / 1024).toFixed(1)} KB`,
              created_at: stats.birthtime.toISOString(),
            });
          }
        }
      }
    } catch {}

    const result = Array.from(fileMap.values());
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lecture médias' }, { status: 500 });
  }
}
