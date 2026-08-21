import { Router } from 'express';
import { Top10Controller } from '../controllers/top10.controller';

const router = Router();

router.get('/', Top10Controller.getTop10);

export default router;
