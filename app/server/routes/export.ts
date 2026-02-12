import { Router } from 'express';
import { env } from '../config/env.js';
import { getPlayers, getTeams } from '../services/dataService.js';

export const exportRouter = Router();

function toCsv<T extends Record<string, unknown>>(rows: T[]) {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(env.EXPORT_DELIMITER);
  const body = rows
    .map((row) => keys.map((key) => JSON.stringify(row[key] ?? '')).join(env.EXPORT_DELIMITER))
    .join('\n');
  return `${header}\n${body}`;
}

function sortRows<T extends Record<string, unknown>>(rows: T[], sortKey: string, sortDir: string) {
  return rows.sort((a, b) => {
    const left = a[sortKey];
    const right = b[sortKey];
    const cmp = left === right ? 0 : left! > right! ? 1 : -1;
    return sortDir === 'asc' ? cmp : -cmp;
  });
}

exportRouter.get('/teams', async (req, res, next) => {
  try {
    const payload = await getTeams();
    const { division = 'both', stage = 'all', search = '', sortKey = 'points', sortDir = 'desc' } = req.query as Record<string, string>;
    const rows = sortRows(
      payload.data
        .filter((row) => division === 'both' || row.division === division)
        .filter((row) => stage === 'all' || row.stage === stage)
        .filter((row) => row.team.toLowerCase().includes(search.toLowerCase())),
      sortKey,
      sortDir
    );
    const filename = `teams-${Date.now()}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.type('text/csv').send(toCsv(rows as unknown as Record<string, unknown>[]));
  } catch (error) {
    next(error);
  }
});

exportRouter.get('/players', async (req, res, next) => {
  try {
    const payload = await getPlayers();
    const {
      division = 'both', position = 'all', team = 'all', minGp = '0', search = '', sortKey = 'points', sortDir = 'desc'
    } = req.query as Record<string, string>;
    const rows = sortRows(
      payload.data
        .filter((row) => division === 'both' || row.division === division)
        .filter((row) => position === 'all' || row.position === position)
        .filter((row) => team === 'all' || row.team === team)
        .filter((row) => row.gamesPlayed >= Number(minGp))
        .filter((row) => `${row.name} ${row.team}`.toLowerCase().includes(search.toLowerCase())),
      sortKey,
      sortDir
    );
    const filename = `players-${Date.now()}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.type('text/csv').send(toCsv(rows as unknown as Record<string, unknown>[]));
  } catch (error) {
    next(error);
  }
});
