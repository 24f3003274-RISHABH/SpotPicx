import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';
import { USER_ROLES, UserRole } from '../constants/roles';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  public static register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const result = await AuthService.register(validatedData);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      'User registered successfully',
      HTTP_STATUS.CREATED
    );
  });

  /**
   * POST /api/v1/auth/login
   */
  public static login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      'Login successful'
    );
  });

  /**
   * POST /api/v1/auth/refresh
   */
  public static refresh = asyncHandler(async (req: Request, res: Response) => {
    // Read from HTTP-only cookie or request body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return sendError(
        res,
        'Refresh token is missing from cookies or request body',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await AuthService.refreshToken(token);

    // Update cookie with fresh refresh token
    res.cookie('refreshToken', result.tokens.refreshToken, COOKIE_OPTIONS);

    return sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      'Access token refreshed successfully'
    );
  });

  /**
   * POST /api/v1/auth/logout
   */
  public static logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear the HTTP-only cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return sendSuccess(res, null, 'Logged out successfully');
  });

  /**
   * GET /api/v1/auth/me
   */
  public static getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    return sendSuccess(
      res,
      { user: req.user },
      'User profile retrieved successfully'
    );
  });

  /**
   * GET /api/v1/auth/users (Admin only)
   */
  public static getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await AuthService.getAllUsers();
    return sendSuccess(
      res,
      {
        users,
        total: users.length,
      },
      'Users list retrieved successfully'
    );
  });

  /**
   * PATCH /api/v1/auth/users/:id/role (Super Admin / Admin only)
   */
  public static updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(USER_ROLES).includes(role as UserRole)) {
      return sendError(res, `Invalid role. Allowed values: ${Object.values(USER_ROLES).join(', ')}`, HTTP_STATUS.BAD_REQUEST);
    }

    const updatedUser = await AuthService.updateUserRole(id, role as UserRole);
    return sendSuccess(res, { user: updatedUser }, `User role updated to ${role}`);
  });
}
