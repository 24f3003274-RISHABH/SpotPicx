import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap: Map<string, RateLimitRecord> = new Map();

/**
 * Clean up expired rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 60000);

/**
 * Sliding window in-memory rate limiter for authentication routes
 * @param windowMs Time window in milliseconds (default: 60s)
 * @param maxLimit Maximum requests per window (default: 30)
 */
export const authRateLimiter = (windowMs: number = 60000, maxLimit: number = 30) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();

    const record = ipRequestMap.get(ip);

    if (!record || now > record.resetTime) {
      ipRequestMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxLimit);
      res.setHeader('X-RateLimit-Remaining', maxLimit - 1);
      return next();
    }

    if (record.count >= maxLimit) {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please slow down and try again shortly.',
      });
      return;
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxLimit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxLimit - record.count));
    next();
  };
};
