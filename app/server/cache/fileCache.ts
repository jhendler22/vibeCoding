import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

interface CacheRecord<T> {
  data: T;
  cachedAt: string;
}

const cacheDir = path.resolve(process.cwd(), env.CACHE_DIR);

async function ensureDir() {
  await mkdir(cacheDir, { recursive: true });
}

export async function writeCache<T>(key: string, data: T): Promise<CacheRecord<T>> {
  await ensureDir();
  const record = { data, cachedAt: new Date().toISOString() };
  await writeFile(path.join(cacheDir, `${key}.json`), JSON.stringify(record, null, 2), 'utf8');
  return record;
}

export async function readCache<T>(key: string): Promise<CacheRecord<T> | null> {
  try {
    const raw = await readFile(path.join(cacheDir, `${key}.json`), 'utf8');
    return JSON.parse(raw) as CacheRecord<T>;
  } catch {
    return null;
  }
}
