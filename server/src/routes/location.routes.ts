import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';

const router = Router();

// GET /api/v1/locations
router.get('/', LocationController.getLocations);

// GET /api/v1/locations/:slug
router.get('/:slug', LocationController.getLocationBySlug);

// GET /api/v1/locations/:slug/businesses
router.get('/:slug/businesses', LocationController.getLocationBusinesses);

export default router;
