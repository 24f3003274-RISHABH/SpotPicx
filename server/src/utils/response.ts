import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/statusCodes';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: string;
  errors?: unknown[];
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK,
  meta?: Record<string, unknown>
): Response => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };
  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  error?: string,
  errors?: unknown[]
): Response => {
  const responseBody: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(responseBody);
};
