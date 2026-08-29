import { Request, Response } from 'express';
import { OpportunityService } from '../services/opportunity.service';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class OpportunityController {
  public static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      type,
      opportunityType,
      status,
      search,
      featured,
      isFeatured,
      thisWeek,
      isThisWeek,
      locationType,
      sort,
      page,
      limit,
    } = req.query;

    const result = await OpportunityService.getAllOpportunities({
      opportunityType: (type || opportunityType) as string,
      status: status as string,
      search: search as string,
      isFeatured: (featured || isFeatured) as string,
      isThisWeek: (thisWeek || isThisWeek) as string,
      locationType: locationType as string,
      sort: sort as any,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });

    return sendSuccess(res, result, 'Opportunities retrieved successfully');
  });

  public static getThisWeek = asyncHandler(async (req: Request, res: Response) => {
    const result = await OpportunityService.getAllOpportunities({
      isThisWeek: true,
      limit: 10,
      sort: 'recommended',
    });

    return sendSuccess(res, result.opportunities, "This week's opportunities retrieved successfully");
  });

  public static getBySlugOrId = asyncHandler(async (req: Request, res: Response) => {
    const { slugOrId } = req.params;
    const opportunity = await OpportunityService.getOpportunityBySlugOrId(slugOrId);

    if (!opportunity) {
      return sendError(res, 'Opportunity not found', 404);
    }

    const jsonLd = OpportunityService.generateJsonLd(opportunity);

    return sendSuccess(
      res,
      { opportunity, jsonLd },
      'Opportunity details retrieved successfully'
    );
  });

  public static create = asyncHandler(async (req: Request, res: Response) => {
    try {
      const opportunity = await OpportunityService.createOpportunity(req.body);
      return sendSuccess(res, opportunity, 'Opportunity created successfully', 201);
    } catch (e: any) {
      return sendError(res, e.message || 'Failed to create opportunity', 400);
    }
  });

  public static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const opportunity = await OpportunityService.updateOpportunity(id, req.body);
      return sendSuccess(res, opportunity, 'Opportunity updated successfully');
    } catch (e: any) {
      return sendError(res, e.message || 'Failed to update opportunity', 400);
    }
  });

  public static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await OpportunityService.deleteOpportunity(id);
    if (!deleted) {
      return sendError(res, 'Opportunity not found', 404);
    }
    return sendSuccess(res, { id }, 'Opportunity deleted successfully');
  });

  public static cleanupExpired = asyncHandler(async (_req: Request, res: Response) => {
    const count = await OpportunityService.cleanupExpiredOpportunities();
    return sendSuccess(res, { deletedCount: count }, `Cleaned up ${count} expired opportunities`);
  });
}
