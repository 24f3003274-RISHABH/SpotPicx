import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/statusCodes';
import { sendError } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown[];
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : undefined,
    err.errors
  );
};
