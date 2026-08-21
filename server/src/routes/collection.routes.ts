import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public: Get collections
router.get('/', CollectionController.getCollections);

// Protected: Get user's own collections
router.get('/me', authenticate, CollectionController.getMyCollections);

// Public / Protected: Get collection by ID or Slug
router.get('/:id', CollectionController.getCollectionById);

// Protected: Create collection
router.post('/', authenticate, CollectionController.createCollection);

// Protected: Add / Remove item from collection
router.post('/:id/items', authenticate, CollectionController.toggleItem);

// Protected: Delete collection
router.delete('/:id', authenticate, CollectionController.deleteCollection);

export default router;
