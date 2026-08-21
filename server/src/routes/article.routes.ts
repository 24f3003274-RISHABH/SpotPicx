import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';

const router = Router();

router.get('/', ArticleController.getAll);
router.get('/:slug', ArticleController.getBySlug);
router.post('/', ArticleController.createOrUpdate);
router.put('/:slug', ArticleController.createOrUpdate);

export default router;
