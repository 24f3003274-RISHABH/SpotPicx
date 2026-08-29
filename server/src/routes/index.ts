import { Router } from 'express';
import { healthRoutes } from './health.routes';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import locationRoutes from './location.routes';
import businessRoutes from './business.routes';
import searchRoutes from './search.routes';
import seedRoutes from './seed.routes';
import reviewRoutes from './review.routes';
import favoriteRoutes from './favorite.routes';
import collectionRoutes from './collection.routes';
import reportRoutes from './report.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import businessOwnerRoutes from './businessOwner.routes';
import top10Routes from './top10.routes';
import seoPageRoutes from './seoPage.routes';
import articleRoutes from './article.routes';
import sitemapRoutes from './sitemap.routes';
import eventRoutes from './event.routes';
import jobRoutes from './job.routes';
import offerRoutes from './offer.routes';
import discoveryRoutes from './discovery.routes';
import monetizationRoutes from './monetization.routes';
import opportunityRoutes from './opportunity.routes';
import popularSearchRoutes from './popular-search.routes';

const router = Router();

// Mount modules
router.use('/', healthRoutes);
router.use('/', sitemapRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/businesses', businessRoutes);
router.use('/search', searchRoutes);
router.use('/popular-searches', popularSearchRoutes);
router.use('/seed', seedRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/collections', collectionRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);

// Events, Offers, Jobs, Opportunities & Specialized Discovery
router.use('/events', eventRoutes);
router.use('/jobs', jobRoutes);
router.use('/offers', offerRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/discovery', discoveryRoutes);

// SEO Engine & Content Platform
router.use('/top10', top10Routes);
router.use('/seo-pages', seoPageRoutes);
router.use('/articles', articleRoutes);

// Monetization, Ads & Leads (Phase 19)
router.use('/monetization', monetizationRoutes);

// Business Owner & Admin Portals
router.use('/admin', adminRoutes);
router.use('/business-owner', businessOwnerRoutes);

export const apiV1Routes = router;


