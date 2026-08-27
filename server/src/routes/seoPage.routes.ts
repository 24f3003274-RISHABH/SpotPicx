import { Router } from 'express';
import { SeoPageController } from '../controllers/seoPage.controller';

const router = Router();

// Core SEO pages retrieval & management
router.get('/', SeoPageController.getAll);
router.post('/ai-draft', SeoPageController.generateAiDraft);

// Organic SEO Analytics & Conversion Tracking
router.post('/analytics/track-landing', SeoPageController.trackLandingPageHit);
router.post('/analytics/track-conversion', SeoPageController.trackConversion);
router.get('/analytics/overview', SeoPageController.getSeoAnalyticsOverview);

router.get('/:slug', SeoPageController.getBySlug);
router.post('/', SeoPageController.createOrUpdate);
router.put('/:slug', SeoPageController.createOrUpdate);

export default router;

