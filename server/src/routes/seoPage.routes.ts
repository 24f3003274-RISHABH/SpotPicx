import { Router } from 'express';
import { SeoPageController } from '../controllers/seoPage.controller';

const router = Router();

router.get('/', SeoPageController.getAll);
router.get('/:slug', SeoPageController.getBySlug);
router.post('/', SeoPageController.createOrUpdate);
router.put('/:slug', SeoPageController.createOrUpdate);

export default router;
