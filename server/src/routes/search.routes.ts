import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';

const router = Router();

// GET /api/v1/search
router.get('/', SearchController.search);

// GET /api/v1/search/suggestions
router.get('/suggestions', SearchController.getSuggestions);

// GET /api/v1/search/parse
router.get('/parse', SearchController.parseQuery);

// GET /api/v1/search/analytics
router.get('/analytics', SearchController.getAnalytics);

export default router;
