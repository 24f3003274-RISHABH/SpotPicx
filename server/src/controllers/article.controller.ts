import { Request, Response } from 'express';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/Article';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class ArticleController {
  public static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { category, tag, location, search } = req.query;
    const articles = await ArticleService.getAllArticles({
      category: category as string,
      tag: tag as string,
      location: location as string,
      search: search as string,
    });
    return sendSuccess(res, articles, 'Articles retrieved successfully');
  });

  public static getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const article = await ArticleService.getArticleBySlug(slug);

    if (!article) {
      return sendError(res, 'Article not found', 404);
    }

    const host = req.get('host') || 'spotpicks.delhi';
    const protocol = req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;

    // Generate Article Schema for JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: (article as any).title,
      description: (article as any).excerpt,
      image: [(article as any).coverImage],
      datePublished: (article as any).publishedAt || (article as any).createdAt,
      dateModified: (article as any).updatedAt || (article as any).publishedAt,
      author: {
        '@type': 'Person',
        name: (article as any).author || 'SpotPicks Editorial Team',
        jobTitle: (article as any).authorRole || 'Delhi City Curator',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SpotPicks Delhi',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.ico`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/articles/${(article as any).slug}`,
      },
    };

    return sendSuccess(res, { article, jsonLd }, 'Article details retrieved successfully');
  });

  public static createOrUpdate = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.slug || !data.title) {
      return sendError(res, 'Slug and Title are required', 400);
    }

    const updated = await Article.findOneAndUpdate(
      { slug: data.slug.toLowerCase().trim() },
      { ...data },
      { new: true, upsert: true }
    );

    return sendSuccess(res, updated, 'Article saved successfully');
  });
}
