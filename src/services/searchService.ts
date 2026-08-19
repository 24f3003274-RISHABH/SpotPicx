import { apiClient } from '../api/apiClient';
import { SearchApiResponse, SearchSuggestionsResponse, ParsedSearchQuery } from '../types';

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
}

export const searchService = {
  /**
   * Execute full unified search
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
   * Fetch debounced auto-complete suggestions
   */
  async getSuggestions(query: string): Promise<SearchSuggestionsResponse['data']> {
    const response = await apiClient.get<SearchSuggestionsResponse>(
      `/search/suggestions?q=${encodeURIComponent(query)}`
    );
    return (response as any).data;
  },

  /**
   * Parse search query string
   */
  async parseQuery(query: string): Promise<ParsedSearchQuery> {
    const response = await apiClient.get<{ success: boolean; data: ParsedSearchQuery }>(
      `/search/parse?q=${encodeURIComponent(query)}`
    );
    return (response as any).data;
  },
};
