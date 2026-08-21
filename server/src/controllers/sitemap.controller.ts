import { Request, Response } from 'express';
import { SitemapService } from '../services/sitemap.service';
import { asyncHandler } from '../utils/asyncHandler';

export class SitemapController {
  public static getSitemapXml = asyncHandler(async (req: Request, res: Response) => {
    const host = req.get('host') || 'spotpicks.delhi';
    const protocol = req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;

    const xml = await SitemapService.generateSitemapXml(baseUrl);
    res.setHeader('Content-Type', 'application/xml');
    return res.send(xml);
  });

  public static getRobotsTxt = asyncHandler(async (req: Request, res: Response) => {
    const host = req.get('host') || 'spotpicks.delhi';
    const protocol = req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;

    const txt = SitemapService.generateRobotsTxt(baseUrl);
    res.setHeader('Content-Type', 'text/plain');
    return res.send(txt);
  });
}
