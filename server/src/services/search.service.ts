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
  private static readonly KNOWN_CITIES = new Set([
    'delhi', 'delhi ncr', 'new delhi', 'ncr', 'mumbai', 'bangalore', 'bengaluru',
    'kolkata', 'hyderabad', 'chennai', 'pune', 'jaipur', 'dehradun', 'goa',
    'chandigarh', 'ahmedabad', 'lucknow', 'noida', 'gurugram', 'gurgaon', 'faridabad', 'ghaziabad'
  ]);

  private static readonly LOCALITY_SYNONYMS: Record<string, string[]> = {
    'old delhi': ['old delhi', 'chandni chowk', 'daryaganj', 'jama masjid', 'chawri bazar', 'red fort'],
    'chandni chowk': ['chandni chowk', 'old delhi', 'jama masjid', 'chawri bazar'],
    'connaught place': ['connaught place', 'cp', 'rajiv chowk', 'janpath', 'inner circle', 'outer circle'],
    'majnu ka tilla': ['majnu ka tilla', 'aruna nagar', 'tibetan colony', 'mkt'],
    'hauz khas': ['hauz khas', 'hauz khas village', 'hkv', 'green park', 'deer park'],
    'gtb nagar': ['gtb nagar', 'hudson lane', 'north campus', 'delhi university', 'kamla nagar'],
    'nehru place': ['nehru place', 'kalkaji', 'cr park'],
    'saket': ['saket', 'saidulajab', 'champa gali'],
    'south delhi': ['saket', 'hauz khas', 'south extension', 'greater kailash', 'gk', 'lajpat nagar', 'green park'],
    'north campus': ['gtb nagar', 'hudson lane', 'kamla nagar', 'vishwavidyalaya', 'malka ganj'],
  };

  private static readonly CATEGORY_ALIAS_MAP: Record<string, string[]> = {
    'cafes-bakeries': ['cafes-bakeries', 'food-dining', 'food-and-cafes'],
    'cafes': ['cafes-bakeries', 'food-dining', 'food-and-cafes'],
    'street-food': ['street-food', 'food-dining', 'food-and-cafes', 'restaurants'],
    'food-dining': ['food-dining', 'food-and-cafes', 'cafes-bakeries', 'street-food', 'restaurants', 'nightlife-bars'],
    'food-and-cafes': ['food-dining', 'food-and-cafes', 'cafes-bakeries', 'street-food', 'restaurants', 'nightlife-bars'],
    'restaurants': ['restaurants', 'food-dining', 'food-and-cafes'],
    'nightlife-bars': ['nightlife-bars', 'food-dining', 'food-and-cafes'],
    'pgs-hostels': ['pgs-hostels', 'stays-living', 'hotels-and-pgs', 'hotels'],
    'stays-living': ['stays-living', 'hotels-and-pgs', 'pgs-hostels', 'hotels'],
    'hotels-and-pgs': ['stays-living', 'hotels-and-pgs', 'pgs-hostels', 'hotels'],
    'hotels': ['hotels', 'stays-living', 'hotels-and-pgs', 'pgs-hostels'],
    'services-repairs': ['services-repairs', 'repair-and-services', 'laptop-mobile-repair', 'salons-spas', 'gyms-fitness'],
    'repair-and-services': ['services-repairs', 'repair-and-services', 'laptop-mobile-repair', 'salons-spas', 'gyms-fitness'],
    'laptop-mobile-repair': ['laptop-mobile-repair', 'services-repairs', 'repair-and-services'],
    'historical-monuments': ['historical-monuments', 'places-visit', 'places-and-heritage'],
    'parks-gardens': ['parks-gardens', 'places-visit', 'places-and-heritage'],
    'places-visit': ['places-visit', 'places-and-heritage', 'historical-monuments', 'parks-gardens'],
    'places-and-heritage': ['places-visit', 'places-and-heritage', 'historical-monuments', 'parks-gardens'],
    'shopping-markets': ['shopping-markets', 'shopping-and-retail', 'electronics-gadgets', 'apparel-ethnic', 'books-stationery'],
    'shopping-and-retail': ['shopping-markets', 'shopping-and-retail', 'electronics-gadgets', 'apparel-ethnic', 'books-stationery'],
    'gyms-fitness': ['gyms-fitness', 'services-repairs'],
    'education-coaching': ['education-coaching', 'coaching-institutes'],
  };

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
    categoryIds?: mongoose.Types.ObjectId[],
    options: { relaxRating?: boolean; relaxLocality?: boolean; relaxTags?: boolean } = {}
  ): Record<string, any> {
    const query: Record<string, any> = {
      status: { $nin: ['REJECTED', 'ARCHIVED', 'DELETED', 'PENDING_REVIEW', 'DRAFT'] },
    };

    // 1. Category Filter: explicit param or parsed intent
    if (categoryIds && categoryIds.length > 0) {
      query.$or = [
        { category: { $in: categoryIds } },
        { categories: { $in: categoryIds } },
      ];
    }

    // 2. City & Locality Filter Normalization
    let rawLocality = params.locality || (!params.category ? parsedQuery.locality : undefined);
    let rawCity = params.city || parsedQuery.city || 'Delhi';

    // If locality passed is actually a city name (e.g. 'Delhi', 'Delhi NCR'), treat it as city
    if (rawLocality && this.KNOWN_CITIES.has(rawLocality.trim().toLowerCase())) {
      rawCity = rawLocality.trim();
      rawLocality = undefined;
    }

    // Apply City Filter
    if (rawCity && rawCity !== 'All') {
      const cityRegex = new RegExp(`(${rawCity}|Delhi NCR|NCR|New Delhi)`, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ city: cityRegex }, { state: cityRegex }, { address: cityRegex }],
      });
    }

    // Apply Locality Filter (if not relaxed by fallback)
    if (!options.relaxLocality && rawLocality && rawLocality !== 'All') {
      const locKey = rawLocality.trim().toLowerCase();
      const synonyms = this.LOCALITY_SYNONYMS[locKey] || [rawLocality.trim()];
      const locRegex = new RegExp(synonyms.join('|'), 'i');

      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { locality: locRegex },
          { address: locRegex },
          { name: locRegex },
          { description: locRegex },
        ],
      });
    }

    // 3. Rating Filter (only if explicit and not relaxed)
    const minRating = !options.relaxRating ? (params.rating || (params.sort === 'rating' ? 4.0 : undefined)) : undefined;
    if (minRating && minRating > 0) {
      query.rating = { $gte: Number(minRating) };
    }

    // 4. Price Tier Filter
    const priceRange = params.priceRange || parsedQuery.priceRange;
    if (priceRange) {
      query.priceRange = priceRange;
    }

    // 5. Tags Filter (if not relaxed)
    if (!options.relaxTags) {
      const tagsParam = Array.isArray(params.tags)
        ? params.tags
        : params.tags
        ? params.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      if (tagsParam.length > 0) {
        query.tags = { $in: tagsParam.map((t) => new RegExp(t, 'i')) };
      }
    }

    // 6. Amenities Filter
    const amenitiesParam = Array.isArray(params.amenities)
      ? params.amenities
      : params.amenities
      ? params.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      : [];
    if (amenitiesParam.length > 0) {
      query.amenities = { $in: amenitiesParam.map((a) => new RegExp(a, 'i')) };
    }

    // 7. Full-Text Search / Keyword Regex (Smart Non-Blocking Tokens)
    const rawQ = params.q?.trim();
    if (rawQ && rawQ.length > 0) {
      const stopWords = new Set([
        'best', 'top', 'under', 'places', 'place', 'spots', 'spot', 'in', 'at',
        'near', 'around', 'for', 'with', 'of', 'delhi', 'ncr', 'the', 'a', 'an',
        'good', 'show', 'find', 'me', 'to', 'visit', 'all', 'great', 'popular',
        'cafes', 'cafe', 'momo', 'momos', 'street food', 'pg', 'pgs', 'hostel',
        'hostels', 'repair', 'repairs', 'monument', 'monuments', 'heritage',
      ]);

      const tokens = rawQ
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 3 && !stopWords.has(w));

      // Only add text constraint if specific non-category distinguishing tokens remain (e.g. "wifi", "rooftop", "macbook", "tandoori", "champa", "ama")
      if (tokens.length > 0) {
        const tokenRegexes = tokens.map((t) => new RegExp(t, 'i'));
        const textOrConditions = tokenRegexes.map((regex) => ({
          $or: [
            { name: regex },
            { description: regex },
            { shortDescription: regex },
            { tags: { $in: [regex] } },
            { amenities: { $in: [regex] } },
            { features: { $in: [regex] } },
            { locality: regex },
            { address: regex },
          ],
        }));

        query.$and = query.$and || [];
        query.$and.push(...textOrConditions);
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
   * MongoDB query execution implementation with Multi-Layer Fallbacks
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
    if (catSlug && catSlug !== 'All') {
      const slugsToFind = this.CATEGORY_ALIAS_MAP[catSlug] || [catSlug];
      const categoryDocs = await Category.find({
        $or: [
          { slug: { $in: slugsToFind } },
          { slug: new RegExp(catSlug.replace(/-/g, '.*'), 'i') },
        ],
      });

      for (const cd of categoryDocs) {
        categoryIds.push(cd._id as mongoose.Types.ObjectId);
        const subCats = await Category.find({ parent: cd._id }).select('_id');
        categoryIds.push(...subCats.map((sc) => sc._id as mongoose.Types.ObjectId));
      }
    }

    // Attempt 1: Strict Query
    let query = this.buildBusinessQuery(params, parsedQuery, categoryIds);
    let total = await Business.countDocuments(query);

    // Layered Fallback 1: Relax Rating & Tags if 0 results
    if (total === 0 && (params.rating || params.tags)) {
      query = this.buildBusinessQuery(params, parsedQuery, categoryIds, { relaxRating: true, relaxTags: true });
      total = await Business.countDocuments(query);
    }

    // Layered Fallback 2: Relax Locality to City-wide if 0 results
    if (total === 0 && params.locality) {
      query = this.buildBusinessQuery(params, parsedQuery, categoryIds, { relaxRating: true, relaxTags: true, relaxLocality: true });
      total = await Business.countDocuments(query);
    }

    // Layered Fallback 3: Search City-wide without Category restriction if still 0 results
    if (total === 0 && categoryIds.length > 0) {
      const broadParams = { ...params, category: undefined };
      const broadParsed = { ...parsedQuery, category: undefined };
      query = this.buildBusinessQuery(broadParams, broadParsed, undefined, { relaxRating: true, relaxTags: true, relaxLocality: true });
      total = await Business.countDocuments(query);
    }

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
    const allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());

    const executeFilter = (opts: { relaxRating?: boolean; relaxLocality?: boolean; relaxTags?: boolean; relaxCategory?: boolean }) => {
      let items = [...allBusinesses];

      // 1. Filter by Category
      const rawCatSlug = !opts.relaxCategory ? (params.category || parsedQuery.category) : undefined;
      if (rawCatSlug && rawCatSlug !== 'All') {
        const targetSlugs = this.CATEGORY_ALIAS_MAP[rawCatSlug] || [rawCatSlug];
        const matchCat = SeedService.inMemoryCategories.get(rawCatSlug);
        const subCatSlugs = Array.from(SeedService.inMemoryCategories.values())
          .filter((c) => c.parent === matchCat?._id || c.parent === matchCat?.slug)
          .map((c) => c.slug);
        const allowedCategories = new Set([...targetSlugs, ...subCatSlugs]);

        items = items.filter((b) => {
          const catSlug = b.categoryDetails?.slug || b.categorySlug || (typeof b.category === 'object' ? b.category?.slug : null);
          const allSlugs = Array.isArray(b.categorySlugs) ? b.categorySlugs : [];
          if (catSlug && allowedCategories.has(catSlug)) return true;
          if (allSlugs.some((s: string) => allowedCategories.has(s))) return true;
          return false;
        });
      }

      // 2. City & Locality Filter Normalization
      let rawLocality = !opts.relaxLocality ? (params.locality || (!params.category ? parsedQuery.locality : undefined)) : undefined;
      let rawCity = params.city || parsedQuery.city || 'Delhi';

      if (rawLocality && this.KNOWN_CITIES.has(rawLocality.trim().toLowerCase())) {
        rawCity = rawLocality.trim();
        rawLocality = undefined;
      }

      if (rawCity && rawCity !== 'All') {
        const cityRegex = new RegExp(`(${rawCity}|Delhi NCR|NCR|New Delhi)`, 'i');
        items = items.filter((b) => cityRegex.test(b.city) || cityRegex.test(b.state || '') || cityRegex.test(b.address || ''));
      }

      if (rawLocality && rawLocality !== 'All') {
        const locKey = rawLocality.trim().toLowerCase();
        const synonyms = this.LOCALITY_SYNONYMS[locKey] || [rawLocality.trim()];
        const locRegex = new RegExp(synonyms.join('|'), 'i');
        items = items.filter((b) => locRegex.test(b.locality) || locRegex.test(b.address) || locRegex.test(b.name) || locRegex.test(b.description));
      }

      // 3. Filter by Rating
      const minRating = !opts.relaxRating ? (params.rating || parsedQuery.minRating) : undefined;
      if (minRating && minRating > 0) {
        items = items.filter((b) => (b.rating || 0) >= Number(minRating));
      }

      // 4. Filter by Price Range
      const priceRange = params.priceRange || parsedQuery.priceRange;
      if (priceRange) {
        items = items.filter((b) => b.priceRange === priceRange);
      }

      // 5. Filter by Tags
      if (!opts.relaxTags) {
        const tagsParam = Array.isArray(params.tags)
          ? params.tags
          : params.tags
          ? params.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [];
        if (tagsParam.length > 0) {
          items = items.filter((b) => {
            const itemTags = (b.tags || []).map((t: string) => t.toLowerCase());
            return tagsParam.some((tag) => itemTags.some((it) => it.includes(tag.toLowerCase())));
          });
        }
      }

      // 6. Filter by Amenities
      const amenitiesParam = Array.isArray(params.amenities)
        ? params.amenities
        : params.amenities
        ? params.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
      if (amenitiesParam.length > 0) {
        items = items.filter((b) => {
          const itemAmenities = (b.amenities || []).map((a: string) => a.toLowerCase());
          return amenitiesParam.some((am) => itemAmenities.some((ia) => ia.includes(am.toLowerCase())));
        });
      }

      // 7. Keyword / Free-Text Filter (Robust multi-term matching without blocking category chips)
      const rawKeyword = params.q?.trim();
      if (rawKeyword && rawKeyword.length > 0) {
        const stopWords = new Set([
          'in', 'near', 'the', 'and', 'for', 'best', 'top', 'good', 'find', 'show',
          'delhi', 'ncr', 'places', 'place', 'spots', 'spot', 'with', 'under', 'to', 'visit',
          'cafes', 'cafe', 'momo', 'momos', 'street food', 'pg', 'pgs', 'hostel',
          'hostels', 'repair', 'repairs', 'monument', 'monuments', 'heritage',
        ]);
        const searchTerms = rawKeyword
          .toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 3 && !stopWords.has(w));

        if (searchTerms.length > 0) {
          items = items.filter((b) => {
            const searchableText = [
              b.name,
              b.description,
              b.shortDescription,
              b.locality,
              b.address,
              ...(b.tags || []),
              ...(b.amenities || []),
              ...(b.features || []),
              b.categoryDetails?.name,
              b.categoryDetails?.slug,
              ...(b.placeIntelligence?.popularItems || []),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchTerms.some((term) => searchableText.includes(term));
          });
        }
      }

      return items;
    };

    // Attempt 1: Strict filter
    let items = executeFilter({});

    // Fallback 1: Relax Rating & Tags
    if (items.length === 0 && (params.rating || params.tags)) {
      items = executeFilter({ relaxRating: true, relaxTags: true });
    }

    // Fallback 2: Relax Locality to City-wide
    if (items.length === 0 && params.locality) {
      items = executeFilter({ relaxRating: true, relaxTags: true, relaxLocality: true });
    }

    // Fallback 3: Relax Category to City-wide
    if (items.length === 0 && (params.category || parsedQuery.category)) {
      items = executeFilter({ relaxRating: true, relaxTags: true, relaxLocality: true, relaxCategory: true });
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
