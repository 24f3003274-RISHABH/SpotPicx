import { Request, Response } from 'express';
import { OfferService } from '../services/offer.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';

export class OfferController {
  /**
   * GET /api/v1/offers (Public All Offers)
   */
  public static getPublicOffers = asyncHandler(async (req: Request, res: Response) => {
    const { category, locality, query, tag } = req.query;
    const offers = await OfferService.getPublicOffers({
      category: category as string,
      locality: locality as string,
      query: query as string,
      tag: tag as string,
    });
    return sendSuccess(res, { offers, total: offers.length }, 'Public active offers retrieved');
  });

  /**
   * GET /api/v1/offers/business/:id
   */
  public static getOffersByBusiness = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offers = await OfferService.getOffersByBusiness(id);
    return sendSuccess(res, { offers }, 'Business offers retrieved');
  });

  /**
   * GET /api/v1/business-owner/offers
   */
  public static getOwnerOffers = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const offers = await OfferService.getOwnerOffers(userId);
    return sendSuccess(res, { offers }, 'Owner offers retrieved');
  });

  /**
   * POST /api/v1/business-owner/offers
   */
  public static createOffer = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { businessId, title, description, discount, couponCode, validFrom, validUntil, terms, category, tags } = req.body;

    if (!businessId || !title || !discount) {
      return sendError(res, 'Business ID, title and discount are required', HTTP_STATUS.BAD_REQUEST);
    }

    const offer = await OfferService.createOffer(userId, {
      businessId,
      title,
      description,
      discount,
      couponCode,
      validFrom,
      validUntil,
      terms,
      category,
      tags,
    });

    return sendSuccess(res, { offer }, 'Offer created successfully', HTTP_STATUS.CREATED);
  });

  /**
   * PATCH /api/v1/business-owner/offers/:id/toggle
   */
  public static toggleOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const offer = await OfferService.toggleOffer(id);
    return sendSuccess(res, { offer }, 'Offer status updated');
  });

  /**
   * DELETE /api/v1/business-owner/offers/:id
   */
  public static deleteOffer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await OfferService.deleteOffer(id);
    return sendSuccess(res, null, 'Offer removed');
  });

  /**
   * GET /api/v1/admin/offers
   */
  public static getAllAdminOffers = asyncHandler(async (_req: Request, res: Response) => {
    const offers = await OfferService.getAllOffers();
    return sendSuccess(res, { offers, total: offers.length }, 'All platform offers retrieved');
  });
}
