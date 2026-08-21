import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export class AnalyticsController {
  /**
   * GET /api/v1/business-owner/analytics
   */
  public static getOwnerAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { businessId } = req.query;
    const data = await AnalyticsService.getOwnerAnalytics(userId, businessId as string);
    return sendSuccess(res, data, 'Business owner analytics loaded');
  });

  /**
   * POST /api/v1/businesses/:id/track
   */
  public static trackAction = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body;
    const result = await AnalyticsService.trackAction(id, action || 'view');
    return sendSuccess(res, result, 'Action tracked');
  });
}
