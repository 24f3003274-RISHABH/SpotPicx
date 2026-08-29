import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunity.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public routes
router.get('/', OpportunityController.getAll);
router.get('/this-week', OpportunityController.getThisWeek);
router.get('/:slugOrId', OpportunityController.getBySlugOrId);

// Admin-protected routes
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OpportunityController.create
);

router.put(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OpportunityController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OpportunityController.delete
);

router.post(
  '/cleanup-expired',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OpportunityController.cleanupExpired
);

export default router;
