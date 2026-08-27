import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';

const router = Router();

// GET /api/v1/locations - query all locations with type, city, state, status
router.get('/', LocationController.getLocations);

// GET /api/v1/locations/india - India-wide geographic overview
router.get('/india', LocationController.getIndiaOverview);

// POST /api/v1/locations/waitlist - join expansion city waitlist
router.post('/waitlist', LocationController.joinWaitlist);

// PATCH or POST /api/v1/locations/:idOrSlug/status - update city/locality status
router.patch('/:idOrSlug/status', LocationController.updateStatus);
router.post('/:idOrSlug/status', LocationController.updateStatus);

// GET /api/v1/locations/india/:stateSlug
router.get('/india/:stateSlug', LocationController.getStateBySlug);

// GET /api/v1/locations/india/:stateSlug/:citySlug
router.get('/india/:stateSlug/:citySlug', LocationController.getCityBySlug);

// GET /api/v1/locations/:slug
router.get('/:slug', LocationController.getLocationBySlug);

// GET /api/v1/locations/:slug/businesses
router.get('/:slug/businesses', LocationController.getLocationBusinesses);

export default router;

