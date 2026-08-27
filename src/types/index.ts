export type UserRole = 'USER' | 'BUSINESS_OWNER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  _id?: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  city?: string;
  isActive?: boolean;
  savedSpots?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthResponseData;
}

export type PriceRange = 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
export type BusinessStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'ARCHIVED';

export interface Category {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  iconName?: string;
  color?: string;
  gradient?: string;
  image: string;
  parent?: string | { _id: string; name: string; slug: string; icon?: string } | null;
  type: 'ROOT' | 'SUBCATEGORY' | 'LEAF';
  isActive: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  subcategories?: Category[];
  businessCount?: number;
  countLabel?: string;
  searchPhrases?: string[];
}

export type LocationType =
  | 'COUNTRY'
  | 'STATE'
  | 'DISTRICT'
  | 'CITY'
  | 'LOCALITY'
  | 'NEIGHBORHOOD';

export type LocationStatus = 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE';

export interface LocationItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  type: LocationType;
  status?: LocationStatus;
  parent?: string | { _id: string; name: string; slug: string } | null;
  country: string;
  countrySlug?: string;
  state: string;
  stateSlug?: string;
  district?: string;
  districtSlug?: string;
  city: string;
  citySlug?: string;
  locality?: string;
  neighborhood?: string;
  shortCode?: string;
  latitude: number;
  longitude: number;
  pincode: string;
  isActive: boolean;
  readinessScore?: number;
  waitlistCount?: number;
  description?: string;
  image?: string;
  bannerImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  businessCount?: number;
  highlights?: string[];
  popularCategories?: string[];
  nearbyLocalities?: Array<{ name: string; slug: string; distance: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  relatedGuides?: Array<{ title: string; slug: string }>;
  metroConnectivity?: string;
}

export interface PlaceAccessibility {
  wheelchairAccessible: boolean;
  elevator?: boolean;
  groundFloor?: boolean;
  notes?: string;
}

export interface PlaceParking {
  available: boolean;
  type?: 'VALET' | 'STREET' | 'DEDICATED_LOT' | 'MALL_PARKING' | 'NONE' | string;
  valet?: boolean;
  notes?: string;
}

export interface PlaceTransport {
  metroNearby?: string;
  metroLine?: string;
  walkingDistance?: string;
  busStop?: string;
  autoStand?: string;
}

export interface PlaceAISummary {
  whyVisit?: string;
  bestFor?: string | string[];
  whatToExpect?: string;
  generatedAt?: string;
}

export interface PlaceSourceRef {
  name: string;
  url?: string;
  verified: boolean;
  license?: string;
  note?: string;
}

export interface PlaceIntelligence {
  highlights?: string[];
  bestFor?: string[];
  popularItems?: string[];
  priceLevel?: string;
  ambience?: string[];
  amenities?: string[];
  goodFor?: string[];
  nearbyAttractions?: Array<{ name: string; distance: string; type?: string }>;
  recommendedDuration?: string;
  bestTimeToVisit?: string;
  accessibility?: PlaceAccessibility;
  parking?: PlaceParking;
  transport?: PlaceTransport;
  metroNearby?: string;
  aiSummary?: PlaceAISummary;
  sources?: PlaceSourceRef[];
}

export interface GalleryItem {
  url: string;
  caption?: string;
  isHero?: boolean;
  sourceAttribution?: string;
}

export interface Business {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category | string;
  categoryDetails?: Category;
  categories?: (Category | string)[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  // Image Pipeline (Phase 16)
  coverImage?: string;
  thumbnail?: string;
  gallery?: (GalleryItem | string)[];
  images: string[];
  logo?: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  tags: string[];
  amenities: string[];
  features: string[];
  openingHours?: Record<string, string> | Array<{ day: string; open: string; close: string; isClosed?: boolean }>;
  verified: boolean;
  claimed: boolean;
  owner?: User | string | null;
  status: BusinessStatus;
  distanceKm?: number;
  popularity?: number;
  rankingScore?: number;
  // Place Intelligence (Phase 16)
  placeIntelligence?: PlaceIntelligence;
  // Source Tracking & Freshness (Phase 15)
  source?: string;
  sourceUrl?: string;
  sourceType?: 'API' | 'SCRAPER' | 'RSS' | 'WEB_SEARCH' | 'MANUAL' | 'DIRECT';
  lastUpdated?: string;
  lastVerified?: string;
  freshnessStatus?: 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface AskAboutPlaceResponse {
  question: string;
  answer: string;
  businessName: string;
  highlights: string[];
  sources: PlaceSourceRef[];
  confidence: 'HIGH' | 'MEDIUM';
  groundedWithWeb: boolean;
  fallbackUsed: boolean;
  latencyMs: number;
}

export type FreshnessStatus = 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED';

export interface FreshnessInfo {
  status: FreshnessStatus;
  label: string;
  formattedTime: string;
  isFresh: boolean;
  color: string;
}

export type DataSourceType = 'API' | 'SCRAPER' | 'RSS' | 'WEB_SEARCH' | 'MANUAL';
export type DataSourceStatus = 'ACTIVE' | 'PAUSED' | 'FAILED' | 'DISABLED';

export interface RateLimitConfig {
  requestDelayMs: number;
  maxRequestsPerRun: number;
  retryLimit: number;
  backoffFactor: number;
}

export interface DataSourceItem {
  _id: string;
  name: string;
  slug: string;
  type: DataSourceType;
  categorySlug?: string;
  baseUrl: string;
  sourceUrl: string;
  status: DataSourceStatus;
  lastRun?: string | null;
  nextRun?: string | null;
  lastSuccess?: string | null;
  lastFailure?: string | null;
  itemsProcessed: number;
  itemsUpdated: number;
  errorCount: number;
  rateLimit: RateLimitConfig;
  scheduleIntervalMinutes: number;
  lastError?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DataSourcesStats {
  totalSources: number;
  activeSources: number;
  totalProcessed: number;
  totalUpdated: number;
  totalErrors: number;
  freshnessBreakdown: {
    fresh: number;
    recent: number;
    stale: number;
    expired: number;
    total: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BusinessListResponse {
  success: boolean;
  data: Business[];
  pagination: PaginationMeta;
  location?: LocationItem;
}

export interface SingleBusinessResponse {
  success: boolean;
  data: Business;
}

export interface CategoryListResponse {
  success: boolean;
  count: number;
  data: Category[];
}

export interface LocationListResponse {
  success: boolean;
  count: number;
  data: LocationItem[];
}

export type SearchIntent =
  | 'BEST'
  | 'TOP'
  | 'CHEAP'
  | 'NEAR_ME'
  | 'NEAR_LOCATION'
  | 'UNDER_PRICE'
  | 'OPEN_NOW'
  | 'FOR_COUPLES'
  | 'FOR_STUDENTS'
  | 'FOR_FAMILIES'
  | 'FOR_FRIENDS'
  | 'FOR_SOLO'
  | 'TRENDING'
  | 'POPULAR'
  | 'HIDDEN_GEM'
  | 'STANDARD';

export interface ParsedSearchQuery {
  originalQuery: string;
  cleanedQuery: string;
  intent: SearchIntent;
  category?: string;
  locality?: string;
  city?: string;
  priceRange?: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
  priceMax?: number;
  priceMin?: number;
  minRating?: number;
  openNow?: boolean;
  isNearMe?: boolean;
  nearLocationTarget?: string;
  tags: string[];
  amenities: string[];
  confidence: number;
}

export interface SearchFiltersApplied {
  category?: string;
  locality?: string;
  city?: string;
  rating?: number;
  priceRange?: string;
  hasLocation: boolean;
  radiusKm?: number;
  sort: string;
}

export interface SearchApiResponse {
  success: boolean;
  message?: string;
  data: Business[];
  parsedQuery: ParsedSearchQuery;
  pagination: PaginationMeta;
  filtersApplied: SearchFiltersApplied;
  meta?: {
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

export interface SearchSuggestionsResponse {
  success: boolean;
  data: SearchSuggestions;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  data?: {
    status: string;
    database?: {
      isConnected: boolean;
      state: string;
      mode: string;
      message?: string;
    };
    version: string;
  };
}

export interface ReviewResponseAuthor {
  _id: string;
  name: string;
  avatar?: string;
  username?: string;
  role?: string;
}

export interface ReviewBusinessResponse {
  comment: string;
  respondedAt: string;
  respondedBy: string;
}

export interface Review {
  _id: string;
  id?: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  visitDate?: string;
  business: string | Business;
  businessName?: string;
  businessSlug?: string;
  user: ReviewResponseAuthor;
  likes: string[];
  likeCount: number;
  isReported?: boolean;
  response?: ReviewBusinessResponse;
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewStats {
  total: number;
  average: number;
  breakdown: RatingBreakdown;
}

export interface ReviewListResponse {
  success: boolean;
  data: Review[];
  stats: ReviewStats;
  pagination: PaginationMeta;
}

export type CollectionVisibility = 'PUBLIC' | 'PRIVATE';

export interface SpotCollection {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  visibility: CollectionVisibility;
  owner: {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  items: Business[];
  itemIds?: string[];
  itemCount: number;
  likes?: string[];
  isCurated?: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportTargetType = 'BUSINESS' | 'REVIEW' | 'PHOTO' | 'COLLECTION' | 'USER' | 'CONTENT';
export type ReportReason =
  | 'SPAM_OR_FAKE'
  | 'INAPPROPRIATE_CONTENT'
  | 'OUTDATED_OR_CLOSED'
  | 'INCORRECT_LOCATION'
  | 'HARASSMENT'
  | 'COPYRIGHT'
  | 'OTHER';
export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export interface ReportItem {
  _id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  reason: ReportReason;
  details: string;
  reporter?: {
    _id: string;
    name: string;
    email: string;
  };
  reporterEmail?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
}

export type NotificationType =
  | 'REVIEW_RESPONSE'
  | 'REVIEW_LIKED'
  | 'COLLECTION_SAVED'
  | 'BUSINESS_VERIFIED'
  | 'SYSTEM_ALERT';

export interface UserNotification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type RankingMethodType =
  | 'rating'
  | 'reviewCount'
  | 'popularity'
  | 'distance'
  | 'engagement'
  | 'newest'
  | 'custom';

export interface SEOContentSection {
  title: string;
  body: string;
  bulletPoints?: string[];
}

export interface SEOFaq {
  question: string;
  answer: string;
}

export interface SEOPageFilters {
  priceRange?: string[];
  amenities?: string[];
  tags?: string[];
  minRating?: number;
  dietaryOptions?: string[];
}

export interface SEOPage {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription: string;
  h1: string;
  intro: string;
  category?: string;
  location?: string;
  locality?: string;
  intent?: string;
  filters?: SEOPageFilters;
  rankingMethod: RankingMethodType;
  contentSections: SEOContentSection[];
  faq: SEOFaq[];
  relatedPages: string[];
  relatedCategories?: string[];
  relatedLocations?: string[];
  published: boolean;
  isIndexed?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  top10?: (Business & { rankingScore?: number; rank?: number })[];
  stats?: {
    avgRating: number;
    totalReviews: number;
    verifiedCount: number;
    localities: string[];
    generatedAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  locations: string[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  publishedAt?: string;
  readingTimeMinutes: number;
  featured: boolean;
  relatedBusinesses?: Business[];
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// Phase 10: Events, Offers, Jobs & Specialized Discovery
// ----------------------------------------------------

export type EventCategoryType =
  | 'Concert'
  | 'Comedy'
  | 'Theatre'
  | 'Exhibition'
  | 'Workshop'
  | 'Hackathon'
  | 'Tech'
  | 'Startup'
  | 'Food Festival'
  | 'Cultural';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface EventItem {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  category: EventCategoryType | string;
  venue: string;
  location: {
    address?: string;
    locality: string;
    city: string;
    coordinates?: [number, number];
  };
  startDate: string;
  endDate: string;
  ticketPrice: string | number;
  bookingUrl?: string;
  organizer: string;
  tags: string[];
  featured?: boolean;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type JobType = 'Internship' | 'Part-time' | 'Full-time' | 'Freelance';

export interface JobItem {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  description: string;
  location: string;
  type: JobType;
  salary: string;
  skills: string[];
  experience: string;
  applyUrl: string;
  deadline: string;
  tags: string[];
  featured?: boolean;
  status: 'ACTIVE' | 'CLOSED';
  createdAt?: string;
  updatedAt?: string;
}

export interface OfferItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  business: {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    locality?: string;
    city?: string;
    rating?: number;
    image?: string;
    images?: string[];
    address?: string;
  } | any;
  discount: string;
  couponCode: string;
  validFrom: string;
  validUntil: string;
  terms: string[];
  status?: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  isActive: boolean;
  claimedCount?: number;
  featured?: boolean;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type SpecialIntentType =
  | 'couples'
  | 'families'
  | 'friends'
  | 'solo'
  | 'students'
  | 'budget'
  | 'luxury'
  | 'hidden-gems';

export interface SpecialDiscoveryData {
  intent: SpecialIntentType;
  meta: {
    title: string;
    tagline: string;
    curatorNote: string;
    recommendedTags: string[];
  };
  items: Business[];
  total: number;
}

// ----------------------------------------------------
// Phase 11: AI Search, Analytics & Personalization
// ----------------------------------------------------

export interface StructuredSearchCriteria {
  category?: string;
  subcategory?: string;
  locality?: string;
  city?: string;
  priceMax?: number;
  priceMin?: number;
  priceRange?: PriceRange;
  minRating?: number;
  openNow?: boolean;
  amenities: string[];
  tags: string[];
  intent: string;
  cleanedQuery?: string;
  confidence: number;
  explanation?: string;
  provider: string;
  rawAnalysis?: string;
}

export interface AISearchApiResponse extends SearchApiResponse {
  aiCriteria: StructuredSearchCriteria;
  aiMetadata: {
    providerUsed: string;
    fallbackUsed: boolean;
    aiExecutionTimeMs: number;
  };
}

export interface WebSourceCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface AskSpotPicksData {
  question: string;
  answer: string;
  criteria?: StructuredSearchCriteria;
  recommendedBusinesses: Business[];
  totalMatches: number;
  sources: WebSourceCitation[];
  groundedWithWeb: boolean;
  fallbackUsed: boolean;
  latencyMs: number;
  disclaimer?: string;
}

export interface AskSpotPicksResponse {
  success: boolean;
  message?: string;
  data: AskSpotPicksData;
}

export interface TrendingSearchItem {
  query: string;
  count: number;
  category?: string;
  locality?: string;
  trend: 'up' | 'stable' | 'hot';
}

export interface TrendingBusinessItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
  locality?: string;
  rating?: number;
  score: number;
  badge?: string;
  image?: string;
}

export interface TrendingCategoryItem {
  name: string;
  slug: string;
  searchCount: number;
  icon?: string;
  image?: string;
}

export interface TrendingData {
  businesses: TrendingBusinessItem[];
  searches: TrendingSearchItem[];
  categories: TrendingCategoryItem[];
}

export interface UserPreferencesProfile {
  recentlyViewed?: Array<{ id: string; category?: string; locality?: string; priceRange?: string; timestamp?: number }>;
  savedCategories?: string[];
  favoriteLocations?: string[];
  preferredPriceRanges?: string[];
  searchHistory?: string[];
}

export interface PersonalizedRecommendationsResponse {
  isPersonalized: boolean;
  confidenceScore: number;
  reason: string;
  items: any[];
}

export interface AdminSearchAnalyticsData {
  summary: {
    totalSearches: number;
    totalClicks: number;
    ctr: string;
    avgResponseTimeMs: number;
    totalZeroResultSearches: number;
    aiSearchesCount: number;
    aiSuccessRate: string;
  };
  dailySearches: Array<{
    date: string;
    searches: number;
    zeroResults: number;
    avgLatencyMs: number;
  }>;
  popularSearches: Array<{
    query: string;
    count: number;
    category?: string;
    location?: string;
    clickRate: string;
    resultCount: number;
  }>;
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  topLocations: Array<{
    name: string;
    searches: number;
    businesses: number;
  }>;
  zeroResultQueries: Array<{
    query: string;
    count: number;
    potentialCategory: string;
    seoOpportunity: string;
  }>;
  mostViewedBusinesses: Array<{
    name: string;
    locality: string;
    views: number;
    saves: number;
    rating: number;
  }>;
}



