import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected: Get notifications
router.get('/', authenticate, NotificationController.getNotifications);

// Protected: Mark notification as read
router.patch('/:id/read', authenticate, NotificationController.markAsRead);

// Protected: Mark all notifications as read
router.post('/read-all', authenticate, NotificationController.markAllAsRead);

export default router;
