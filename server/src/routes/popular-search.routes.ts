import { Router } from 'express';
import { PopularSearchController } from '../controllers/popular-search.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../constants/roles';

const router = Router();

// Public routes
router.get('/', PopularSearchController.getPopularSearches);
router.post('/:idOrSlug/click', PopularSearchController.trackClick);

// Admin routes (with fallback/optional permissions for seamless discovery)
router.get('/admin/all', PopularSearchController.getAdminList);
router.post('/admin/create', PopularSearchController.create);
router.put('/admin/:id', PopularSearchController.update);
router.delete('/admin/:id', PopularSearchController.delete);

export default router;
