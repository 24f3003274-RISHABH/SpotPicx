import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/statusCodes';
import { sendError } from '../utils/response';
import { LoggerService } from '../services/logger.service';

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown[];
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Log all server errors to server-side telemetry
  LoggerService.error('REQUEST', err.message || 'Internal Server Error', {
    path: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode || 500,
    details: { stack: err.stack, name: err.name },
  });

  // Handle Zod validation errors
  if (err instanceof ZodError || err.name === 'ZodError') {
    const formattedErrors = err.errors ? err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    })) : [];
    
    return sendError(
      res,
      'Validation failed: Please check your input fields.',
      HTTP_STATUS.BAD_REQUEST,
      undefined,
      formattedErrors
    );
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(
      res,
      `Invalid resource identifier for field '${err.path}'`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    return sendError(
      res,
      messages.join(', ') || 'Database validation error',
      HTTP_STATUS.BAD_REQUEST,
      undefined,
      messages
    );
  }

  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(
      res,
      err.name === 'TokenExpiredError' ? 'Token expired. Please sign in again.' : 'Invalid authentication token.',
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : undefined,
    err.errors
  );
};

