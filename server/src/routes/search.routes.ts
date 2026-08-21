import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';

const router = Router();

// GET /api/v1/search - Main parameter & full-text search
router.get('/', SearchController.search);

// POST /api/v1/search/ai - Natural language conversational AI search with structured parsing
router.post('/ai', SearchController.searchWithAI);

// GET /api/v1/search/suggestions - Debounced auto-complete suggestions
router.get('/suggestions', SearchController.getSuggestions);

// GET /api/v1/search/parse - Deterministic query inspection endpoint
router.get('/parse', SearchController.parseQuery);

// POST /api/v1/search/track-click - Track click-throughs on search results
router.post('/track-click', SearchController.trackSearchClick);

// GET /api/v1/search/trending - Trending searches, categories & businesses
router.get('/trending', SearchController.getTrending);

// POST /api/v1/search/personalization - Dynamic tailored recommendations
router.post('/personalization', SearchController.getPersonalized);

// GET /api/v1/search/analytics/admin - Full analytics intelligence for Admin dashboard
router.get('/analytics/admin', SearchController.getAdminAnalytics);

export default router;
