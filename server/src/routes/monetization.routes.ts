import { Router } from 'express';
import { MonetizationController } from '../controllers/monetization.controller';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public: View plans & active promotions
router.get('/plans', MonetizationController.getPlans);
router.get('/subscription/:businessId', MonetizationController.getSubscription);

// Public: Serve non-intrusive ads & sponsored placements
router.get('/ads/placement/:placement', MonetizationController.getAdsForPlacement);
router.post('/ads/:adId/impression', MonetizationController.trackAdImpression);
router.post('/ads/:adId/click', MonetizationController.trackAdClick);

// Public / Visitor: Track lead actions & send customer inquiries
router.post('/leads/track', optionalAuthenticate, MonetizationController.trackLeadAction);
router.post('/leads/enquiry', optionalAuthenticate, MonetizationController.submitEnquiry);

// Business Owner routes (Authentication required)
router.post('/checkout', authenticate, MonetizationController.initiateCheckout);
router.post('/verify', authenticate, MonetizationController.verifyPayment);
router.post('/cancel', authenticate, MonetizationController.cancelSubscription);
router.get(
  '/leads/:businessId',
  authenticate,
  authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.getBusinessLeads
);
router.patch(
  '/leads/:leadId/status',
  authenticate,
  authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.updateLeadStatus
);

// Admin Command Center Routes (Admin/Super Admin only)
router.get(
  '/admin/analytics',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.getAdminMonetizationAnalytics
);
router.get(
  '/admin/ads',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.getAdminAds
);
router.post(
  '/admin/ads',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.createAdminAd
);
router.put(
  '/admin/ads/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.updateAdminAd
);
router.delete(
  '/admin/ads/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.deleteAdminAd
);
router.get(
  '/admin/subscriptions',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  MonetizationController.getAdminSubscriptions
);

export default router;
