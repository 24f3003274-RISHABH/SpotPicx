import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

// GET /api/v1/categories
router.get('/', CategoryController.getCategories);

// GET /api/v1/categories/:slug
router.get('/:slug', CategoryController.getCategoryBySlug);

export default router;
