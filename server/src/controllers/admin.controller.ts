import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { BusinessService } from '../services/business.service';
import { ReviewService } from '../services/review.service';
import { ReportService } from '../services/report.service';
import { CategoryService } from '../services/category.service';
import { LocationService } from '../services/location.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';

export class AdminController {
  /**
   * GET /api/v1/admin/stats
   */
  public static getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await AdminService.getDashboardStats();
    return sendSuccess(res, stats, 'Admin dashboard statistics loaded');
  });

  /**
   * GET /api/v1/admin/businesses
   */
  public static getBusinesses = asyncHandler(async (req: Request, res: Response) => {
    const { status, search, verified, page, limit } = req.query;
    const result = await AdminService.getAdminBusinesses({
      status: status as string,
      search: search as string,
      verified: verified as string,
      page: Number(page) || 1,
      limit: Number(limit) || 25,
    });
    return sendSuccess(res, result, 'Admin businesses list loaded');
  });

  /**
   * PATCH /api/v1/admin/businesses/:id/status
   */
  public static updateBusinessStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return sendError(res, 'Status is required (ACTIVE, PENDING, REJECTED, ARCHIVED)', HTTP_STATUS.BAD_REQUEST);
    }
    const business = await AdminService.updateBusinessStatus(id, status);
    return sendSuccess(res, { business }, `Business status updated to ${status}`);
  });

  /**
   * PATCH /api/v1/admin/businesses/:id/verify
   */
  public static toggleBusinessVerified = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const business = await AdminService.toggleBusinessVerified(id);
    return sendSuccess(res, { business }, 'Business verification status updated');
  });

  /**
   * DELETE /api/v1/admin/businesses/:id
   */
  public static deleteBusiness = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;
    await BusinessService.deleteBusiness(id, user);
    return sendSuccess(res, null, 'Business permanently deleted');
  });

  /**
   * GET /api/v1/admin/reviews
   */
  public static getReviews = asyncHandler(async (req: Request, res: Response) => {
    const { status, page, limit } = req.query;
    const reviews = await ReviewService.getAllReviewsAdmin(status as string);
    return sendSuccess(res, { reviews, total: reviews.length }, 'Admin reviews loaded');
  });

  /**
   * PATCH /api/v1/admin/reviews/:id/status
   */
  public static updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const review = await ReviewService.updateReviewStatus(id, status);
    return sendSuccess(res, { review }, `Review status updated to ${status}`);
  });

  /**
   * DELETE /api/v1/admin/reviews/:id
   */
  public static deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user;
    await ReviewService.deleteReview(id, user.id || user._id, user.role || 'ADMIN');
    return sendSuccess(res, null, 'Review deleted');
  });

  /**
   * Events Management (Admin)
   */
  public static getEvents = asyncHandler(async (_req: Request, res: Response) => {
    const events = await AdminService.getEvents();
    return sendSuccess(res, { events, total: events.length }, 'Events retrieved');
  });

  public static createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await AdminService.createEvent(req.body);
    return sendSuccess(res, { event }, 'Event created', HTTP_STATUS.CREATED);
  });

  public static updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await AdminService.updateEvent(id, req.body);
    return sendSuccess(res, { event }, 'Event updated');
  });

  public static approveEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await AdminService.approveEvent(id);
    return sendSuccess(res, { event }, 'Event approved and published');
  });

  public static toggleFeatureEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await AdminService.toggleFeatureEvent(id);
    return sendSuccess(res, { event }, 'Event feature status toggled');
  });

  public static expireEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await AdminService.expireEvent(id);
    return sendSuccess(res, { event }, 'Event marked as expired');
  });

  public static deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteEvent(id);
    return sendSuccess(res, null, 'Event deleted');
  });

  /**
   * Offers Management (Admin)
   */
  public static getOffers = asyncHandler(async (_req: Request, res: Response) => {
    const offers = await AdminService.getOffers();
    return sendSuccess(res, { offers, total: offers.length }, 'Offers retrieved');
  });

  public static createOffer = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const offer = await AdminService.createOffer(user?.id || user?._id || 'admin', req.body);
    return sendSuccess(res, { offer }, 'Offer created', HTTP_STATUS.CREATED);
  });

  public static updateOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await AdminService.updateOffer(id, req.body);
    return sendSuccess(res, { offer }, 'Offer updated');
  });

  public static approveOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await AdminService.approveOffer(id);
    return sendSuccess(res, { offer }, 'Offer approved and published');
  });

  public static toggleFeatureOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await AdminService.toggleFeatureOffer(id);
    return sendSuccess(res, { offer }, 'Offer featured status toggled');
  });

  public static expireOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await AdminService.expireOffer(id);
    return sendSuccess(res, { offer }, 'Offer marked as expired');
  });

  public static deleteOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteOffer(id);
    return sendSuccess(res, null, 'Offer deleted');
  });

  /**
   * Articles Management
   */
  public static getArticles = asyncHandler(async (_req: Request, res: Response) => {
    const articles = await AdminService.getArticles();
    return sendSuccess(res, { articles, total: articles.length }, 'Articles retrieved');
  });

  public static createArticle = asyncHandler(async (req: Request, res: Response) => {
    const article = await AdminService.createArticle(req.body);
    return sendSuccess(res, { article }, 'Article created', HTTP_STATUS.CREATED);
  });

  public static deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteArticle(id);
    return sendSuccess(res, null, 'Article deleted');
  });

  /**
   * SEO Pages Management
   */
  public static getSeoPages = asyncHandler(async (_req: Request, res: Response) => {
    const seoPages = await AdminService.getSeoPages();
    return sendSuccess(res, { seoPages, total: seoPages.length }, 'SEO Pages retrieved');
  });

  public static createSeoPage = asyncHandler(async (req: Request, res: Response) => {
    const page = await AdminService.createSeoPage(req.body);
    return sendSuccess(res, { page }, 'SEO landing page created', HTTP_STATUS.CREATED);
  });

  public static deleteSeoPage = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteSeoPage(id);
    return sendSuccess(res, null, 'SEO page deleted');
  });

  /**
   * Data Ingestion & Sources Management (Phase 15)
   */
  public static getDataSources = asyncHandler(async (_req: Request, res: Response) => {
    const { DataIngestionService } = await import('../services/ingestion.service');
    const sources = await DataIngestionService.getAllSources();
    return sendSuccess(res, { sources, total: sources.length }, 'Data sources retrieved');
  });

  public static getDataSourcesStats = asyncHandler(async (_req: Request, res: Response) => {
    const { DataIngestionService } = await import('../services/ingestion.service');
    const { FreshnessService } = await import('../services/freshness.service');
    const sources = await DataIngestionService.getAllSources();
    const freshness = await FreshnessService.getFreshnessStats();

    const totalProcessed = sources.reduce((acc, s) => acc + (s.itemsProcessed || 0), 0);
    const totalUpdated = sources.reduce((acc, s) => acc + (s.itemsUpdated || 0), 0);
    const totalErrors = sources.reduce((acc, s) => acc + (s.errorCount || 0), 0);
    const activeSources = sources.filter((s) => s.status === 'ACTIVE').length;

    return sendSuccess(
      res,
      {
        totalSources: sources.length,
        activeSources,
        totalProcessed,
        totalUpdated,
        totalErrors,
        freshnessBreakdown: freshness,
      },
      'Data source and freshness stats retrieved'
    );
  });

  public static runSourceIngestion = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { DataIngestionService } = await import('../services/ingestion.service');
    const result = await DataIngestionService.runSourceIngestion(id);
    return sendSuccess(res, { result }, `Ingestion completed for ${result.sourceName}`);
  });

  public static runAllSourcesIngestion = asyncHandler(async (_req: Request, res: Response) => {
    const { DataIngestionService } = await import('../services/ingestion.service');
    const results = await DataIngestionService.runAllActiveSources();
    return sendSuccess(res, { results }, `Executed ingestion for ${results.length} active sources`);
  });

  public static createDataSource = asyncHandler(async (req: Request, res: Response) => {
    const { DataSource } = await import('../models/DataSource');
    const slug = (req.body.name || 'source')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created = await DataSource.create({
      ...req.body,
      slug,
      status: req.body.status || 'ACTIVE',
      scheduleIntervalMinutes: req.body.scheduleIntervalMinutes || 360,
      rateLimit: {
        requestDelayMs: req.body.rateLimit?.requestDelayMs || 500,
        maxRequestsPerRun: req.body.rateLimit?.maxRequestsPerRun || 25,
        retryLimit: req.body.rateLimit?.retryLimit || 3,
        backoffFactor: req.body.rateLimit?.backoffFactor || 2,
      },
      metadata: req.body.metadata || {
        attribution: req.body.attribution || 'Public Permitted Feed',
        robotsTxtCompliant: true,
      },
    });

    return sendSuccess(res, { source: created }, 'Data source registered successfully', HTTP_STATUS.CREATED);
  });

  public static updateDataSource = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { DataSource } = await import('../models/DataSource');
    const updated = await DataSource.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return sendError(res, 'Data source not found', HTTP_STATUS.NOT_FOUND);
    }
    return sendSuccess(res, { source: updated }, 'Data source updated');
  });

  public static deleteDataSource = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { DataSource } = await import('../models/DataSource');
    await DataSource.findByIdAndDelete(id);
    return sendSuccess(res, null, 'Data source deleted');
  });

  public static recalculateFreshness = asyncHandler(async (_req: Request, res: Response) => {
    const { FreshnessService } = await import('../services/freshness.service');
    const result = await FreshnessService.recalculateAllFreshness();
    return sendSuccess(res, result, `Recalculated freshness for ${result.updatedCount} listings`);
  });
}
