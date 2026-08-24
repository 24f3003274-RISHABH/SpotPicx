import { apiClient } from '../api/apiClient';
import {
  SearchApiResponse,
  SearchSuggestionsResponse,
  ParsedSearchQuery,
  AISearchApiResponse,
  AskSpotPicksResponse,
  AskSpotPicksData,
  TrendingData,
  UserPreferencesProfile,
  PersonalizedRecommendationsResponse,
  AdminSearchAnalyticsData,
} from '../types';

export interface SearchQueryOptions {
  q?: string;
  category?: string;
  subcategory?: string;
  city?: string;
  locality?: string;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  priceRange?: string;
  tags?: string[];
  amenities?: string[];
  openNow?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  sort?: string;
  page?: number;
  limit?: number;
  useAI?: boolean;
}

/**
 * Search and Intelligence Client Service
 * Connects the React application with SpotPicks deterministic engine,
 * server-side Gemini 3.7 AI extraction layer, analytics tracking, and personalization.
 */
export const searchService = {
  /**
   * "Ask SpotPicks" conversational answering & discovery API
   * Answers natural language questions using server-side Gemini 3.7 with database-first verified context & web grounding.
   */
  async askSpotPicks(
    question: string,
    options: { city?: string; lat?: number; lng?: number } = {}
  ): Promise<AskSpotPicksData> {
    const response = await apiClient.post<AskSpotPicksResponse>('/search/ask', {
      question,
      city: options.city || 'Delhi',
      lat: options.lat,
      lng: options.lng,
    });
    return (response as any).data;
  },

  /**
   * Execute standard unified search (supports query parameters, geo-filtering, facets)
   */
  async search(options: SearchQueryOptions): Promise<SearchApiResponse> {
    const params = new URLSearchParams();

    if (options.q) params.set('q', options.q);
    if (options.category && options.category !== 'All') params.set('category', options.category);
    if (options.subcategory) params.set('subcategory', options.subcategory);
    if (options.city && options.city !== 'All') params.set('city', options.city);
    if (options.locality && options.locality !== 'All') params.set('locality', options.locality);
    if (options.rating && options.rating > 0) params.set('rating', String(options.rating));
    if (options.priceRange) params.set('priceRange', options.priceRange);
    if (options.priceMax) params.set('priceMax', String(options.priceMax));
    if (options.priceMin) params.set('priceMin', String(options.priceMin));
    if (options.openNow) params.set('openNow', 'true');
    if (options.useAI) params.set('useAI', 'true');
    if (options.lat && options.lng) {
      params.set('lat', String(options.lat));
      params.set('lng', String(options.lng));
      if (options.radius) params.set('radius', String(options.radius));
    }
    if (options.tags && options.tags.length > 0) {
      params.set('tags', options.tags.join(','));
    }
    if (options.amenities && options.amenities.length > 0) {
      params.set('amenities', options.amenities.join(','));
    }
    if (options.sort) params.set('sort', options.sort);
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));

    const response = await apiClient.get<SearchApiResponse>(`/search?${params.toString()}`);
    return response as any;
  },

  /**
   * Execute natural language AI-assisted search
   * Example: "Find me a quiet cafe near JNU where I can work with WiFi under ₹500"
   */
  async searchWithAI(
    query: string,
    filters: Partial<SearchQueryOptions> = {},
    provider: string = 'gemini'
  ): Promise<AISearchApiResponse> {
    const response = await apiClient.post<AISearchApiResponse>('/search/ai', {
      query,
      filters,
      provider,
    });
    return response as any;
  },

  /**
   * Fetch debounced auto-complete suggestions
   */
  async getSuggestions(query: string): Promise<SearchSuggestionsResponse['data']> {
    const response = await apiClient.get<SearchSuggestionsResponse>(
      `/search/suggestions?q=${encodeURIComponent(query)}`
    );
    return (response as any).data;
  },

  /**
   * Parse search query string with deterministic regex/keyword parser
   */
  async parseQuery(query: string): Promise<ParsedSearchQuery> {
    const response = await apiClient.get<{ success: boolean; data: ParsedSearchQuery }>(
      `/search/parse?q=${encodeURIComponent(query)}`
    );
    return (response as any).data;
  },

  /**
   * Track click-through on search result items to power ranking and CTR metrics
   */
  async trackClick(data: {
    query: string;
    businessId: string;
    businessName?: string;
    position?: number;
    sessionId?: string;
    page?: number;
  }): Promise<void> {
    try {
      await apiClient.post('/search/track-click', data);
    } catch {
      // Fire-and-forget telemetry logging
    }
  },

  /**
   * Retrieve trending searches, businesses, and categories
   */
  async getTrending(): Promise<TrendingData> {
    const response = await apiClient.get<{ success: boolean; data: TrendingData }>('/search/trending');
    return (response as any).data;
  },

  /**
   * Retrieve personalized recommendations based on client preference profile
   */
  async getPersonalized(
    profile: UserPreferencesProfile,
    limit: number = 8
  ): Promise<PersonalizedRecommendationsResponse> {
    const response = await apiClient.post<{ success: boolean; data: PersonalizedRecommendationsResponse }>(
      `/search/personalization?limit=${limit}`,
      profile
    );
    return (response as any).data;
  },

  /**
   * Fetch Admin Search & Intelligence analytics dashboard data
   */
  async getAdminSearchAnalytics(): Promise<AdminSearchAnalyticsData> {
    const response = await apiClient.get<{ success: boolean; data: AdminSearchAnalyticsData }>(
      '/search/analytics/admin'
    );
    return (response as any).data;
  },
};
