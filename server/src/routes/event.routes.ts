import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public routes
router.get('/', EventController.getEvents);
router.get('/:slug', EventController.getEventBySlug);

// Admin-protected routes
router.post('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), EventController.createEvent);
router.delete('/:id', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), EventController.deleteEvent);

export default router;
