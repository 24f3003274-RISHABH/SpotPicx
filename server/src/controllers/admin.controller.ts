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
   * Events Management
   */
  public static getEvents = asyncHandler(async (_req: Request, res: Response) => {
    const events = await AdminService.getEvents();
    return sendSuccess(res, { events, total: events.length }, 'Events retrieved');
  });

  public static createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await AdminService.createEvent(req.body);
    return sendSuccess(res, { event }, 'Event created', HTTP_STATUS.CREATED);
  });

  public static deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdminService.deleteEvent(id);
    return sendSuccess(res, null, 'Event deleted');
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
}
