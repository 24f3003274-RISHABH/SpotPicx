import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';

export class FavoriteController {
  // GET /api/v1/favorites
  public static async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const favorites = await FavoriteService.getUserFavorites(user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: favorites,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch favorites',
      });
    }
  }

  // POST /api/v1/favorites/:businessId
  public static async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { businessId } = req.params;

      const result = await FavoriteService.addFavorite(user._id?.toString() || user.id, businessId);

      res.status(200).json({
        success: true,
        message: 'Spot saved to favorites',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to save favorite',
      });
    }
  }

  // DELETE /api/v1/favorites/:businessId
  public static async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { businessId } = req.params;

      const result = await FavoriteService.removeFavorite(user._id?.toString() || user.id, businessId);

      res.status(200).json({
        success: true,
        message: 'Spot removed from favorites',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove favorite',
      });
    }
  }
}
