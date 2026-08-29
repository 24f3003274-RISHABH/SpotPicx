import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller';

const router = Router();

router.get('/', AuthorController.getAll);
router.get('/:slug', AuthorController.getBySlug);
router.post('/', AuthorController.create);
router.put('/:id', AuthorController.update);
router.delete('/:id', AuthorController.delete);

export default router;
