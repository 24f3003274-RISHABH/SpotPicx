import { createApp } from './app';
import { dbConnection } from './config/db';
import { ENV } from './config/env';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export const startStandaloneServer = async () => {
  const app = createApp();

  // Attempt database connection
  await dbConnection.connect();

  // 404 & Error handlers for standalone backend mode
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(ENV.PORT, '0.0.0.0', () => {
    console.log(`🚀 [SpotPicks Server] Running on http://0.0.0.0:${ENV.PORT}`);
    console.log(`📡 [Health Endpoint] http://0.0.0.0:${ENV.PORT}${ENV.API_PREFIX}/health`);
  });

  return server;
};

// If run directly
if (process.env.RUN_STANDALONE === 'true') {
  startStandaloneServer();
}
