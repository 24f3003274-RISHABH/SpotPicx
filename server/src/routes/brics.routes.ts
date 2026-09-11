import { Router } from 'express';
import { BricsController } from '../controllers/brics.controller';

const router = Router();

// Public Knowledge Hub routes
router.get('/', BricsController.getHub);
router.get('/members', BricsController.getMembers);
router.get('/members/:slug', BricsController.getMemberBySlug);
router.get('/summits', BricsController.getSummits);
router.get('/presidencies', BricsController.getPresidencies);
router.get('/facts', BricsController.getFacts);
router.get('/institutions', BricsController.getInstitutions);
router.get('/faqs', BricsController.getFaqs);
router.get('/sources', BricsController.getSources);

// Admin & Governance routes
router.get('/admin/stats', BricsController.getAdminStats);
router.post('/admin/facts', BricsController.upsertFact);
router.post('/admin/faqs', BricsController.upsertFaq);
router.post('/seed', BricsController.seedCollections);

export default router;
