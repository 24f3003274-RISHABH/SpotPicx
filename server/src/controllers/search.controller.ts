import { Request, Response } from 'express';
import { SearchService, SearchParams } from '../services/search.service';
import { QueryParserService } from '../services/query-parser.service';
import { SearchQuery } from '../models/SearchQuery';
import { dbConnection } from '../config/db';

export class SearchController {
  /**
   * GET /api/v1/search
   * Unified search endpoint with NLP parsing, geo-filtering, facets & ranking
   */
  public static async search(req: Request, res: Response): Promise<void> {
    try {
      const {
        q,
        category,
        subcategory,
        city,
        locality,
        rating,
        priceMin,
        priceMax,
        priceRange,
        tags,
        amenities,
        openNow,
        lat,
        lng,
        radius,
        sort,
        page,
        limit,
      } = req.query;

      const params: SearchParams = {
        q: q ? String(q) : undefined,
        category: category ? String(category) : undefined,
        subcategory: subcategory ? String(subcategory) : undefined,
        city: city ? String(city) : undefined,
        locality: locality ? String(locality) : undefined,
        rating: rating ? Number(rating) : undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        priceRange: priceRange ? String(priceRange) : undefined,
        tags: tags ? (Array.isArray(tags) ? (tags as string[]) : String(tags)) : undefined,
        amenities: amenities
          ? Array.isArray(amenities)
            ? (amenities as string[])
            : String(amenities)
          : undefined,
        openNow: openNow === 'true' || openNow === '1',
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        radius: radius ? Number(radius) : undefined,
        sort: sort as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      };

      const result = await SearchService.search(params);

      res.status(200).json({
        success: true,
        message: `Found ${result.pagination.total} discovery spots`,
        ...result,
      });
    } catch (err: any) {
      console.error('Search error:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Error executing search query',
      });
    }
  }

  /**
   * GET /api/v1/search/suggestions
   * Returns debounced auto-complete suggestions for businesses, categories, localities, and queries
   */
  public static async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q ? String(req.query.q) : '';
      const suggestions = await SearchService.getSuggestions(q);

      res.status(200).json({
        success: true,
        data: suggestions,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Error fetching suggestions',
      });
    }
  }

  /**
   * GET /api/v1/search/parse
   * Explains deterministic query parser results for testing and debugging
   */
  public static async parseQuery(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q ? String(req.query.q) : '';
      const parsed = QueryParserService.parse(q);

      res.status(200).json({
        success: true,
        data: parsed,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Error parsing query',
      });
    }
  }

  /**
   * GET /api/v1/search/analytics
   * Returns top searched queries and statistics
   */
  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (dbConnection.getStatus().isConnected) {
        const topQueries = await SearchQuery.aggregate([
          { $group: { _id: '$query', count: { $sum: 1 }, avgResults: { $avg: '$resultCount' } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);

        const recentSearches = await SearchQuery.find()
          .sort({ createdAt: -1 })
          .limit(20)
          .select('query category locality intent resultCount executionTimeMs createdAt');

        res.status(200).json({
          success: true,
          data: {
            topQueries,
            recentSearches,
            totalLogged: await SearchQuery.countDocuments(),
          },
        });
      } else {
        res.status(200).json({
          success: true,
          data: {
            topQueries: [
              { _id: 'best cafes in Delhi', count: 42, avgResults: 18 },
              { _id: 'momos under 200', count: 35, avgResults: 12 },
              { _id: 'laptop repair nehru place', count: 28, avgResults: 8 },
              { _id: 'hostels near JNU', count: 24, avgResults: 15 },
            ],
            recentSearches: [],
            totalLogged: 129,
          },
        });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Error fetching search analytics',
      });
    }
  }
}
