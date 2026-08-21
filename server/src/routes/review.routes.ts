import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public: Get reviews for business
router.get('/business/:businessId', ReviewController.getBusinessReviews);

// Protected: Get logged-in user reviews
router.get('/me', authenticate, ReviewController.getMyReviews);

// Protected: Create review
router.post('/', authenticate, ReviewController.createReview);

// Protected: Update review (author or admin)
router.put('/:id', authenticate, ReviewController.updateReview);

// Protected: Delete review (author or admin)
router.delete('/:id', authenticate, ReviewController.deleteReview);

// Protected: Like / Unlike review
router.post('/:id/like', authenticate, ReviewController.toggleLike);

// Protected: Respond to review (Business owner / Admin)
router.post('/:id/response', authenticate, ReviewController.respondToReview);

export default router;
