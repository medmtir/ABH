import { NextRequest, NextResponse } from 'next/server';
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
    case '.doc':
    case '.docx':
      return true; // standard office containers
    default:
      return true;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop lourd (Maximum 15 Mo)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: 'Format de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, PDF, DOC, DOCX' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify magic bytes
    if (!checkMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { error: 'Intégrité du fichier invalide ou format corrompu.' },
        { status: 400 }
      );
    }

    const sanitizedBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const fileName = `rfq_${sanitizedBase}_${Date.now()}${ext}`;

    // 1. Persist directly to Neon PostgreSQL uploaded_files table
    const pool = getNeonPool();
    if (pool) {
      try {
        const base64Data = buffer.toString('base64');
        const mimeType = file.type || (
          ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
          ext === '.png' ? 'image/png' :
          ext === '.webp' ? 'image/webp' :
          ext === '.pdf' ? 'application/pdf' :
          ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream'
        );

        await pool.query(
          `INSERT INTO uploaded_files (id, filename, mime_type, data_base64, size_bytes, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (id) DO UPDATE SET data_base64 = $4, size_bytes = $5;`,
          [fileName, fileName, mimeType, base64Data, buffer.length]
        );
      } catch (dbErr) {
        console.error('Neon uploaded_files save error:', dbErr);
      }
    }

    // 2. Also try writing to local disk (for dev environment & speed)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
    } catch (diskErr) {
      // Expected on serverless readonly environments
    }

    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: fileName,
      original_name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Public upload error:', error);
    return NextResponse.json({ error: 'Erreur lors du téléversement du fichier.' }, { status: 500 });
  }
}
