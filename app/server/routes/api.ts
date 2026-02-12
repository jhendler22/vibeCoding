import { Router } from 'express';
import { getGames, getPlayers, getTeams } from '../services/dataService.js';

export const apiRouter = Router();

apiRouter.get('/teams', async (_req, res, next) => {
  try {
    res.json(await getTeams());
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/players', async (_req, res, next) => {
  try {
    res.json(await getPlayers());
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/games', async (_req, res, next) => {
  try {
    res.json(await getGames());
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/games/:id', async (req, res, next) => {
  try {
    const payload = await getGames();
    const game = payload.data.find((row) => row.id === req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json({ ...payload, data: game });
  } catch (error) {
    next(error);
  }
});
