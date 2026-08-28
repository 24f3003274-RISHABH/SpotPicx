import { createApp } from './app';
import { dbConnection } from './config/db';
import { ENV } from './config/env';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export const startStandaloneServer = async () => {
  const app = createApp();

  // Attempt database connection
  const isConnected = await dbConnection.connect();
  if (isConnected) {
    try {
      const { SeedService } = await import('./services/seed.service');
      const { AuthService } = await import('./services/auth.service');
      await SeedService.seedDatabase();
      await AuthService.seedMongoUsers();
    } catch (e: any) {
      console.warn('Standalone server seed notice:', e.message);
    }
  }

  // 404 & Error handlers for standalone backend mode
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(ENV.PORT, '0.0.0.0', () => {
    console.log(`🚀 [SpotPicks Server] Running on http://0.0.0.0:${ENV.PORT}`);
    console.log(`📡 [Health Endpoint] http://0.0.0.0:${ENV.PORT}${ENV.API_PREFIX}/health`);
  });

  app.get("/api/v1/debug/database", async (_req, res) => {
    try {
      const mongoose = await import("mongoose");

      res.json({
        success: true,
        readyState: mongoose.default.connection.readyState,
        host: mongoose.default.connection.host,
        database: mongoose.default.connection.name,
        port: mongoose.default.connection.port,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return server;
};

// If run directly
if (process.env.RUN_STANDALONE === 'true') {
  startStandaloneServer();
}
