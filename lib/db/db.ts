import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { Database, ContactMessage } from '@/lib/types';
import { seedData } from '@/lib/db/seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'abh.db.json');

function ensureDirectoryExists(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch {}
}

let memoryCache: Database | null = null;
let lastSyncTime = 0;
const CACHE_TTL = 3000;

// ----- Neon PostgreSQL Connection Pool -----
const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_Gqvw5E1aHiWB@ep-frosty-rice-b5wogudu-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

let neonPool: Pool | null = null;

export function getNeonPool(): Pool | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || DEFAULT_DATABASE_URL;
  if (!url) return null;
  if (!neonPool) {
    try {
      neonPool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
      });
    } catch (e) {
      console.error('Failed to initialize Neon pool:', e);
    }
  }
  return neonPool;
}

// Background sync to Neon PostgreSQL
export async function persistToNeon(db: Database) {
  const pool = getNeonPool();
  if (!pool) return;

  try {
    // 1. Sync full master document for fast serverless hydration
    await pool.query(
      `INSERT INTO app_database_sync (key, data, updated_at)
       VALUES ('abh_master', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW();`,
      [JSON.stringify(db)]
    );

    // 2. Also keep clients table in sync
    if (Array.isArray(db.clients)) {
      for (const cl of db.clients) {
        await pool.query(
          `INSERT INTO clients (id, name, tax_id, contact_person, email, phone, country, address, notes, is_deleted, deleted_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO UPDATE SET
             name = $2, tax_id = $3, contact_person = $4, email = $5, phone = $6,
             country = $7, address = $8, notes = $9, is_deleted = $10, deleted_at = $11;`,
          [
            cl.id,
            cl.name,
            cl.tax_id || null,
            cl.contact_person || null,
            cl.email || null,
            cl.phone || null,
            cl.country,
            cl.address || null,
            cl.notes || null,
            cl.is_deleted || false,
            cl.deleted_at || null,
            cl.created_at || new Date(),
          ]
        );
      }
    }

    // 3. Keep orders table in sync
    if (Array.isArray(db.orders)) {
      for (const ord of db.orders) {
        await pool.query(
          `INSERT INTO orders (
             id, order_number, client_id, client_name, product_id, product_name, packaging,
             quantity, unit, unit_price, currency, total_amount, paid_amount, remaining_amount,
             payment_status, order_status, order_date, payments, delivery_installments,
             delivered_quantity, remaining_quantity, delivery_status, is_deleted, deleted_at, notes, created_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
           ON CONFLICT (id) DO UPDATE SET
             client_id = $3, client_name = $4, product_name = $6, packaging = $7,
             quantity = $8, unit = $9, unit_price = $10, currency = $11, total_amount = $12,
             paid_amount = $13, remaining_amount = $14, payment_status = $15, order_status = $16,
             order_date = $17, payments = $18, delivery_installments = $19, delivered_quantity = $20,
             remaining_quantity = $21, delivery_status = $22, is_deleted = $23, deleted_at = $24, notes = $25;`,
          [
            ord.id,
            ord.order_number,
            ord.client_id || '',
            ord.client_name,
            ord.product_id || '',
            ord.product_name,
            ord.packaging,
            ord.quantity,
            ord.unit || 'tonnes',
            ord.unit_price,
            ord.currency || 'EUR',
            ord.total_amount,
            ord.paid_amount || 0,
            ord.remaining_amount,
            ord.payment_status || 'unpaid',
            ord.order_status || 'confirmed',
            ord.order_date || new Date(),
            JSON.stringify(ord.payments || []),
            JSON.stringify(ord.delivery_installments || []),
            ord.delivered_quantity || 0,
            ord.remaining_quantity,
            ord.delivery_status || 'pending',
            ord.is_deleted || false,
            ord.deleted_at || null,
            ord.notes || null,
            ord.created_at || new Date(),
          ]
        );
      }
    }

    // 4. Keep contact_messages table in sync
    if (Array.isArray(db.messages)) {
      for (const msg of db.messages) {
        await pool.query(
          `INSERT INTO contact_messages (
             id, full_name, company_name, country, email, phone,
             product_interest, quantity, destination_country, message,
             privacy_consent, file_attachment, status, admin_notes, created_at, trashed_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO UPDATE SET
             full_name = $2, company_name = $3, country = $4, email = $5, phone = $6,
             product_interest = $7, quantity = $8, destination_country = $9, message = $10,
             privacy_consent = $11, file_attachment = $12, status = $13, admin_notes = $14, trashed_at = $16;`,
          [
            msg.id,
            msg.full_name,
            msg.company_name,
            msg.country,
            msg.email,
            msg.phone,
            msg.product_interest,
            msg.quantity,
            msg.destination_country,
            msg.message,
            msg.privacy_consent,
            msg.file_attachment || null,
            msg.status,
            msg.admin_notes || null,
            msg.created_at || new Date(),
            msg.trashed_at || null,
          ]
        );
      }
    }
  } catch (err) {
    console.error('[Neon PostgreSQL Background Sync Warning]:', err);
  }
}

// Synchronous load for build-time or static routes
export function loadDatabase(): Database {
  const now = Date.now();
  if (memoryCache && now - lastSyncTime < CACHE_TTL) {
    return memoryCache;
  }

  try {
    ensureDirectoryExists(DATA_DIR);
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as Database;
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.admins)) {
        memoryCache = parsed;
        lastSyncTime = now;
        return memoryCache;
      }
    }
  } catch (error) {
    console.error('Error reading ABH database from disk:', error);
  }

  // Fallback to seedData
  const initial = JSON.parse(JSON.stringify(seedData)) as Database;
  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial seed data:', err);
  }

  memoryCache = initial;
  lastSyncTime = now;
  return memoryCache;
}

// Real-time asynchronous load that hydrates from Neon PostgreSQL
export async function loadDatabaseAsync(): Promise<Database> {
  const now = Date.now();
  if (memoryCache && now - lastSyncTime < CACHE_TTL) {
    return memoryCache;
  }

  const pool = getNeonPool();
  if (pool) {
    try {
      const res = await pool.query(
        "SELECT data, updated_at FROM app_database_sync WHERE key = 'abh_master'"
      );
      if (res.rows.length > 0) {
        const raw = res.rows[0].data;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.admins)) {
          memoryCache = parsed as Database;
          lastSyncTime = now;
          return parsed as Database;
        }
      }
    } catch (err) {
      console.error('Failed to load database from Neon PostgreSQL, falling back to disk:', err);
    }
  }

  return loadDatabase();
}

// Synchronous save
export function saveDatabase(db: Database): boolean {
  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    memoryCache = JSON.parse(JSON.stringify(db));
    lastSyncTime = Date.now();

    // Trigger asynchronous persistence to Neon PostgreSQL
    persistToNeon(db).catch(() => {});

    return true;
  } catch (error) {
    console.error('Error saving ABH database to disk:', error);
    memoryCache = JSON.parse(JSON.stringify(db));
    persistToNeon(db).catch(() => {});
    return false;
  }
}

// Asynchronous save that awaits Neon PostgreSQL persistence
export async function saveDatabaseAsync(db: Database): Promise<boolean> {
  memoryCache = JSON.parse(JSON.stringify(db));
  lastSyncTime = Date.now();

  try {
    ensureDirectoryExists(DATA_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // Expected on Vercel where filesystem is read-only
  }

  const pool = getNeonPool();
  if (pool) {
    try {
      await persistToNeon(db);
      return true;
    } catch (err) {
      console.error('Neon persistence error in saveDatabaseAsync:', err);
    }
  }

  return true;
}

export function getDatabase(): Database {
  return loadDatabase();
}

// ============================================================
// Direct High-Performance Operations for RFQ / Contact Messages
// ============================================================

export interface ContactMessageCounts {
  all: number;
  unread: number;
  contacted: number;
  archived: number;
  trash: number;
}

export async function insertContactMessageDirect(newMessage: ContactMessage): Promise<void> {
  const pool = getNeonPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO contact_messages (
           id, full_name, company_name, country, email, phone,
           product_interest, quantity, destination_country, message,
           privacy_consent, file_attachment, status, admin_notes, created_at, trashed_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO UPDATE SET
           full_name = $2, company_name = $3, country = $4, email = $5, phone = $6,
           product_interest = $7, quantity = $8, destination_country = $9, message = $10,
           privacy_consent = $11, file_attachment = $12, status = $13, admin_notes = $14, trashed_at = $16;`,
        [
          newMessage.id,
          newMessage.full_name,
          newMessage.company_name,
          newMessage.country,
          newMessage.email,
          newMessage.phone,
          newMessage.product_interest,
          newMessage.quantity,
          newMessage.destination_country,
          newMessage.message,
          newMessage.privacy_consent,
          newMessage.file_attachment || null,
          newMessage.status || 'unread',
          newMessage.admin_notes || null,
          newMessage.created_at || new Date(),
          newMessage.trashed_at || null,
        ]
      );
    } catch (err) {
      console.error('Neon direct insertContactMessage error:', err);
    }
  }

  // Update in memory and sync master document
  try {
    const db = await loadDatabaseAsync();
    if (!Array.isArray(db.messages)) {
      db.messages = [];
    }
    const existingIdx = db.messages.findIndex((m) => m.id === newMessage.id);
    if (existingIdx >= 0) {
      db.messages[existingIdx] = newMessage;
    } else {
      db.messages.unshift(newMessage);
    }
    saveDatabase(db);
  } catch (err) {
    console.error('Error updating local db cache for message:', err);
  }
}

export async function getContactMessagesDirect(statusFilter?: string): Promise<{
  messages: ContactMessage[];
  counts: ContactMessageCounts;
}> {
  const pool = getNeonPool();
  if (pool) {
    try {
      // 1. Auto-purge trash older than 7 days
      await pool.query(
        "DELETE FROM contact_messages WHERE status = 'trash' AND trashed_at < NOW() - INTERVAL '7 days'"
      );

      // 2. Fetch counts
      const countsRes = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status != 'trash') as count_all,
          COUNT(*) FILTER (WHERE status = 'unread') as count_unread,
          COUNT(*) FILTER (WHERE status = 'contacted') as count_contacted,
          COUNT(*) FILTER (WHERE status = 'archived') as count_archived,
          COUNT(*) FILTER (WHERE status = 'trash') as count_trash
        FROM contact_messages
      `);

      const counts: ContactMessageCounts = {
        all: parseInt(countsRes.rows[0]?.count_all || '0', 10),
        unread: parseInt(countsRes.rows[0]?.count_unread || '0', 10),
        contacted: parseInt(countsRes.rows[0]?.count_contacted || '0', 10),
        archived: parseInt(countsRes.rows[0]?.count_archived || '0', 10),
        trash: parseInt(countsRes.rows[0]?.count_trash || '0', 10),
      };

      // 3. Fetch messages for the requested filter
      let query = '';
      let params: any[] = [];

      if (!statusFilter || statusFilter === 'all') {
        query = "SELECT * FROM contact_messages WHERE status != 'trash' ORDER BY created_at DESC";
      } else if (statusFilter === 'trash') {
        query = "SELECT * FROM contact_messages WHERE status = 'trash' ORDER BY trashed_at DESC NULLS LAST, created_at DESC";
      } else {
        query = 'SELECT * FROM contact_messages WHERE status = $1 ORDER BY created_at DESC';
        params = [statusFilter];
      }

      const res = await pool.query(query, params);
      const messages: ContactMessage[] = res.rows.map((row) => ({
        id: row.id,
        full_name: row.full_name,
        company_name: row.company_name,
        country: row.country,
        email: row.email,
        phone: row.phone || '',
        product_interest: row.product_interest,
        quantity: row.quantity || '',
        destination_country: row.destination_country || '',
        message: row.message,
        privacy_consent: !!row.privacy_consent,
        file_attachment: row.file_attachment || '',
        status: row.status,
        admin_notes: row.admin_notes || '',
        created_at: new Date(row.created_at).toISOString(),
        trashed_at: row.trashed_at ? new Date(row.trashed_at).toISOString() : undefined,
      }));

      return { messages, counts };
    } catch (err) {
      console.error('Neon direct getContactMessages error, falling back to JSON:', err);
    }
  }

  // Fallback to memory / disk db
  const db = await loadDatabaseAsync();
  const allMsgs = db.messages || [];

  const counts: ContactMessageCounts = {
    all: allMsgs.filter((m) => m.status !== 'trash').length,
    unread: allMsgs.filter((m) => m.status === 'unread').length,
    contacted: allMsgs.filter((m) => m.status === 'contacted').length,
    archived: allMsgs.filter((m) => m.status === 'archived').length,
    trash: allMsgs.filter((m) => m.status === 'trash').length,
  };

  let messages = allMsgs;
  if (!statusFilter || statusFilter === 'all') {
    messages = allMsgs.filter((m) => m.status !== 'trash');
  } else if (statusFilter === 'trash') {
    messages = allMsgs.filter((m) => m.status === 'trash');
  } else {
    messages = allMsgs.filter((m) => m.status === statusFilter);
  }

  return { messages, counts };
}

export async function updateContactMessageDirect(
  id: string,
  updates: { status?: string; admin_notes?: string }
): Promise<ContactMessage | null> {
  const pool = getNeonPool();
  if (pool) {
    try {
      if (updates.status !== undefined) {
        if (updates.status === 'trash') {
          await pool.query(
            "UPDATE contact_messages SET status = 'trash', trashed_at = NOW() WHERE id = $1",
            [id]
          );
        } else {
          await pool.query(
            'UPDATE contact_messages SET status = $1, trashed_at = NULL WHERE id = $2',
            [updates.status, id]
          );
        }
      }

      if (updates.admin_notes !== undefined) {
        await pool.query('UPDATE contact_messages SET admin_notes = $1 WHERE id = $2', [
          updates.admin_notes,
          id,
        ]);
      }
    } catch (err) {
      console.error('Neon direct updateContactMessage error:', err);
    }
  }

  // Sync memory cache & file
  const db = await loadDatabaseAsync();
  const msg = (db.messages || []).find((m) => m.id === id);
  if (msg) {
    if (updates.status !== undefined) {
      msg.status = updates.status as any;
      if (updates.status === 'trash') {
        msg.trashed_at = new Date().toISOString();
      } else {
        msg.trashed_at = undefined;
      }
    }
    if (updates.admin_notes !== undefined) {
      msg.admin_notes = updates.admin_notes;
    }
    saveDatabase(db);
    return msg;
  }
  return null;
}

export async function deleteContactMessageDirect(id: string, permanent: boolean): Promise<boolean> {
  const pool = getNeonPool();
  if (pool) {
    try {
      if (permanent) {
        await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]);
      } else {
        await pool.query(
          "UPDATE contact_messages SET status = 'trash', trashed_at = NOW() WHERE id = $1",
          [id]
        );
      }
    } catch (err) {
      console.error('Neon direct deleteContactMessage error:', err);
    }
  }

  const db = await loadDatabaseAsync();
  if (permanent) {
    db.messages = (db.messages || []).filter((m) => m.id !== id);
  } else {
    const msg = (db.messages || []).find((m) => m.id === id);
    if (msg) {
      msg.status = 'trash';
      msg.trashed_at = new Date().toISOString();
    }
  }
  saveDatabase(db);
  return true;
}
