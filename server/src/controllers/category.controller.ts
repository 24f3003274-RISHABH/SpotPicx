import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  public static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const { type, parent } = req.query;
      const categories = await CategoryService.getAllCategories({
        type: type ? String(type) : undefined,
        parent: parent ? String(parent) : undefined,
      });

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CATEGORIES_ERROR',
          message: error.message || 'Failed to fetch categories',
        },
      });
    }
  }

  public static async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);

      if (!category) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CATEGORY_NOT_FOUND',
            message: `Category '${slug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CATEGORY_ERROR',
          message: error.message || 'Failed to fetch category',
        },
      });
    }
  }
}
