import { env } from '../config/env.js';
import { readCache, writeCache } from '../cache/fileCache.js';
import { fetchGames, fetchPlayers, fetchTeams } from '../providers/mockProvider.js';
import type { ApiEnvelope, Game, PlayerStat, TeamStanding } from '../models/types.js';

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= env.MAX_RETRIES) throw error;
      attempt += 1;
      await sleep(env.RETRY_BACKOFF_SECONDS * 1000 * attempt);
    }
  }
}

async function getWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<ApiEnvelope<T>> {
  try {
    const data = await withRetry(fetcher);
    const cached = await writeCache<T>(key, data);
    return { data: cached.data, stale: false, cachedAt: cached.cachedAt, provider: env.DATA_PROVIDER };
  } catch (error) {
    const cached = await readCache<T>(key);
    if (cached) {
      return {
        data: cached.data,
        stale: true,
        cachedAt: cached.cachedAt,
        provider: env.DATA_PROVIDER,
        error: error instanceof Error ? error.message : 'provider_failed'
      };
    }
    throw error;
  }
}

export const getTeams = () => getWithCache<TeamStanding[]>('teams', fetchTeams);
export const getPlayers = () => getWithCache<PlayerStat[]>('players', fetchPlayers);
export const getGames = () => getWithCache<Game[]>('games', fetchGames);
