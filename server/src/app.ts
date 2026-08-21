import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { sanitizeMiddleware } from './middleware/sanitize.middleware';
import { apiV1Routes } from './routes/index';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { ENV } from './config/env';

export const createApp = () => {
  const app = express();

  // Security headers with content security policy configured for development and preview
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Cross-Origin Resource Sharing with credentials for HTTP-only cookies
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN === '*' ? true : ENV.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Request logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Cookie parser for secure HTTP-only refresh tokens
  app.use(cookieParser());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Sanitize inputs to prevent MongoDB injection and XSS
  app.use(sanitizeMiddleware);

  // API v1 Routes
  app.use(ENV.API_PREFIX, apiV1Routes);

  // Fallback 404 for unhandled API requests
  app.use(`${ENV.API_PREFIX}/*`, notFoundHandler);

  // Global API error handler
  app.use(errorHandler);

  return app;
};
