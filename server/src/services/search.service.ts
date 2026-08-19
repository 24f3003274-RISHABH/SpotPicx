import mongoose from 'mongoose';
import { Business, IBusiness } from '../models/Business';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { SearchQuery } from '../models/SearchQuery';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';
import { QueryParserService, ParsedSearchQuery } from './query-parser.service';
import { RankingService } from './ranking.service';

export interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  city?: string;
  locality?: string;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  priceRange?: string; // BUDGET, MODERATE, PREMIUM, LUXURY
  tags?: string | string[];
  amenities?: string | string[];
  openNow?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // in kilometers (e.g. 5, 10, 20)
  sort?:
    | 'recommended'
    | 'rating'
    | 'popularity'
    | 'reviews'
    | 'distance'
    | 'newest'
    | 'price_asc'
    | 'price_desc';
  page?: number;
  limit?: number;
}

export interface SearchResultItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: any;
  categories?: any[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: string;
  locality: string;
  city: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  images: string[];
  logo?: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  amenities?: string[];
  features?: string[];
  openingHours?: Record<string, string>;
  verified: boolean;
  claimed: boolean;
  distanceKm?: number;
  rankingScore?: number;
}

export interface SearchResponse {
  data: SearchResultItem[];
  parsedQuery: ParsedSearchQuery;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filtersApplied: {
    category?: string;
    locality?: string;
    city?: string;
    rating?: number;
    priceRange?: string;
    hasLocation: boolean;
    radiusKm?: number;
    sort: string;
  };
  meta: {
    executionTimeMs: number;
    source: 'mongodb' | 'seed_in_memory';
  };
}

export interface SearchSuggestions {
  businesses: Array<{ name: string; slug: string; locality: string; categoryName?: string }>;
  categories: Array<{ name: string; slug: string; icon?: string }>;
  locations: Array<{ name: string; slug: string; type?: string }>;
  popularSearches: string[];
}

export class SearchService {
  /**
   * Calculates Haversine distance in kilometers between two GPS coordinates
   */
  public static calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Rounded to 1 decimal
  }

  /**
   * Reusable MongoDB Query Builder for business discovery
   */
  public static buildBusinessQuery(
    params: SearchParams,
    parsedQuery: ParsedSearchQuery,
    categoryIds?: mongoose.Types.ObjectId[]
  ): Record<string, any> {
    const query: Record<string, any> = {
      status: 'ACTIVE',
    };

    // 1. Category Filter: explicit param or parsed intent
    const categorySlug = params.category || (parsedQuery.category && !params.q?.includes('category:') ? parsedQuery.category : undefined);
    if (categoryIds && categoryIds.length > 0) {
      query.$or = query.$or || [];
      query.$or.push(
        { category: { $in: categoryIds } },
        { categories: { $in: categoryIds } }
      );
    }

    // 2. City & Locality Filter
    const city = params.city || parsedQuery.city;
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    const locality = params.locality || (!params.category ? parsedQuery.locality : undefined);
    if (locality && locality !== 'All') {
      query.locality = new RegExp(locality, 'i');
    }

    // 3. Rating Filter
    const minRating = params.rating || parsedQuery.minRating;
    if (minRating && minRating > 0) {
      query.rating = { $gte: Number(minRating) };
    }

    // 4. Price Tier Filter
    const priceRange = params.priceRange || parsedQuery.priceRange;
    if (priceRange) {
      query.priceRange = priceRange;
    }

    // 5. Tags Filter
    const tagsParam = Array.isArray(params.tags)
      ? params.tags
      : params.tags
      ? params.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const combinedTags = Array.from(new Set([...tagsParam, ...parsedQuery.tags]));
    if (combinedTags.length > 0) {
      query.tags = { $in: combinedTags.map((t) => new RegExp(t, 'i')) };
    }

    // 6. Amenities Filter
    const amenitiesParam = Array.isArray(params.amenities)
      ? params.amenities
      : params.amenities
      ? params.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
    const combinedAmenities = Array.from(new Set([...amenitiesParam, ...parsedQuery.amenities]));
    if (combinedAmenities.length > 0) {
      query.amenities = { $in: combinedAmenities.map((a) => new RegExp(a, 'i')) };
    }

    // 7. Full-Text Search / Keyword Regex fallback
    const keyword = parsedQuery.cleanedQuery || params.q?.trim();
    if (keyword && keyword.length > 0) {
      const regex = new RegExp(keyword, 'i');
      const textConditions = [
        { name: regex },
        { description: regex },
        { shortDescription: regex },
        { tags: { $in: [regex] } },
        { locality: regex },
        { address: regex },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: textConditions }];
        delete query.$or;
      } else {
        query.$or = textConditions;
      }
    }

    // 8. Geospatial Filter ($near / $geoNear via coordinates)
    if (params.lat && params.lng) {
      const radiusKm = params.radius || 25;
      const maxDistanceMeters = radiusKm * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(params.lng), Number(params.lat)],
          },
          $maxDistance: maxDistanceMeters,
        },
      };
    }

    return query;
  }

  /**
   * Main unified search entry point
   */
  public static async search(params: SearchParams): Promise<SearchResponse> {
    const startTime = Date.now();
    const parsedQuery = QueryParserService.parse(params.q || '');

    // Normalize pagination
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 20));
    const sort = params.sort || 'recommended';

    const isConnected = dbConnection.getStatus().isConnected;

    let searchResponse: SearchResponse;

    if (isConnected) {
      searchResponse = await this.searchMongoDB(params, parsedQuery, page, limit, sort, startTime);
    } else {
      searchResponse = this.searchInMemory(params, parsedQuery, page, limit, sort, startTime);
    }

    // Asynchronously log query analytics (non-blocking)
    this.logSearchQuery(params, parsedQuery, searchResponse.pagination.total, Date.now() - startTime).catch(() => {});

    return searchResponse;
  }

  /**
   * MongoDB query execution implementation
   */
  private static async searchMongoDB(
    params: SearchParams,
    parsedQuery: ParsedSearchQuery,
    page: number,
    limit: number,
    sort: string,
    startTime: number
  ): Promise<SearchResponse> {
    let categoryIds: mongoose.Types.ObjectId[] = [];
    const catSlug = params.category || parsedQuery.category;
    if (catSlug) {
      const categoryDoc = await Category.findOne({ slug: catSlug });
      if (categoryDoc) {
        categoryIds.push(categoryDoc._id);
        const subCats = await Category.find({ parent: categoryDoc._id }).select('_id');
        categoryIds.push(...subCats.map((sc) => sc._id));
      }
    }

    const query = this.buildBusinessQuery(params, parsedQuery, categoryIds);

    const total = await Business.countDocuments(query);
    const skip = (page - 1) * limit;

    let cursor = Business.find(query)
      .populate('category', 'name slug icon image type')
      .populate('categories', 'name slug icon image');

    // Handle initial sort in query if not using in-memory ranking
    if (sort === 'rating') {
      cursor = cursor.sort({ rating: -1, reviewCount: -1 });
    } else if (sort === 'reviews' || sort === 'popularity') {
      cursor = cursor.sort({ reviewCount: -1, rating: -1 });
    } else if (sort === 'newest') {
      cursor = cursor.sort({ createdAt: -1 });
    } else if (sort === 'price_asc') {
      cursor = cursor.sort({ priceRange: 1, rating: -1 });
    } else if (sort === 'price_desc') {
      cursor = cursor.sort({ priceRange: -1, rating: -1 });
    }

    const rawResults = await cursor.skip(skip).limit(limit).lean();

    // Map and augment with Distance & Ranking
    let mappedResults: SearchResultItem[] = rawResults.map((doc: any) => {
      let distanceKm: number | undefined;
      const userLat = params.lat;
      const userLng = params.lng;

      if (userLat && userLng) {
        const [docLng, docLat] = doc.location?.coordinates || [doc.longitude || 77.209, doc.latitude || 28.6139];
        distanceKm = this.calculateHaversineDistance(userLat, userLng, docLat, docLng);
      }

      return {
        _id: String(doc._id),
        id: String(doc._id),
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        shortDescription: doc.shortDescription,
        category: doc.category,
        categories: doc.categories,
        location: doc.location || { type: 'Point', coordinates: [doc.longitude || 77.209, doc.latitude || 28.6139] },
        address: doc.address,
        locality: doc.locality,
        city: doc.city,
        state: doc.state,
        country: doc.country,
        pincode: doc.pincode,
        latitude: doc.latitude,
        longitude: doc.longitude,
        phone: doc.phone,
        email: doc.email,
        website: doc.website,
        images: doc.images || [],
        logo: doc.logo,
        priceRange: doc.priceRange,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        tags: doc.tags || [],
        amenities: doc.amenities || [],
        features: doc.features || [],
        openingHours: doc.openingHours,
        verified: doc.verified,
        claimed: doc.claimed,
        distanceKm,
      };
    });

    // Apply Ranking Engine for 'recommended' or 'distance' sorts
    if (sort === 'recommended' || sort === 'popularity') {
      mappedResults = RankingService.rankBusinesses(mappedResults, {
        userLat: params.lat,
        userLng: params.lng,
        intent: parsedQuery.intent,
      });
    } else if (sort === 'distance' && params.lat && params.lng) {
      mappedResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: mappedResults,
      parsedQuery,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filtersApplied: {
        category: params.category || parsedQuery.category,
        locality: params.locality || parsedQuery.locality,
        city: params.city || parsedQuery.city,
        rating: params.rating || parsedQuery.minRating,
        priceRange: params.priceRange || parsedQuery.priceRange,
        hasLocation: Boolean(params.lat && params.lng),
        radiusKm: params.radius,
        sort,
      },
      meta: {
        executionTimeMs: Date.now() - startTime,
        source: 'mongodb',
      },
    };
  }

  /**
   * Resilient in-memory search implementation for offline / preview environment
   */
  private static searchInMemory(
    params: SearchParams,
    parsedQuery: ParsedSearchQuery,
    page: number,
    limit: number,
    sort: string,
    startTime: number
  ): SearchResponse {
    let items = Array.from(SeedService.inMemoryBusinesses.values());

    // 1. Filter by Category
    const categorySlug = params.category || parsedQuery.category;
    if (categorySlug && categorySlug !== 'All') {
      const matchCat = SeedService.inMemoryCategories.get(categorySlug);
      const subCatSlugs = Array.from(SeedService.inMemoryCategories.values())
        .filter((c) => c.parent === matchCat?._id || c.parent === matchCat?.slug)
        .map((c) => c.slug);
      const allowedCategories = new Set([categorySlug, ...subCatSlugs]);

      items = items.filter((b) => {
        const cat = typeof b.category === 'object' ? (b.category as any)?.slug : b.category;
        return allowedCategories.has(cat);
      });
    }

    // 2. Filter by Locality
    const locality = params.locality || (!params.category ? parsedQuery.locality : undefined);
    if (locality && locality !== 'All') {
      const locRegex = new RegExp(locality, 'i');
      items = items.filter((b) => locRegex.test(b.locality) || locRegex.test(b.address));
    }

    // 3. Filter by City
    const city = params.city || parsedQuery.city;
    if (city && city !== 'All') {
      const cityRegex = new RegExp(city, 'i');
      items = items.filter((b) => cityRegex.test(b.city));
    }

    // 4. Filter by Rating
    const minRating = params.rating || parsedQuery.minRating;
    if (minRating && minRating > 0) {
      items = items.filter((b) => (b.rating || 0) >= Number(minRating));
    }

    // 5. Filter by Price Range
    const priceRange = params.priceRange || parsedQuery.priceRange;
    if (priceRange) {
      items = items.filter((b) => b.priceRange === priceRange);
    }

    // 6. Filter by Tags
    const tagsParam = Array.isArray(params.tags)
      ? params.tags
      : params.tags
      ? params.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const combinedTags = Array.from(new Set([...tagsParam, ...parsedQuery.tags]));
    if (combinedTags.length > 0) {
      items = items.filter((b) => {
        const itemTags = (b.tags || []).map((t: string) => t.toLowerCase());
        return combinedTags.some((tag) => itemTags.some((it) => it.includes(tag.toLowerCase())));
      });
    }

    // 7. Filter by Amenities
    const amenitiesParam = Array.isArray(params.amenities)
      ? params.amenities
      : params.amenities
      ? params.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
    const combinedAmenities = Array.from(new Set([...amenitiesParam, ...parsedQuery.amenities]));
    if (combinedAmenities.length > 0) {
      items = items.filter((b) => {
        const itemAmenities = (b.amenities || []).map((a: string) => a.toLowerCase());
        return combinedAmenities.some((am) => itemAmenities.some((ia) => ia.includes(am.toLowerCase())));
      });
    }

    // 8. Keyword / Free-Text Filter
    const keyword = parsedQuery.cleanedQuery || params.q?.trim();
    if (keyword && keyword.length > 0) {
      const kw = keyword.toLowerCase();
      items = items.filter((b) => {
        return (
          b.name?.toLowerCase().includes(kw) ||
          b.description?.toLowerCase().includes(kw) ||
          b.shortDescription?.toLowerCase().includes(kw) ||
          b.locality?.toLowerCase().includes(kw) ||
          b.address?.toLowerCase().includes(kw) ||
          (b.tags || []).some((t: string) => t.toLowerCase().includes(kw))
        );
      });
    }

    // Map results and compute distance if coordinates are given
    let mappedResults: SearchResultItem[] = items.map((doc: any) => {
      let distanceKm: number | undefined;
      const userLat = params.lat;
      const userLng = params.lng;

      if (userLat && userLng) {
        const docLat = doc.latitude || 28.6139;
        const docLng = doc.longitude || 77.209;
        distanceKm = this.calculateHaversineDistance(userLat, userLng, docLat, docLng);
      }

      return {
        _id: String(doc._id || doc.id || doc.slug),
        id: String(doc._id || doc.id || doc.slug),
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        shortDescription: doc.shortDescription,
        category: doc.category,
        categories: doc.categories,
        location: doc.location || { type: 'Point', coordinates: [doc.longitude || 77.209, doc.latitude || 28.6139] },
        address: doc.address,
        locality: doc.locality,
        city: doc.city,
        state: doc.state || 'Delhi',
        country: doc.country || 'India',
        pincode: doc.pincode,
        latitude: doc.latitude || 28.6139,
        longitude: doc.longitude || 77.209,
        phone: doc.phone,
        email: doc.email,
        website: doc.website,
        images: doc.images || [],
        logo: doc.logo,
        priceRange: doc.priceRange || 'MODERATE',
        rating: doc.rating || 4.5,
        reviewCount: doc.reviewCount || 10,
        tags: doc.tags || [],
        amenities: doc.amenities || [],
        features: doc.features || [],
        openingHours: doc.openingHours,
        verified: Boolean(doc.verified),
        claimed: Boolean(doc.claimed),
        distanceKm,
      };
    });

    // Distance Radius Filter
    if (params.lat && params.lng && params.radius) {
      mappedResults = mappedResults.filter((b) => (b.distanceKm || 0) <= (params.radius || 25));
    }

    // Apply Sorting / Ranking
    if (sort === 'recommended' || sort === 'popularity') {
      mappedResults = RankingService.rankBusinesses(mappedResults, {
        userLat: params.lat,
        userLng: params.lng,
        intent: parsedQuery.intent,
      });
    } else if (sort === 'distance') {
      mappedResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else if (sort === 'rating') {
      mappedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'reviews') {
      mappedResults.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else if (sort === 'price_asc') {
      const priceOrder: Record<string, number> = { BUDGET: 1, MODERATE: 2, PREMIUM: 3, LUXURY: 4 };
      mappedResults.sort((a, b) => (priceOrder[a.priceRange] || 2) - (priceOrder[b.priceRange] || 2));
    } else if (sort === 'price_desc') {
      const priceOrder: Record<string, number> = { BUDGET: 1, MODERATE: 2, PREMIUM: 3, LUXURY: 4 };
      mappedResults.sort((a, b) => (priceOrder[b.priceRange] || 2) - (priceOrder[a.priceRange] || 2));
    }

    const total = mappedResults.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = mappedResults.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      parsedQuery,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filtersApplied: {
        category: params.category || parsedQuery.category,
        locality: params.locality || parsedQuery.locality,
        city: params.city || parsedQuery.city,
        rating: params.rating || parsedQuery.minRating,
        priceRange: params.priceRange || parsedQuery.priceRange,
        hasLocation: Boolean(params.lat && params.lng),
        radiusKm: params.radius,
        sort,
      },
      meta: {
        executionTimeMs: Date.now() - startTime,
        source: 'seed_in_memory',
      },
    };
  }

  /**
   * Search suggestions for debounced auto-complete
   */
  public static async getSuggestions(query: string): Promise<SearchSuggestions> {
    const q = (query || '').trim().toLowerCase();

    const popularSearches = [
      'Best cafes in Delhi',
      'Best momos in Majnu Ka Tilla',
      'Laptop repair Nehru Place',
      'Hostels near JNU & North Campus',
      'Rooftop cafes Connaught Place',
      'Affordable street food Chandni Chowk',
      'Quiet study cafes with WiFi',
      '24/7 Gyms in South Delhi',
      'Historical monuments Hauz Khas',
    ];

    if (!q) {
      return {
        businesses: [],
        categories: Array.from(SeedService.inMemoryCategories.values())
          .slice(0, 6)
          .map((c) => ({ name: c.name, slug: c.slug, icon: c.icon })),
        locations: Array.from(SeedService.inMemoryLocations.values())
          .slice(0, 6)
          .map((l) => ({ name: l.name, slug: l.slug, type: l.type })),
        popularSearches: popularSearches.slice(0, 5),
      };
    }

    // 1. Match Businesses
    const matchingBusinesses: SearchSuggestions['businesses'] = [];
    const allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
    for (const b of allBusinesses) {
      if (
        b.name?.toLowerCase().includes(q) ||
        b.locality?.toLowerCase().includes(q) ||
        (b.tags || []).some((t: string) => t.toLowerCase().includes(q))
      ) {
        matchingBusinesses.push({
          name: b.name,
          slug: b.slug,
          locality: b.locality,
          categoryName: typeof b.category === 'object' ? (b.category as any)?.name : undefined,
        });
      }
      if (matchingBusinesses.length >= 5) break;
    }

    // 2. Match Categories
    const matchingCategories: SearchSuggestions['categories'] = [];
    const allCategories = Array.from(SeedService.inMemoryCategories.values());
    for (const c of allCategories) {
      if (c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q)) {
        matchingCategories.push({
          name: c.name,
          slug: c.slug,
          icon: c.icon,
        });
      }
      if (matchingCategories.length >= 4) break;
    }

    // 3. Match Locations
    const matchingLocations: SearchSuggestions['locations'] = [];
    const allLocations = Array.from(SeedService.inMemoryLocations.values());
    for (const l of allLocations) {
      if (l.name?.toLowerCase().includes(q) || l.slug?.toLowerCase().includes(q)) {
        matchingLocations.push({
          name: l.name,
          slug: l.slug,
          type: l.type,
        });
      }
      if (matchingLocations.length >= 4) break;
    }

    // 4. Match Popular Searches
    const filteredPopular = popularSearches.filter((p) => p.toLowerCase().includes(q));

    return {
      businesses: matchingBusinesses,
      categories: matchingCategories,
      locations: matchingLocations,
      popularSearches: filteredPopular.length > 0 ? filteredPopular : popularSearches.slice(0, 4),
    };
  }

  /**
   * Logs search query for anonymous analytics (no PII)
   */
  private static async logSearchQuery(
    params: SearchParams,
    parsed: ParsedSearchQuery,
    resultCount: number,
    executionTimeMs: number
  ): Promise<void> {
    if (!params.q && !params.category && !params.locality) return;

    try {
      if (dbConnection.getStatus().isConnected) {
        await SearchQuery.create({
          query: params.q || `${params.category || ''} ${params.locality || ''}`.trim(),
          category: params.category || parsed.category || '',
          locality: params.locality || parsed.locality || '',
          city: params.city || parsed.city || 'Delhi',
          intent: parsed.intent || 'STANDARD',
          resultCount,
          hasFilters: Boolean(params.rating || params.priceRange || params.tags || params.lat),
          filtersUsed: {
            rating: params.rating,
            priceRange: params.priceRange,
            radius: params.radius,
            sort: params.sort,
          },
          executionTimeMs,
        });
      }
    } catch {
      // Non-blocking catch
    }
  }
}
