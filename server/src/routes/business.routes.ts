import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// GET /api/v1/businesses
router.get('/', BusinessController.getBusinesses);

// GET /api/v1/businesses/:slug
router.get('/:slug', BusinessController.getBusinessBySlug);

// POST /api/v1/businesses - Authorized roles only
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BusinessController.createBusiness
);

// PUT /api/v1/businesses/:id - Authenticated owner or editor/admin
router.put('/:id', authenticate, BusinessController.updateBusiness);

// DELETE /api/v1/businesses/:id - Authenticated owner or admin
router.delete('/:id', authenticate, BusinessController.deleteBusiness);

export default router;
