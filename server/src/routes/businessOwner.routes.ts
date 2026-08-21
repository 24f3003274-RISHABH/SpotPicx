import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';
import { ClaimController } from '../controllers/claim.controller';
import { OfferController } from '../controllers/offer.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { ReviewController } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Business Owner routes require authentication and appropriate role
router.use(
  authenticate,
  authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.EDITOR)
);

// Dashboard Overview / Analytics
router.get('/dashboard', AnalyticsController.getOwnerAnalytics);
router.get('/analytics', AnalyticsController.getOwnerAnalytics);

// Manage Owned Listings
router.get('/businesses', async (req, res, next) => {
  // Return listings belonging to this owner
  const userId = (req as any).user?._id || (req as any).user?.id;
  const result = await BusinessController.getBusinesses(
    { ...req, query: { ...req.query, owner: userId } } as any,
    res
  );
});
router.post('/businesses', BusinessController.createBusiness);
router.put('/businesses/:id', BusinessController.updateBusiness);
router.delete('/businesses/:id', BusinessController.deleteBusiness);

// Reviews & Direct Response
router.get('/reviews', ReviewController.getBusinessReviews);
router.post('/reviews/:id/reply', ReviewController.respondToReview);

// Promotional Offers
router.get('/offers', OfferController.getOwnerOffers);
router.post('/offers', OfferController.createOffer);
router.patch('/offers/:id/toggle', OfferController.toggleOffer);
router.delete('/offers/:id', OfferController.deleteOffer);

// Claims status
router.get('/claims', ClaimController.getMyClaims);

export default router;
