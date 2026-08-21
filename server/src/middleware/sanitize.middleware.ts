import { Request, Response, NextFunction } from 'express';

/**
 * Recursive sanitizer that removes MongoDB query injection operators ($gt, $where, $regex, etc.)
 * from request body, params, and query strings.
 */
function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Prevent simple script tags in input strings
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const cleanObj: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    // Strip leading dollar signs ($) or dots (.) which are MongoDB query operator / path injection keys
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObj[key] = sanitizeObject(obj[key]);
  }
  return cleanObj;
}

/**
 * Express middleware to sanitize incoming request bodies, queries, and params
 */
export const sanitizeMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
};
