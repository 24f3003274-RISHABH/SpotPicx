import { Request, Response } from 'express';
import { DiscoveryService } from '../services/discovery.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export class DiscoveryController {
  /**
   * GET /api/v1/discovery/students
   */
  public static getStudentDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const {
      category,
      college,
      studentFriendlyOnly,
      budgetOnly,
      nearMetroOnly,
      query,
    } = req.query;

    const result = await DiscoveryService.getStudentDiscovery({
      category: category as string,
      college: college as string,
      studentFriendlyOnly: studentFriendlyOnly === 'true',
      budgetOnly: budgetOnly === 'true',
      nearMetroOnly: nearMetroOnly === 'true',
      query: query as string,
    });

    return sendSuccess(res, result, 'Student discovery results retrieved');
  });

  /**
   * GET /api/v1/discovery/housing
   */
  public static getHousingDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const {
      housingType,
      gender,
      acOnly,
      foodIncluded,
      furnishedOnly,
      nearMetro,
      collegeHub,
      query,
    } = req.query;

    const result = await DiscoveryService.getHousingDiscovery({
      housingType: housingType as any,
      gender: gender as any,
      acOnly: acOnly === 'true',
      foodIncluded: foodIncluded === 'true',
      furnishedOnly: furnishedOnly === 'true',
      nearMetro: nearMetro === 'true',
      collegeHub: collegeHub as string,
      query: query as string,
    });

    return sendSuccess(res, result, 'Housing discovery results retrieved');
  });

  /**
   * GET /api/v1/discovery/special
   */
  public static getSpecialDiscovery = asyncHandler(async (req: Request, res: Response) => {
    const { intent = 'couples', locality, query } = req.query;

    const result = await DiscoveryService.getSpecialDiscovery({
      intent: intent as any,
      locality: locality as string,
      query: query as string,
    });

    return sendSuccess(res, result, 'Special intent discovery results retrieved');
  });
}
