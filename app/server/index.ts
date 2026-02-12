import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { env } from './config/env.js';
import { apiRouter } from './routes/api.js';
import { exportRouter } from './routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api', apiRouter);
  app.use('/api/export', exportRouter);

  if (env.APP_ENV === 'development') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa', root: path.resolve(__dirname, '..') });
    app.use(vite.middlewares);
  } else {
    const clientDist = path.resolve(__dirname, '../client');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unhandled error';
    res.status(500).json({ message });
  });

  return app;
}

createApp().then((app) => {
  app.listen(env.PORT, () => {
    console.log(`Olympic Hockey Stats Tracker running on http://localhost:${env.PORT}`);
  });
});
