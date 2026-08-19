import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimiter';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public auth routes with rate limiting
router.post('/register', authRateLimiter(60000, 20), AuthController.register);
router.post('/login', authRateLimiter(60000, 20), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected routes (Requires valid JWT Access Token)
router.get('/me', authenticate, AuthController.getMe);

// Admin-only user management routes
router.get('/users', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), AuthController.getAllUsers);
router.patch('/users/:id/role', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), AuthController.updateUserRole);

export default router;
