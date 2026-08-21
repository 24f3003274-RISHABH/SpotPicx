import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';

export class ReviewController {
  // POST /api/v1/reviews
  public static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { businessId, rating, title, comment, images, visitDate } = req.body;

      if (!businessId) {
        res.status(400).json({ success: false, message: 'businessId is required' });
        return;
      }

      const review = await ReviewService.createReview(
        user._id?.toString() || user.id,
        {
          name: user.name,
          avatar: user.avatar,
          username: user.username,
          role: user.role,
        },
        {
          businessId,
          rating: Number(rating),
          title,
          comment,
          images,
          visitDate,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Review published successfully',
        data: review,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit review',
      });
    }
  }

  // GET /api/v1/reviews/business/:businessId
  public static async getBusinessReviews(req: Request, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;
      const { page, limit, sort } = req.query;

      const result = await ReviewService.getBusinessReviews(businessId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sort: sort as any,
      });

      res.status(200).json({
        success: true,
        data: result.reviews,
        stats: result.stats,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch reviews',
      });
    }
  }

  // GET /api/v1/reviews/me
  public static async getMyReviews(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const reviews = await ReviewService.getUserReviews(user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch user reviews',
      });
    }
  }

  // PUT /api/v1/reviews/:id
  public static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { rating, title, comment, images, visitDate } = req.body;

      const updated = await ReviewService.updateReview(
        id,
        user._id?.toString() || user.id,
        user.role,
        {
          rating: rating ? Number(rating) : undefined,
          title,
          comment,
          images,
          visitDate,
        }
      );

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update review',
      });
    }
  }

  // DELETE /api/v1/reviews/:id
  public static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      await ReviewService.deleteReview(id, user._id?.toString() || user.id, user.role);

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete review',
      });
    }
  }

  // POST /api/v1/reviews/:id/like
  public static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const result = await ReviewService.toggleLikeReview(id, user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to like review',
      });
    }
  }

  // POST /api/v1/reviews/:id/response
  public static async respondToReview(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { comment, respondedBy } = req.body;

      const updated = await ReviewService.respondToReview(
        id,
        user._id?.toString() || user.id,
        user.role,
        comment,
        respondedBy || user.name
      );

      res.status(200).json({
        success: true,
        message: 'Response posted successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to post review response',
      });
    }
  }
}
