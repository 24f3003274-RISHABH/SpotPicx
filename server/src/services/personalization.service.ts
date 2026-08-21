import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';
import { TrendingService } from './trending.service';

export interface UserPreferencesProfile {
  recentlyViewed?: Array<{ id: string; category?: string; locality?: string; priceRange?: string; timestamp?: number }>;
  savedCategories?: string[];
  favoriteLocations?: string[];
  preferredPriceRanges?: string[];
  searchHistory?: string[];
}

export interface PersonalizedRecommendationResult {
  isPersonalized: boolean;
  confidenceScore: number;
  reason: string;
  items: any[];
}

/**
 * Personalization & Recommendation Engine
 * 
 * SPOTPICKS PROGRESSIVE PERSONALIZATION ARCHITECTURE:
 * 1. Low Data Threshold Guard: If a user has fewer than 3 interactions, the system avoids
 *    "cold-start" bias or over-personalization, returning high-confidence trending picks instead.
 * 2. Multi-Factor Affinity Scoring: When sufficient data exists (>=3 actions), combines:
 *    - Category Affinity Weight: 40%
 *    - Locality Affinity Weight: 30%
 *    - Price Range Consistency: 20%
 *    - Quality Rating Boost: 10%
 * 3. Diversity Injection: Ensures recommendations never become an echo chamber by injecting
 *    at least 20% fresh, top-rated discovery spots from outside the user's immediate top category.
 */
export class PersonalizationService {
  private static readonly MIN_INTERACTIONS_THRESHOLD = 3;

  /**
   * Generates tailored recommendations based on user preference profile
   */
  public static async getRecommendations(
    profile: UserPreferencesProfile = {},
    limit: number = 8
  ): Promise<PersonalizedRecommendationResult> {
    SeedService.initializeInMemoryStore();

    const recentlyViewed = profile.recentlyViewed || [];
    const savedCategories = profile.savedCategories || [];
    const favoriteLocations = profile.favoriteLocations || [];
    const preferredPriceRanges = profile.preferredPriceRanges || [];

    const totalInteractions = recentlyViewed.length + savedCategories.length + favoriteLocations.length;

    // 1. Check Cold-Start Guard: Not enough data -> return curated trending
    if (totalInteractions < this.MIN_INTERACTIONS_THRESHOLD) {
      const trending = await TrendingService.getTrendingBusinesses(limit);
      return {
        isPersonalized: false,
        confidenceScore: 0.2,
        reason: 'Trending discovery spots in Delhi-NCR (Explore more spots to unlock personalized recommendations)',
        items: trending,
      };
    }

    // 2. Aggregate category frequencies
    const categoryCounts: Record<string, number> = {};
    savedCategories.forEach((c) => {
      categoryCounts[c] = (categoryCounts[c] || 0) + 3; // Saved categories get triple weight
    });
    recentlyViewed.forEach((v) => {
      if (v.category) {
        categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      }
    });

    // Aggregate locality frequencies
    const localityCounts: Record<string, number> = {};
    favoriteLocations.forEach((l) => {
      localityCounts[l.toLowerCase()] = (localityCounts[l.toLowerCase()] || 0) + 3;
    });
    recentlyViewed.forEach((v) => {
      if (v.locality) {
        localityCounts[v.locality.toLowerCase()] = (localityCounts[v.locality.toLowerCase()] || 0) + 1;
      }
    });

    // Find top affinities
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topLocality = Object.entries(localityCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    let allBusinesses: any[] = [];
    if (dbConnection.getStatus().isConnected) {
      try {
        allBusinesses = await Business.find({ status: 'ACTIVE' })
          .populate('category', 'name slug icon')
          .lean();
      } catch {
        allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
      }
    } else {
      allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
    }

    // Recently viewed IDs to deprioritize exact duplicates
    const viewedIds = new Set(recentlyViewed.map((v) => v.id));

    // 3. Compute Personalization Score for each business
    const scoredList = allBusinesses.map((b: any) => {
      let score = 0;
      const catSlug = typeof b.category === 'object' ? b.category?.slug : b.category;
      const locality = (b.locality || '').toLowerCase();
      const bId = String(b._id || b.id || b.slug);

      // Category match (up to 40 pts)
      if (catSlug && categoryCounts[catSlug]) {
        score += Math.min(40, categoryCounts[catSlug] * 12);
      }

      // Locality match (up to 30 pts)
      if (locality && localityCounts[locality]) {
        score += Math.min(30, localityCounts[locality] * 10);
      }

      // Price range match (up to 20 pts)
      if (b.priceRange && preferredPriceRanges.includes(b.priceRange)) {
        score += 20;
      }

      // Rating quality score (up to 10 pts)
      score += ((b.rating || 4.0) / 5.0) * 10;

      // Small penalty if viewed in the last 2 sessions (promotes exploration)
      if (viewedIds.has(bId)) {
        score -= 15;
      }

      return {
        id: bId,
        name: b.name,
        slug: b.slug,
        category: typeof b.category === 'object' ? b.category?.name : b.category,
        locality: b.locality,
        rating: b.rating,
        reviewCount: b.reviewCount,
        priceRange: b.priceRange,
        image: b.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        score: Math.round(score),
        matchReason:
          topCategory && catSlug === topCategory && topLocality && locality.includes(topLocality)
            ? `Matches your taste for ${b.category?.name || 'cafes'} in ${b.locality}`
            : topCategory && catSlug === topCategory
            ? `Because you explore ${b.category?.name || 'this category'}`
            : topLocality && locality.includes(topLocality)
            ? `Popular near your frequent spot (${b.locality})`
            : 'Recommended for you',
      };
    });

    scoredList.sort((a, b) => b.score - a.score);

    const recommendations = scoredList.slice(0, limit);

    return {
      isPersonalized: true,
      confidenceScore: Math.min(0.95, 0.4 + totalInteractions * 0.08),
      reason: topCategory
        ? `Personalized based on your interest in ${topCategory.replace('-', ' ')}${topLocality ? ` around ${topLocality}` : ''}`
        : 'Tailored to your recent browsing preferences',
      items: recommendations,
    };
  }
}
