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

export interface LocationItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  type: 'COUNTRY' | 'STATE' | 'CITY' | 'LOCALITY';
  parent?: string | { _id: string; name: string; slug: string } | null;
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  pincode: string;
  isActive: boolean;
  description?: string;
  image?: string;
  businessCount?: number;
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
  images: string[];
  logo?: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  tags: string[];
  amenities: string[];
  features: string[];
  openingHours?: Record<string, string>;
  verified: boolean;
  claimed: boolean;
  owner?: User | string | null;
  status: BusinessStatus;
  distanceKm?: number;
  rankingScore?: number;
  createdAt: string;
  updatedAt: string;
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
