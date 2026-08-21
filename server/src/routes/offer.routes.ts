import { Router } from 'express';
import { OfferController } from '../controllers/offer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public routes
router.get('/', OfferController.getPublicOffers);
router.get('/business/:id', OfferController.getOffersByBusiness);

// Business Owner & Admin routes
router.get('/my-offers', authenticate, OfferController.getOwnerOffers);
router.post('/', authenticate, authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), OfferController.createOffer);
router.patch('/:id/toggle', authenticate, authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), OfferController.toggleOffer);
router.delete('/:id', authenticate, authorize(USER_ROLES.BUSINESS_OWNER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), OfferController.deleteOffer);

export default router;
