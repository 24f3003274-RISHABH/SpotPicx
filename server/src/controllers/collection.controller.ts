import { Request, Response } from 'express';
import { CollectionService } from '../services/collection.service';

export class CollectionController {
  // GET /api/v1/collections
  public static async getCollections(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, visibility, curatedOnly, ownerId } = req.query;

      const result = await CollectionService.getCollections({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        visibility: visibility as any,
        curatedOnly: curatedOnly === 'true',
        ownerId: ownerId ? String(ownerId) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.collections,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch collections',
      });
    }
  }

  // GET /api/v1/collections/me
  public static async getMyCollections(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const result = await CollectionService.getCollections({
        ownerId: user._id?.toString() || user.id,
      });

      res.status(200).json({
        success: true,
        data: result.collections,
        total: result.total,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch user collections',
      });
    }
  }

  // GET /api/v1/collections/:id
  public static async getCollectionById(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const collection = await CollectionService.getCollectionById(
        id,
        user?._id?.toString() || user?.id
      );

      res.status(200).json({
        success: true,
        data: collection,
      });
    } catch (error: any) {
      const status = error.message.includes('private') ? 403 : 404;
      res.status(status).json({
        success: false,
        message: error.message || 'Collection not found',
      });
    }
  }

  // POST /api/v1/collections
  public static async createCollection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { name, description, coverImage, visibility, items, category } = req.body;

      const created = await CollectionService.createCollection(
        user._id?.toString() || user.id,
        {
          name: user.name,
          avatar: user.avatar,
          username: user.username,
        },
        {
          name,
          description,
          coverImage,
          visibility,
          items,
          category,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        data: created,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create collection',
      });
    }
  }

  // POST /api/v1/collections/:id/items
  public static async toggleItem(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { businessId } = req.body;

      if (!businessId) {
        res.status(400).json({ success: false, message: 'businessId is required' });
        return;
      }

      const result = await CollectionService.toggleItemInCollection(
        id,
        businessId,
        user._id?.toString() || user.id
      );

      res.status(200).json({
        success: true,
        message: result.isPresent ? 'Spot added to collection' : 'Spot removed from collection',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update collection items',
      });
    }
  }

  // DELETE /api/v1/collections/:id
  public static async deleteCollection(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      await CollectionService.deleteCollection(
        id,
        user._id?.toString() || user.id,
        user.role
      );

      res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete collection',
      });
    }
  }
}
