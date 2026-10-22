import fs from 'fs';
import path from 'path';
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
    return true;
  } catch (error) {
    console.error('Error saving ABH database to disk:', error);
    memoryCache = JSON.parse(JSON.stringify(db));
    return false;
  }
}

export function getDatabase(): Database {
  return loadDatabase();
}
