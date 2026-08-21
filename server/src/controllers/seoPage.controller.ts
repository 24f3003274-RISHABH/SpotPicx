import { Request, Response } from 'express';
import { SeoPageService } from '../services/seoPage.service';
import { SeoPage } from '../models/SeoPage';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class SeoPageController {
  public static getAll = asyncHandler(async (req: Request, res: Response) => {
    const pages = await SeoPageService.getAllPublished();
    return sendSuccess(res, pages, 'SEO pages retrieved successfully');
  });

  public static getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const page = await SeoPageService.getBySlug(slug);

    if (!page) {
      return sendError(res, 'Curated SEO guide not found', 404);
    }

    const host = req.get('host') || 'spotpicks.delhi';
    const protocol = req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;
    const jsonLd = SeoPageService.generateJsonLd(page, baseUrl);

    return sendSuccess(res, { page, jsonLd }, 'SEO page details retrieved successfully');
  });

  public static createOrUpdate = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.slug || !data.title) {
      return sendError(res, 'Slug and Title are required', 400);
    }

    const updated = await SeoPage.findOneAndUpdate(
      { slug: data.slug.toLowerCase().trim() },
      { ...data },
      { new: true, upsert: true }
    );

    return sendSuccess(res, updated, 'SEO page saved successfully');
  });
}
