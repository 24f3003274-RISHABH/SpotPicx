import mongoose from 'mongoose';
import { Business } from '../models/Business';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { SeoPageService } from './seoPage.service';
import { ArticleService } from './article.service';
import { BookService } from './book.service';
import { AuthorService } from './author.service';
import { mockBusinesses, mockCategories, mockLocations } from './seed.data';

export class SitemapService {
  /**
   * Normalizes any base URL to the canonical production domain
   */
  public static resolveBaseUrl(baseUrl?: string): string {
    const defaultSiteUrl = process.env.SITE_URL || 'https://spotpicx.me';
    if (!baseUrl || baseUrl.includes('spotpicks.in') || baseUrl.includes('spotpicks.delhi') || baseUrl.includes('spotpicx.com')) {
      return defaultSiteUrl.replace(/\/$/, '');
    }
    return baseUrl.replace(/\/$/, '');
  }

  /**
   * Generates a fully dynamic, standards-compliant sitemap.xml strictly using canonical https://spotpicx.me
   */
  public static async generateSitemapXml(inputBaseUrl = 'https://spotpicx.me'): Promise<string> {
    const baseUrl = this.resolveBaseUrl(inputBaseUrl);
    const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];
    const addedLocs = new Set<string>();
    const now = new Date().toISOString().split('T')[0];

    const addUrl = (path: string, priority: string, changefreq: string, lastmod = now) => {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      const loc = `${baseUrl}${cleanPath}`;
      if (!addedLocs.has(loc)) {
        addedLocs.add(loc);
        urls.push({ loc, lastmod, changefreq, priority });
      }
    };

    // 1. Core High-Priority Pages
    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/explore', priority: '0.9', changefreq: 'daily' },
      { path: '/categories', priority: '0.8', changefreq: 'weekly' },
      { path: '/locations', priority: '0.8', changefreq: 'weekly' },
      { path: '/collections', priority: '0.7', changefreq: 'weekly' },
      { path: '/delhi', priority: '0.9', changefreq: 'daily' },
      { path: '/delhi/heritage', priority: '0.85', changefreq: 'weekly' },
      { path: '/delhi/weekend-getaways', priority: '0.85', changefreq: 'weekly' },
      { path: '/india', priority: '0.9', changefreq: 'daily' },
      { path: '/india/spiritual', priority: '0.85', changefreq: 'weekly' },
      { path: '/guides', priority: '0.9', changefreq: 'daily' },
      { path: '/articles', priority: '0.9', changefreq: 'daily' },
      { path: '/books', priority: '0.9', changefreq: 'daily' },
      { path: '/books/categories', priority: '0.8', changefreq: 'weekly' },
      { path: '/books/collections', priority: '0.8', changefreq: 'weekly' },
      { path: '/books/paths', priority: '0.8', changefreq: 'weekly' },
      { path: '/books/authors', priority: '0.8', changefreq: 'weekly' },
      { path: '/events', priority: '0.8', changefreq: 'daily' },
      { path: '/offers', priority: '0.8', changefreq: 'daily' },
      { path: '/students', priority: '0.8', changefreq: 'weekly' },
      { path: '/housing', priority: '0.8', changefreq: 'daily' },
      { path: '/jobs', priority: '0.7', changefreq: 'daily' },
      { path: '/pricing', priority: '0.6', changefreq: 'monthly' },
      // BRICS 2026 India Knowledge Hub
      { path: '/brics', priority: '0.95', changefreq: 'daily' },
      { path: '/brics/2026', priority: '0.90', changefreq: 'weekly' },
      { path: '/articles/brics-summit-2026-india', priority: '0.95', changefreq: 'weekly' },
      { path: '/brics/countries/india', priority: '0.85', changefreq: 'monthly' },
      { path: '/brics/countries/brazil', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/russia', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/china', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/south-africa', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/egypt', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/ethiopia', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/iran', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/saudi-arabia', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/united-arab-emirates', priority: '0.80', changefreq: 'monthly' },
      { path: '/brics/countries/indonesia', priority: '0.85', changefreq: 'monthly' },
    ];

    for (const r of staticRoutes) {
      addUrl(r.path, r.priority, r.changefreq);
    }

    // 2. SEO Landing Pages (Top 10 Guides) - Highest SEO Priority
    try {
      const seoPages = await SeoPageService.getAllPublished();
      for (const sp of seoPages) {
        if (sp.slug) {
          addUrl(`/${sp.slug}`, '0.95', 'weekly');
        }
      }
    } catch (e) {
      console.warn('Error adding SEO pages to sitemap:', e);
    }

    // 3. Articles & Editorial Guides
    try {
      const articles = await ArticleService.getAllArticles();
      for (const art of articles) {
        if (art.slug) {
          const mod = art.publishedAt ? new Date(art.publishedAt).toISOString().split('T')[0] : now;
          addUrl(`/articles/${art.slug}`, '0.85', 'monthly', mod);
        }
      }
    } catch (e) {
      console.warn('Error adding articles to sitemap:', e);
    }

    // 4. Books Discovery Engine
    try {
      const booksResult = await BookService.getBooks({ limit: 100 });
      for (const b of booksResult.books) {
        if (b.slug) {
          addUrl(`/books/${b.slug}`, '0.85', 'weekly');
        }
      }
    } catch (e) {
      console.warn('Error adding books to sitemap:', e);
    }

    // 5. Verified Authors Directory
    try {
      const authorRes = await AuthorService.getAuthors({ limit: 100 });
      for (const a of authorRes.authors) {
        if (a.slug) {
          addUrl(`/books/authors/${a.slug}`, '0.80', 'weekly');
        }
      }
    } catch (e) {
      console.warn('Error adding authors to sitemap:', e);
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    // 6. Categories & Category Hubs
    try {
      let categories: any[] = [];
      if (isDbConnected) {
        try {
          categories = await Category.find({ isActive: true }).lean();
        } catch (err) {}
      }
      if (!categories || categories.length === 0) {
        categories = mockCategories;
      }

      for (const cat of categories) {
        if (cat.slug) {
          addUrl(`/category/${cat.slug}`, '0.80', 'weekly');
          addUrl(`/delhi/${cat.slug}`, '0.80', 'weekly');
        }
      }
    } catch (e) {
      console.warn('Error adding categories to sitemap:', e);
    }

    // 7. Locations & Neighborhood Hubs
    try {
      let locations: any[] = [];
      if (isDbConnected) {
        try {
          locations = await Location.find({ isActive: true }).lean();
        } catch (err) {}
      }
      if (!locations || locations.length === 0) {
        locations = mockLocations;
      }

      for (const loc of locations) {
        if (loc.slug) {
          addUrl(`/location/${loc.slug}`, '0.80', 'weekly');
        }
      }
    } catch (e) {
      console.warn('Error adding locations to sitemap:', e);
    }

    // 8. Verified Businesses & Spots
    try {
      let businesses: any[] = [];
      if (isDbConnected) {
        try {
          businesses = await Business.find({ status: 'ACTIVE' }).select('slug _id updatedAt').lean();
        } catch (err) {}
      }
      if (!businesses || businesses.length === 0) {
        businesses = mockBusinesses;
      }

      for (const biz of businesses) {
        const slugOrId = biz.slug || biz._id;
        const mod = biz.updatedAt ? new Date(biz.updatedAt).toISOString().split('T')[0] : now;
        addUrl(`/business/${slugOrId}`, '0.75', 'weekly', mod);
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
  public static generateRobotsTxt(inputBaseUrl = 'https://spotpicx.me'): string {
    const baseUrl = this.resolveBaseUrl(inputBaseUrl);
    return `# Robots.txt for SpotPicx
User-agent: *
Allow: /
Allow: /explore
Allow: /articles
Allow: /category/
Allow: /location/
Allow: /delhi/
Allow: /india
Allow: /india/
Allow: /guides
Allow: /guides/
Allow: /books
Allow: /books/
Allow: /brics
Allow: /brics/
Allow: /business/
Allow: /best-*
Allow: /top-*

# Protect Administrative and Private User Paths
Disallow: /admin/
Disallow: /business/dashboard
Disallow: /business/leads
Disallow: /business/subscription
Disallow: /business/reviews
Disallow: /business/analytics
Disallow: /business/offers
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /saved
Disallow: /api/

# XML Sitemap Directive
Sitemap: ${baseUrl}/sitemap.xml
`;
  }
}
