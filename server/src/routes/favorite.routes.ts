import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected: Get favorites
router.get('/', authenticate, FavoriteController.getFavorites);

// Protected: Add favorite
router.post('/:businessId', authenticate, FavoriteController.addFavorite);

// Protected: Remove favorite
router.delete('/:businessId', authenticate, FavoriteController.removeFavorite);

export default router;
