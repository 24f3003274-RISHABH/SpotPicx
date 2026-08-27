import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../constants/roles';

/**
 * Authentication Middleware: Verifies the JWT Access Token from Authorization Header
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid Bearer access token in Authorization header.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Malformed authorization token.',
      });
      return;
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.name === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token',
      });
      return;
    }

    const user = await AuthService.getUserById(payload.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account has been deactivated.',
      });
      return;
    }

    // Attach sanitized user to request
    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication internal server error',
    });
  }
};

/**
 * Optional Authentication: Attaches req.user if a valid token exists, but does not block unauthenticated users
 */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const payload = verifyAccessToken(token);
          const user = await AuthService.getUserById(payload.id);
          if (user && user.isActive) {
            req.user = user;
          }
        } catch {
          // Ignore token verification errors for optional auth
        }
      }
    }
    next();
  } catch {
    next();
  }
};

/**
 * Authorization Middleware: Checks if user's role satisfies the required roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required before role verification.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your current role is '${req.user.role}'.`,
      });
      return;
    }

    next();
  };
};
