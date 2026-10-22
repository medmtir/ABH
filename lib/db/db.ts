import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { Database } from '@/lib/types';
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
let neonPool: Pool | null = null;

function getNeonPool(): Pool | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
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
async function persistToNeon(db: Database) {
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
  } catch (err) {
    console.error('[Neon PostgreSQL Background Sync Warning]:', err);
  }
}

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

export function getDatabase(): Database {
  return loadDatabase();
}
