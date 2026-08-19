import { Router } from 'express';
import { healthRoutes } from './health.routes';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import locationRoutes from './location.routes';
import businessRoutes from './business.routes';
import searchRoutes from './search.routes';
import seedRoutes from './seed.routes';

const router = Router();

// Mount modules
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/businesses', businessRoutes);
router.use('/search', searchRoutes);
router.use('/seed', seedRoutes);

export const apiV1Routes = router;
