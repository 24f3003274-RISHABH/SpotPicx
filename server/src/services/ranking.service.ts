export type RankingMethod =
  | 'rating'
  | 'reviewCount'
  | 'popularity'
  | 'distance'
  | 'engagement'
  | 'newest'
  | 'custom';

export interface RankingWeights {
  ratingWeight: number;       // default 0.35
  reviewCountWeight: number;  // default 0.20
  popularityWeight: number;   // default 0.15
  verificationWeight: number; // default 0.10
  distanceWeight: number;     // default 0.20 (when distance is available)
}

export interface RankingOptions {
  userLat?: number;
  userLng?: number;
  maxRadiusKm?: number;
  intent?: string;
  rankingMethod?: RankingMethod;
  weights?: Partial<RankingWeights>;
  limit?: number;
}

export interface RankableBusiness {
  _id?: any;
  id?: string;
  name: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  priceRange?: string;
  distanceKm?: number;
  popularityScore?: number;
  analytics?: {
    views?: number;
    searchAppearances?: number;
    directionClicks?: number;
    phoneClicks?: number;
    websiteClicks?: number;
  };
  views?: number;
  createdAt?: string | Date;
  tags?: string[];
  [key: string]: any;
}

export class RankingService {
  private static defaultWeights: RankingWeights = {
    ratingWeight: 0.35,
    reviewCountWeight: 0.20,
    popularityWeight: 0.15,
    verificationWeight: 0.10,
    distanceWeight: 0.20,
  };

  /**
   * Adjust weights dynamically based on user intent
   */
  public static getEffectiveWeights(intent?: string, customWeights?: Partial<RankingWeights>): RankingWeights {
    const base = { ...this.defaultWeights, ...customWeights };

    const upperIntent = (intent || '').toUpperCase();
    if (upperIntent === 'BEST' || upperIntent === 'TOP') {
      base.ratingWeight = 0.50;
      base.reviewCountWeight = 0.25;
      base.distanceWeight = 0.10;
    } else if (upperIntent === 'NEAR_ME' || upperIntent === 'NEAR_LOCATION') {
      base.distanceWeight = 0.50;
      base.ratingWeight = 0.25;
      base.reviewCountWeight = 0.15;
    } else if (upperIntent === 'POPULAR' || upperIntent === 'TRENDING') {
      base.popularityWeight = 0.40;
      base.reviewCountWeight = 0.30;
      base.ratingWeight = 0.20;
    } else if (upperIntent === 'CHEAP' || upperIntent === 'BUDGET' || upperIntent === 'UNDER_PRICE') {
      base.ratingWeight = 0.35;
      base.reviewCountWeight = 0.20;
    }

    return base;
  }

  /**
   * Calculates engagement score based on interactions
   */
  public static calculateEngagement(biz: RankableBusiness): number {
    const directions = biz.analytics?.directionClicks || 0;
    const phones = biz.analytics?.phoneClicks || 0;
    const websites = biz.analytics?.websiteClicks || 0;
    const views = biz.analytics?.views || biz.views || 0;
    const reviews = biz.reviewCount || 0;

    // Engagement formula: high-intent actions carry higher weight
    return directions * 5 + phones * 4 + websites * 3 + reviews * 2 + Math.floor(views * 0.1);
  }

  /**
   * Calculates a composite ranking score between 0.0 and 100.0 for a business
   */
  public static calculateScore(biz: RankableBusiness, options: RankingOptions = {}): number {
    const method = options.rankingMethod || 'custom';
    const weights = this.getEffectiveWeights(options.intent, options.weights);
    const maxRadius = options.maxRadiusKm || 25;

    const rawRating = typeof biz.rating === 'number' ? biz.rating : 4.0;
    const rawReviews = typeof biz.reviewCount === 'number' ? biz.reviewCount : 10;
    const engagement = this.calculateEngagement(biz);

    if (method === 'rating') {
      // Bayesian weighted average: (v*R + m*C) / (v+m), m=5 minimum reviews, C=4.2 avg
      const m = 5;
      const C = 4.2;
      const bayesian = (rawReviews * rawRating + m * C) / (rawReviews + m);
      return Math.round((bayesian / 5.0) * 10000) / 100;
    }

    if (method === 'reviewCount') {
      return rawReviews;
    }

    if (method === 'popularity') {
      const popularity = biz.popularityScore || (rawRating * rawReviews) / 10;
      return Math.round(popularity * 100) / 100;
    }

    if (method === 'distance') {
      const dist = typeof biz.distanceKm === 'number' ? biz.distanceKm : 10;
      return Math.max(0, Math.round((100 - (dist / maxRadius) * 100) * 100) / 100);
    }

    if (method === 'engagement') {
      return engagement;
    }

    if (method === 'newest') {
      const date = biz.createdAt ? new Date(biz.createdAt).getTime() : 0;
      return date;
    }

    // Default 'custom' weighted formula:
    // 1. Rating Score (0 to 100)
    const ratingScore = Math.min(100, Math.max(0, (rawRating / 5.0) * 100));

    // 2. Review Count Score (0 to 100): log scale
    const reviewScore = Math.min(100, (Math.log10(rawReviews + 1) / Math.log10(300)) * 100);

    // 3. Popularity & Engagement Score (0 to 100)
    const popularity = biz.popularityScore || (rawRating * rawReviews) / 10;
    const popNorm = Math.min(100, Math.max(20, (popularity / 100) * 100));
    const engNorm = Math.min(100, (Math.log10(engagement + 1) / Math.log10(500)) * 100);
    const combinedPopEngScore = popNorm * 0.6 + engNorm * 0.4;

    // 4. Verification Bonus
    const verificationScore = biz.verified ? 100 : 30;

    // 5. Distance Score
    let distanceScore = 75;
    if (typeof biz.distanceKm === 'number') {
      distanceScore = Math.max(0, 100 - (biz.distanceKm / maxRadius) * 100);
    }

    // Weighted composite sum
    let totalScore =
      ratingScore * weights.ratingWeight +
      reviewScore * weights.reviewCountWeight +
      combinedPopEngScore * weights.popularityWeight +
      verificationScore * weights.verificationWeight;

    if (typeof biz.distanceKm === 'number') {
      totalScore += distanceScore * weights.distanceWeight;
    } else {
      const remainingWeightFactor = 1 / (1 - weights.distanceWeight);
      totalScore *= remainingWeightFactor;
    }

    // Intent-specific adjustments
    const upperIntent = (options.intent || '').toUpperCase();
    if ((upperIntent === 'CHEAP' || upperIntent === 'BUDGET') && biz.priceRange === 'BUDGET') {
      totalScore += 10;
    } else if ((upperIntent === 'ROMANTIC' || upperIntent === 'FOR_COUPLES') && (biz.tags?.includes('romantic') || biz.tags?.includes('date') || biz.tags?.includes('cozy') || biz.tags?.includes('rooftop'))) {
      totalScore += 12;
    } else if ((upperIntent === 'WORK_FRIENDLY' || upperIntent === 'WORK') && (biz.tags?.includes('work') || biz.tags?.includes('wifi') || biz.tags?.includes('quiet') || biz.amenities?.includes('High-Speed Wi-Fi'))) {
      totalScore += 12;
    } else if (upperIntent === 'HIDDEN_GEM' && rawRating >= 4.6 && rawReviews < 80) {
      totalScore += 15;
    }

    return Math.round(totalScore * 100) / 100;
  }

  /**
   * Sorts an array of businesses by composite ranking score and assigns rank
   */
  public static rankBusinesses<T extends RankableBusiness>(
    businesses: T[],
    options: RankingOptions = {}
  ): (T & { rankingScore: number; rank: number })[] {
    const scored = businesses.map((biz) => {
      const rankingScore = this.calculateScore(biz, options);
      return {
        ...biz,
        rankingScore,
      };
    });

    const sorted = scored.sort((a, b) => b.rankingScore - a.rankingScore);

    const limit = options.limit && options.limit > 0 ? options.limit : sorted.length;
    const ranked = sorted.slice(0, limit).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return ranked;
  }
}

