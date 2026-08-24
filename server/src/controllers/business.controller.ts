import { Request, Response } from 'express';
import { BusinessService } from '../services/business.service';
import { GeminiService } from '../services/gemini.service';
import { createBusinessSchema, updateBusinessSchema } from '../validators/business.validator';

export class BusinessController {
  /**
   * POST /api/v1/businesses/:id/ask-place or /api/v1/businesses/:slug/ask-place
   * Answers place-specific questions ("Ask about this place") with verified context & Gemini
   */
  public static async askAboutPlace(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { question } = req.body;

      if (!question || typeof question !== 'string' || !question.trim()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'QUESTION_REQUIRED',
            message: 'A valid question string is required',
          },
        });
        return;
      }

      const business = await BusinessService.getBusinessBySlug(id);
      if (!business) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: `Venue '${id}' not found`,
          },
        });
        return;
      }

      const result = await GeminiService.askAboutPlace(business, question.trim());

      res.status(200).json({
        success: true,
        message: 'Successfully generated answer for venue',
        data: result,
      });
    } catch (error: any) {
      console.error('Ask about place error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'ASK_PLACE_ERROR',
          message: error.message || 'Failed to process question about place',
        },
      });
    }
  }

  /**
   * POST /api/v1/businesses/:id/generate-summary or /api/v1/businesses/:slug/generate-summary
   * Generates or refreshes concise AI summary ("Why visit?", "Best for", "What to expect")
   */
  public static async generateSummary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const business = await BusinessService.getBusinessBySlug(id);

      if (!business) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: `Venue '${id}' not found`,
          },
        });
        return;
      }

      const summary = await GeminiService.generatePlaceSummary(business);

      res.status(200).json({
        success: true,
        message: 'Generated verified place summary',
        data: summary,
      });
    } catch (error: any) {
      console.error('Generate summary error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GENERATE_SUMMARY_ERROR',
          message: error.message || 'Failed to generate place summary',
        },
      });
    }
  }

  public static async getBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, category, locality, city, priceRange, verified, rating, tags, q, sort } =
        req.query;

      const result = await BusinessService.getBusinesses({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        category: category ? String(category) : undefined,
        locality: locality ? String(locality) : undefined,
        city: city ? String(city) : undefined,
        priceRange: priceRange ? String(priceRange) : undefined,
        verified: verified !== undefined ? String(verified) : undefined,
        rating: rating ? Number(rating) : undefined,
        tags: tags ? (Array.isArray(tags) ? (tags as string[]) : String(tags).split(',')) : undefined,
        q: q ? String(q) : undefined,
        sort: sort as any,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_BUSINESSES_ERROR',
          message: error.message || 'Failed to fetch businesses',
        },
      });
    }
  }

  public static async getBusinessBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const business = await BusinessService.getBusinessBySlug(slug);

      if (!business) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: `Business '${slug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: business,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_BUSINESS_ERROR',
          message: error.message || 'Failed to fetch business',
        },
      });
    }
  }

  public static async createBusiness(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createBusinessSchema.parse(req.body);
      const user = (req as any).user;

      const newBusiness = await BusinessService.createBusiness(validatedData, user?._id || user?.id);

      res.status(201).json({
        success: true,
        message: 'Business created successfully',
        data: newBusiness,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_BUSINESS_ERROR',
          message: error.message || 'Failed to create business',
        },
      });
    }
  }

  public static async updateBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateBusinessSchema.parse(req.body);
      const user = (req as any).user;

      const updated = await BusinessService.updateBusiness(id, validatedData, user);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: 'Business not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Business updated successfully',
        data: updated,
      });
    } catch (error: any) {
      const isAuthError = error.message && error.message.includes('UNAUTHORIZED');
      res.status(isAuthError ? 403 : 400).json({
        success: false,
        error: {
          code: isAuthError ? 'FORBIDDEN' : 'UPDATE_BUSINESS_ERROR',
          message: error.message || 'Failed to update business',
        },
      });
    }
  }

  public static async deleteBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const deleted = await BusinessService.deleteBusiness(id, user);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BUSINESS_NOT_FOUND',
            message: 'Business not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Business deleted successfully',
      });
    } catch (error: any) {
      const isAuthError = error.message && error.message.includes('UNAUTHORIZED');
      res.status(isAuthError ? 403 : 400).json({
        success: false,
        error: {
          code: isAuthError ? 'FORBIDDEN' : 'DELETE_BUSINESS_ERROR',
          message: error.message || 'Failed to delete business',
        },
      });
    }
  }
}
