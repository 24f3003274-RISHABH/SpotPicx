import { Request, Response } from 'express';
import { PopularSearch, IPopularSearch, PopularSearchGroup } from '../models/PopularSearch';
import { dbConnection } from '../config/db';
import { SeedService } from '../services/seed.service';

export class PopularSearchController {
  /**
   * GET /api/v1/popular-searches (or /api/v1/search/popular)
   * Public list of active popular searches
   */
  public static async getPopularSearches(req: Request, res: Response): Promise<void> {
    try {
      const { group, limit } = req.query;
      const maxLimit = Math.min(50, Math.max(1, Number(limit) || 20));
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const queryFilter: any = { isActive: true };
        if (group && group !== 'ALL') {
          queryFilter.group = group;
        }

        const items = await PopularSearch.find(queryFilter)
          .sort({ priority: -1, clickCount: -1, createdAt: -1 })
          .limit(maxLimit)
          .lean();

        res.json({
          success: true,
          data: items,
          total: items.length,
        });
        return;
      }

      // In-Memory Fallback
      SeedService.initializeInMemoryStore();
      let inMemoryItems = Array.from(SeedService.inMemoryPopularSearches.values()).filter(
        (item) => item.isActive
      );

      if (group && group !== 'ALL') {
        inMemoryItems = inMemoryItems.filter((item) => item.group === group);
      }

      inMemoryItems.sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.clickCount || 0) - (a.clickCount || 0));

      const sliced = inMemoryItems.slice(0, maxLimit);

      res.json({
        success: true,
        data: sliced,
        total: sliced.length,
      });
    } catch (error: any) {
      console.error('Error fetching popular searches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch popular searches',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/popular-searches/:id/click (or by slug)
   * Tracks user interaction with popular search button
   */
  public static async trackClick(req: Request, res: Response): Promise<void> {
    try {
      const { idOrSlug } = req.params;
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
        const filter = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug };
        await PopularSearch.findOneAndUpdate(filter, { $inc: { clickCount: 1 } });
      } else {
        SeedService.initializeInMemoryStore();
        const item = SeedService.inMemoryPopularSearches.get(idOrSlug) ||
          Array.from(SeedService.inMemoryPopularSearches.values()).find(
            (p) => p.slug === idOrSlug || String(p._id) === idOrSlug
          );
        if (item) {
          item.clickCount = (item.clickCount || 0) + 1;
        }
      }

      res.json({ success: true, message: 'Click tracked' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/v1/admin/popular-searches
   * Admin list with all statuses
   */
  public static async getAdminList(req: Request, res: Response): Promise<void> {
    try {
      const { group, search } = req.query;
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const queryFilter: any = {};
        if (group && group !== 'ALL') {
          queryFilter.group = group;
        }
        if (search && typeof search === 'string') {
          queryFilter.$or = [
            { title: new RegExp(search, 'i') },
            { query: new RegExp(search, 'i') },
            { slug: new RegExp(search, 'i') },
          ];
        }

        const items = await PopularSearch.find(queryFilter)
          .sort({ priority: -1, clickCount: -1, createdAt: -1 })
          .lean();

        res.json({
          success: true,
          data: items,
          total: items.length,
        });
        return;
      }

      // In-Memory Fallback
      SeedService.initializeInMemoryStore();
      let items = Array.from(SeedService.inMemoryPopularSearches.values());

      if (group && group !== 'ALL') {
        items = items.filter((item) => item.group === group);
      }
      if (search && typeof search === 'string') {
        const regex = new RegExp(search, 'i');
        items = items.filter((item) => regex.test(item.title) || regex.test(item.query) || regex.test(item.slug));
      }

      items.sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.clickCount || 0) - (a.clickCount || 0));

      res.json({
        success: true,
        data: items,
        total: items.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch admin popular searches',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/v1/admin/popular-searches
   * Create a popular search item
   */
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, slug, query, category, location, filters, description, icon, group, badge, priority, isActive } = req.body;

      if (!title || !query) {
        res.status(400).json({ success: false, message: 'Title and query are required' });
        return;
      }

      const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const existing = await PopularSearch.findOne({ slug: generatedSlug });
        if (existing) {
          res.status(400).json({ success: false, message: 'A popular search with this slug already exists' });
          return;
        }

        const created = await PopularSearch.create({
          title,
          slug: generatedSlug,
          query,
          category,
          location,
          filters: filters || {},
          description,
          icon: icon || 'Sparkles',
          group: (group as PopularSearchGroup) || 'ALL',
          badge: badge || '',
          priority: Number(priority) || 0,
          isActive: isActive !== false,
          clickCount: 0,
        });

        res.status(201).json({ success: true, data: created });
        return;
      }

      // In-Memory Fallback
      SeedService.initializeInMemoryStore();
      const mockId = 'pop_' + Date.now();
      const mockItem: any = {
        _id: mockId,
        id: mockId,
        title,
        slug: generatedSlug,
        query,
        category,
        location,
        filters: filters || {},
        description,
        icon: icon || 'Sparkles',
        group: (group as PopularSearchGroup) || 'ALL',
        badge: badge || '',
        priority: Number(priority) || 0,
        isActive: isActive !== false,
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      SeedService.inMemoryPopularSearches.set(generatedSlug, mockItem);

      res.status(201).json({ success: true, data: mockItem });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to create popular search', error: error.message });
    }
  }

  /**
   * PUT /api/v1/admin/popular-searches/:id
   * Update a popular search item
   */
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const updated = await PopularSearch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updated) {
          res.status(404).json({ success: false, message: 'Popular search not found' });
          return;
        }
        res.json({ success: true, data: updated });
        return;
      }

      // In-Memory Fallback
      SeedService.initializeInMemoryStore();
      const item = SeedService.inMemoryPopularSearches.get(id) ||
        Array.from(SeedService.inMemoryPopularSearches.values()).find(
          (p) => String(p._id) === id || p.slug === id
        );

      if (!item) {
        res.status(404).json({ success: false, message: 'Popular search not found in memory' });
        return;
      }

      Object.assign(item, updateData, { updatedAt: new Date() });
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to update popular search', error: error.message });
    }
  }

  /**
   * DELETE /api/v1/admin/popular-searches/:id
   * Delete a popular search item
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const isConnected = dbConnection.getStatus().isConnected;

      if (isConnected) {
        const deleted = await PopularSearch.findByIdAndDelete(id);
        if (!deleted) {
          res.status(404).json({ success: false, message: 'Popular search not found' });
          return;
        }
        res.json({ success: true, message: 'Popular search deleted successfully' });
        return;
      }

      // In-Memory Fallback
      SeedService.initializeInMemoryStore();
      let keyToDelete: string | null = null;
      for (const [k, v] of SeedService.inMemoryPopularSearches.entries()) {
        if (String(v._id) === id || v.slug === id || k === id) {
          keyToDelete = k;
          break;
        }
      }

      if (keyToDelete) {
        SeedService.inMemoryPopularSearches.delete(keyToDelete);
        res.json({ success: true, message: 'Deleted from in-memory store' });
      } else {
        res.status(404).json({ success: false, message: 'Popular search not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to delete popular search', error: error.message });
    }
  }
}
