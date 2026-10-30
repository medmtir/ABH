import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getNeonPool } from '@/lib/db/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename) {
    return new NextResponse('Filename missing', { status: 400 });
  }

  // 1. Try serving from local disk (development or pre-bundled)
  try {
    const localPath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(localPath)) {
      const fileBuffer = fs.readFileSync(localPath);
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';

      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.pdf') contentType = 'application/pdf';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (err) {
    // Disk read failed, fallback to database
  }

  // 2. Query Neon PostgreSQL uploaded_files table
  const pool = getNeonPool();
  if (pool) {
    try {
      const res = await pool.query(
        'SELECT mime_type, data_base64 FROM uploaded_files WHERE filename = $1 OR id = $1 LIMIT 1',
        [filename]
      );

      if (res.rows.length > 0) {
        const { mime_type, data_base64 } = res.rows[0];
        const buffer = Buffer.from(data_base64, 'base64');

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mime_type || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (err) {
      console.error('Database file retrieval error:', err);
    }
  }

  return new NextResponse('File Not Found', { status: 404 });
}
