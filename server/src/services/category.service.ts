import { Category, ICategory } from '../models/Category';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export class CategoryService {
  public static async getAllCategories(query: { type?: string; parent?: string } = {}) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = { isActive: true };
        if (query.type) filter.type = query.type;
        if (query.parent === 'null') filter.parent = null;
        else if (query.parent) filter.parent = query.parent;

        const categories = await Category.find(filter)
          .populate('parent', 'name slug icon')
          .sort({ order: 1, name: 1 })
          .lean();

        return categories;
      } catch (err: any) {
        console.warn('[CategoryService] Falling back to in-memory categories:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    let all = Array.from(SeedService.inMemoryCategories.values());

    if (query.type) {
      all = all.filter((c) => c.type === query.type);
    }
    if (query.parent === 'null') {
      all = all.filter((c) => !c.parent);
    }

    return all.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public static async getCategoryBySlug(slug: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const category = await Category.findOne({ slug, isActive: true })
          .populate('parent', 'name slug icon')
          .lean();

        if (category) {
          const subcategories = await Category.find({ parent: category._id, isActive: true })
            .sort({ order: 1 })
            .lean();

          const businessCount = await Business.countDocuments({
            $or: [{ category: category._id }, { categories: category._id }],
            status: 'ACTIVE',
          });

          return {
            ...category,
            subcategories,
            businessCount,
          };
        }
      } catch (err: any) {
        console.warn('[CategoryService] Falling back to in-memory category lookup:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    const cat = SeedService.inMemoryCategories.get(slug);
    if (!cat) return null;

    const subcategories = Array.from(SeedService.inMemoryCategories.values()).filter(
      (c) => c.parent === cat._id
    );

    const businessCount = Array.from(SeedService.inMemoryBusinesses.values()).filter(
      (b) => b.categorySlug === slug || (b.categorySlugs && b.categorySlugs.includes(slug))
    ).length;

    return {
      ...cat,
      subcategories,
      businessCount,
    };
  }
}
