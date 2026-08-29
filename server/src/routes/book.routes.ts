import { Router } from 'express';
import { BookController } from '../controllers/book.controller';

const router = Router();

// Specialized discovery and taxonomy endpoints FIRST
router.get('/discovery/hub', BookController.getDiscoveryHub);
router.get('/taxonomy/categories', BookController.getCategories);
router.get('/taxonomy/reading-paths', BookController.getReadingPaths);
router.get('/taxonomy/reading-paths/:slug', BookController.getReadingPathBySlug);
router.get('/taxonomy/collections', BookController.getEditorialCollections);
router.get('/taxonomy/collections/:slug', BookController.getEditorialCollectionBySlug);
router.post('/compare', BookController.compare);

// Core CRUD & List
router.get('/', BookController.getAll);
router.get('/:slug', BookController.getBySlug);
router.post('/', BookController.create);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.delete);

export default router;
