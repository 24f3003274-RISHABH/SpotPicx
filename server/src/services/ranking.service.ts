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
  weights?: Partial<RankingWeights>;
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
  views?: number;
  createdAt?: string | Date;
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

    if (intent === 'BEST' || intent === 'TOP') {
      base.ratingWeight = 0.50;
      base.reviewCountWeight = 0.25;
      base.distanceWeight = 0.10;
    } else if (intent === 'NEAR_ME' || intent === 'NEAR_LOCATION') {
      base.distanceWeight = 0.50;
      base.ratingWeight = 0.25;
      base.reviewCountWeight = 0.15;
    } else if (intent === 'POPULAR' || intent === 'TRENDING') {
      base.popularityWeight = 0.40;
      base.reviewCountWeight = 0.30;
      base.ratingWeight = 0.20;
    } else if (intent === 'CHEAP' || intent === 'UNDER_PRICE') {
      base.ratingWeight = 0.35;
      base.reviewCountWeight = 0.20;
    }

    return base;
  }

  /**
   * Calculates a composite ranking score between 0.0 and 100.0 for a business
   */
  public static calculateScore(biz: RankableBusiness, options: RankingOptions = {}): number {
    const weights = this.getEffectiveWeights(options.intent, options.weights);
    const maxRadius = options.maxRadiusKm || 25; // default 25km max for normalization

    // 1. Rating Score (0 to 100): scale 0-5 to 0-100
    const rawRating = typeof biz.rating === 'number' ? biz.rating : 4.0;
    const ratingScore = Math.min(100, Math.max(0, (rawRating / 5.0) * 100));

    // 2. Review Count Score (0 to 100): logarithmic dampening (log10(reviews + 1) / log10(500)) * 100
    const rawReviews = typeof biz.reviewCount === 'number' ? biz.reviewCount : 10;
    const reviewScore = Math.min(100, (Math.log10(rawReviews + 1) / Math.log10(300)) * 100);

    // 3. Popularity / Engagement Score (0 to 100)
    const popularity = biz.popularityScore || (biz.rating * (biz.reviewCount || 10)) / 10;
    const popularityScore = Math.min(100, Math.max(20, (popularity / 100) * 100));

    // 4. Verification Bonus (100 if verified, 30 if unverified)
    const verificationScore = biz.verified ? 100 : 30;

    // 5. Distance Score (0 to 100): 100 at 0km, decreases linearly to 0 at maxRadius
    let distanceScore = 75; // neutral fallback if no location provided
    if (typeof biz.distanceKm === 'number') {
      distanceScore = Math.max(0, 100 - (biz.distanceKm / maxRadius) * 100);
    }

    // Weighted composite sum
    let totalScore =
      ratingScore * weights.ratingWeight +
      reviewScore * weights.reviewCountWeight +
      popularityScore * weights.popularityWeight +
      verificationScore * weights.verificationWeight;

    if (typeof biz.distanceKm === 'number') {
      totalScore += distanceScore * weights.distanceWeight;
    } else {
      // Re-distribute the distance weight proportionally if distance is absent
      const remainingWeightFactor = 1 / (1 - weights.distanceWeight);
      totalScore *= remainingWeightFactor;
    }

    // Intent specific bonus modifiers
    if (options.intent === 'CHEAP' && biz.priceRange === 'BUDGET') {
      totalScore += 10;
    } else if (options.intent === 'FOR_COUPLES' && (biz.tags?.includes('romantic') || biz.tags?.includes('date') || biz.tags?.includes('cozy'))) {
      totalScore += 12;
    } else if (options.intent === 'FOR_STUDENTS' && (biz.tags?.includes('student friendly') || biz.tags?.includes('pocket friendly') || biz.priceRange === 'BUDGET')) {
      totalScore += 10;
    } else if (options.intent === 'HIDDEN_GEM' && rawRating >= 4.6 && rawReviews < 80) {
      totalScore += 15;
    }

    return Math.round(totalScore * 100) / 100;
  }

  /**
   * Sorts an array of businesses by composite ranking score
   */
  public static rankBusinesses<T extends RankableBusiness>(
    businesses: T[],
    options: RankingOptions = {}
  ): (T & { rankingScore: number })[] {
    const scored = businesses.map((biz) => {
      const rankingScore = this.calculateScore(biz, options);
      return {
        ...biz,
        rankingScore,
      };
    });

    return scored.sort((a, b) => b.rankingScore - a.rankingScore);
  }
}
