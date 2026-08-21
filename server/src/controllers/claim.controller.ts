import { Request, Response } from 'express';
import { ClaimService } from '../services/claim.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';

export class ClaimController {
  /**
   * POST /api/v1/businesses/:id/claim
   */
  public static submitClaim = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { documents, message } = req.body;

    if (!userId) {
      return sendError(res, 'Authentication required to submit ownership claim', HTTP_STATUS.UNAUTHORIZED);
    }

    const claim = await ClaimService.submitClaim(id, userId, { documents, message });
    return sendSuccess(res, { claim }, 'Business claim submitted for review', HTTP_STATUS.CREATED);
  });

  /**
   * GET /api/v1/business-owner/claims
   */
  public static getMyClaims = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const claims = await ClaimService.getMyClaims(userId);
    return sendSuccess(res, { claims }, 'User claims retrieved');
  });

  /**
   * GET /api/v1/admin/claims
   */
  public static getAllClaims = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query;
    const claims = await ClaimService.getAllClaims(status as string);
    return sendSuccess(res, { claims, total: claims.length }, 'Claims list retrieved');
  });

  /**
   * PATCH /api/v1/admin/claims/:id/approve
   */
  public static approveClaim = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminUser = (req as any).user;
    const claim = await ClaimService.approveClaim(id, adminUser);
    return sendSuccess(res, { claim }, 'Claim approved and business ownership transferred');
  });

  /**
   * PATCH /api/v1/admin/claims/:id/reject
   */
  public static rejectClaim = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminUser = (req as any).user;
    const { reason } = req.body;
    const claim = await ClaimService.rejectClaim(id, adminUser, reason);
    return sendSuccess(res, { claim }, 'Claim rejected with note');
  });
}
