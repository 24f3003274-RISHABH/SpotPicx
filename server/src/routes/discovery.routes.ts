import { Router } from 'express';
import { DiscoveryController } from '../controllers/discovery.controller';

const router = Router();

// Specialized discovery endpoints
router.get('/students', DiscoveryController.getStudentDiscovery);
router.get('/housing', DiscoveryController.getHousingDiscovery);
router.get('/special', DiscoveryController.getSpecialDiscovery);

export default router;
