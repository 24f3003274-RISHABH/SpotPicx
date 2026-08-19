import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/src/app';
import { dbConnection } from './server/src/config/db';
import { ENV } from './server/src/config/env';
import { errorHandler } from './server/src/middleware/errorHandler';

async function startServer() {
  // Initialize Express with security, CORS, Morgan, and /api/v1 routes
  const app = createApp();
  const PORT = ENV.PORT || 3000;

  // Initialize MongoDB connection asynchronously (does not block web app if credentials pending)
  dbConnection.connect().catch((err) => {
    console.warn('MongoDB initialization check:', err.message);
  });

  // Attach Vite middleware in development or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ [SpotPicks] Full-stack application ready at http://0.0.0.0:${PORT}`);
    console.log(`🔌 [API Health] http://0.0.0.0:${PORT}/api/v1/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SpotPicks server:', err);
  process.exit(1);
});
