import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AnalyticsController } from '../controllers/analytics.controller';
import { ClaimController } from '../controllers/claim.controller';
import { OfferController } from '../controllers/offer.controller';
import { ReportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// CRITICAL SECURITY REQUIREMENT:
// Every admin API must strictly verify authenticate() and authorize("ADMIN", "SUPER_ADMIN")
router.use(authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN));

// Overview & Analytics Intelligence Platform
router.get('/stats', AdminController.getStats);
router.get('/analytics', AnalyticsController.getAdminAnalytics);
router.get('/analytics/export', AnalyticsController.exportAdminAnalytics);

// Business Management
router.get('/businesses', AdminController.getBusinesses);
router.patch('/businesses/:id/status', AdminController.updateBusinessStatus);
router.patch('/businesses/:id/verify', AdminController.toggleBusinessVerified);
router.delete('/businesses/:id', AdminController.deleteBusiness);

// Claim Verification Queue
router.get('/claims', ClaimController.getAllClaims);
router.patch('/claims/:id/approve', ClaimController.approveClaim);
router.patch('/claims/:id/reject', ClaimController.rejectClaim);

// Review Moderation
router.get('/reviews', AdminController.getReviews);
router.patch('/reviews/:id/status', AdminController.updateReviewStatus);
router.delete('/reviews/:id', AdminController.deleteReview);

// Reports Queue
router.get('/reports', ReportController.getReports);
router.patch('/reports/:id/status', ReportController.updateReportStatus);

// City Events Management
router.get('/events', AdminController.getEvents);
router.post('/events', AdminController.createEvent);
router.delete('/events/:id', AdminController.deleteEvent);

// Platform Offers
router.get('/offers', OfferController.getAllAdminOffers);
router.delete('/offers/:id', OfferController.deleteOffer);

// Articles & Guides Management
router.get('/articles', AdminController.getArticles);
router.post('/articles', AdminController.createArticle);
router.delete('/articles/:id', AdminController.deleteArticle);

// SEO Landing Pages
router.get('/seo-pages', AdminController.getSeoPages);
router.post('/seo-pages', AdminController.createSeoPage);
router.delete('/seo-pages/:id', AdminController.deleteSeoPage);

// Data Ingestion & Sources Platform (Phase 15)
router.get('/sources', AdminController.getDataSources);
router.get('/sources/stats', AdminController.getDataSourcesStats);
router.post('/sources', AdminController.createDataSource);
router.post('/sources/run-all', AdminController.runAllSourcesIngestion);
router.post('/sources/:id/run', AdminController.runSourceIngestion);
router.put('/sources/:id', AdminController.updateDataSource);
router.delete('/sources/:id', AdminController.deleteDataSource);
router.post('/freshness/recalculate', AdminController.recalculateFreshness);

export default router;
