import { Business } from '../models/Business';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { RankingService, RankingMethod, RankingOptions } from './ranking.service';
import { mockBusinesses } from './seed.data';

export interface Top10QueryParams {
  category?: string;
  location?: string;
  intent?: string;
  rankingMethod?: RankingMethod;
  priceRange?: string | string[];
  amenities?: string | string[];
  tags?: string | string[];
  minRating?: number;
  dietaryOptions?: string | string[];
  limit?: number;
  userLat?: number;
  userLng?: number;
}

export class Top10Service {
  /**
   * Generic Top 10 ranking engine
   * Retrieves, filters, ranks, and annotates Top 10 spots for any category, locality, and intent
   */
  public static async getTop10(params: Top10QueryParams) {
    const {
      category,
      location,
      intent = 'BEST',
      rankingMethod = 'custom',
      priceRange,
      amenities,
      tags,
      minRating,
      limit = 10,
      userLat,
      userLng,
    } = params;

    let candidateBusinesses: any[] = [];

    try {
      // 1. Build MongoDB query if database is connected
      const query: any = { status: 'ACTIVE' };

      if (category && category !== 'all' && category !== 'delhi') {
        const catDoc = await Category.findOne({
          $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }],
        });

        if (catDoc) {
          query.$or = [
            { category: catDoc.name },
            { categories: catDoc._id },
            { tags: new RegExp(catDoc.slug, 'i') },
          ];
        } else {
          query.$or = [
            { category: new RegExp(category, 'i') },
            { tags: new RegExp(category, 'i') },
          ];
        }
      }

      if (location && location.toLowerCase() !== 'delhi' && location !== 'all') {
        const locDoc = await Location.findOne({
          $or: [{ slug: location.toLowerCase() }, { name: new RegExp(`^${location}$`, 'i') }],
        });

        const locName = locDoc ? locDoc.name : location;
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { locality: new RegExp(locName, 'i') },
            { address: new RegExp(locName, 'i') },
            { city: new RegExp(locName, 'i') },
          ],
        });
      }

      if (minRating && Number(minRating) > 0) {
        query.rating = { $gte: Number(minRating) };
      }

      if (priceRange) {
        const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
        query.priceRange = { $in: prices };
      }

      if (tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagList.map((t) => new RegExp(t, 'i')) };
      }

      if (amenities) {
        const amenityList = Array.isArray(amenities) ? amenities : [amenities];
        query.amenities = { $in: amenityList.map((a) => new RegExp(a, 'i')) };
      }

      candidateBusinesses = await Business.find(query).lean();
    } catch (err) {
      console.warn('MongoDB query in Top10Service failed, falling back to mock dataset:', err);
    }

    // Fallback to rich mock dataset if candidate list is empty
    if (!candidateBusinesses || candidateBusinesses.length === 0) {
      candidateBusinesses = mockBusinesses.filter((b) => {
        if (b.status && b.status !== 'ACTIVE') return false;

        if (category && category !== 'all' && category.toLowerCase() !== 'delhi') {
          const catLower = category.toLowerCase();
          const matchCat =
            ((b as any).category && String((b as any).category).toLowerCase().includes(catLower)) ||
            (b.categorySlug && b.categorySlug.toLowerCase().includes(catLower)) ||
            (b.categorySlugs && b.categorySlugs.some((cs: string) => cs.toLowerCase().includes(catLower))) ||
            (b.tags && b.tags.some((t: string) => t.toLowerCase().includes(catLower))) ||
            (b.name && b.name.toLowerCase().includes(catLower));
          if (!matchCat) return false;
        }

        if (location && location.toLowerCase() !== 'delhi' && location !== 'all') {
          const matchLoc =
            (b.locality && b.locality.toLowerCase().includes(location.toLowerCase())) ||
            (b.address && b.address.toLowerCase().includes(location.toLowerCase()));
          if (!matchLoc) return false;
        }

        if (minRating && (b.rating || 0) < Number(minRating)) {
          return false;
        }

        if (priceRange) {
          const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
          if (!prices.includes(b.priceRange)) return false;
        }

        return true;
      });
    }

    // If still empty (e.g. very specific filter), provide top overall spots
    if (candidateBusinesses.length === 0) {
      candidateBusinesses = mockBusinesses.slice(0, 15);
    }

    // 2. Rank candidate businesses using RankingService
    const rankingOpts: RankingOptions = {
      intent,
      rankingMethod,
      limit: Number(limit) || 10,
      userLat,
      userLng,
    };

    const ranked = RankingService.rankBusinesses(candidateBusinesses, rankingOpts);

    // 3. Compute aggregate insights for the Top 10 list
    const avgRating =
      ranked.length > 0
        ? Math.round((ranked.reduce((acc, b) => acc + (b.rating || 0), 0) / ranked.length) * 10) / 10
        : 4.5;
    
    const localities = Array.from(new Set(ranked.map((b) => b.locality).filter(Boolean)));
    const totalReviews = ranked.reduce((acc, b) => acc + (b.reviewCount || 0), 0);
    const verifiedCount = ranked.filter((b) => b.verified).length;

    return {
      items: ranked,
      count: ranked.length,
      intent,
      rankingMethod,
      category: category || 'All Spots',
      location: location || 'Delhi NCR',
      meta: {
        avgRating,
        totalReviews,
        verifiedCount,
        localities,
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
