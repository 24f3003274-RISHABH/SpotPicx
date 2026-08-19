import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/statusCodes';
import { sendError } from '../utils/response';

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND
  );
};
