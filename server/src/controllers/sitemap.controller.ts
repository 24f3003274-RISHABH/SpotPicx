import { Request, Response } from 'express';
import { SitemapService } from '../services/sitemap.service';
import { asyncHandler } from '../utils/asyncHandler';

export class SitemapController {
  public static getSitemapXml = asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = process.env.SITE_URL || 'https://spotpicx.me';

    const xml = await SitemapService.generateSitemapXml(baseUrl);
    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  });

  public static getRobotsTxt = asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = process.env.SITE_URL || 'https://spotpicx.me';

    const txt = SitemapService.generateRobotsTxt(baseUrl);
    res.setHeader('Content-Type', 'text/plain');
    return res.send(txt);
  });
}
