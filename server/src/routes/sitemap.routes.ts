import { Router } from 'express';
import { SitemapController } from '../controllers/sitemap.controller';

const router = Router();

router.get('/sitemap.xml', SitemapController.getSitemapXml);
router.get('/robots.txt', SitemapController.getRobotsTxt);

export default router;
