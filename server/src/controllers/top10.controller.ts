import { Request, Response } from 'express';
import { Top10Service } from '../services/top10.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class Top10Controller {
  public static getTop10 = asyncHandler(async (req: Request, res: Response) => {
    const {
      category,
      location,
      intent,
      rankingMethod,
      priceRange,
      amenities,
      tags,
      minRating,
      limit,
      userLat,
      userLng,
    } = req.query;

    const result = await Top10Service.getTop10({
      category: category as string,
      location: location as string,
      intent: intent as string,
      rankingMethod: rankingMethod as any,
      priceRange: priceRange as any,
      amenities: amenities as any,
      tags: tags as any,
      minRating: minRating ? Number(minRating) : undefined,
      limit: limit ? Number(limit) : 10,
      userLat: userLat ? Number(userLat) : undefined,
      userLng: userLng ? Number(userLng) : undefined,
    });

    return sendSuccess(res, result, 'Top 10 ranked spots retrieved successfully');
  });
}
