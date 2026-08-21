import { Business } from '../models/Business';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { SeoPageService } from './seoPage.service';
import { ArticleService } from './article.service';
import { mockBusinesses, mockCategories, mockLocations } from './seed.data';

export class SitemapService {
  /**
   * Generates a fully dynamic, standards-compliant sitemap.xml
   */
  public static async generateSitemapXml(baseUrl = 'https://spotpicks.delhi'): Promise<string> {
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];
    const now = new Date().toISOString().split('T')[0];

    // 1. Core High-Priority Pages
    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/explore', priority: '0.9', changefreq: 'daily' },
      { path: '/articles', priority: '0.9', changefreq: 'daily' },
      { path: '/categories', priority: '0.8', changefreq: 'weekly' },
      { path: '/locations', priority: '0.8', changefreq: 'weekly' },
      { path: '/collections', priority: '0.7', changefreq: 'weekly' },
      { path: '/delhi', priority: '0.9', changefreq: 'daily' },
    ];

    for (const r of staticRoutes) {
      urls.push({
        loc: `${baseUrl}${r.path}`,
        lastmod: now,
        changefreq: r.changefreq,
        priority: r.priority,
      });
    }

    // 2. SEO Landing Pages (Top 10 Guides) - Highest SEO Priority
    try {
      const seoPages = await SeoPageService.getAllPublished();
      for (const sp of seoPages) {
        urls.push({
          loc: `${baseUrl}/${sp.slug}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.95',
        });
      }
    } catch (e) {
      console.warn('Error adding SEO pages to sitemap:', e);
    }

    // 3. Articles & Editorial Guides
    try {
      const articles = await ArticleService.getAllArticles();
      for (const art of articles) {
        urls.push({
          loc: `${baseUrl}/articles/${art.slug}`,
          lastmod: art.publishedAt ? new Date(art.publishedAt).toISOString().split('T')[0] : now,
          changefreq: 'monthly',
          priority: '0.85',
        });
      }
    } catch (e) {
      console.warn('Error adding articles to sitemap:', e);
    }

    // 4. Categories & Category Hubs
    try {
      let categories: any[] = [];
      try {
        categories = await Category.find({ isActive: true }).lean();
      } catch (err) {}
      if (!categories || categories.length === 0) {
        categories = mockCategories;
      }

      for (const cat of categories) {
        if (cat.slug) {
          urls.push({
            loc: `${baseUrl}/category/${cat.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.80',
          });
          urls.push({
            loc: `${baseUrl}/delhi/${cat.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.80',
          });
        }
      }
    } catch (e) {
      console.warn('Error adding categories to sitemap:', e);
    }

    // 5. Locations & Neighborhood Hubs
    try {
      let locations: any[] = [];
      try {
        locations = await Location.find({ isActive: true }).lean();
      } catch (err) {}
      if (!locations || locations.length === 0) {
        locations = mockLocations;
      }

      for (const loc of locations) {
        if (loc.slug) {
          urls.push({
            loc: `${baseUrl}/location/${loc.slug}`,
            lastmod: now,
            changefreq: 'weekly',
            priority: '0.80',
          });
        }
      }
    } catch (e) {
      console.warn('Error adding locations to sitemap:', e);
    }

    // 6. Verified Businesses & Spots
    try {
      let businesses: any[] = [];
      try {
        businesses = await Business.find({ status: 'ACTIVE' }).select('slug _id updatedAt').lean();
      } catch (err) {}
      if (!businesses || businesses.length === 0) {
        businesses = mockBusinesses;
      }

      for (const biz of businesses) {
        const slugOrId = biz.slug || biz._id;
        urls.push({
          loc: `${baseUrl}/business/${slugOrId}`,
          lastmod: biz.updatedAt ? new Date(biz.updatedAt).toISOString().split('T')[0] : now,
          changefreq: 'weekly',
          priority: '0.75',
        });
      }
    } catch (e) {
      console.warn('Error adding businesses to sitemap:', e);
    }

    // Generate XML structure
    const xmlEntries = urls
      .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;
  }

  /**
   * Generates a compliant robots.txt
   */
  public static generateRobotsTxt(baseUrl = 'https://spotpicks.delhi'): string {
    return `# Robots.txt for SpotPicks Delhi
User-agent: *
Allow: /
Allow: /explore
Allow: /articles
Allow: /category/
Allow: /location/
Allow: /delhi/
Allow: /business/
Allow: /best-*

Disallow: /admin/
Disallow: /business/dashboard
Disallow: /business/reviews
Disallow: /business/analytics
Disallow: /business/offers
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /saved

# XML Sitemap Directive
Sitemap: ${baseUrl}/sitemap.xml
`;
  }
}
